'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { projects as fallbackProjects } from '@/lib/constants'
import ProjectCard from '@/components/ProjectCard'
import ProjectModal from '@/components/ProjectModal'
import AnimatedSection from '@/components/AnimatedSection'
import { staggerContainer } from '@/lib/animations'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<typeof fallbackProjects>(fallbackProjects)
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        const response = await fetch(`${API_URL}/api/projects`, {
          next: { revalidate: 300 } // Cache for 5 minutes
        })
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data.length > 0) {
            setProjects(data.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        // Keep using fallback projects
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleProjectClick = useCallback((project: typeof projects[0]) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-dark-navy to-black pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
              My Projects
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 text-center mb-10 sm:mb-12 md:mb-16 max-w-2xl mx-auto px-4">
            A collection of projects showcasing my skills in full-stack development, 
            from concept to deployment.
          </p>
        </AnimatedSection>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </motion.div>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
