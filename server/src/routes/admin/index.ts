import { Router } from 'express'
import authRouter from './auth'
import usersRouter from './users'
import operatorsRouter from './operators'
import logsRouter from './logs'
import { adminJwt } from '../../middleware/adminJwt'

const router = Router()

router.use('/auth', authRouter)

// 用户管理模块
router.use('/users', usersRouter)

// 操作员管理模块
router.use('/operators', operatorsRouter)

// 操作日志模块
router.use('/logs', logsRouter)

// 示例：受保护的路由，后续可扩展到各模块
router.get('/me', adminJwt, (req, res) => {
  res.json({ user: (req as any).user })
})

export default router