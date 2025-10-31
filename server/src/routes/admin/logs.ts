import { Router, Request, Response } from 'express'
import { getSupabaseServiceClient } from '../../services/supabaseClient'
import { adminJwt } from '../../middleware/adminJwt'

const router = Router()

// 保护所有日志接口
router.use(adminJwt)

// 操作日志列表（分页 + 过滤）
router.get('/actions', async (req: Request, res: Response) => {
  try {
    const supabase = getSupabaseServiceClient()
    const perms: string[] = (req as any).user?.permissions || []
    const canRead = perms.some(p => p === 'users.read' || p === 'users.write' || p === 'roles.read' || p === 'roles.write')
    if (!canRead) return res.status(403).json({ message: 'Forbidden', required: 'users.read|users.write|roles.read|roles.write' })

    const page = Math.max(1, Number(req.query.page ?? 1))
    const limit = Math.max(1, Math.min(100, Number(req.query.limit ?? 20)))
    const start = (page - 1) * limit
    const end = start + limit - 1

    const operatorId = (req.query.operator_id as string | undefined)
    const action = (req.query.action as string | undefined)
    const targetType = (req.query.target_type as string | undefined)
    const targetId = (req.query.target_id as string | undefined)
    const from = (req.query.from as string | undefined)
    const to = (req.query.to as string | undefined)

    let query = supabase
      .from('operator_action_logs')
      .select('id, operator_id, action, target_type, target_id, ip, created_at', { count: 'exact' })

    if (operatorId) query = query.eq('operator_id', operatorId)
    if (action) query = query.ilike('action', `%${action}%`)
    if (targetType) query = query.eq('target_type', targetType)
    if (targetId) query = query.eq('target_id', targetId)
    if (from && from.trim()) {
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

// 导出 CSV（同筛选项）
router.get('/actions/export', async (req: Request, res: Response) => {
  try {
    const supabase = getSupabaseServiceClient()
    const perms: string[] = (req as any).user?.permissions || []
    const canRead = perms.some(p => p === 'users.read' || p === 'users.write' || p === 'roles.read' || p === 'roles.write')
    if (!canRead) return res.status(403).json({ message: 'Forbidden', required: 'users.read|users.write|roles.read|roles.write' })

    const operatorId = (req.query.operator_id as string | undefined)
    const action = (req.query.action as string | undefined)
    const targetType = (req.query.target_type as string | undefined)
    const targetId = (req.query.target_id as string | undefined)
    const from = (req.query.from as string | undefined)
    const to = (req.query.to as string | undefined)
    const max = Math.max(1, Math.min(10000, Number(req.query.max ?? 1000)))

    let query = supabase
      .from('operator_action_logs')
      .select('id, operator_id, action, target_type, target_id, ip, created_at')

    if (operatorId) query = query.eq('operator_id', operatorId)
    if (action) query = query.ilike('action', `%${action}%`)
    if (targetType) query = query.eq('target_type', targetType)
    if (targetId) query = query.eq('target_id', targetId)
    if (from && from.trim()) {
      const fromVal = /T/.test(from) ? from : `${from}T00:00:00.000Z`
      query = query.gte('created_at', fromVal)
    }
    if (to && to.trim()) {
      const toVal = /T/.test(to) ? to : `${to}T23:59:59.999Z`
      query = query.lte('created_at', toVal)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(max)
    if (error) throw error

    const rows = (data || []) as any[]
    const header = ['id','operator_id','action','target_type','target_id','ip','created_at']
    const escape = (v: any) => {
      if (v == null) return ''
      const s = String(v)
      if (s.includes('"') || s.includes(',') || s.includes('\n')) return '"' + s.replace(/"/g, '""') + '"'
      return s
    }
    const lines = [header.join(',')]
    for (const r of rows) {
      lines.push([
        escape(r.id),
        escape(r.operator_id),
        escape(r.action),
        escape(r.target_type),
        escape(r.target_id),
        escape(r.ip),
        escape(r.created_at),
      ].join(','))
    }
    const csv = lines.join('\n')
    const ts = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    const filename = `operator_action_logs_${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.csv`
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    return res.send(csv)
  } catch (err: any) {
    return res.status(500).json({ message: '导出失败', error: String(err?.message || err) })
  }
})

export default router