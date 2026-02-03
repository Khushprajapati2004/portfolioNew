'use client'

import { motion } from 'framer-motion'
import { personalInfo } from '@/lib/constants'
import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => {
        setSubscribed(false)
        setEmail('')
      }, 3000)
    }
  }

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Skills', href: '/#skills' },
    { name: 'Projects', href: '/projects' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Contact', href: '/contact' },
  ]

  const socialLinks = [
    {
      name: 'GitHub',
      href: personalInfo.github,
      icon: (
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      ),
      color: 'hover:bg-neon-blue/20 hover:border-neon-blue/50'
    },
    {
      name: 'LinkedIn',
      href: personalInfo.linkedin,
      icon: (
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      ),
      color: 'hover:bg-neon-cyan/20 hover:border-neon-cyan/50'
    },
    {
      name: 'Email',
      href: `mailto:${personalInfo.email}`,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      ),
      color: 'hover:bg-neon-purple/20 hover:border-neon-purple/50',
      stroke: true
    },
  ]

  return (
    <footer className="relative bg-gradient-to-b from-dark-navy to-black border-t border-glass-border overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-neon-blue opacity-5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-neon-purple opacity-5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple bg-clip-text text-transparent mb-3 sm:mb-4">
                {personalInfo.name}
              </h3>
              <p className="text-sm sm:text-base text-gray-400 mb-5 sm:mb-6 leading-relaxed max-w-md">
                Full-Stack Developer crafting modern, scalable web experiences with cutting-edge technologies. 
                Let's build something amazing together.
              </p>

              {/* Newsletter */}
              <div className="mb-5 sm:mb-6">
                <h4 className="text-base sm:text-lg text-white font-semibold mb-3">Stay Updated</h4>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base bg-glass-white backdrop-blur-glass border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all"
                    disabled={subscribed}
                  />
                  <motion.button
                    type="submit"
                    className={`px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base rounded-lg font-semibold transition-all whitespace-nowrap ${
                      subscribed
                        ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                        : 'bg-gradient-to-r from-neon-blue to-neon-cyan text-white hover:shadow-lg hover:shadow-neon-blue/50'
                    }`}
                    whileHover={{ scale: subscribed ? 1 : 1.05 }}
                    whileTap={{ scale: subscribed ? 1 : 0.95 }}
                    disabled={subscribed}
                  >
                    {subscribed ? '✓ Subscribed' : 'Subscribe'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-base sm:text-lg text-white font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={link.href}>
                    <motion.span
                      className="text-sm sm:text-base text-gray-400 hover:text-neon-blue transition-colors cursor-pointer flex items-center group"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-neon-blue mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs sm:text-sm">→</span>
                      {link.name}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-base sm:text-lg text-white font-semibold mb-3 sm:mb-4">Connect With Me</h4>
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 sm:w-12 sm:h-12 bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl flex items-center justify-center text-white transition-all ${social.color}`}
                  whileHover={{ scale: 1.1, rotate: 5, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.name}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill={social.stroke ? "none" : "currentColor"} stroke={social.stroke ? "currentColor" : "none"} viewBox="0 0 24 24">
                    {social.icon}
                  </svg>
                </motion.a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-xs sm:text-sm">
              <a href={`mailto:${personalInfo.email}`} className="text-gray-400 hover:text-neon-blue transition-colors flex items-center gap-2 break-all">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {personalInfo.email}
              </a>
              <p className="text-gray-400 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {personalInfo.location}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-glass-border pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-2 sm:gap-3 text-gray-400 text-xs sm:text-sm text-center md:text-left">
            <p className="flex items-center gap-2">
              &copy; {currentYear} {personalInfo.name}. All rights reserved.
            </p>
          </div>

          {/* Back to top */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-neon-blue/10 to-neon-cyan/10 backdrop-blur-glass border border-neon-blue/30 rounded-xl text-white hover:border-neon-blue hover:shadow-lg hover:shadow-neon-blue/30 transition-all flex items-center gap-2"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xs sm:text-sm font-semibold">Back to Top</span>
            <motion.svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </motion.svg>
          </motion.button>
        </motion.div>
      </div>
    </footer>
  )
}
