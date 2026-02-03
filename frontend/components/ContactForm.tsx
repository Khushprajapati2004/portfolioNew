'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/animations'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
        setErrorMessage(data.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('Failed to send message. Please try again later.')
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm sm:text-base text-gray-300 mb-2 font-medium">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base bg-glass-white backdrop-blur-glass border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm sm:text-base text-gray-300 mb-2 font-medium">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base bg-glass-white backdrop-blur-glass border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all"
            placeholder="your.email@example.com"
          />
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm sm:text-base text-gray-300 mb-2 font-medium">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base bg-glass-white backdrop-blur-glass border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all"
            placeholder="What's this about?"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm sm:text-base text-gray-300 mb-2 font-medium">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base bg-glass-white backdrop-blur-glass border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all resize-none"
            placeholder="Your message..."
          />
        </div>

        {/* Status Messages */}
        {status === 'success' && (
          <motion.div
            className="p-3 sm:p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm sm:text-base"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ✓ Message sent successfully! I'll get back to you soon.
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            className="p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm sm:text-base"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ✗ {errorMessage}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-3 sm:py-4 text-sm sm:text-base bg-gradient-blue-purple text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-blue/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
          whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </motion.button>
      </div>
    </motion.form>
  )
}
