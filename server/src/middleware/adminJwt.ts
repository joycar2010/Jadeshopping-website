import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'

export interface AdminTokenPayload {
  sub: string // operator id
  username: string
  roles?: string[]
  permissions?: string[]
}

export function adminJwt(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : ''
  if (!token) return res.status(401).json({ message: 'Missing token' })
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AdminTokenPayload
    ;(req as any).user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}