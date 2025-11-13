'use client'

import React, { useState, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { AddApplicationModal } from '@/components/applications/AddApplicationModal'
import { authenticatedFetch } from '@/lib/utils/authenticatedFetch'

interface Application {
  id: string
  company_name: string
  position_title: string
  job_url?: string
  job_description?: string
  location?: string
  salary_range?: string
  remote_type?: string
  status: 'applied' | 'phone_screen' | 'interview' | 'offer' | 'rejected'
  date_applied: string
  notes?: string
}

interface DashboardClientProps {
  children: React.ReactNode
}

// Create context for edit functionality
interface DashboardContextType {
  onEdit: (applicationId: string) => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within DashboardClient')
  }
  return context
}

export const DashboardClient: React.FC<DashboardClientProps> = ({ children }) => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingApplication, setEditingApplication] = useState<Application | null>(null)

  const handleEdit = async (applicationId: string) => {
    try {
      const response = await authenticatedFetch(`/api/applications/${applicationId}`)
      if (!response.ok) throw new Error('Failed to fetch application')

      const data = await response.json()
      setEditingApplication(data)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error fetching application:', error)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingApplication(null)
  }

  const handleSuccess = () => {
    router.refresh()
  }

  return (
    <DashboardContext.Provider value={{ onEdit: handleEdit }}>
      {/* Header with Add Application Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <button
          onClick={() => {
            setEditingApplication(null)
            setIsModalOpen(true)
          }}
          className="bg-[#0D9488] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#0D9488]/90 transition-colors flex items-center gap-2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Application
        </button>
      </div>

      {/* Dashboard Content */}
      {children}

      {/* Add/Edit Application Modal */}
      <AddApplicationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingApplication={editingApplication}
        onSuccess={handleSuccess}
      />
    </DashboardContext.Provider>
  )
}

DashboardClient.displayName = 'DashboardClient'
