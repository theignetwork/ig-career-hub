'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { KanbanBoard } from './KanbanBoard'
import { AddApplicationModal } from './AddApplicationModal'
import { ApplicationDetailsModal } from './ApplicationDetailsModal'
import type { Application } from '@/lib/api/applications'
import { authenticatedFetch, authenticatedPatch, authenticatedDelete } from '@/lib/utils/authenticatedFetch'

interface KanbanClientProps {
  initialApplications: Application[]
  initialTotal: number
}

export const KanbanClient: React.FC<KanbanClientProps> = ({
  initialApplications,
  initialTotal,
}) => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [viewingApplicationId, setViewingApplicationId] = useState<string | null>(null)
  const [editingApplication, setEditingApplication] = useState<Application | null>(null)
  const [applications, setApplications] = useState<Application[]>(initialApplications)

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    // Optimistically update local state
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus as any } : app))
    )

    try {
      const response = await authenticatedPatch(`/api/applications/${applicationId}`, { status: newStatus })

      if (!response.ok) throw new Error('Failed to update status')

      // Refresh to get the latest data from server
      router.refresh()
    } catch (error) {
      console.error('Error updating application status:', error)
      // Revert on error
      setApplications(initialApplications)
      router.refresh()
    }
  }

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

  const handleView = (applicationId: string) => {
    setViewingApplicationId(applicationId)
    setIsDetailsModalOpen(true)
  }

  const handleDelete = async (applicationId: string) => {
    try {
      const response = await authenticatedDelete(`/api/applications/${applicationId}`)

      if (!response.ok) throw new Error('Failed to delete application')

      // Remove from local state
      setApplications((prev) => prev.filter((app) => app.id !== applicationId))
      router.refresh()
    } catch (error) {
      console.error('Error deleting application:', error)
    }
  }

  const handleDuplicate = async (applicationId: string) => {
    try {
      const response = await authenticatedFetch(`/api/applications/${applicationId}`)
      if (!response.ok) throw new Error('Failed to fetch application')

      const data = await response.json()
      // Remove id and adjust date
      const { id, ...duplicateData } = data
      setEditingApplication({
        ...duplicateData,
        company_name: `${duplicateData.company_name} (Copy)`,
        date_applied: new Date().toISOString().split('T')[0],
      } as Application)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error duplicating application:', error)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Application Pipeline</h1>
          <p className="text-gray-400 text-sm mt-1">
            {initialTotal} {initialTotal === 1 ? 'application' : 'applications'} tracked
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-[#0A0E1A] border-2 border-[#1E293B] rounded-lg p-1">
            <button
              onClick={() => router.push('/applications/table')}
              className="px-3 py-1.5 rounded text-gray-400 hover:text-white text-sm font-medium transition-colors"
              title="Switch to table view"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </button>
            <button
              className="px-3 py-1.5 rounded bg-[#0D9488] text-white text-sm font-medium transition-colors"
              title="Kanban view (current)"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
          </div>

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
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        applications={applications}
        onEdit={handleEdit}
        onView={handleView}
        onStatusChange={handleStatusChange}
      />

      {/* Add/Edit Application Modal */}
      <AddApplicationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingApplication={editingApplication}
        onSuccess={handleSuccess}
      />

      {/* Application Details Modal */}
      {viewingApplicationId && (
        <ApplicationDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setViewingApplicationId(null)
          }}
          applicationId={viewingApplicationId}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      )}
    </>
  )
}

KanbanClient.displayName = 'KanbanClient'
