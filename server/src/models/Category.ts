import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  name: string
  image?: string
  description?: string
  isActive: boolean
}

const CategorySchema: Schema = new Schema<ICategory>({
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

export default mongoose.model<ICategory>('Category', CategorySchema)