import { generateMetadata as genMeta, generateBreadcrumbSchema } from '@/lib/seo'

export const metadata = genMeta({
  title: 'Contact',
  description: 'Get in touch with Khush Prajapati. Available for freelance projects, full-time opportunities, and collaborations. Let\'s build something amazing together!',
  keywords: ['contact', 'hire developer', 'freelance', 'collaboration', 'web development services'],
  url: '/contact',
})

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' },
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
