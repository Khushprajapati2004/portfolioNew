'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'
import toast from 'react-hot-toast'

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
        toast.success('Skill added successfully')
        return true
      }
      if (res.status === 401) { handleLogout(); return false }
      const err = await res.json()
      toast.error(err.message || 'Failed to add skill')
    } catch (error: any) {
      toast.error(`Failed to add skill: ${error.message}`)
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
        toast.success('Skill updated successfully')
        return true
      }
      if (res.status === 401) { handleLogout(); return false }
      const errorData = await res.json()
      toast.error(`Failed to update skill: ${errorData.message || 'Unknown error'}`)
    } catch (error: any) {
      toast.error(`Failed to update skill: ${error.message}`)
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
        toast.success('Skill deleted successfully')
      } else if (res.status === 401) {
        handleLogout()
      } else {
        const errorData = await res.json()
        toast.error(`Failed to delete skill: ${errorData.message || 'Unknown error'}`)
      }
    } catch (error: any) {
      toast.error(`Failed to delete skill: ${error.message}`)
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
        toast.success('Message deleted successfully')
      } else if (res.status === 401) {
        handleLogout()
      } else {
        const errorData = await res.json()
        toast.error(`Failed to delete message: ${errorData.message || 'Unknown error'}`)
      }
    } catch (error: any) {
      toast.error(`Failed to delete message: ${error.message}`)
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
        toast.success('Project added successfully')
        return true
      }
      if (res.status === 401) { handleLogout(); return false }
      const errorData = await res.json()
      toast.error(`Failed to add project: ${errorData.message || 'Unknown error'}`)
    } catch (error: any) {
      toast.error(`Failed to add project: ${error.message}`)
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
        toast.success('Project deleted successfully')
      } else if (res.status === 401) {
        handleLogout()
      } else {
        const errorData = await res.json()
        toast.error(`Failed to delete project: ${errorData.message || 'Unknown error'}`)
      }
    } catch (error: any) {
      toast.error(`Failed to delete project: ${error.message}`)
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
    <div className="min-h-screen bg-gradient-to-b from-black via-dark-navy to-black pt-4 pb-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-glass-white/5 backdrop-blur-xl border border-glass-border/50 rounded-2xl p-4 sm:p-6 mb-8 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="bg-black/50 p-2.5 rounded-xl border border-glass-border/50 shadow-inner">
                <Link href="/">
                  <Logo />
                </Link>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-neon-blue bg-clip-text text-transparent">
                    Admin Dashboard
                  </span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">Manage your portfolio content</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-gradient-to-r from-red-500/10 to-red-900/20 border border-red-500/30 text-red-400 font-medium rounded-xl hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all flex items-center gap-2 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 overflow-x-auto custom-scrollbar pb-1 relative z-10">
            {(['messages', 'projects', 'skills'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-2.5 text-sm font-semibold capitalize transition-all whitespace-nowrap rounded-xl ${
                  activeTab === tab
                    ? 'text-white bg-neon-blue/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-neon-blue/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {tab === 'messages' && (
                    <svg className={`w-4 h-4 ${activeTab === tab ? 'text-neon-blue' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  {tab === 'projects' && (
                    <svg className={`w-4 h-4 ${activeTab === tab ? 'text-neon-cyan' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  )}
                  {tab === 'skills' && (
                    <svg className={`w-4 h-4 ${activeTab === tab ? 'text-neon-purple' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {tab}
                  {tab === 'messages' && messages.length > 0 && (
                    <span className={`ml-1 text-[10px] px-2 py-0.5 rounded-full ${activeTab === tab ? 'bg-neon-blue text-white' : 'bg-neon-blue/20 text-neon-blue'}`}>
                      {messages.length}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
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
      className="grid md:grid-cols-12 gap-6 lg:gap-8 relative items-start"
    >
      {/* Left side: Message List */}
      <div className="md:col-span-5 lg:col-span-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar relative">
        <div className="sticky top-0 bg-black/95 backdrop-blur-xl p-4 rounded-md z-10 border-b border-glass-border/50 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Inbox
            </h2>
            <span className="bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              {messages.length} Total
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-glass-border rounded-xl bg-glass-white/5 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-full bg-neon-blue/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-neon-blue/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-300 font-semibold mb-1">Your inbox is empty</p>
              <p className="text-gray-500 text-xs">When people contact you via the form, their messages will appear here.</p>
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg._id}
                onClick={() => setSelectedMessage(msg)}
                className={`group bg-glass-white backdrop-blur-glass border rounded-xl p-5 cursor-pointer transition-all duration-300 ${selectedMessage?._id === msg._id
                  ? 'border-neon-blue bg-neon-blue/5 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                  : 'border-glass-border hover:border-neon-blue/50 hover:bg-white/5'
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-semibold truncate pr-2 ${!msg.read ? 'text-white' : 'text-gray-300'}`}>
                    {msg.name}
                  </h3>
                  {msg.createdAt && (
                    <span className="text-[10px] text-gray-500 whitespace-nowrap uppercase tracking-wider pt-1">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
                <p className="text-neon-blue text-xs mb-3 truncate">{msg.email}</p>
                <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed group-hover:text-gray-300 transition-colors">{msg.subject}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right side: Message Details */}
      <div className="md:col-span-7 lg:col-span-8 md:sticky md:top-24">
        {selectedMessage ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            key={selectedMessage._id}
            className="bg-glass-white backdrop-blur-glass border border-neon-blue/30 rounded-2xl p-6 md:p-8 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8 pb-6 border-b border-glass-border">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedMessage.subject}</h2>
                {selectedMessage.createdAt && (
                  <p className="text-xs text-gray-400 font-medium">
                    Received on {new Date(selectedMessage.createdAt).toLocaleString(undefined, {
                      weekday: 'short', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
              <button
                onClick={() => deleteMessage(selectedMessage._id)}
                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-sm hover:bg-red-500/20 hover:text-red-300 transition-all flex items-center gap-2 group whitespace-nowrap self-start"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-4 bg-black/40 p-5 rounded-xl border border-glass-border/50">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-1.5 font-bold">Sender</p>
                  <div className="flex items-center gap-3 text-white font-medium">
                    <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue font-bold text-sm">
                      {selectedMessage.name.charAt(0).toUpperCase()}
                    </div>
                    {selectedMessage.name}
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-1.5 font-bold">Email</p>
                  <a href={`mailto:${selectedMessage.email}`} className="flex items-center gap-2 text-neon-blue hover:text-neon-cyan transition-colors font-medium h-8">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {selectedMessage.email}
                  </a>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-3 font-bold">Message Content</p>
                <div className="bg-black/30 border border-glass-border rounded-xl p-6">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-glass-white backdrop-blur-glass border border-glass-border rounded-2xl p-10 flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4 text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-gray-400 font-medium">Select a message from the list<br />to view its details</p>
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
  const [featureInput, setFeatureInput] = useState('')

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
      image: imagePreview || '/images/projects/default.jpg',
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-1">
            <div className="p-2 bg-neon-cyan/10 rounded-lg">
              <svg className="w-5 h-5 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            Projects Portfolio
          </h2>
          <p className="text-gray-400 text-sm">Manage your portfolio projects ({projects.length} total)</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2.5 bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-medium rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          {showForm ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              Cancel Addition
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Add New Project
            </>
          )}
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
                  <label className="block text-sm text-gray-300 mb-2">Features *</label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. User authentication"
                        value={featureInput}
                        onChange={e => setFeatureInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (featureInput.trim()) {
                              const currentFeatures = formData.features ? formData.features.split('\n') : [];
                              set('features', [...currentFeatures, featureInput.trim()].join('\n'));
                              setFeatureInput('');
                            }
                          }
                        }}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (featureInput.trim()) {
                            const currentFeatures = formData.features ? formData.features.split('\n') : [];
                            set('features', [...currentFeatures, featureInput.trim()].join('\n'));
                            setFeatureInput('');
                          }
                        }}
                        className="px-4 py-3 bg-neon-blue/20 text-neon-blue border border-neon-blue/50 rounded-lg hover:bg-neon-blue/30 transition-all font-semibold"
                      >
                        Add
                      </button>
                    </div>

                    {formData.features && (
                      <ul className="space-y-2 mt-3">
                        {formData.features.split('\n').map((feat, index) => (
                          <li key={index} className="flex justify-between items-center bg-black/40 border border-glass-border px-3 py-2 rounded-lg text-gray-300 text-sm">
                            <span>{feat}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const list = formData.features.split('\n');
                                list.splice(index, 1);
                                set('features', list.join('\n'));
                              }}
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1 rounded transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-1">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            Technical Skills
          </h2>
          <p className="text-gray-400 text-sm">Manage your skills across all categories ({skills.length} total)</p>
        </div>
        <button
          onClick={openAdd}
          className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-neon-cyan text-white font-medium rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Add New Skill
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
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === 'all'
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
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${activeCategory === cat
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
