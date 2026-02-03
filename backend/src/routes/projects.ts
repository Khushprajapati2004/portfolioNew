import express, { Request, Response } from 'express'
import { authenticateAdmin } from '../middleware/auth'
import prisma from '../utils/prisma'

const router = express.Router()

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// GET all projects
router.get('/projects', async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    })

    // Transform data to match frontend expectations
    const transformedProjects = projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      longDescription: project.content,
      tech: project.tech,
      image: project.image || '/images/projects/default.jpg',
      github: project.github || '',
      demo: project.demo || '',
      features: project.content.split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, ''))
    }))

    res.json({
      success: true,
      data: transformedProjects
    })
  } catch (error: any) {
    console.error('Fetch projects error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    })
  }
})

// POST create project (admin only)
router.post('/projects', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { title, description, longDescription, tech, github, demo, features, image } = req.body

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      })
    }

    const slug = generateSlug(title)
    
    // Create content from longDescription and features
    let content = longDescription || description
    if (features && Array.isArray(features) && features.length > 0) {
      content += '\n\n' + features.map((f: string) => `- ${f}`).join('\n')
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        content,
        tech: Array.isArray(tech) ? tech : [],
        image: image || '/images/projects/default.jpg',
        github: github || null,
        demo: demo || null,
        published: true
      }
    })

    // Transform response to match frontend expectations
    const transformedProject = {
      id: project.id,
      title: project.title,
      description: project.description,
      longDescription: project.content,
      tech: project.tech,
      image: project.image,
      github: project.github || '',
      demo: project.demo || '',
      features: features || []
    }

    res.status(201).json({
      success: true,
      data: transformedProject
    })
  } catch (error: any) {
    console.error('Create project error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create project'
    })
  }
})

// PUT update project (admin only)
router.put('/projects/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { title, description, longDescription, tech, github, demo, features, image } = req.body

    const existingProject = await prisma.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      })
    }

    const slug = title ? generateSlug(title) : existingProject.slug
    
    let content = longDescription || description || existingProject.content
    if (features && Array.isArray(features) && features.length > 0) {
      content += '\n\n' + features.map((f: string) => `- ${f}`).join('\n')
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(title && { title, slug }),
        ...(description && { description }),
        ...(content && { content }),
        ...(tech && { tech: Array.isArray(tech) ? tech : [] }),
        ...(image && { image }),
        ...(github !== undefined && { github }),
        ...(demo !== undefined && { demo })
      }
    })

    res.json({
      success: true,
      data: project
    })
  } catch (error: any) {
    console.error('Update project error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    })
  }
})

// DELETE project (admin only)
router.delete('/projects/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await prisma.project.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error: any) {
    console.error('Delete project error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    })
  }
})

// GET all skills
router.get('/skills', async (req: Request, res: Response) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
        { name: 'asc' }
      ]
    })

    res.json({
      success: true,
      data: skills
    })
  } catch (error: any) {
    console.error('Fetch skills error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills'
    })
  }
})

// POST create skill (admin only)
router.post('/skills', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { name, category, level, icon } = req.body

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name and category are required'
      })
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        level: level || 5,
        icon: icon || null
      }
    })

    res.status(201).json({
      success: true,
      data: skill
    })
  } catch (error: any) {
    console.error('Create skill error:', error)
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Skill with this name already exists'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create skill'
    })
  }
})

// PUT update skill (admin only)
router.put('/skills/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, category, level, icon, order } = req.body

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(level !== undefined && { level }),
        ...(icon !== undefined && { icon }),
        ...(order !== undefined && { order })
      }
    })

    res.json({
      success: true,
      data: skill
    })
  } catch (error: any) {
    console.error('Update skill error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update skill'
    })
  }
})

// DELETE skill (admin only)
router.delete('/skills/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await prisma.skill.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: 'Skill deleted successfully'
    })
  } catch (error: any) {
    console.error('Delete skill error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete skill'
    })
  }
})

export default router
