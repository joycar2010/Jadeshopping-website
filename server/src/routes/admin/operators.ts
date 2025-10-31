import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { getSupabaseServiceClient } from '../../services/supabaseClient'
import { adminJwt } from '../../middleware/adminJwt'
import { requirePermission, Permissions } from '../../rbac'

const router = Router()

// 保护所有操作员管理接口
router.use(adminJwt)

// 创建操作员
router.post('/', async (req: Request, res: Response) => {
  // 需要角色写权限（视为可管理后台操作员）
  const hasPerm = ((req as any).user?.permissions || []).includes(Permissions['roles.write'])
  if (!hasPerm) return res.status(403).json({ message: 'Forbidden', required: Permissions['roles.write'] })
  const { username, email, password, is_active } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ message: '用户名与密码必填' })
  }
  try {
    const supabase = getSupabaseServiceClient()
    // 检查重名
    const { data: existing, error: qErr } = await supabase
      .from('operators')
      .select('id')
      .eq('username', username)
      .limit(1)
    if (qErr) throw qErr
    if (existing && existing.length) {
      return res.status(409).json({ message: '用户名已存在' })
    }
    const password_hash = await bcrypt.hash(password, 10)
    const { data: created, error: iErr } = await supabase
      .from('operators')
      .insert({ username, email, password_hash, is_active: typeof is_active === 'boolean' ? is_active : true })
      .select('id')
    if (iErr) throw iErr
    const id = created?.[0]?.id
    return res.json({ ok: true, id })
  } catch (err: any) {
    return res.status(500).json({ message: '创建失败', error: String(err?.message || err) })
  }
})

// 更新操作员基本信息
router.put('/:id', async (req: Request, res: Response) => {
  const hasPerm = ((req as any).user?.permissions || []).includes(Permissions['roles.write'])
  if (!hasPerm) return res.status(403).json({ message: 'Forbidden', required: Permissions['roles.write'] })
  const { id } = req.params
  const { username, email, is_active } = req.body || {}
  try {
    const supabase = getSupabaseServiceClient()
    const update: any = {}
    if (typeof username === 'string' && username.trim().length) {
      // 重名检查
      const { data: sameName, error: qErr } = await supabase
        .from('operators')
        .select('id')
        .eq('username', username)
        .limit(1)
      if (qErr) throw qErr
      const conflict = sameName?.[0]?.id && sameName[0].id !== id
      if (conflict) return res.status(409).json({ message: '用户名已被占用' })
      update.username = username
    }
    if (typeof email === 'string') update.email = email
    if (typeof is_active === 'boolean') update.is_active = is_active
    if (!Object.keys(update).length) return res.status(400).json({ message: '未提供更新字段' })
    const { data, error } = await supabase
      .from('operators')
      .update(update)
      .eq('id', id)
      .select('id')
    if (error) throw error
    if (!data?.length) return res.status(404).json({ message: '操作员不存在' })
    return res.json({ ok: true })
  } catch (err: any) {
    return res.status(500).json({ message: '更新失败', error: String(err?.message || err) })
  }
})

// 重置操作员密码
router.post('/:id/reset_password', async (req: Request, res: Response) => {
  const hasPerm = ((req as any).user?.permissions || []).includes(Permissions['roles.write'])
  if (!hasPerm) return res.status(403).json({ message: 'Forbidden', required: Permissions['roles.write'] })
  const { id } = req.params
  const { newPassword } = req.body || {}
  if (!newPassword) return res.status(400).json({ message: '新密码必填' })
  try {
    const supabase = getSupabaseServiceClient()
    const password_hash = await bcrypt.hash(newPassword, 10)
    const { data, error } = await supabase
      .from('operators')
      .update({ password_hash })
      .eq('id', id)
      .select('id')
    if (error) throw error
    if (!data?.length) return res.status(404).json({ message: '操作员不存在' })
    return res.json({ ok: true })
  } catch (err: any) {
    return res.status(500).json({ message: '重置失败', error: String(err?.message || err) })
  }
})

