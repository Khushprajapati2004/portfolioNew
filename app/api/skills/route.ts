import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Skill from '@/lib/models/Skill'
import { verifyAdminTokenFromReq } from '@/lib/adminAuth'

// GET /api/skills — public, returns all skills
export async function GET() {
  try {
    await connectDB()
    const skills = await Skill.find().sort({ category: 1, name: 1 }).lean()

    return NextResponse.json({ success: true, data: skills })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
}

// POST /api/skills — protected, add a new skill
export async function POST(req: NextRequest) {
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

    const existing = await Skill.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      category,
    })

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Skill already exists in this category' },
        { status: 409 }
      )
    }

    const skill = await Skill.create({ name: name.trim(), category })

    return NextResponse.json({ success: true, data: skill }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to create skill' },
      { status: 500 }
    )
  }
}
