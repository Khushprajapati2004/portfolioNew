'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import { fadeInUp } from '@/lib/animations'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
}

export default function AnimatedSection({ children, className = '', delay = 0 }: AnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
