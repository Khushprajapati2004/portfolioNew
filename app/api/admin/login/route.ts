import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Admin } from '@/lib/models/Admin'
import { verifyPassword, generateAccessToken, generateRefreshToken } from '@/lib/adminAuth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    await connectDB()

    const admin = await Admin.findOne({ username })
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isMatch = await verifyPassword(password, admin.passwordHash)
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Generate tokens
    const payload = { id: admin._id.toString(), username: admin.username, role: 'admin' }
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    // Save refresh token to DB
    admin.refreshToken = refreshToken
    await admin.save()

    // Set refresh token in HTTP-only cookie
    cookies().set({
      name: 'refresh_token',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/'
    })

    return NextResponse.json({
      message: 'Logged in successfully',
      accessToken,
      user: { username: admin.username, role: 'admin' }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
