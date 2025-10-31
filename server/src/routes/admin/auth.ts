import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../../config'
import { getSupabaseServiceClient } from '../../services/supabaseClient'

const router = Router()

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码必填' })
  }
  try {
    const supabase = getSupabaseServiceClient()
    const { data: rows, error } = await supabase
      .from('operators')
      .select('id, username, password_hash, is_active')
      .eq('username', username)
      .limit(1)

    if (error) throw error
    const op = rows?.[0]
    if (!op) return res.status(401).json({ message: '账号不存在' })
    if (!op.is_active) return res.status(403).json({ message: '账号已禁用' })

    const ok = await bcrypt.compare(password, (op as any).password_hash as string)
    if (!ok) {
      // 记录失败登录
      await supabase.from('operator_login_logs').insert({
        operator_id: op.id,
        username,
        success: false,
        ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '',
      })
      return res.status(401).json({ message: '密码错误' })
    }

    // 聚合角色与权限
    const { data: opRoles, error: rErr } = await supabase
      .from('operator_roles')
      .select('role_id')
      .eq('operator_id', op.id)
    if (rErr) throw rErr
    const roleIds = (opRoles || []).map(r => (r as any).role_id)
    let roles: string[] = []
    let permissions: string[] = []
    if (roleIds.length) {
      const { data: roleRows, error: rrErr } = await supabase
        .from('roles')
        .select('id, name')
        .in('id', roleIds)
      if (rrErr) throw rrErr
      roles = (roleRows || []).map(r => (r as any).name as string)
      const { data: permRows, error: prErr } = await supabase
        .from('role_permissions')
        .select('permission_id')
        .in('role_id', roleIds)
      if (prErr) throw prErr
      const permIds = (permRows || []).map(p => (p as any).permission_id)
      if (permIds.length) {
        const { data: permsTable, error: pErr } = await supabase
          .from('permissions')
          .select('id, name')
          .in('id', permIds)
        if (pErr) throw pErr
        permissions = (permsTable || []).map(p => (p as any).name as string)
      }
    }

    // 生成令牌，包含角色与权限
    const token = jwt.sign({ sub: op.id, username, roles, permissions }, config.jwtSecret, { expiresIn: '8h' })
    // 记录成功登录
    await supabase.from('operator_login_logs').insert({
      operator_id: op.id,
      username,
      success: true,
      ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '',
    })
    return res.json({ token })
  } catch (err: any) {
    return res.status(500).json({ message: '登录失败', error: String(err?.message || err) })
  }
})

router.post('/reset', async (req: Request, res: Response) => {
  const { username, newPassword } = req.body || {}
  if (!username || !newPassword) {
    return res.status(400).json({ message: '用户名与新密码必填' })
  }
  try {
    const supabase = getSupabaseServiceClient()
    const saltRounds = 10
    const password_hash = await bcrypt.hash(newPassword, saltRounds)
    const { data, error } = await supabase
      .from('operators')
      .update({ password_hash })
      .eq('username', username)
      .select('id, username')
    if (error) throw error
    if (!data?.length) return res.status(404).json({ message: '账号不存在' })
    return res.json({ ok: true })
  } catch (err: any) {
    return res.status(500).json({ message: '重置失败', error: String(err?.message || err) })
  }
})

export default router