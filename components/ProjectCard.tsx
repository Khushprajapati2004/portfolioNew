'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { cardHover } from '@/lib/animations'

interface ProjectCardProps {
  project: {
    id: number | string
    title: string
    description: string
    tech: string[]
    image: string
    github: string
    demo: string
  }
  onClick: () => void
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <motion.div
      className="bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl overflow-hidden cursor-pointer group"
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      onClick={onClick}
    >
      {/* Project Image */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-5xl sm:text-6xl font-bold text-white/10">
          {project.title.substring(0, 2)}
        </div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-dark-navy to-transparent opacity-60"
          whileHover={{ opacity: 0.3 }}
        />
      </div>

      {/* Project Info */}
      <div className="p-4 sm:p-5 md:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {project.tech.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 sm:px-3 sm:py-1 bg-neon-blue/10 border border-neon-blue/30 rounded-full text-[10px] sm:text-xs text-neon-blue"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs text-gray-400">
              +{project.tech.length - 3} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 text-center bg-glass-white border border-glass-border rounded-lg text-xs sm:text-sm text-gray-300 hover:bg-neon-blue/20 hover:border-neon-blue transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            GitHub
          </a>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 text-center bg-gradient-blue-purple rounded-lg text-xs sm:text-sm text-white hover:shadow-lg hover:shadow-neon-blue/50 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            Live Demo
          </a>
        </div>
      </div>
    </motion.div>
  )
}


export default memo(ProjectCard)
