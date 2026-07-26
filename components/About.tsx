'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { about, personalInfo } from '@/lib/constants'
import AnimatedSection from './AnimatedSection'
import { staggerContainer, fadeInUp } from '@/lib/animations'

export default function About() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 relative scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="relative max-w-md mx-auto md:max-w-none md:mx-0">
              <div className="relative w-full aspect-[4/5] max-w-md mx-auto md:mx-0 group">
                {/* Decorative background glow */}
                <div className="absolute -inset-1 bg-gradient-to-tr from-neon-blue to-neon-purple rounded-2xl opacity-20 blur-xl -z-10 group-hover:opacity-50 transition-opacity duration-500" />

                {/* Image Container */}
                <div className="relative w-full h-full bg-glass-white backdrop-blur-glass border border-glass-border rounded-2xl p-2 z-10">
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner">
                    {/* Default Image */}
                    <Image
                      src="/images/profile.png"
                      alt={`${personalInfo.name} Profile`}
                      fill
                      className="object-cover object-top transition-opacity duration-700 ease-in-out group-hover:opacity-0"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />

                    {/* Hover Image */}
                    <Image
                      src="/images/profile1.png"
                      alt={`${personalInfo.name} Alternate Profile`}
                      fill
                      className="object-cover object-top opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
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