// 操作员列表，支持按启用状态与用户名/邮箱关键字查询，分页
router.get('/', async (req: Request, res: Response) => {
  const perms: string[] = (req as any).user?.permissions || []
  const hasPerm = perms.includes(Permissions['roles.read']) || perms.includes(Permissions['roles.write'])
  if (!hasPerm) return res.status(403).json({ message: 'Forbidden', required: `${Permissions['roles.read']} or ${Permissions['roles.write']}` })
  try {
    const supabase = getSupabaseServiceClient()
    const page = Math.max(1, Number(req.query.page ?? 1))
    const limit = Math.max(1, Math.min(100, Number(req.query.limit ?? 20)))
    const status = (req.query.status as string | undefined)
    const q = (req.query.q as string | undefined) // 用户名或邮箱关键字

    let query = supabase
      .from('operators')
      .select('id, username, email, is_active, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (typeof status !== 'undefined') {
      if (status === 'enabled') query = query.eq('is_active', true)
      else if (status === 'disabled') query = query.eq('is_active', false)
    }
    if (q && q.trim().length) {
      // 模糊匹配用户名或邮箱
      const like = `%${q.trim()}%`
      // Supabase 不支持 OR ilike 链式；采用两次查询并去重合并
      const start = (page - 1) * limit
      const end = start + limit - 1
      const baseFilter = query
      const { data: byUsername, error: e1 } = await baseFilter.ilike('username', like).range(start, end)
      if (e1) throw e1
      // 重新构造邮箱查询（由于 baseFilter 已带有 ilike，重新定义）
      let emailQuery = supabase
        .from('operators')
        .select('id, username, email, is_active, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
      if (typeof status !== 'undefined') {
        if (status === 'enabled') emailQuery = emailQuery.eq('is_active', true)
        else if (status === 'disabled') emailQuery = emailQuery.eq('is_active', false)
      }
      const { data: byEmail, error: e2 } = await emailQuery.ilike('email', like).range(start, end)
      if (e2) throw e2
      const mergedMap = new Map<string, any>()
      for (const r of byUsername || []) mergedMap.set(r.id as string, r)
      for (const r of byEmail || []) mergedMap.set(r.id as string, r)
      const data = Array.from(mergedMap.values())
      // 总数无法精确 OR 统计，这里返回合并后的长度作为近似值
      return res.json({ data, page, limit, total: data.length, totalPages: 1 })
    }

    const start = (page - 1) * limit
    const end = start + limit - 1
    const { data, error, count } = await query.range(start, end)
    if (error) throw error
    return res.json({ data, page, limit, total: count ?? 0, totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)) })
  } catch (err: any) {
    return res.status(500).json({ message: '查询失败', error: String(err?.message || err) })
  }
})

// 启用操作员
router.post('/:id/enable', async (req: Request, res: Response) => {
  const hasPerm = ((req as any).user?.permissions || []).includes(Permissions['roles.write'])
  if (!hasPerm) return res.status(403).json({ message: 'Forbidden', required: Permissions['roles.write'] })
  const { id } = req.params
  try {
    const supabase = getSupabaseServiceClient()
    const { data, error } = await supabase
      .from('operators')
      .update({ is_active: true })
      .eq('id', id)
      .select('id, is_active')
    if (error) throw error
    if (!data?.length) return res.status(404).json({ message: '操作员不存在' })
    return res.json({ ok: true })
  } catch (err: any) {
    return res.status(500).json({ message: '启用失败', error: String(err?.message || err) })
  }
})

// 禁用操作员
router.post('/:id/disable', async (req: Request, res: Response) => {
  const hasPerm = ((req as any).user?.permissions || []).includes(Permissions['roles.write'])
  if (!hasPerm) return res.status(403).json({ message: 'Forbidden', required: Permissions['roles.write'] })
  const { id } = req.params
  try {
    const supabase = getSupabaseServiceClient()
    const { data, error } = await supabase
      .from('operators')
      .update({ is_active: false })
      .eq('id', id)
      .select('id, is_active')
    if (error) throw error
    if (!data?.length) return res.status(404).json({ message: '操作员不存在' })
    return res.json({ ok: true })
  } catch (err: any) {
    return res.status(500).json({ message: '禁用失败', error: String(err?.message || err) })
  }
})

// 操作员登录记录
router.get('/:id/logins', async (req: Request, res: Response) => {
  const perms: string[] = (req as any).user?.permissions || []
  const hasPerm = perms.includes(Permissions['roles.read']) || perms.includes(Permissions['roles.write'])
  if (!hasPerm) return res.status(403).json({ message: 'Forbidden', required: `${Permissions['roles.read']} or ${Permissions['roles.write']}` })
  const { id } = req.params
  try {
    const supabase = getSupabaseServiceClient()
    const page = Math.max(1, Number(req.query.page ?? 1))
    const limit = Math.max(1, Math.min(100, Number(req.query.limit ?? 20)))
    const start = (page - 1) * limit
    const end = start + limit - 1

    const { data, error, count } = await supabase
      .from('operator_login_logs')
      .select('id, operator_id, username, success, ip, created_at', { count: 'exact' })
      .eq('operator_id', id)
      .order('created_at', { ascending: false })
      .range(start, end)
    if (error) throw error
    return res.json({ data, page, limit, total: count ?? 0, totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)) })
  } catch (err: any) {
    return res.status(500).json({ message: '查询失败', error: String(err?.message || err) })
  }
})

