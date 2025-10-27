'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { AddInterviewModal } from '@/components/interviews/AddInterviewModal'
import { EditInterviewModal } from '@/components/interviews/EditInterviewModal'

interface Interview {
  id: string
  interview_date: string
  interview_type: string
  notes?: string
  prepared: boolean
  outcome?: string
  application?: {
    company_name: string
    position_title: string
  }
}

export default function InterviewsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null)
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([])
  const [pastInterviews, setPastInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInterviews()
  }, [])

  const fetchInterviews = async () => {
    try {
      setLoading(true)
      const [upcomingRes, pastRes] = await Promise.all([
        fetch('/api/interviews?upcoming=true'),
        fetch('/api/interviews?upcoming=false&limit=10'),
      ])

      const upcomingData = await upcomingRes.json()
      const pastData = await pastRes.json()

      setUpcomingInterviews(upcomingData.interviews || [])
      setPastInterviews(pastData.interviews || [])
    } catch (error) {
      console.error('Error fetching interviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = () => {
    fetchInterviews()
  }

  const handleMarkPrepared = async (interviewId: string) => {
    try {
      const response = await fetch('/api/interviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: interviewId, prepared: true }),
      })

      if (!response.ok) throw new Error('Failed to update interview')

      // Refresh the interviews list
      fetchInterviews()
    } catch (error) {
      console.error('Error marking interview as prepared:', error)
    }
  }

  const handleDeleteInterview = async (interviewId: string) => {
    if (!confirm('Are you sure you want to delete this interview?')) return

    try {
      const response = await fetch(`/api/interviews?id=${interviewId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete interview')

      // Refresh the interviews list
      fetchInterviews()
    } catch (error) {
      console.error('Error deleting interview:', error)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading...</div>
        </div>
      </DashboardLayout>
    )
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return '📞'
      case 'video':
        return '💻'
      case 'onsite':
        return '🏢'
      case 'technical':
        return '⚙️'
      default:
        return '📝'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'phone':
        return 'Phone Screen'
      case 'video':
        return 'Video Call'
      case 'onsite':
        return 'On-site'
      case 'technical':
        return 'Technical'
      default:
        return type
    }
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Interviews</h1>
          <p className="text-gray-400 text-sm mt-1">
            {upcomingInterviews.length} upcoming • {pastInterviews.length} past
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
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
          Schedule Interview
        </button>
      </div>

      {/* Upcoming Interviews */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Upcoming Interviews</h2>
        {upcomingInterviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingInterviews.map((interview) => {
              const { date, time } = formatDateTime(interview.interview_date)
              return (
                <div
                  key={interview.id}
                  className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl p-6 hover:border-[#0D9488] transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {interview.application?.company_name || 'Unknown Company'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {interview.application?.position_title || 'Position not specified'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {interview.prepared && (
                        <span className="text-green-400 text-sm">✓ Prepared</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <span>📅</span>
                      <span className="text-sm">{date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span>🕐</span>
                      <span className="text-sm">{time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">{getTypeIcon(interview.interview_type)}</span>
                    <span className="text-sm text-gray-400">
                      {getTypeLabel(interview.interview_type)}
                    </span>
                  </div>

                  {interview.notes && (
                    <div className="bg-white/5 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-300">{interview.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!interview.prepared && (
                      <button
                        onClick={() => handleMarkPrepared(interview.id)}
                        className="flex-1 px-4 py-2 bg-[#0D9488] text-white rounded-lg text-sm hover:bg-[#0D9488]/90 transition-colors"
                      >
                        Mark as Prepared
                      </button>
                    )}
                    <button
                      onClick={() => setEditingInterview(interview)}
                      className="flex-1 px-4 py-2 border-2 border-[#1E293B] text-white rounded-lg text-sm hover:bg-white/5 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteInterview(interview.id)}
                      className="px-4 py-2 border-2 border-red-500/50 text-red-400 rounded-lg text-sm hover:bg-red-500/10 transition-colors"
                      title="Delete interview"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl p-12 text-center">
            <div className="text-gray-400 text-lg mb-2">No upcoming interviews</div>
            <div className="text-gray-500 text-sm">
              Schedule your first interview to start preparing
            </div>
          </div>
        )}
      </div>

      {/* Past Interviews */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Past Interviews</h2>
        {pastInterviews.length > 0 ? (
          <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1E293B]">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
                    Company
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
                    Position
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">
                    Outcome
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pastInterviews.map((interview) => {
                  const { date } = formatDateTime(interview.interview_date)
                  return (
                    <tr
                      key={interview.id}
                      className="border-b border-[#1E293B] hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">
                          {interview.application?.company_name || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300">
                          {interview.application?.position_title || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span>{getTypeIcon(interview.interview_type)}</span>
                          <span className="text-sm text-gray-400">
                            {getTypeLabel(interview.interview_type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-400 text-sm">{date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-400 text-sm">
                          {interview.outcome || 'Not recorded'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingInterview(interview)}
                            className="px-3 py-1.5 text-sm border-2 border-[#1E293B] text-white rounded-lg hover:bg-white/5 transition-colors"
                            title="Edit interview"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteInterview(interview.id)}
                            className="px-3 py-1.5 text-sm border-2 border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                            title="Delete interview"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl p-12 text-center">
            <div className="text-gray-400 text-lg mb-2">No past interviews</div>
            <div className="text-gray-500 text-sm">Your interview history will appear here</div>
          </div>
        )}
      </div>

      {/* Schedule Interview Modal */}
      <AddInterviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Edit Interview Modal */}
      <EditInterviewModal
        interview={editingInterview}
        isOpen={!!editingInterview}
        onClose={() => setEditingInterview(null)}
        onSuccess={handleSuccess}
      />
    </DashboardLayout>
  )
}
