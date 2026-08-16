import mongoose, { Schema } from 'mongoose'

const CartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  weightLabel: String,
  cutting: String,
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true }
})

const CartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: { type: [CartItemSchema], default: [] }
}, { timestamps: true })

export default mongoose.model('Cart', CartSchema)
