'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { personalInfo } from '@/lib/constants'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  
  // Show background if scrolled OR not on home page
  const isHomePage = pathname === '/'
  const showBackground = scrolled || !isHomePage

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Skills', href: '/#skills' },
    { name: 'Projects', href: '/projects' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showBackground ? 'bg-dark-navy/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated icon */}
              <motion.div
                className="relative"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <motion.path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.path
                    d="M2 17L12 22L22 17"
                    stroke="url(#gradient2)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
                  />
                  <motion.path
                    d="M2 12L12 17L22 12"
                    stroke="url(#gradient3)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 1, repeat: Infinity }}
                  />
                  <defs>
                    <linearGradient id="gradient1" x1="2" y1="2" x2="22" y2="12">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="2" y1="17" x2="22" y2="22">
                      <stop offset="0%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                    <linearGradient id="gradient3" x1="2" y1="12" x2="22" y2="17">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* Text logo */}
              <motion.span
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                KP
              </motion.span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <motion.span
                  className="text-sm xl:text-base text-gray-300 hover:text-neon-blue transition-colors duration-300 cursor-pointer whitespace-nowrap"
                  whileHover={{ y: -2 }}
                >
                  {link.name}
                </motion.span>
              </Link>
            ))}
            
            {/* Download Resume Button */}
            <a href={personalInfo.resumeUrl} download>
              <motion.button
                className="px-4 xl:px-6 py-2 bg-transparent border-2 border-neon-blue text-neon-blue text-sm xl:text-base font-semibold rounded-lg hover:bg-neon-blue hover:text-white transition-all duration-300 whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Resume
              </motion.button>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-white focus:outline-none p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden mt-4 pb-4 pt-4 bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={link.href}>
                    <div
                      className="block py-3 px-4 mx-2 text-base sm:text-lg text-gray-300 hover:text-neon-blue hover:bg-neon-blue/10 rounded-lg transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </div>
                  </Link>
                </motion.div>
              ))}
              
              {/* Mobile Resume Button */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="mt-4 px-2"
              >
                <a href={personalInfo.resumeUrl} download>
                  <button
                    className="w-full py-3 text-base sm:text-lg bg-gradient-to-r from-neon-blue to-neon-cyan border-2 border-transparent text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-blue/50 transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Download Resume
                  </button>
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
