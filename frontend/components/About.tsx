'use client'

import { motion } from 'framer-motion'
import { about, personalInfo } from '@/lib/constants'
import AnimatedSection from './AnimatedSection'
import { staggerContainer, fadeInUp } from '@/lib/animations'

export default function About() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-black to-dark-navy">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 sm:mb-12 md:mb-16">
            <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
              About Me
            </span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          {/* Profile Image Placeholder */}
          <AnimatedSection delay={0.2}>
            <div className="relative max-w-md mx-auto md:max-w-none">
              <div className="w-full aspect-square bg-gradient-blue-purple rounded-2xl opacity-20 absolute inset-0 blur-3xl" />
              <div className="relative bg-glass-white backdrop-blur-glass border border-glass-border rounded-2xl p-6 sm:p-8 flex items-center justify-center aspect-square">
                <div className="text-center">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center text-4xl sm:text-5xl md:text-6xl font-bold text-white shadow-lg shadow-neon-blue/50">
                    {personalInfo.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* About Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 md:mt-0"
          >
            <motion.p 
              className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8"
              variants={fadeInUp}
            >
              {about.description}
            </motion.p>

            <motion.div variants={fadeInUp}>
              <h3 className="text-lg sm:text-xl font-semibold text-neon-blue mb-3 sm:mb-4">Hobbies & Interests</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {about.hobbies.map((hobby) => (
                  <motion.span
                    key={hobby}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-glass-white backdrop-blur-glass border border-glass-border rounded-full text-sm sm:text-base text-gray-300 hover:border-neon-blue transition-colors"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {hobby}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4" variants={fadeInUp}>
              <div className="bg-glass-white backdrop-blur-glass border border-glass-border rounded-lg p-3 sm:p-4 text-center hover:border-neon-blue transition-colors">
                <div className="text-2xl sm:text-3xl font-bold text-neon-blue">5+</div>
                <div className="text-gray-400 text-xs sm:text-sm mt-1">Projects Built</div>
              </div>
              <div className="bg-glass-white backdrop-blur-glass border border-glass-border rounded-lg p-3 sm:p-4 text-center hover:border-neon-cyan transition-colors">
                <div className="text-2xl sm:text-3xl font-bold text-neon-cyan">1+</div>
                <div className="text-gray-400 text-xs sm:text-sm mt-1">Years Experience</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
