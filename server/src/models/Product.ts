import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  description?: string
  category?: string
  images?: string[]
  weights?: { label: string; price: number }[]
  cuttingOptions?: string[]
  stock: number
  isActive?: boolean
  badge?: string
  netWeight?: string
  grossWeight?: string
  pieces?: string
  deliveryTime?: string
  rating?: number
  reviewsCount?: number
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  images: { type: [String], default: [] },
  weights: { type: [Schema.Types.Mixed], default: [] },
  cuttingOptions: { type: [String], default: [] },
  stock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  badge: { type: String },
  netWeight: { type: String },
  grossWeight: { type: String },
  pieces: { type: String },
  deliveryTime: { type: String, default: 'Today in 90 mins' },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 120 }
}, { timestamps: true })

export default mongoose.model('Product', ProductSchema)