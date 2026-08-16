import mongoose, { Schema, Document } from 'mongoose'

export type Role = 'CUSTOMER' | 'ADMIN' | 'DELIVERY_PARTNER'

export interface IUser extends Document {
  name: string
  email: string
  phone?: string
  password: string
  role: Role
  addresses: any[]
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['CUSTOMER','ADMIN','DELIVERY_PARTNER'], default: 'CUSTOMER' },
  addresses: { type: [Schema.Types.Mixed], default: [] }
}, { timestamps: true })

export default mongoose.model('User', UserSchema)