import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ClientLayout from '@/components/ClientLayout'
import { generateMetadata as genMeta, generatePersonSchema, generateWebsiteSchema } from '@/lib/seo'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  ...genMeta({}),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const personSchema = generatePersonSchema()
  const websiteSchema = generateWebsiteSchema()

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <ClientLayout>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  )
}
