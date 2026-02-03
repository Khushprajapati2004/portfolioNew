import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import contactRoutes from './routes/contact'
import adminRoutes from './routes/admin'
import projectRoutes from './routes/projects'
import { rateLimiter } from './middleware/rateLimiter'
import prisma from './utils/prisma'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(compression()) // Enable gzip compression
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cache control middleware for public routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/projects') || req.path.startsWith('/api/skills')) {
    // Cache for 5 minutes
    res.set('Cache-Control', 'public, max-age=300, s-maxage=300')
  }
  next()
})

// Rate limiting
app.use('/api/', rateLimiter)

// MongoDB Connection (for contact messages)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
    console.log('✓ MongoDB connected successfully')
  } catch (error) {
    console.error('✗ MongoDB connection error:', error)
    process.exit(1)
  }
}

// Prisma Connection Test (for projects and skills)
const connectPrisma = async () => {
  try {
    await prisma.$connect()
    console.log('✓ PostgreSQL (Prisma) connected successfully')
  } catch (error) {
    console.error('✗ PostgreSQL connection error:', error)
    console.log('  Make sure DATABASE_URL is set in .env')
  }
}

connectDB()
connectPrisma()

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Khush Prajapati Portfolio API' })
})

app.use('/api/contact', contactRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api', projectRoutes)

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack)
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`)
})

export default app
