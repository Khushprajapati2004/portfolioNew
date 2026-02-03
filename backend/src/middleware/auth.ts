import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request {
  admin?: {
    id: string
    username: string
  }
}

export const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    req.admin = decoded
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    })
  }
}