export default router

// === 角色分配相关接口 ===
// 列出所有可用角色（is_active=true）
router.get('/roles', async (req: Request, res: Response) => {
  const hasPerm = ((req as any).user?.permissions || []).includes(Permissions['roles.read'])
  if (!hasPerm) return res.status(403).json({ message: 'Forbidden', required: Permissions['roles.read'] })
  try {
    const supabase = getSupabaseServiceClient()
    const { data, error } = await supabase
      .from('roles')
      .select('id, name, description, is_active')
      .eq('is_active', true)
      .order('name', { ascending: true })
    if (error) throw error
    return res.json({ data })
  } catch (err: any) {
    return res.status(500).json({ message: '查询角色失败', error: String(err?.message || err) })
  }
})

// 查询指定操作员的角色（返回角色名数组）
router.get('/:id/roles', async (req: Request, res: Response) => {
  const hasPerm = ((req as any).user?.permissions || []).includes(Permissions['roles.read'])
  if (!hasPerm) return res.status(403).json({ message: 'Forbidden', required: Permissions['roles.read'] })
  const { id } = req.params
  try {
    const supabase = getSupabaseServiceClient()
    const { data: opRoles, error: rErr } = await supabase
      .from('operator_roles')
      .select('role_id')
      .eq('operator_id', id)
    if (rErr) throw rErr
    const roleIds = (opRoles || []).map(r => (r as any).role_id)
    if (!roleIds.length) return res.json({ roles: [] })
    const { data: roles, error: rrErr } = await supabase
      .from('roles')
      .select('name')
      .in('id', roleIds)
    if (rrErr) throw rrErr
    return res.json({ roles: (roles || []).map(r => (r as any).name as string) })
  } catch (err: any) {
    return res.status(500).json({ message: '查询操作员角色失败', error: String(err?.message || err) })
  }
})

// 设置指定操作员的角色（覆盖式）
router.post('/:id/roles', async (req: Request, res: Response) => {
  const hasPerm = ((req as any).user?.permissions || []).includes(Permissions['roles.write'])
  if (!hasPerm) return res.status(403).json({ message: 'Forbidden', required: Permissions['roles.write'] })
  const { id } = req.params
  const roles = (req.body?.roles as string[]) || []
  if (!Array.isArray(roles)) return res.status(400).json({ message: 'roles 必须为字符串数组' })
  try {
    const supabase = getSupabaseServiceClient()
    // 查询所有目标角色的ID
    const { data: roleRows, error: rrErr } = await supabase
      .from('roles')
      .select('id, name')
      .in('name', roles)
    if (rrErr) throw rrErr
    const targetRoleIds = new Set<string>((roleRows || []).map(r => (r as any).id as string))
    // 查询当前已分配的角色
    const { data: currentRows, error: crErr } = await supabase
      .from('operator_roles')
      .select('role_id')
      .eq('operator_id', id)
    if (crErr) throw crErr
    const currentRoleIds = new Set<string>((currentRows || []).map(r => (r as any).role_id as string))

    // 需要删除的（当前有但不在目标中）
    const toDelete = Array.from(currentRoleIds).filter(rid => !targetRoleIds.has(rid))
    if (toDelete.length) {
      // Supabase 不支持 in() 删除复合主键组合，这里循环删除
      for (const rid of toDelete) {
        const { error: dErr } = await supabase
          .from('operator_roles')
          .delete()
          .eq('operator_id', id)
          .eq('role_id', rid)
        if (dErr) throw dErr
      }
    }

    // 需要新增的（目标有但当前没有）
    const toInsert = Array.from(targetRoleIds).filter(rid => !currentRoleIds.has(rid)).map(rid => ({ operator_id: id, role_id: rid }))
    if (toInsert.length) {
      const { error: iErr } = await supabase
        .from('operator_roles')
        .insert(toInsert)
      if (iErr) throw iErr
    }

    return res.json({ ok: true })
  } catch (err: any) {
    return res.status(500).json({ message: '分配角色失败', error: String(err?.message || err) })
  }
})