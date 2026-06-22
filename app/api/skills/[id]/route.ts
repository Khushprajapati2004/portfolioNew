import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Skill from '@/lib/models/Skill'
import { verifyAdminTokenFromReq } from '@/lib/adminAuth'

// PUT /api/skills/[id] — protected, update a skill
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyAdminTokenFromReq(req)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { name, category } = await req.json()

    if (!name?.trim() || !category) {
      return NextResponse.json(
        { success: false, message: 'Name and category are required' },
        { status: 400 }
      )
    }

    await connectDB()

    const skill = await Skill.findByIdAndUpdate(
      params.id,
      { name: name.trim(), category },
      { new: true, runValidators: true }
    )

    if (!skill) {
      return NextResponse.json(
        { success: false, message: 'Skill not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: skill })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to update skill' },
      { status: 500 }
    )
  }
}

// DELETE /api/skills/[id] — protected, delete a skill
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyAdminTokenFromReq(req)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    await connectDB()

    const skill = await Skill.findByIdAndDelete(params.id)

    if (!skill) {
      return NextResponse.json(
        { success: false, message: 'Skill not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Skill deleted' })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to delete skill' },
      { status: 500 }
    )
  }
}
