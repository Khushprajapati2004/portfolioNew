'use client'

import { motion } from 'framer-motion'
import { experience } from '@/lib/constants'
import AnimatedSection from './AnimatedSection'

export default function Experience() {
  return (
    <section id="experience" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-dark-navy to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 sm:mb-12 md:mb-16">
            <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
        </AnimatedSection>

        <div className="relative">
          {/* Timeline line - centered on desktop, left on mobile */}
          <div className="absolute left-3 sm:left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-blue via-neon-cyan to-neon-purple" />

          {experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              className="relative mb-8 sm:mb-10 md:w-1/2 md:mb-16"
              style={{
                marginLeft: index % 2 === 0 ? '0' : 'auto',
                marginRight: index % 2 === 0 ? 'auto' : '0'
              }}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {/* Timeline dot - Desktop */}
              <div 
                className="hidden md:block absolute top-5 sm:top-6 w-4 h-4 sm:w-5 sm:h-5 bg-neon-blue rounded-full border-4 border-black z-10 shadow-lg shadow-neon-blue/50"
                style={{
                  left: index % 2 === 0 ? 'calc(100% + 1.25rem)' : 'auto',
                  right: index % 2 === 0 ? 'auto' : 'calc(100% + 1.25rem)'
                }}
              />

              {/* Mobile dot */}
              <div className="absolute top-5 sm:top-6 -left-2 sm:-left-2.5 w-4 h-4 sm:w-5 sm:h-5 bg-neon-blue rounded-full border-4 border-black z-10 shadow-lg shadow-neon-blue/50 md:hidden" />

              <div className={`ml-8 sm:ml-10 md:ml-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                <div className="bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl p-4 sm:p-5 md:p-6 hover:border-neon-blue/50 transition-all duration-300">
                  <div className="flex flex-col mb-2 sm:mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{exp.title}</h3>
                    <span className="text-xs sm:text-sm text-neon-cyan mb-2">{exp.period}</span>
                  </div>
                  
                  <div className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
                    <span className="font-semibold">{exp.company}</span> • {exp.location}
                  </div>

                  <ul className="space-y-2 sm:space-y-2.5">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2 text-gray-300 text-xs sm:text-sm leading-relaxed">
                        <span className="text-neon-blue mt-1 sm:mt-1.5 flex-shrink-0 text-sm sm:text-base">▹</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
