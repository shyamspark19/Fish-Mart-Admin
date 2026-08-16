import mongoose, { Schema, Document } from 'mongoose'

export interface IOrderItem {
  product: mongoose.Types.ObjectId
  name: string
  weightLabel: string
  cutting: string
  quantity: number
  price: number
}

export interface IOrder extends Document {
  orderNumber: string
  user: mongoose.Types.ObjectId
  items: IOrderItem[]
  address: any
  deliverySlot: any
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  subtotal: number
  discount: number
  deliveryFee: number
  tax: number
  total: number
}

const OrderSchema: Schema = new Schema({
  orderNumber: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [Schema.Types.Mixed], default: [] },
  address: { type: Object, required: true },
  deliverySlot: { type: Object },
  paymentMethod: { type: String },
  paymentStatus: { type: String, default: 'PENDING' },
  orderStatus: { type: String, default: 'PLACED' },
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { timestamps: true })

export default mongoose.model<IOrder>('Order', OrderSchema)