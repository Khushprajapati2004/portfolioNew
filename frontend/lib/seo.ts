// SEO Configuration and Utilities

export const siteConfig = {
  name: 'Khush Prajapati',
  title: 'Khush Prajapati | Full-Stack Developer & Software Engineer',
  description: 'Full-Stack Developer specializing in React.js, Next.js, Node.js, and modern web technologies. Building scalable, user-centric applications with expertise in JavaScript, TypeScript, MongoDB, and PostgreSQL.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  links: {
    github: 'https://github.com/khushprajapati',
    linkedin: 'https://linkedin.com/in/khushprajapati',
    twitter: 'https://twitter.com/khushprajapati',
    email: 'mailto:khushprajapati777@gmail.com',
  },
  keywords: [
    'Full-Stack Developer',
    'React Developer',
    'Next.js Developer',
    'Node.js Developer',
    'JavaScript Developer',
    'TypeScript Developer',
    'Web Developer',
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'MERN Stack Developer',
    'MongoDB',
    'PostgreSQL',
    'Express.js',
    'Tailwind CSS',
    'Web Development',
    'Software Development',
    'Khush Prajapati',
  ],
  author: {
    name: 'Khush Prajapati',
    email: 'khushprajapati777@gmail.com',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
}

export const generateMetadata = (page: {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: string
}) => {
  const title = page.title 
    ? `${page.title} | ${siteConfig.name}` 
    : siteConfig.title
  
  const description = page.description || siteConfig.description
  const keywords = [...siteConfig.keywords, ...(page.keywords || [])]
  const image = page.image || siteConfig.ogImage
  const url = page.url || siteConfig.url
  const type = page.type || 'website'

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: type as any,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@khushprajapati',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
      // bing: 'your-bing-verification-code',
    },
  }
}

// JSON-LD Schema for structured data
export const generatePersonSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.author.name,
  url: siteConfig.url,
  email: siteConfig.author.email,
  jobTitle: 'Full-Stack Developer',
  description: siteConfig.description,
  sameAs: [
    siteConfig.links.github,
    siteConfig.links.linkedin,
    siteConfig.links.twitter,
  ],
  knowsAbout: [
    'React.js',
    'Next.js',
    'Node.js',
    'JavaScript',
    'TypeScript',
    'MongoDB',
    'PostgreSQL',
    'Web Development',
    'Software Engineering',
  ],
})

export const generateWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  author: {
    '@type': 'Person',
    name: siteConfig.author.name,
  },
  inLanguage: 'en-US',
})

export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${siteConfig.url}${item.url}`,
  })),
})
