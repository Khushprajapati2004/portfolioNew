'use client'

import { motion } from 'framer-motion'
import ContactForm from '@/components/ContactForm'
import AnimatedSection from '@/components/AnimatedSection'
import { personalInfo } from '@/lib/constants'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-dark-navy to-black pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 text-center mb-10 sm:mb-12 md:mb-16 max-w-2xl mx-auto px-4">
            Have a project in mind or want to collaborate? Feel free to reach out. 
            I'm always open to discussing new opportunities and ideas.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <AnimatedSection delay={0.2}>
            <div className="space-y-5 sm:space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Contact Information</h2>
                <div className="space-y-3 sm:space-y-4">
                  {/* Email Card */}
                  <motion.a
                    href={`mailto:${personalInfo.email}`}
                    className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl hover:border-neon-blue/50 hover:shadow-lg hover:shadow-neon-blue/20 transition-all group"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div 
                      className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-xl flex items-center justify-center shadow-lg shadow-neon-blue/30 flex-shrink-0"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Email</p>
                      <p className="text-sm sm:text-base text-white font-semibold group-hover:text-neon-blue transition-colors truncate">
                        {personalInfo.email}
                      </p>
                    </div>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-neon-blue transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.a>

                  {/* Location Card */}
                  <motion.div
                    className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl hover:border-neon-cyan/50 hover:shadow-lg hover:shadow-neon-cyan/20 transition-all group"
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <motion.div 
                      className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-neon-cyan to-neon-blue rounded-xl flex items-center justify-center shadow-lg shadow-neon-cyan/30 flex-shrink-0"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Location</p>
                      <p className="text-sm sm:text-base text-white font-semibold group-hover:text-neon-cyan transition-colors">
                        {personalInfo.location}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Social Links Card */}
              <motion.div 
                className="bg-gradient-to-br from-glass-white to-transparent backdrop-blur-glass border border-glass-border rounded-xl p-4 sm:p-5 md:p-6 hover:border-neon-blue/50 transition-all"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Connect on Social
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <motion.a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group py-3 px-3 sm:py-4 sm:px-4 bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl text-center hover:bg-neon-blue/10 hover:border-neon-blue transition-all flex flex-col items-center gap-1.5 sm:gap-2"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-neon-blue transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span className="text-white text-xs sm:text-sm font-semibold group-hover:text-neon-blue transition-colors">GitHub</span>
                  </motion.a>

                  <motion.a
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group py-3 px-3 sm:py-4 sm:px-4 bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl text-center hover:bg-neon-cyan/10 hover:border-neon-cyan transition-all flex flex-col items-center gap-1.5 sm:gap-2"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-neon-cyan transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-white text-xs sm:text-sm font-semibold group-hover:text-neon-cyan transition-colors">LinkedIn</span>
                  </motion.a>
                </div>
              </motion.div>

              {/* Quick Response Badge */}
              <motion.div
                className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-green-500/10 to-neon-blue/10 border border-green-500/30 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex-shrink-0"
                >
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50" />
                </motion.div>
                <p className="text-xs sm:text-sm text-gray-300">
                  <span className="text-green-400 font-semibold">Available for work</span> • Usually responds within 24 hours
                </p>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
