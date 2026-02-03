'use client'

import { motion } from 'framer-motion'
import { education, achievements } from '@/lib/constants'
import AnimatedSection from './AnimatedSection'
import { scaleIn } from '@/lib/animations'

export default function Education() {
  return (
    <section id="education" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-black via-dark-navy to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/3 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
              Education & Achievements
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 text-center mb-10 sm:mb-12 md:mb-16 max-w-2xl mx-auto px-4">
            Academic background and notable accomplishments
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Education Card */}
          <motion.div
            className="bg-glass-white backdrop-blur-glass border border-glass-border rounded-2xl p-5 sm:p-6 md:p-8 hover:border-neon-blue/50 hover:shadow-xl hover:shadow-neon-blue/10 transition-all duration-300 group"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-start space-x-3 sm:space-x-4 mb-5 sm:mb-6">
              <motion.div 
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-neon-blue/30"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </motion.div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-neon-blue transition-colors">
                  {education.degree}
                </h3>
                <p className="text-sm sm:text-base text-neon-cyan font-semibold">{education.field}</p>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 mb-5 sm:mb-6">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-neon-blue mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-sm sm:text-base text-gray-300 font-semibold">{education.institution}</p>
              </div>
              
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-neon-cyan mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-xs sm:text-sm text-gray-400">{education.location}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 gap-2 sm:gap-0">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs sm:text-sm text-gray-400">{education.period}</p>
                </div>
                <motion.div 
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-neon-blue/20 to-neon-cyan/20 border border-neon-blue/30 rounded-full w-fit"
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-sm sm:text-base text-neon-blue font-bold">{education.gpa}</p>
                </motion.div>
              </div>
            </div>

            <div className="border-t border-glass-border pt-5 sm:pt-6">
              <h4 className="text-sm sm:text-base text-white font-semibold mb-3 sm:mb-4 flex items-center space-x-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span>Highlights</span>
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {education.achievements.map((achievement, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start space-x-2 sm:space-x-3 text-gray-300 text-xs sm:text-sm group/item"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-neon-cyan mt-0.5 text-base leading-none flex-shrink-0 group-hover/item:scale-125 transition-transform">•</span>
                    <span className="group-hover/item:text-white transition-colors leading-relaxed">{achievement}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Achievements Card */}
          <motion.div
            className="bg-glass-white backdrop-blur-glass border border-glass-border rounded-2xl p-5 sm:p-6 md:p-8 hover:border-neon-blue/50 hover:shadow-xl hover:shadow-neon-blue/10 transition-all duration-300"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center space-x-3 mb-5 sm:mb-6">
              <motion.div 
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-neon-blue via-neon-cyan to-neon-blue rounded-xl flex items-center justify-center shadow-lg shadow-neon-blue/30"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </motion.div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Achievements</h3>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {achievements.map((achievement, index) => {
                const emoji = achievement.split(' ')[0]
                const text = achievement.substring(achievement.indexOf(' ') + 1)
                
                // Icon mapping for each achievement type
                const getIcon = (emoji: string) => {
                  if (emoji === '🏆') {
                    return (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    )
                  } else if (emoji === '🎓') {
                    return (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    )
                  } else if (emoji === '💻') {
                    return (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    )
                  } else if (emoji === '📱') {
                    return (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    )
                  } else if (emoji === '⚡') {
                    return (
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                      </svg>
                    )
                  }
                  return null
                }
                
                return (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-neon-blue/5 to-neon-cyan/5 rounded-xl hover:from-neon-blue/15 hover:to-neon-cyan/15 border border-neon-blue/20 hover:border-neon-blue/40 transition-all duration-300 group cursor-pointer"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <motion.div 
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-neon-blue/20 to-neon-cyan/20 rounded-lg flex items-center justify-center text-neon-blue flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-neon-blue/30 group-hover:to-neon-cyan/30 transition-all"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {getIcon(emoji)}
                    </motion.div>
                    <p className="text-gray-300 text-xs sm:text-sm flex-1 leading-relaxed group-hover:text-white transition-colors pt-0.5 sm:pt-1">
                      {text}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
