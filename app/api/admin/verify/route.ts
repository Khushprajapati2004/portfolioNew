import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminTokenFromReq } from '@/lib/adminAuth'

export async function POST(req: NextRequest) {
  const decoded = verifyAdminTokenFromReq(req)
  if (!decoded) {
    return NextResponse.json(
      { success: false, message: 'Invalid or expired token' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Token is valid',
    data: { user: decoded },
  })
}
