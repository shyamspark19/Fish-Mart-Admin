import { Request, Response } from 'express'
import Product from '../models/Product'

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { q, category } = req.query as any
    const filter: any = {}
    if (category) filter.category = category
    if (q) filter.name = { $regex: q, $options: 'i' }
    const products = await Product.find(filter).limit(100)
    console.log(`Found ${products.length} products`)
    return res.json(products)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    return res.json(product)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}