import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Seed Projects
  const projects = [
    {
      title: 'TravelVista',
      slug: 'travelvista',
      description: 'A comprehensive travel booking platform',
      content: 'Full-featured travel booking application with MERN stack...',
      tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
      github: 'https://github.com/khushprajapati/travelvista',
      demo: 'https://travelvista-demo.vercel.app',
      featured: true,
      published: true,
    },
    {
      title: 'CareerHub',
      slug: 'careerhub',
      description: 'Modern job portal connecting job seekers with employers',
      content: 'Job portal with Next.js and PostgreSQL...',
      tech: ['Next.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS'],
      github: 'https://github.com/khushprajapati/careerhub',
      demo: 'https://careerhub-demo.vercel.app',
      featured: true,
      published: true,
    },
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: project,
    })
  }

  // Seed Skills
  const skills = [
    { name: 'React.js', category: 'Frontend', level: 9, order: 1 },
    { name: 'Next.js', category: 'Frontend', level: 8, order: 2 },
    { name: 'TypeScript', category: 'Languages', level: 8, order: 3 },
    { name: 'Node.js', category: 'Backend', level: 8, order: 4 },
    { name: 'Express.js', category: 'Backend', level: 8, order: 5 },
    { name: 'MongoDB', category: 'Databases', level: 7, order: 6 },
    { name: 'PostgreSQL', category: 'Databases', level: 7, order: 7 },
    { name: 'Tailwind CSS', category: 'Frontend', level: 9, order: 8 },
  ]

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    })
  }

  // Seed Blog Posts
  const blogPosts = [
    {
      title: 'Getting Started with Next.js 14',
      slug: 'getting-started-nextjs-14',
      excerpt: 'Learn the fundamentals of Next.js 14 and its new features',
      content: 'Next.js 14 introduces several exciting features...',
      tags: ['Next.js', 'React', 'Web Development'],
      published: true,
    },
    {
      title: 'Building Scalable APIs with Node.js',
      slug: 'building-scalable-apis-nodejs',
      excerpt: 'Best practices for creating robust and scalable Node.js APIs',
      content: 'When building APIs with Node.js...',
      tags: ['Node.js', 'API', 'Backend'],
      published: true,
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
  }

  console.log('✓ Database seeded successfully')
}

main()
  .catch((e) => {
    console.error('✗ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
