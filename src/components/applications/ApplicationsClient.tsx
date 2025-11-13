'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ApplicationFilters } from './ApplicationFilters'
import { ApplicationsTable } from './ApplicationsTable'
import { AddApplicationModal } from './AddApplicationModal'
import type { Application } from '@/lib/api/applications'
import { authenticatedFetch } from '@/lib/utils/authenticatedFetch'

interface ApplicationsClientProps {
  initialApplications: Application[]
  initialTotal: number
}

export const ApplicationsClient: React.FC<ApplicationsClientProps> = ({
  initialApplications,
  initialTotal,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingApplication, setEditingApplication] = useState<Application | null>(null)

  // Filter state from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [status, setStatus] = useState(searchParams.get('status') || 'all')
  const [remoteType, setRemoteType] = useState(searchParams.get('remoteType') || 'all')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'date_applied')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  )

  // Update URL and refresh data
  const updateFilters = (newFilters: {
    search?: string
    status?: string
    remoteType?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => {
    const params = new URLSearchParams()

    const finalSearch = newFilters.search !== undefined ? newFilters.search : search
    const finalStatus = newFilters.status !== undefined ? newFilters.status : status
    const finalRemoteType =
      newFilters.remoteType !== undefined ? newFilters.remoteType : remoteType
    const finalSortBy = newFilters.sortBy !== undefined ? newFilters.sortBy : sortBy
    const finalSortOrder = newFilters.sortOrder !== undefined ? newFilters.sortOrder : sortOrder

    if (finalSearch) params.set('search', finalSearch)
    if (finalStatus !== 'all') params.set('status', finalStatus)
    if (finalRemoteType !== 'all') params.set('remoteType', finalRemoteType)
    if (finalSortBy !== 'date_applied') params.set('sortBy', finalSortBy)
    if (finalSortOrder !== 'desc') params.set('sortOrder', finalSortOrder)

    const queryString = params.toString()
    router.push(`/applications${queryString ? `?${queryString}` : ''}`)
  }

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch)
    // Debounce search - only update after user stops typing
    const timer = setTimeout(() => {
      updateFilters({ search: newSearch })
    }, 500)
    return () => clearTimeout(timer)
  }

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
    updateFilters({ status: newStatus })
  }

  const handleRemoteTypeChange = (newRemoteType: string) => {
    setRemoteType(newRemoteType)
    updateFilters({ remoteType: newRemoteType })
  }

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
    updateFilters({ sortBy: newSortBy, sortOrder: newSortOrder })
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

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Applications</h1>
          <p className="text-gray-400 text-sm mt-1">
            {initialTotal} {initialTotal === 1 ? 'application' : 'applications'} tracked
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-[#0A0E1A] border-2 border-[#1E293B] rounded-lg p-1">
            <button
              className="px-3 py-1.5 rounded bg-[#0D9488] text-white text-sm font-medium transition-colors"
              title="Table view (current)"
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
              onClick={() => router.push('/applications')}
              className="px-3 py-1.5 rounded text-gray-400 hover:text-white text-sm font-medium transition-colors"
              title="Switch to kanban view"
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

      {/* Filters */}
      <div className="mb-6">
        <ApplicationFilters
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onRemoteTypeChange={handleRemoteTypeChange}
          onSortChange={handleSortChange}
          currentSearch={search}
          currentStatus={status}
          currentRemoteType={remoteType}
          currentSort={sortBy}
          currentSortOrder={sortOrder}
        />
      </div>

      {/* Applications Table */}
      <ApplicationsTable applications={initialApplications} onEdit={handleEdit} />

      {/* Add/Edit Application Modal */}
      <AddApplicationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingApplication={editingApplication}
        onSuccess={handleSuccess}
      />
    </>
  )
}

ApplicationsClient.displayName = 'ApplicationsClient'
