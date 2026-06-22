'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

// ─── Interfaces ───────────────────────────────────────────────────────────────

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

type Category = 'frontend' | 'backend' | 'databases' | 'languages' | 'tools'

interface Skill {
  _id: string
  name: string
  category: Category
}

const CATEGORIES: Category[] = ['frontend', 'backend', 'databases', 'languages', 'tools']

// ─── Admin Page ───────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'messages' | 'projects' | 'skills'>('messages')
  const router = useRouter()

  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])

  // ── Auth ──────────────────────────────────────────────────────────────────

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.ok
    } catch {
      return false
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setMessages([])
    setProjects([])
    setSkills([])
    router.push('/admin')
  }

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('adminToken')
      if (token && (await verifyToken(token))) {
        setIsAuthenticated(true)
        await fetchAllData(token)
      } else {
        localStorage.removeItem('adminToken')
        router.push('/admin')
      }
      setIsLoading(false)
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Data fetching ─────────────────────────────────────────────────────────

  const fetchAllData = async (token: string) => {
    await Promise.all([fetchSkills(), fetchMessages(token), fetchProjects()])
  }

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills')
      if (res.ok) {
        const data = await res.json()
        setSkills(data.data || [])
      }
    } catch {
      console.error('Failed to fetch skills')
    }
  }

  const fetchMessages = async (token: string) => {
    try {
      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setMessages(data.data || [])
      } else if (res.status === 401) {
        handleLogout()
      }
    } catch {
      console.error('Failed to fetch messages')
    }
  }

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data.data || [])
      }
    } catch {
      console.error('Failed to fetch projects')
    }
  }

  // ── Skills CRUD ───────────────────────────────────────────────────────────

  const addSkill = async (skillData: { name: string; category: string }): Promise<boolean> => {
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(skillData),
      })
      if (res.ok) {
        const data = await res.json()
        setSkills(prev => [...prev, data.data])
        return true
      }
      if (res.status === 401) { handleLogout(); return false }
      const err = await res.json()
      alert(err.message || 'Failed to add skill')
    } catch {
      alert('Failed to add skill')
    }
    return false
  }

  const updateSkill = async (id: string, skillData: { name: string; category: string }): Promise<boolean> => {
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(skillData),
      })
      if (res.ok) {
        const data = await res.json()
        setSkills(prev => prev.map(s => s._id === id ? data.data : s))
        return true
      }
      if (res.status === 401) { handleLogout(); return false }
      const err = await res.json()
      alert(err.message || 'Failed to update skill')
    } catch {
      alert('Failed to update skill')
    }
    return false
  }

  const deleteSkill = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setSkills(prev => prev.filter(s => s._id !== id))
      } else if (res.status === 401) {
        handleLogout()
      }
    } catch {
      alert('Failed to delete skill')
    }
  }

  // ── Messages CRUD ─────────────────────────────────────────────────────────

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setMessages(prev => prev.filter(m => m._id !== id))
        setSelectedMessage(null)
      } else if (res.status === 401) {
        handleLogout()
      }
    } catch {
      alert('Failed to delete message')
    }
  }

  // ── Projects CRUD ─────────────────────────────────────────────────────────

  const addProject = async (projectData: Partial<Project>): Promise<boolean> => {
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      })
      if (res.ok) {
        const data = await res.json()
        setProjects(prev => [...prev, data.data])
        return true
      }
      if (res.status === 401) { handleLogout(); return false }
    } catch {
      alert('Failed to add project')
    }
    return false
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return
    const token = localStorage.getItem('adminToken')
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id))
      } else if (res.status === 401) {
        handleLogout()
      }
    } catch {
      alert('Failed to delete project')
    }
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-dark-navy to-black pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Logo />
            </Link>
            <h1 className="text-3xl font-bold border-l-2 border-glass-border pl-4">
              <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-glass-border overflow-x-auto">
          {(['messages', 'projects', 'skills'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-semibold capitalize transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'text-neon-blue border-b-2 border-neon-blue'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
              {tab === 'messages' && messages.length > 0 && (
                <span className="ml-2 text-xs bg-neon-blue/20 text-neon-blue px-2 py-0.5 rounded-full">
                  {messages.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'messages' && (
            <MessagesTab
              key="messages"
              messages={messages}
              selectedMessage={selectedMessage}
              setSelectedMessage={setSelectedMessage}
              deleteMessage={deleteMessage}
            />
          )}
          {activeTab === 'projects' && (
            <ProjectsTab
              key="projects"
              projects={projects}
              addProject={addProject}
              deleteProject={deleteProject}
            />
          )}
          {activeTab === 'skills' && (
            <SkillsTab
              key="skills"
              skills={skills}
              addSkill={addSkill}
              updateSkill={updateSkill}
              deleteSkill={deleteSkill}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Messages Tab ─────────────────────────────────────────────────────────────

function MessagesTab({ messages, selectedMessage, setSelectedMessage, deleteMessage }: {
  messages: Message[]
  selectedMessage: Message | null
  setSelectedMessage: (m: Message | null) => void
  deleteMessage: (id: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid md:grid-cols-2 gap-6"
    >
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-white mb-4">Messages ({messages.length})</h2>
        {messages.length === 0 && (
          <p className="text-gray-500 text-sm italic">No messages yet.</p>
        )}
        {messages.map(msg => (
          <div
            key={msg._id}
            onClick={() => setSelectedMessage(msg)}
            className={`bg-glass-white backdrop-blur-glass border rounded-xl p-4 cursor-pointer transition-all ${
              selectedMessage?._id === msg._id
                ? 'border-neon-blue'
                : 'border-glass-border hover:border-neon-blue/50'
            }`}
          >
            <h3 className="text-white font-semibold">{msg.name}</h3>
            <p className="text-gray-400 text-sm">{msg.email}</p>
            <p className="text-gray-300 text-sm mt-1 truncate">{msg.subject}</p>
          </div>
        ))}
      </div>

      <div>
        {selectedMessage ? (
          <div className="bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-white">Message Details</h2>
              <button
                onClick={() => deleteMessage(selectedMessage._id)}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg text-sm hover:bg-red-500/30 transition-all"
              >
                Delete
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'From', value: selectedMessage.name, color: 'text-white' },
                { label: 'Email', value: selectedMessage.email, color: 'text-neon-blue' },
                { label: 'Subject', value: selectedMessage.subject, color: 'text-white' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">{label}</p>
                  <p className={`${color} text-sm`}>{value}</p>
                </div>
              ))}
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Message</p>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl p-6 flex items-center justify-center h-48">
            <p className="text-gray-500 text-sm">Select a message to view details</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Projects Tab ─────────────────────────────────────────────────────────────

function ProjectsTab({ projects, addProject, deleteProject }: {
  projects: Project[]
  addProject: (data: Partial<Project>) => Promise<boolean>
  deleteProject: (id: string) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '', description: '', longDescription: '',
    tech: '', github: '', demo: '', features: '',
  })

  const set = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const resetForm = () => {
    setShowForm(false)
    setFormData({ title: '', description: '', longDescription: '', tech: '', github: '', demo: '', features: '' })
    setImageFile(null)
    setImagePreview('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const success = await addProject({
      ...formData,
      tech: formData.tech.split(',').map(t => t.trim()).filter(Boolean),
      features: formData.features.split('\n').map(f => f.trim()).filter(Boolean),
      image: imageFile ? `/images/projects/${imageFile.name}` : '/images/projects/default.jpg',
    })
    setSubmitting(false)
    if (success) resetForm()
  }

  const inputClass = 'w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all'

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
          className="px-6 py-2.5 bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-blue/50 transition-all"
        >
          {showForm ? 'Cancel' : '+ Add Project'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-glass-white backdrop-blur-glass border border-neon-blue/40 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Add New Project</h3>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Basic info */}
                <div>
                  <h4 className="text-sm font-semibold text-neon-blue uppercase tracking-wide mb-3">Basic Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Project Title *</label>
                      <input type="text" placeholder="e.g., TravelVista" value={formData.title}
                        onChange={e => set('title', e.target.value)} className={inputClass} required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Technologies *</label>
                      <input type="text" placeholder="React.js, Node.js, MongoDB" value={formData.tech}
                        onChange={e => set('tech', e.target.value)} className={inputClass} required />
                      <p className="text-xs text-gray-400 mt-1">Comma separated</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-300 mb-2">Short Description *</label>
                    <textarea placeholder="Brief description (1–2 sentences)" value={formData.description}
                      onChange={e => set('description', e.target.value)} className={inputClass} rows={2} required />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm text-gray-300 mb-2">Detailed Description</label>
                    <textarea placeholder="Full project description..." value={formData.longDescription}
                      onChange={e => set('longDescription', e.target.value)} className={inputClass} rows={4} />
                  </div>
                </div>

                {/* Links */}
                <div>
                  <h4 className="text-sm font-semibold text-neon-blue uppercase tracking-wide mb-3">Project Links</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">GitHub Repository</label>
                      <input type="url" placeholder="https://github.com/..." value={formData.github}
                        onChange={e => set('github', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Live Demo</label>
                      <input type="url" placeholder="https://..." value={formData.demo}
                        onChange={e => set('demo', e.target.value)} className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-sm font-semibold text-neon-blue uppercase tracking-wide mb-3">Key Features</h4>
                  <label className="block text-sm text-gray-300 mb-2">Features (one per line) *</label>
                  <textarea
                    placeholder={'User authentication\nReal-time search\nResponsive design'}
                    value={formData.features}
                    onChange={e => set('features', e.target.value)}
                    className={inputClass}
                    rows={5}
                    required
                  />
                </div>

                {/* Image upload */}
                <div>
                  <h4 className="text-sm font-semibold text-neon-blue uppercase tracking-wide mb-3">Project Image</h4>
                  <div className="border-2 border-dashed border-glass-border rounded-lg p-6 text-center hover:border-neon-blue/50 transition-all">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="img-upload" />
                    <label htmlFor="img-upload" className="cursor-pointer block">
                      {imagePreview ? (
                        <div>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imagePreview} alt="Preview" className="h-40 object-cover rounded-lg mx-auto mb-2" />
                          <p className="text-xs text-gray-400">Click to change</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-12 h-12 mx-auto bg-glass-white rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <p className="text-white text-sm">Upload project image</p>
                          <p className="text-gray-400 text-xs">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={resetForm}
                    className="flex-1 py-3 bg-gray-600/20 text-gray-300 rounded-lg hover:bg-gray-600/30 transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 py-3 bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-blue/50 transition-all disabled:opacity-50">
                    {submitting ? 'Adding...' : 'Add Project'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project cards */}
      {projects.length === 0 && !showForm && (
        <p className="text-gray-500 text-sm italic">No projects yet.</p>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl overflow-hidden hover:border-neon-blue/50 transition-all">
            {project.image && (
              <div className="h-40 bg-gray-800 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.image} alt={project.title} className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = '/images/projects/default.jpg' }} />
              </div>
            )}
            <div className="p-5">
              <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
              <p className="text-gray-400 text-xs mb-3 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tech?.slice(0, 3).map((t, i) => (
                  <span key={i} className="px-2 py-0.5 bg-neon-blue/20 text-neon-blue text-xs rounded">{t}</span>
                ))}
                {project.tech?.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-600/20 text-gray-400 text-xs rounded">+{project.tech.length - 3}</span>
                )}
              </div>
              <div className="flex gap-2 mb-3">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    className="flex-1 py-1.5 bg-gray-600/20 text-gray-300 text-xs rounded-lg text-center hover:bg-gray-600/30 transition-all">
                    GitHub
                  </a>
                )}
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noopener noreferrer"
                    className="flex-1 py-1.5 bg-neon-blue/20 text-neon-blue text-xs rounded-lg text-center hover:bg-neon-blue/30 transition-all">
                    Live Demo
                  </a>
                )}
              </div>
              <button onClick={() => deleteProject(project.id)}
                className="w-full py-2 bg-red-500/20 text-red-300 rounded-lg text-xs hover:bg-red-500/30 transition-all">
                Delete Project
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Skills Tab ───────────────────────────────────────────────────────────────

function SkillsTab({ skills, addSkill, updateSkill, deleteSkill }: {
  skills: Skill[]
  addSkill: (data: { name: string; category: string }) => Promise<boolean>
  updateSkill: (id: string, data: { name: string; category: string }) => Promise<boolean>
  deleteSkill: (id: string) => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [formData, setFormData] = useState({ name: '', category: 'frontend' as Category })
  const [submitting, setSubmitting] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')

  const openAdd = () => {
    setEditingSkill(null)
    setFormData({ name: '', category: 'frontend' })
    setShowForm(true)
  }

  const openEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setFormData({ name: skill.name, category: skill.category })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingSkill(null)
    setFormData({ name: '', category: 'frontend' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    if (editingSkill) {
      const success = await updateSkill(editingSkill._id, formData)
      if (success) closeForm()
    } else {
      const names = formData.name.split(',').map(n => n.trim()).filter(Boolean)
      let allSuccess = true
      for (const name of names) {
        const success = await addSkill({ name, category: formData.category })
        if (!success) allSuccess = false
      }
      if (allSuccess && names.length > 0) closeForm()
    }
    
    setSubmitting(false)
  }

  const filtered = activeCategory === 'all' ? skills : skills.filter(s => s.category === activeCategory)
  const countOf = (cat: Category) => skills.filter(s => s.category === cat).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Skills ({skills.length})</h2>
          <p className="text-gray-400 text-sm mt-0.5">Manage your skills across all categories</p>
        </div>
        <button
          onClick={openAdd}
          className="px-6 py-2.5 bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-blue/50 transition-all"
        >
          + Add Skill
        </button>
      </div>

      {/* Add / Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-glass-white backdrop-blur-glass border border-neon-blue/40 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">
                {editingSkill ? `Edit "${editingSkill.name}"` : 'Add New Skill'}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Skill Name(s) *</label>
                  <input
                    type="text"
                    placeholder="e.g., React.js, Next.js, HTML"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-all"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData(p => ({ ...p, category: e.target.value as Category }))}
                    className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-lg text-white focus:outline-none focus:border-neon-blue transition-all"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-gray-900 capitalize">{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button type="button" onClick={closeForm}
                  className="flex-1 py-2.5 bg-gray-600/20 text-gray-300 rounded-lg hover:bg-gray-600/30 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={submitting || !formData.name.trim()}
                  className="flex-1 py-2.5 bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-blue/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? 'Saving...' : editingSkill ? 'Update Skill' : 'Add Skill'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeCategory === 'all'
              ? 'bg-neon-blue text-white'
              : 'bg-glass-white border border-glass-border text-gray-400 hover:text-white'
          }`}
        >
          All ({skills.length})
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
              activeCategory === cat
                ? 'bg-neon-blue text-white'
                : 'bg-glass-white border border-glass-border text-gray-400 hover:text-white'
            }`}
          >
            {cat} ({countOf(cat)})
          </button>
        ))}
      </div>

      {/* Skills display */}
      {activeCategory === 'all' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map(category => {
            const catSkills = skills.filter(s => s.category === category)
            return (
              <div key={category} className="bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-neon-blue capitalize">{category}</h3>
                  <span className="text-xs text-gray-400 bg-neon-blue/10 px-2 py-0.5 rounded-full">
                    {catSkills.length}
                  </span>
                </div>
                {catSkills.length === 0 && (
                  <p className="text-gray-500 text-xs italic">No skills yet</p>
                )}
                <div className="space-y-2">
                  {catSkills.map(skill => (
                    <div key={skill._id} className="flex items-center justify-between group py-1">
                      <span className="text-gray-300 text-sm">{skill.name}</span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(skill)}
                          className="text-neon-blue hover:text-neon-cyan text-xs px-2 py-0.5 rounded border border-neon-blue/30 hover:border-neon-cyan/50 transition-all">
                          Edit
                        </button>
                        <button onClick={() => deleteSkill(skill._id)}
                          className="text-red-400 hover:text-red-300 text-xs px-2 py-0.5 rounded border border-red-400/30 hover:border-red-300/50 transition-all">
                          Del
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-glass-white backdrop-blur-glass border border-glass-border rounded-xl p-6">
          <h3 className="text-lg font-bold text-neon-blue capitalize mb-4">
            {activeCategory} ({filtered.length})
          </h3>
          {filtered.length === 0 && (
            <p className="text-gray-500 text-sm italic">No skills in this category.</p>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(skill => (
              <div key={skill._id}
                className="flex items-center justify-between bg-black/20 border border-glass-border rounded-lg px-4 py-3 group hover:border-neon-blue/40 transition-all">
                <span className="text-gray-300 text-sm">{skill.name}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(skill)} title="Edit"
                    className="text-neon-blue hover:text-neon-cyan text-xs">✏️</button>
                  <button onClick={() => deleteSkill(skill._id)} title="Delete"
                    className="text-red-400 hover:text-red-300 text-xs">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
