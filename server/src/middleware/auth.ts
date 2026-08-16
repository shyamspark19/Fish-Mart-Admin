import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface TokenPayload {
  id: string
  role: string
  iat?: number
  exp?: number
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' })
  const parts = authHeader.split(' ')
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid authorization header' })
  const token = parts[1]
  try {
    const secret = process.env.JWT_SECRET || 'secret'
    const payload = jwt.verify(token, secret) as TokenPayload
    ;(req as any).user = { id: payload.id, role: payload.role }
    return next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export default authenticate
