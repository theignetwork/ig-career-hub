'use client'

import React, { useState, useEffect } from 'react'
import { SmartToolsSection } from './SmartToolsSection'
import type { Application } from '@/lib/api/applications'
import { authenticatedFetch } from '@/lib/utils/authenticatedFetch'

interface Activity {
  id: string
  activity_type: string
  activity_date: string
  notes?: string
}

interface ApplicationDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  applicationId: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate?: (id: string) => void
}

export const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  const [application, setApplication] = useState<Application | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && applicationId) {
      // Clear cached data and fetch fresh data from database
      setApplication(null)
      setActivities([])
      fetchApplicationDetails()
    }
  }, [isOpen, applicationId])

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true)
      const [appResponse, activityResponse] = await Promise.all([
        authenticatedFetch(`/api/applications/${applicationId}`),
        authenticatedFetch(`/api/applications/${applicationId}/activities`),
      ])

      if (appResponse.ok) {
        const appData = await appResponse.json()
        setApplication(appData)
      }

      if (activityResponse.ok) {
        const activityData = await activityResponse.json()
        setActivities(activityData.activities || [])
      }
    } catch (error) {
      console.error('Error fetching application details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = () => {
    if (confirm(`Delete application for ${application?.company_name}?`)) {
      onDelete(applicationId)
      onClose()
    }
  }

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(applicationId)
      onClose()
    }
  }

  if (!isOpen) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50'
      case 'phone_screen':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
      case 'interview':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50'
      case 'offer':
        return 'bg-green-500/20 text-green-300 border-green-500/50'
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/50'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'applied':
        return '📝'
      case 'phone_screen_scheduled':
        return '📞'
      case 'interview_scheduled':
        return '🎤'
      case 'offer_received':
        return '🎉'
      case 'rejected':
        return '❌'
      case 'note_added':
        return '📋'
      default:
        return '•'
    }
  }

  const formatActivityType = (type: string) => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl w-full max-w-4xl my-8">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : application ? (
          <>
            {/* Header */}
            <div className="border-b border-[#1E293B] px-6 py-4 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {application.company_name}
                </h2>
                <p className="text-lg text-gray-300">{application.position_title}</p>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium border-2 mt-3 ${getStatusColor(
                    application.status
                  )}`}
                >
                  {formatActivityType(application.status)}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/50 hover:text-white/90 hover:bg-white/5 rounded-lg transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Smart Tools Section - Featured */}
              <SmartToolsSection application={application} />

              {/* Key Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Location</div>
                  <div className="text-white">{application.location || 'Not specified'}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Salary Range</div>
                  <div className="text-white">{application.salary_range || 'Not specified'}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Work Type</div>
                  <div className="text-white capitalize">
                    {application.remote_type || 'Not specified'}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Date Applied</div>
                  <div className="text-white">
                    {new Date(application.date_applied).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Job URL */}
              {application.job_url && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">Job Posting</h3>
                  <a
                    href={application.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0D9488] hover:underline text-sm break-all"
                  >
                    {application.job_url}
                  </a>
                </div>
              )}

              {/* Job Description */}
              {application.job_description && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">Job Description</h3>
                  <div className="bg-white/5 rounded-lg p-4 text-sm text-gray-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {application.job_description}
                  </div>
                </div>
              )}

              {/* Notes */}
              {application.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">Notes</h3>
                  <div className="bg-white/5 rounded-lg p-4 text-sm text-gray-300 whitespace-pre-wrap">
                    {application.notes}
                  </div>
                </div>
              )}

              {/* Activity Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Activity Timeline</h3>
                {activities.length > 0 ? (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex gap-3 bg-white/5 rounded-lg p-3 items-start"
                      >
                        <span className="text-xl">{getActivityIcon(activity.activity_type)}</span>
                        <div className="flex-1">
                          <div className="text-white font-medium text-sm">
                            {formatActivityType(activity.activity_type)}
                          </div>
                          {activity.notes && (
                            <div className="text-gray-400 text-xs mt-1">{activity.notes}</div>
                          )}
                          <div className="text-gray-500 text-xs mt-1">
                            {new Date(activity.activity_date).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No activity recorded yet
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-[#1E293B] px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  onEdit(applicationId)
                  onClose()
                }}
                className="flex-1 px-4 py-2 bg-[#0D9488] text-white rounded-lg font-medium hover:bg-[#0D9488]/90 transition-colors"
              >
                Edit Details
              </button>
              {onDuplicate && (
                <button
                  onClick={handleDuplicate}
                  className="px-4 py-2 border-2 border-[#1E293B] text-white rounded-lg font-medium hover:bg-white/5 transition-colors"
                >
                  Duplicate
                </button>
              )}
              <button
                onClick={handleDelete}
                className="px-4 py-2 border-2 border-red-500/50 text-red-400 rounded-lg font-medium hover:bg-red-500/10 transition-colors"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <div className="p-12 text-center text-red-400">Failed to load application</div>
        )}
      </div>
    </div>
  )
}

ApplicationDetailsModal.displayName = 'ApplicationDetailsModal'
