import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Project from '@/lib/models/Project'
import { verifyAdminTokenFromReq } from '@/lib/adminAuth'

export async function GET() {
  try {
    await connectDB()
    const projects = await Project.find().sort({ createdAt: -1 }).lean()
    
    // Convert _id to id to match the expected frontend format
    const formattedProjects = projects.map((p: any) => ({
      ...p,
      id: p._id.toString(),
      _id: undefined
    }))

    return NextResponse.json({ success: true, data: formattedProjects })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminTokenFromReq(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const data = await req.json()
    
    const project = await Project.create(data)
    
    const formattedProject = {
      ...project.toObject(),
      id: project._id.toString(),
    }
    
    return NextResponse.json({ success: true, data: formattedProject }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
