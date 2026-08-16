import { Request, Response } from 'express'
import Cart from '../models/Cart'
import Product from '../models/Product'
import mongoose from 'mongoose'

export const getCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id
  const cart = await Cart.findOne({ user: userId }).populate('items.product')
  return res.json(cart || { items: [] })
}

export const addToCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id
  const { productId, weightLabel, cutting, quantity = 1 } = req.body
  if (!productId) return res.status(400).json({ message: 'productId required' })

  const product = await Product.findById(productId)
  if (!product || !product.isActive) return res.status(404).json({ message: 'Product not available' })

  const priceForWeight = (product.weights || []).find((w: any) => w.label === weightLabel)
  if (!priceForWeight) return res.status(400).json({ message: 'Invalid weight selected' })

  let cart = await Cart.findOne({ user: userId })
  if (!cart) cart = await Cart.create({ user: userId, items: [] })

  // Check existing item with same product+weight+cutting
  const existing = cart.items.find(i => i.product.toString() === productId && i.weightLabel === weightLabel && i.cutting === cutting)
  if (existing) {
    existing.quantity += quantity
  } else {
    cart.items.push({ product: new mongoose.Types.ObjectId(productId), name: product.name, weightLabel, cutting, quantity, price: priceForWeight.price })
  }

  await cart.save()
  return res.json(cart)
}

export const updateCartItem = async (req: Request, res: Response) => {
  const userId = (req as any).user.id
  const { itemId } = req.params
  const { quantity, weightLabel, cutting } = req.body
  const cart = await Cart.findOne({ user: userId })
  if (!cart) return res.status(404).json({ message: 'Cart not found' })
  const item = cart.items.id(itemId)
  if (!item) return res.status(404).json({ message: 'Item not found' })
  if (quantity !== undefined) item.quantity = quantity
  if (weightLabel) {
    // update price based on product weights
    const product = await Product.findById(item.product)
    const priceForWeight = (product!.weights || []).find((w: any) => w.label === weightLabel)
    if (!priceForWeight) return res.status(400).json({ message: 'Invalid weight' })
    item.weightLabel = weightLabel
    item.price = priceForWeight.price
  }
  if (cutting) item.cutting = cutting
  await cart.save()
  return res.json(cart)
}

export const removeCartItem = async (req: Request, res: Response) => {
  const userId = (req as any).user.id
  const { itemId } = req.params
  const cart = await Cart.findOne({ user: userId })
  if (!cart) return res.status(404).json({ message: 'Cart not found' })
  // remove item by id
  cart.items = cart.items.filter(i => i._id?.toString() !== itemId) as any
  await cart.save()
  return res.json(cart)
}
