import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/auth'
import productsRoutes from './routes/products'
import adminRoutes from './routes/admin'
import errorHandler from './middleware/errorHandler'
import cartRoutes from './routes/cart'
import ordersRoutes from './routes/orders'
import adminProductsRoutes from './routes/adminProducts'
import { connectDB } from './config/db'
import { seedInitialData } from './seed'

dotenv.config()

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/admin/products', adminProductsRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', ordersRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

connectDB().then(async () => {
  await seedInitialData()
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}).catch(err => {
  console.error('Failed to connect to DB', err)
  process.exit(1)
})

export default app