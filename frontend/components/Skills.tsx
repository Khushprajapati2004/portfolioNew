'use client'

import { useState, useEffect, useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { skills as fallbackSkills } from '@/lib/constants'
import AnimatedSection from './AnimatedSection'
import { staggerContainer, scaleIn } from '@/lib/animations'

interface Skill {
  id: string
  name: string
  category: string
}

function Skills() {
  const [apiSkills, setApiSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        const response = await fetch(`${API_URL}/api/skills`, {
          next: { revalidate: 300 } // Cache for 5 minutes
        })
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data.length > 0) {
            setApiSkills(data.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch skills:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  // Organize skills by category - memoized for performance
  const organizedSkills = useMemo(() => {
    if (apiSkills.length > 0) {
      const categories: { [key: string]: string[] } = {}
      apiSkills.forEach(skill => {
        const category = skill.category.toLowerCase()
        if (!categories[category]) {
          categories[category] = []
        }
        categories[category].push(skill.name)
      })
      return categories
    }
    return fallbackSkills
  }, [apiSkills])

  const skillCategories = useMemo(() => [
    { title: 'Frontend', skills: organizedSkills.frontend || [], color: 'from-neon-blue to-neon-cyan' },
    { title: 'Backend', skills: organizedSkills.backend || [], color: 'from-neon-cyan to-neon-purple' },
    { title: 'Databases', skills: organizedSkills.databases || [], color: 'from-neon-purple to-neon-blue' },
    { title: 'Languages', skills: organizedSkills.languages || [], color: 'from-neon-blue to-neon-purple' },
    { title: 'Tools', skills: organizedSkills.tools || [], color: 'from-neon-cyan to-neon-blue' },
  ].filter(cat => cat.skills.length > 0), [organizedSkills])

  return (
    <section id="skills" className="py-12 sm:py-16 md:py-20 bg-dark-navy relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-glow-blue opacity-30" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
              Skills & Technologies
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 text-center mb-10 sm:mb-12 md:mb-16 max-w-2xl mx-auto px-4">
            A comprehensive toolkit for building modern, scalable web applications
          </p>
        </AnimatedSection>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              variants={scaleIn}
              className="bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl p-4 sm:p-5 md:p-6 hover:border-neon-blue/50 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <h3 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                {category.title}
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill}
                    className="flex items-center space-x-2 sm:space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                  >
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-neon-blue rounded-full flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-300">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tech Stack Summary */}
        <AnimatedSection delay={0.4}>
          <div className="mt-10 sm:mt-12 md:mt-16 bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl p-5 sm:p-6 md:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Primary Tech Stack</h3>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
              {['React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'TypeScript'].map((tech) => (
                <motion.span
                  key={tech}
                  className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 rounded-full text-sm sm:text-base text-white font-semibold hover:border-neon-blue transition-colors"
                  whileHover={{ scale: 1.05, borderColor: 'rgba(59, 130, 246, 0.8)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}


export default memo(Skills)
