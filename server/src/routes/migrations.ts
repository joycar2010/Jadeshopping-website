import { Router, Request, Response } from 'express'
import { clearAllData, runSeedMigration } from '../services/supabaseMigration'

const router = Router()

function verifyAdminToken(req: Request): boolean {
  const required = process.env.ADMIN_MIGRATION_TOKEN
  if (!required) return true // 未配置则在本地开发允许调用
  const received = req.header('x-admin-token') || ''
  return received === required
}

router.post('/run', async (req: Request, res: Response) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ ok: false, message: 'Unauthorized: invalid admin token' })
  }
  try {
    const results = await runSeedMigration()
    return res.json({ ok: true, results })
  } catch (err: any) {
    return res.status(500).json({ ok: false, message: 'Migration failed', error: String(err?.message || err) })
  }
})

router.post('/clear', async (req: Request, res: Response) => {
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ ok: false, message: 'Unauthorized: invalid admin token' })
  }
  try {
    const ok = await clearAllData()
    return res.json({ ok })
  } catch (err: any) {
    return res.status(500).json({ ok: false, message: 'Clear failed', error: String(err?.message || err) })
  }
})

export default router