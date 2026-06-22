import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Admin } from '@/lib/models/Admin'
import { hashPassword, ADMIN_SETUP_SECRET } from '@/lib/adminAuth'

export async function POST(req: NextRequest) {
  try {
    const { username, password, setupSecret } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    if (setupSecret !== ADMIN_SETUP_SECRET) {
      return NextResponse.json({ error: 'Invalid setup secret' }, { status: 403 })
    }

    await connectDB()

    const existingAdmin = await Admin.findOne({ username })
    if (existingAdmin) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)
    
    await Admin.create({
      username,
      passwordHash
    })

    return NextResponse.json({ message: 'Admin registered successfully' }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
