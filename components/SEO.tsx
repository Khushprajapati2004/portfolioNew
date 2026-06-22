import Head from 'next/head'
import { siteConfig } from '@/lib/seo'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: string
  noindex?: boolean
}

export default function SEO({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  noindex = false,
}: SEOProps) {
  const seo = {
    title: title ? `${title} | ${siteConfig.name}` : siteConfig.title,
    description: description || siteConfig.description,
    image: image || siteConfig.ogImage,
    url: url || siteConfig.url,
    keywords: [...siteConfig.keywords, ...keywords].join(', '),
  }

  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:site_name" content={siteConfig.name} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:creator" content="@khushprajapati" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seo.url} />
    </Head>
  )
}
