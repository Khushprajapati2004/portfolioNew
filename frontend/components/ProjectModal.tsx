'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface Project {
  id: number
  title: string
  description: string
  longDescription: string
  tech: string[]
  image: string
  github: string
  demo: string
  features: string[]
}

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    }
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container with Scroll */}
          <div className="fixed inset-0 z-50 overflow-y-auto mt-20">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6 md:p-8">
              <motion.div
                className="bg-gradient-to-b from-dark-navy to-black border border-glass-border rounded-2xl max-w-5xl w-full shadow-2xl shadow-neon-blue/20 relative"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-glass-white backdrop-blur-glass border border-glass-border rounded-full flex items-center justify-center text-white hover:bg-red-500/20 hover:border-red-500 hover:rotate-90 transition-all duration-300 z-10"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Project Header with Gradient */}
                <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-neon-blue/30 via-neon-purple/30 to-neon-cyan/30 rounded-t-2xl overflow-hidden">
                  {/* Animated background blobs */}
                  <motion.div
                    className="absolute top-0 left-0 w-64 h-64 bg-neon-blue/40 rounded-full blur-3xl"
                    animate={{
                      x: [0, 100, 0],
                      y: [0, 50, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute bottom-0 right-0 w-64 h-64 bg-neon-purple/40 rounded-full blur-3xl"
                    animate={{
                      x: [0, -100, 0],
                      y: [0, -50, 0],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Project Title Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white/20 select-none">
                      {project.title.substring(0, 2).toUpperCase()}
                    </h2>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                    <span className="bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple bg-clip-text text-transparent">
                      {project.title}
                    </span>
                  </h2>
                  
                  {/* Short Description */}
                  <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 italic">
                    {project.description}
                  </p>

                  {/* Long Description */}
                  <div className="mb-6 sm:mb-7 md:mb-8">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2">
                      <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-neon-blue to-neon-cyan rounded-full"></span>
                      About This Project
                    </h3>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                      {project.longDescription}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mb-6 sm:mb-7 md:mb-8">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                      <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-neon-cyan to-neon-purple rounded-full"></span>
                      Key Features
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                      {project.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-glass-white backdrop-blur-glass border border-glass-border rounded-lg hover:border-neon-blue/50 transition-all"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-neon-cyan mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-300 text-xs sm:text-sm leading-relaxed">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-6 sm:mb-7 md:mb-8">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                      <span className="w-1 h-5 sm:h-6 bg-gradient-to-b from-neon-purple to-neon-blue rounded-full"></span>
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {project.tech.map((tech, index) => (
                        <motion.span
                          key={tech}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 backdrop-blur-glass border border-neon-blue/30 rounded-full text-xs sm:text-sm text-gray-200 hover:border-neon-blue hover:shadow-lg hover:shadow-neon-blue/30 transition-all cursor-default"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-glass-border">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 sm:py-3 sm:px-6 text-center bg-glass-white backdrop-blur-glass border border-glass-border rounded-lg text-white hover:bg-neon-blue/20 hover:border-neon-blue transition-all flex items-center justify-center gap-2 group text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      View on GitHub
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 sm:py-3 sm:px-6 text-center bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white hover:shadow-lg hover:shadow-neon-blue/50 transition-all flex items-center justify-center gap-2 group font-semibold text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
