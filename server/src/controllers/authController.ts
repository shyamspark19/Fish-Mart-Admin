import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User'

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body
  try {
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email already registered' })

    const hash = await bcrypt.hash(password, 10)
    const userRole = role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'
    const user = await User.create({ name, email, password: hash, role: userRole })
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
    return res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
    return res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const me = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id
    if (!userId) return res.status(401).json({ message: 'Not authenticated' })
    const user = await User.findById(userId).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    return res.json({ user })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const logout = async (req: Request, res: Response) => {
  // For stateless JWT, logout is handled client-side by deleting token.
  // This endpoint exists for clients that want a server acknowledgement.
  return res.json({ message: 'Logged out' })
}