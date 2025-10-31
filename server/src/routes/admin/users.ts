import { Router, Request, Response } from 'express'
import { getSupabaseServiceClient } from '../../services/supabaseClient'
import { adminJwt } from '../../middleware/adminJwt'
import { Permissions } from '../../rbac'

const router = Router()

// 保护所有用户管理接口
router.use(adminJwt)

// 用户列表，支持按启用状态与邮箱关键字查询，分页
router.get('/', async (req: Request, res: Response) => {
  try {
    const supabase = getSupabaseServiceClient()
    const perms: string[] = (req as any).user?.permissions || []
    const canRead = perms.includes(Permissions['users.read']) || perms.includes(Permissions['users.write'])
    if (!canRead) return res.status(403).json({ message: 'Forbidden', required: `${Permissions['users.read']} or ${Permissions['users.write']}` })
    const page = Math.max(1, Number(req.query.page ?? 1))
    const limit = Math.max(1, Math.min(100, Number(req.query.limit ?? 20)))
    const status = (req.query.status as string | undefined)
    const q = (req.query.q as string | undefined) // 邮箱关键字

    let query = supabase
      .from('users')
      .select('id, email, name, member_level, points, is_active, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (typeof status !== 'undefined') {
      if (status === 'enabled') query = query.eq('is_active', true)
      else if (status === 'disabled') query = query.eq('is_active', false)
    }
    if (q && q.trim().length) {
      query = query.ilike('email', `%${q.trim()}%`)
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

// 获取用户详情
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const perms: string[] = (req as any).user?.permissions || []
    const canRead = perms.includes(Permissions['users.read']) || perms.includes(Permissions['users.write'])
    if (!canRead) return res.status(403).json({ message: 'Forbidden', required: `${Permissions['users.read']} or ${Permissions['users.write']}` })

    const supabase = getSupabaseServiceClient()
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, member_level, points, is_active, created_at')
      .eq('id', id)
      .limit(1)
    if (error) throw error
    if (!data?.length) return res.status(404).json({ message: '用户不存在' })
    return res.json({ data: data[0] })
  } catch (err: any) {
    return res.status(500).json({ message: '查询失败', error: String(err?.message || err) })
  }
})

// 更新用户基本信息（昵称、会员等级、积分、状态）
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const perms: string[] = (req as any).user?.permissions || []
    const canWrite = perms.includes(Permissions['users.write'])
    if (!canWrite) return res.status(403).json({ message: 'Forbidden', required: Permissions['users.write'] })

    const { name, member_level, points, is_active } = req.body || {}
    const update: any = {}
    if (typeof name === 'string') update.name = name
    if (typeof member_level === 'string') update.member_level = member_level
    if (typeof points === 'number' && Number.isFinite(points)) update.points = points
    if (typeof is_active === 'boolean') update.is_active = is_active
    if (!Object.keys(update).length) return res.status(400).json({ message: '未提供更新字段' })

    const supabase = getSupabaseServiceClient()
    const { data, error } = await supabase
      .from('users')
      .update(update)
      .eq('id', id)
      .select('id')
    if (error) throw error
    if (!data?.length) return res.status(404).json({ message: '用户不存在' })
    // 操作日志
    const operatorId = (req as any).user?.sub
    await supabase.from('operator_action_logs').insert({
      operator_id: operatorId,
      action: 'user.update',
      target_type: 'user',
      target_id: id,
      detail: { update },
      ip: req.ip,
    })
    return res.json({ ok: true })
  } catch (err: any) {
    return res.status(500).json({ message: '更新失败', error: String(err?.message || err) })
  }
})

// 启用用户
router.post('/:id/enable', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const perms: string[] = (req as any).user?.permissions || []
    const canWrite = perms.includes(Permissions['users.write'])
    if (!canWrite) return res.status(403).json({ message: 'Forbidden', required: Permissions['users.write'] })
    const supabase = getSupabaseServiceClient()
    const { data, error } = await supabase
      .from('users')
      .update({ is_active: true })
      .eq('id', id)
      .select('id, is_active')
    if (error) throw error
    if (!data?.length) return res.status(404).json({ message: '用户不存在' })
    // 操作日志
    const operatorId = (req as any).user?.sub
    await supabase.from('operator_action_logs').insert({
      operator_id: operatorId,
      action: 'user.enable',
      target_type: 'user',
      target_id: id,
      detail: null,
      ip: req.ip,
    })
    return res.json({ ok: true })
  } catch (err: any) {
    return res.status(500).json({ message: '启用失败', error: String(err?.message || err) })
  }
})

// 禁用用户
router.post('/:id/disable', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const perms: string[] = (req as any).user?.permissions || []
    const canWrite = perms.includes(Permissions['users.write'])
    if (!canWrite) return res.status(403).json({ message: 'Forbidden', required: Permissions['users.write'] })
    const supabase = getSupabaseServiceClient()
    const { data, error } = await supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', id)
      .select('id, is_active')
    if (error) throw error
    if (!data?.length) return res.status(404).json({ message: '用户不存在' })
    // 操作日志
    const operatorId = (req as any).user?.sub
    await supabase.from('operator_action_logs').insert({
      operator_id: operatorId,
      action: 'user.disable',
      target_type: 'user',
      target_id: id,
      detail: null,
      ip: req.ip,
    })
    return res.json({ ok: true })
  } catch (err: any) {
    return res.status(500).json({ message: '禁用失败', error: String(err?.message || err) })
  }
})

// 用户登录记录
router.get('/:id/logins', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const perms: string[] = (req as any).user?.permissions || []
    const canRead = perms.includes(Permissions['users.read']) || perms.includes(Permissions['users.write'])
    if (!canRead) return res.status(403).json({ message: 'Forbidden', required: `${Permissions['users.read']} or ${Permissions['users.write']}` })
    const supabase = getSupabaseServiceClient()
    const page = Math.max(1, Number(req.query.page ?? 1))
    const limit = Math.max(1, Math.min(100, Number(req.query.limit ?? 20)))
    const start = (page - 1) * limit
    const end = start + limit - 1
    const successRaw = (req.query.success as string | undefined) // 'true' | 'false'
    const from = (req.query.from as string | undefined) // ISO 或 YYYY-MM-DD
    const to = (req.query.to as string | undefined) // ISO 或 YYYY-MM-DD

    let query = supabase
      .from('user_login_logs')
      .select('id, user_id, email, success, ip, created_at', { count: 'exact' })
      .eq('user_id', id)

    if (typeof successRaw === 'string') {
      if (successRaw === 'true' || successRaw === '1' || successRaw === 'success') query = query.eq('success', true)
      else if (successRaw === 'false' || successRaw === '0' || successRaw === 'failed') query = query.eq('success', false)
    }
    if (from && from.trim()) {
      // 允许 YYYY-MM-DD 或 ISO 字符串
      const fromVal = /T/.test(from) ? from : `${from}T00:00:00.000Z`
      query = query.gte('created_at', fromVal)
    }
    if (to && to.trim()) {
      const toVal = /T/.test(to) ? to : `${to}T23:59:59.999Z`
      query = query.lte('created_at', toVal)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(start, end)
    if (error) throw error
    return res.json({ data, page, limit, total: count ?? 0, totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)) })
  } catch (err: any) {
    return res.status(500).json({ message: '查询失败', error: String(err?.message || err) })
  }
})

export default router