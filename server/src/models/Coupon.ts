import mongoose, { Schema, Document } from 'mongoose'

export interface ICoupon extends Document {
  code: string
  type: 'PERCENT' | 'FIXED'
  value: number
  minimumOrder?: number
  maximumDiscount?: number
  usageLimit?: number
  usedCount?: number
  expiryDate?: Date
  isActive: boolean
}

const CouponSchema: Schema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ['PERCENT','FIXED'], required: true },
  value: { type: Number, required: true },
  minimumOrder: { type: Number, default: 0 },
  maximumDiscount: { type: Number, default: 0 },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  expiryDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

export default mongoose.model<ICoupon>('Coupon', CouponSchema)