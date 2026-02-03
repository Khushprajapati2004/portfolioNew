/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Optimize production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Enable experimental features for better performance
  experimental: {
    // optimizeCss: true, // Disabled due to critters dependency issue
    optimizePackageImports: ['framer-motion', '@heroicons/react'],
  },
}

module.exports = nextConfig
