import { Request, Response } from 'express'
import Product from '../models/Product'

export const createProduct = async (req: Request, res: Response) => {
  const data = req.body
  const product = await Product.create(data)
  return res.json(product)
}

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params
  const product = await Product.findByIdAndUpdate(id, req.body, { new: true })
  if (!product) return res.status(404).json({ message: 'Product not found' })
  return res.json(product)
}

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params
  await Product.findByIdAndDelete(id)
  return res.json({ message: 'Deleted' })
}
