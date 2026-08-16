import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer: MongoMemoryServer | null = null

export async function connectDB() {
  let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fishmart'
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 500 })
    console.log('MongoDB connected to:', uri)
  } catch (err) {
    console.log('Local MongoDB not found. Initializing in-memory MongoDB server...')
    mongoServer = await MongoMemoryServer.create()
    uri = mongoServer.getUri()
    await mongoose.connect(uri)
    console.log('In-memory MongoDB connected successfully at:', uri)
  }
}