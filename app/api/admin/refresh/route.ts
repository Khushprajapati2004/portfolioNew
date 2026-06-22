import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Admin } from '@/lib/models/Admin'
import { verifyRefreshToken, generateAccessToken } from '@/lib/adminAuth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const refreshToken = cookies().get('refresh_token')?.value

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 })
    }

    const decoded = verifyRefreshToken(refreshToken)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 })
    }

    await connectDB()

    const admin = await Admin.findById(decoded.id)
    if (!admin || admin.refreshToken !== refreshToken) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 })
    }

    // Generate new access token
    const payload = { id: admin._id.toString(), username: admin.username, role: 'admin' }
    const accessToken = generateAccessToken(payload)

    return NextResponse.json({
      accessToken
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
