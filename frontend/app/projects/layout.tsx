import { generateMetadata as genMeta, generateBreadcrumbSchema } from '@/lib/seo'

export const metadata = genMeta({
  title: 'Projects',
  description: 'Explore my portfolio of full-stack web development projects. Built with React.js, Next.js, Node.js, MongoDB, PostgreSQL, and modern web technologies.',
  keywords: ['portfolio', 'projects', 'web development', 'React projects', 'Next.js projects', 'full-stack projects'],
  url: '/projects',
})

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  )
}
