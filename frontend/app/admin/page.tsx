'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Certificate {
  id: string
  title: string
  issuer: string
  date: string
  credentialId?: string
  url?: string
}

interface Message {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  tech: string[]
  image: string
  github: string
  demo: string
  features: string[]
}

interface Skill {
  id: string
  name: string
  category: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'messages' | 'projects' | 'skills'>('messages')
  
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  const handleLogin = async () => {
    setLoginError('')
    setIsLoading(true)
    
    if (!password.trim()) {
      setLoginError('Please enter the admin password')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store the JWT token
        localStorage.setItem('adminToken', data.data.token)
        localStorage.setItem('adminAuth', 'true')
        setIsAuthenticated(true)
        setPassword('')
        await fetchAllData(data.data.token)
      } else {
        setLoginError(data.message || 'Invalid credentials')
        setPassword('')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Login failed. Please check your connection and try again.')
      setPassword('')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        return true
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminAuth')
        return false
      }
    } catch (error) {
      console.error('Token verification error:', error)
      return false
    }
  }

  const fetchAllData = async (authToken: string) => {
    await Promise.all([
      fetchMessages(authToken),
      fetchProjects(authToken),
      fetchSkills(authToken),
      fetchCertificates(authToken)
    ])
  }

  const fetchMessages = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/messages`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
      if (response.ok) {
        const data = await response.json()
        setMessages(data.data || [])
      } else if (response.status === 401) {
        // Token expired or invalid
        handleLogout()
      }
    } catch (err) {
      console.error('Failed to fetch messages')
    }
  }

  const fetchProjects = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/api/projects`)
      if (response.ok) {
        const data = await response.json()
        setProjects(data.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch projects')
    }
  }

  const fetchSkills = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/api/skills`)
      if (response.ok) {
        const data = await response.json()
        setSkills(data.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch skills')
    }
  }

  const fetchCertificates = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/certificates`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
      if (response.ok) {
        const data = await response.json()
        setCertificates(data.data || [])
      } else if (response.status === 401) {
        // Token expired or invalid
        handleLogout()
      }
    } catch (err) {
      console.error('Failed to fetch certificates')
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return
    const authToken = localStorage.getItem('adminToken')
    try {
      const response = await fetch(`${API_URL}/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
      if (response.ok) {
        setMessages(messages.filter(msg => msg._id !== id))
        setSelectedMessage(null)
      } else if (response.status === 401) {
        handleLogout()
      }
    } catch (err) {
      alert('Failed to delete message')
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return
    const authToken = localStorage.getItem('adminToken')
    try {
      const response = await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
      if (response.ok) {
        setProjects(projects.filter(p => p.id !== id))
      } else if (response.status === 401) {
        handleLogout()
      }
    } catch (err) {
      alert('Failed to delete project')
    }
  }

  const deleteSkill = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    const authToken = localStorage.getItem('adminToken')
    try {
      const response = await fetch(`${API_URL}/api/skills/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
      if (response.ok) {
        setSkills(skills.filter(s => s.id !== id))
      } else if (response.status === 401) {
        handleLogout()
      }
    } catch (err) {
      alert('Failed to delete skill')
    }
  }

  const addProject = async (projectData: Partial<Project>) => {
    const authToken = localStorage.getItem('adminToken')
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      })
      if (response.ok) {
        const data = await response.json()
        setProjects([...projects, data.data])
        return true
      } else if (response.status === 401) {
        handleLogout()
      }
    } catch (err) {
      alert('Failed to add project')
    }
    return false
  }

  const addSkill = async (skillData: Partial<Skill>) => {
    const authToken = localStorage.getItem('adminToken')
    try {
      const response = await fetch(`${API_URL}/api/skills`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(skillData)
      })
      if (response.ok) {
        const data = await response.json()
        setSkills([...skills, data.data])
        return true
      } else if (response.status === 401) {
        handleLogout()
      }
    } catch (err) {
      alert('Failed to add skill')
    }
    return false
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminAuth')
    setIsAuthenticated(false)
    setPassword('')
    setLoginError('')
    setMessages([])
    setProjects([])
    setSkills([])
    setCertificates([])
  }

  useEffect(() => {
    const checkAuth = async () => {
      const savedAuth = localStorage.getItem('adminAuth')
      const savedToken = localStorage.getItem('adminToken')
      
      if (savedAuth === 'true' && savedToken) {
        // Verify token with backend
        const isValid = await verifyToken(savedToken)
        if (isValid) {
          setIsAuthenticated(true)
          await fetchAllData(savedToken)
        } else {
          // Token is invalid, clear storage
          handleLogout()
        }
      }
    }

    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-dark-navy to-black flex items-center justify-center px-4 sm:px-6">
        <motion.div
          className="max-w-md w-full bg-glass-white backdrop-blur-glass border border-glass-border rounded-2xl p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-6">
            <motion.div
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </motion.div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
                Secure Admin Access
              </span>
            </h1>
            <p className="text-gray-400 text-sm">Enter your admin credentials to continue</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm sm:text-base text-gray-300 mb-2">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base bg-glass-white backdrop-blur-glass border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all"
                placeholder="Enter admin password"
                autoComplete="current-password"
              />
            </div>

            {loginError && (
              <motion.div
                className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-xs sm:text-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {loginError}
                </div>
              </motion.div>
            )}

            <button
              onClick={handleLogin}
              disabled={!password.trim() || isLoading}
              className="w-full py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-blue/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                'Access Admin Panel'
              )}
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-glass-border">
            <div className="flex items-center justify-center text-xs text-gray-500">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Protected by secure authentication
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-dark-navy to-black pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 sm:space-x-4 mb-6 sm:mb-8 border-b border-glass-border overflow-x-auto">
          {(['messages', 'projects', 'skills'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold capitalize transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'text-neon-blue border-b-2 border-neon-blue'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'messages' && (
            <MessagesTab
              messages={messages}
              selectedMessage={selectedMessage}
              setSelectedMessage={setSelectedMessage}
              deleteMessage={deleteMessage}
            />
          )}
          
          {activeTab === 'projects' && (
            <ProjectsTab
              projects={projects}
              addProject={addProject}
              deleteProject={deleteProject}
            />
          )}
          
          {activeTab === 'skills' && (
            <SkillsTab
              skills={skills}
              addSkill={addSkill}
              deleteSkill={deleteSkill}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Messages Tab Component
function MessagesTab({ messages, selectedMessage, setSelectedMessage, deleteMessage }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid md:grid-cols-2 gap-6"
    >
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Messages ({messages.length})</h2>
        {messages.map((msg: Message) => (
          <div
            key={msg._id}
            className={`bg-glass-white backdrop-blur-glass border rounded-xl p-4 cursor-pointer transition-all ${
              selectedMessage?._id === msg._id ? 'border-neon-blue' : 'border-glass-border hover:border-neon-blue/50'
            }`}
            onClick={() => setSelectedMessage(msg)}
          >
            <h3 className="text-white font-semibold">{msg.name}</h3>
            <p className="text-gray-400 text-sm">{msg.email}</p>
            <p className="text-gray-300 text-sm mt-2">{msg.subject}</p>
          </div>
        ))}
      </div>

      <div>
        {selectedMessage && (
          <div className="bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Message Details</h2>
              <button
                onClick={() => deleteMessage(selectedMessage._id)}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm">From</label>
                <p className="text-white">{selectedMessage.name}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Email</label>
                <p className="text-neon-blue">{selectedMessage.email}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Subject</label>
                <p className="text-white">{selectedMessage.subject}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Message</label>
                <p className="text-gray-300">{selectedMessage.message}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Projects Tab Component
function ProjectsTab({ projects, addProject, deleteProject }: any) {
  const [showForm, setShowForm] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    tech: '',
    github: '',
    demo: '',
    features: ''
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let imagePath = '/images/projects/default.jpg'
    
    // If image is uploaded, you would typically upload it to your server/cloud storage
    // For now, we'll use a placeholder path
    if (imageFile) {
      imagePath = `/images/projects/${imageFile.name}`
    }

    const success = await addProject({
      ...formData,
      tech: formData.tech.split(',').map(t => t.trim()).filter(t => t),
      features: formData.features.split('\n').map(f => f.trim()).filter(f => f),
      image: imagePath
    })
    
    if (success) {
      setShowForm(false)
      setFormData({ 
        title: '', 
        description: '', 
        longDescription: '', 
        tech: '', 
        github: '', 
        demo: '', 
        features: '' 
      })
      setImageFile(null)
      setImagePreview('')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Projects ({projects.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-cyan text-white rounded-lg"
        >
          {showForm ? 'Cancel' : 'Add Project'}
        </button>
      </div>

      {showForm && (
        <div className="bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-6">Add New Project</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-neon-blue">Basic Information</h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Project Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., TravelVista"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-glass-white border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Technologies *</label>
                  <input
                    type="text"
                    placeholder="React.js, Node.js, MongoDB, Tailwind CSS"
                    value={formData.tech}
                    onChange={(e) => setFormData({...formData, tech: e.target.value})}
                    className="w-full px-4 py-3 bg-glass-white border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Separate technologies with commas</p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Short Description *</label>
                <textarea
                  placeholder="A brief description of your project (1-2 sentences)"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-glass-white border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all resize-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Detailed Description *</label>
                <textarea
                  placeholder="Provide a comprehensive description of your project, including its purpose, functionality, and technical implementation..."
                  value={formData.longDescription}
                  onChange={(e) => setFormData({...formData, longDescription: e.target.value})}
                  className="w-full px-4 py-3 bg-glass-white border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all resize-none"
                  rows={5}
                  required
                />
              </div>
            </div>

            {/* Project Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-neon-blue">Project Links</h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">GitHub Repository</label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/project-name"
                    value={formData.github}
                    onChange={(e) => setFormData({...formData, github: e.target.value})}
                    className="w-full px-4 py-3 bg-glass-white border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Live Demo</label>
                  <input
                    type="url"
                    placeholder="https://your-project-demo.vercel.app"
                    value={formData.demo}
                    onChange={(e) => setFormData({...formData, demo: e.target.value})}
                    className="w-full px-4 py-3 bg-glass-white border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-neon-blue">Key Features</h4>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Project Features *</label>
                <textarea
                  placeholder={`List the key features of your project (one per line):
User authentication and authorization
Real-time search and filtering
Secure payment gateway integration
Booking management system
Responsive design for all devices`}
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  className="w-full px-4 py-3 bg-glass-white border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all resize-none"
                  rows={6}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Enter each feature on a new line</p>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-neon-blue">Project Image</h4>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Upload Project Screenshot</label>
                <div className="border-2 border-dashed border-glass-border rounded-lg p-6 text-center hover:border-neon-blue/50 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-full h-48 object-cover rounded-lg mx-auto"
                        />
                        <p className="text-sm text-gray-400">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-glass-white rounded-lg flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-medium">Upload project image</p>
                          <p className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setFormData({ title: '', description: '', longDescription: '', tech: '', github: '', demo: '', features: '' })
                  setImageFile(null)
                  setImagePreview('')
                }}
                className="flex-1 py-3 px-6 bg-gray-600/20 text-gray-300 rounded-lg hover:bg-gray-600/30 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-6 bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-blue/50 transition-all"
              >
                Add Project
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: Project) => (
          <div key={project.id} className="bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl overflow-hidden hover:border-neon-blue/50 transition-all">
            {/* Project Image */}
            {project.image && (
              <div className="h-48 bg-gray-800 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/projects/default.jpg'
                  }}
                />
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>
              
              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.slice(0, 3).map((t, i) => (
                  <span key={i} className="px-2 py-1 bg-neon-blue/20 text-neon-blue text-xs rounded">
                    {t}
                  </span>
                ))}
                {project.tech.length > 3 && (
                  <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded">
                    +{project.tech.length - 3} more
                  </span>
                )}
              </div>

              {/* Features Preview */}
              {project.features && project.features.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">Key Features:</p>
                  <ul className="text-xs text-gray-300 space-y-1">
                    {project.features.slice(0, 2).map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-neon-blue mr-2">•</span>
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                    {project.features.length > 2 && (
                      <li className="text-gray-400 text-xs">
                        +{project.features.length - 2} more features
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Project Links */}
              <div className="flex gap-2 mb-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-gray-600/20 text-gray-300 text-xs rounded-lg hover:bg-gray-600/30 transition-all text-center"
                  >
                    GitHub
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-neon-blue/20 text-neon-blue text-xs rounded-lg hover:bg-neon-blue/30 transition-all text-center"
                  >
                    Live Demo
                  </a>
                )}
              </div>

              <button
                onClick={() => deleteProject(project.id)}
                className="w-full py-2 bg-red-500/20 text-red-300 rounded-lg text-sm hover:bg-red-500/30 transition-all"
              >
                Delete Project
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// Skills Tab Component
function SkillsTab({ skills, addSkill, deleteSkill }: any) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', category: 'frontend' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await addSkill(formData)
    if (success) {
      setShowForm(false)
      setFormData({ name: '', category: 'frontend' })
    }
  }

  const categories = ['frontend', 'backend', 'databases', 'languages', 'tools']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Skills ({skills.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-cyan text-white rounded-lg"
        >
          {showForm ? 'Cancel' : 'Add Skill'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Skill Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="px-4 py-2 bg-glass-white border border-glass-border rounded-lg text-white"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="px-4 py-2 bg-glass-white border border-glass-border rounded-lg text-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full mt-4 py-3 bg-gradient-to-r from-neon-blue to-neon-cyan text-white rounded-lg"
          >
            Add Skill
          </button>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <div key={category} className="bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-neon-blue mb-4 capitalize">{category}</h3>
            <div className="space-y-2">
              {skills.filter((s: Skill) => s.category === category).map((skill: Skill) => (
                <div key={skill.id} className="flex justify-between items-center">
                  <span className="text-gray-300">{skill.name}</span>
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
