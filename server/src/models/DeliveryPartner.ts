import mongoose, { Schema, Document } from 'mongoose'

export interface IDeliveryPartner extends Document {
  name: string
  phone?: string
  email?: string
  status?: string
  assignedOrders?: mongoose.Types.ObjectId[]
}

const DeliveryPartnerSchema: Schema = new Schema<IDeliveryPartner>({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  status: { type: String, default: 'ACTIVE' },
  assignedOrders: { type: [Schema.Types.ObjectId], default: [] }
}, { timestamps: true })

export default mongoose.model<IDeliveryPartner>('DeliveryPartner', DeliveryPartnerSchema)