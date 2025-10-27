'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Application } from '@/lib/api/applications'

interface ApplicationsTableProps {
  applications: Application[]
  onEdit: (applicationId: string) => void
}

export const ApplicationsTable: React.FC<ApplicationsTableProps> = ({ applications, onEdit }) => {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)

  const handleDeleteClick = (app: Application) => {
    setSelectedApp(app)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedApp) return

    setDeletingId(selectedApp.id)
    try {
      const response = await fetch(`/api/applications/${selectedApp.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete application')

      router.refresh()
      setShowDeleteConfirm(false)
      setSelectedApp(null)
    } catch (error) {
      console.error('Error deleting application:', error)
      alert('Failed to delete application. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
    setSelectedApp(null)
  }

  const getStatusBadge = (status: Application['status']) => {
    const badges = {
      applied: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      phone_screen: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      interview: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      offer: 'bg-green-500/20 text-green-300 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
    }

    const labels = {
      applied: 'Applied',
      phone_screen: 'Phone Screen',
      interview: 'Interview',
      offer: 'Offer',
      rejected: 'Rejected',
    }

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${badges[status]}`}
      >
        {labels[status]}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (applications.length === 0) {
    return (
      <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl p-12 text-center">
        <div className="text-gray-400 text-lg mb-2">No applications found</div>
        <div className="text-gray-500 text-sm">
          Try adjusting your filters or add your first application
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E293B]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
                  Company
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
                  Position
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
                  Date Applied
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
                  Location
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-[#1E293B] hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{app.company_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-300">{app.position_title}</div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-400 text-sm">{formatDate(app.date_applied)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-400 text-sm">
                      {app.location || 'Not specified'}
                      {app.remote_type && (
                        <span className="ml-2 text-[#0D9488]">
                          {app.remote_type === 'remote'
                            ? '🏠 Remote'
                            : app.remote_type === 'hybrid'
                              ? '🔄 Hybrid'
                              : '🏢 On-site'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(app.id)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Edit application"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteClick(app)}
                        disabled={deletingId === app.id}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        aria-label="Delete application"
                      >
                        {deletingId === app.id ? (
                          <svg
                            className="animate-spin"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                        ) : (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        )}
                      </button>

                      {/* View Details Button (Optional - link to job URL) */}
                      {app.job_url && (
                        <a
                          href={app.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-[#0D9488] hover:bg-[#0D9488]/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          aria-label="View job posting"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedApp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-3">Delete Application</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete your application to{' '}
              <span className="text-white font-semibold">{selectedApp.company_name}</span> for the{' '}
              <span className="text-white font-semibold">{selectedApp.position_title}</span>{' '}
              position? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2.5 rounded-lg border-2 border-[#1E293B] text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingId !== null}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

ApplicationsTable.displayName = 'ApplicationsTable'
