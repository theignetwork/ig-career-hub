'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

interface AddApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  editingApplication?: Application | null
  onSuccess?: () => void
}

export const AddApplicationModal: React.FC<AddApplicationModalProps> = ({
  isOpen,
  onClose,
  editingApplication = null,
  onSuccess,
}) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'quick' | 'manual'>('quick')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Quick Add state
  const [jobInput, setJobInput] = useState('')
  const [extractedData, setExtractedData] = useState<{
    company_name: string
    position_title: string
    location: string
    salary_range: string
    remote_type: string
  } | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)

  // Manual Entry state
  const [manualData, setManualData] = useState({
    company_name: '',
    position_title: '',
    job_url: '',
    location: '',
    salary_range: '',
    remote_type: '',
    notes: '',
  })

  const [status, setStatus] = useState('applied')

  // Interview scheduling state
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewTime, setInterviewTime] = useState('')
  const [interviewType, setInterviewType] = useState<'phone' | 'video' | 'onsite' | 'technical'>('video')

  // Pre-populate form when editing
  useEffect(() => {
    if (editingApplication) {
      // Switch to manual tab when editing (as Quick Add requires job description)
      setActiveTab('manual')

      // Pre-populate manual form
      setManualData({
        company_name: editingApplication.company_name || '',
        position_title: editingApplication.position_title || '',
        job_url: editingApplication.job_url || '',
        location: editingApplication.location || '',
        salary_range: editingApplication.salary_range || '',
        remote_type: editingApplication.remote_type || '',
        notes: editingApplication.notes || '',
      })

      // Set status
      setStatus(editingApplication.status || 'applied')

      // If there's job description, also populate job input for Quick Add
      if (editingApplication.job_description) {
        setJobInput(editingApplication.job_description)
      }

      // Fetch existing interview data if status is phone_screen or interview
      if (editingApplication.status === 'phone_screen' || editingApplication.status === 'interview') {
        fetchInterviewData(editingApplication.id)
      }
    }
  }, [editingApplication])

  // Fetch interview data for editing
  const fetchInterviewData = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/interviews?application_id=${applicationId}`)
      if (response.ok) {
        const data = await response.json()
        const interview = data.interviews?.[0]

        if (interview) {
          // Parse the interview datetime
          const dateTime = new Date(interview.interview_date)
          const date = dateTime.toISOString().split('T')[0] // YYYY-MM-DD
          const time = dateTime.toTimeString().slice(0, 5) // HH:MM

          setInterviewDate(date)
          setInterviewTime(time)
          setInterviewType(interview.interview_type || 'video')
        }
      }
    } catch (error) {
      console.error('Error fetching interview data:', error)
    }
  }

  if (!isOpen) return null

  const isEditing = !!editingApplication

  const handleExtract = async () => {
    if (!jobInput.trim()) return

    setIsExtracting(true)
    setError(null)

    try {
      // TODO: Implement AI extraction endpoint
      // For now, using a placeholder
      const response = await fetch('/api/applications/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: jobInput }),
      })

      if (!response.ok) throw new Error('Extraction failed')

      const data = await response.json()
      setExtractedData(data)
    } catch (err) {
      setError('Failed to extract job details. Please try manual entry.')
    } finally {
      setIsExtracting(false)
    }
  }

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!extractedData) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...extractedData,
          job_description: jobInput,
          status,
        }),
      })

      if (!response.ok) throw new Error('Failed to create application')

      router.refresh()
      onClose()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = isEditing ? `/api/applications/${editingApplication.id}` : '/api/applications'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...manualData,
          status,
        }),
      })

      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} application`)

      const applicationData = await response.json()
      const applicationId = isEditing ? editingApplication.id : applicationData.id

      // If interview date is provided and status is interview or phone_screen, create/update interview
      if (interviewDate && (status === 'interview' || status === 'phone_screen')) {
        const interviewDateTime = interviewTime
          ? `${interviewDate}T${interviewTime}:00`
          : `${interviewDate}T09:00:00` // Default to 9 AM if no time specified

        // First, check if an interview already exists for this application
        const existingInterviewsResponse = await fetch(`/api/interviews?application_id=${applicationId}`)
        let existingInterview = null

        if (existingInterviewsResponse.ok) {
          const existingInterviews = await existingInterviewsResponse.json()
          existingInterview = existingInterviews.interviews?.[0] // Get the first interview if any
        }

        if (existingInterview) {
          // Update existing interview
          await fetch(`/api/interviews/${existingInterview.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              interview_date: interviewDateTime,
              interview_type: interviewType,
            }),
          })
        } else {
          // Create new interview
          await fetch('/api/interviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              application_id: applicationId,
              interview_date: interviewDateTime,
              interview_type: interviewType,
              prepared: false,
            }),
          })
        }
      }

      router.refresh()
      if (onSuccess) onSuccess()
      onClose()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setJobInput('')
    setExtractedData(null)
    setManualData({
      company_name: '',
      position_title: '',
      job_url: '',
      location: '',
      salary_range: '',
      remote_type: '',
      notes: '',
    })
    setStatus('applied')
    setInterviewDate('')
    setInterviewTime('')
    setInterviewType('video')
    setError(null)
    setActiveTab('quick')
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#1E293B]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">{isEditing ? 'Edit Application' : 'Add Application'}</h2>
            <button
              onClick={() => {
                onClose()
                resetForm()
              }}
              className="text-gray-400 hover:text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('quick')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'quick'
                  ? 'bg-[#0D9488] text-white'
                  : 'bg-[#1E293B] text-gray-400 hover:text-white'
              }`}
            >
              Quick Add
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === 'manual'
                  ? 'bg-[#0D9488] text-white'
                  : 'bg-[#1E293B] text-gray-400 hover:text-white'
              }`}
            >
              Manual Entry
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {activeTab === 'quick' ? (
            <form onSubmit={handleQuickSubmit} className="space-y-4">
              {/* Quick Add Content */}
              {!extractedData ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Paste Job Description or URL
                    </label>
                    <textarea
                      value={jobInput}
                      onChange={(e) => setJobInput(e.target.value)}
                      rows={12}
                      className="w-full px-4 py-3 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488] resize-none"
                      placeholder="Paste the job posting text here, or enter a URL to the job posting..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleExtract}
                    disabled={!jobInput.trim() || isExtracting}
                    className="w-full bg-[#0D9488] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0D9488]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExtracting ? 'Extracting Details...' : 'Extract Job Details'}
                  </button>
                </>
              ) : (
                <>
                  {/* Extracted Fields (Editable) */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={extractedData.company_name}
                        onChange={(e) =>
                          setExtractedData({ ...extractedData, company_name: e.target.value })
                        }
                        required
                        className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Position Title *
                      </label>
                      <input
                        type="text"
                        value={extractedData.position_title}
                        onChange={(e) =>
                          setExtractedData({ ...extractedData, position_title: e.target.value })
                        }
                        required
                        className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={extractedData.location}
                          onChange={(e) =>
                            setExtractedData({ ...extractedData, location: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Salary Range
                        </label>
                        <input
                          type="text"
                          value={extractedData.salary_range}
                          onChange={(e) =>
                            setExtractedData({ ...extractedData, salary_range: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Work Type
                      </label>
                      <select
                        value={extractedData.remote_type}
                        onChange={(e) =>
                          setExtractedData({ ...extractedData, remote_type: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
                      >
                        <option value="">Select work type</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="onsite">On-site</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
                      >
                        <option value="applied">Applied</option>
                        <option value="phone_screen">Phone Screen</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                        <option value="withdrawn">Withdrawn</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setExtractedData(null)}
                      className="px-6 py-3 bg-[#1E293B] text-white rounded-lg font-semibold hover:bg-[#334155]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-[#0D9488] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0D9488]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting
                        ? (isEditing ? 'Updating...' : 'Adding...')
                        : (isEditing ? 'Update Application' : 'Add Application')
                      }
                    </button>
                  </div>
                </>
              )}
            </form>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              {/* Manual Entry Content */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={manualData.company_name}
                  onChange={(e) =>
                    setManualData({ ...manualData, company_name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
                  placeholder="e.g., Google"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Position Title *
                </label>
                <input
                  type="text"
                  value={manualData.position_title}
                  onChange={(e) =>
                    setManualData({ ...manualData, position_title: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job URL
                </label>
                <input
                  type="url"
                  value={manualData.job_url}
                  onChange={(e) =>
                    setManualData({ ...manualData, job_url: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={manualData.location}
                    onChange={(e) =>
                      setManualData({ ...manualData, location: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    value={manualData.salary_range}
                    onChange={(e) =>
                      setManualData({ ...manualData, salary_range: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
                    placeholder="e.g., $120k - $150k"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Work Type
                </label>
                <select
                  value={manualData.remote_type}
                  onChange={(e) =>
                    setManualData({ ...manualData, remote_type: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
                >
                  <option value="">Select work type</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
                >
                  <option value="applied">Applied</option>
                  <option value="phone_screen">Phone Screen</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>

              {/* Interview Scheduling Section - Only show for phone_screen and interview statuses */}
              {(status === 'phone_screen' || status === 'interview') && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📅</span>
                    <h3 className="text-sm font-semibold text-white">Interview Schedule</h3>
                    <span className="text-xs text-gray-400">(Optional - helps with dashboard reminders)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Interview Date
                      </label>
                      <input
                        type="date"
                        value={interviewDate}
                        onChange={(e) => setInterviewDate(e.target.value)}
                        className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Interview Time
                      </label>
                      <input
                        type="time"
                        value={interviewTime}
                        onChange={(e) => setInterviewTime(e.target.value)}
                        className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Interview Type
                    </label>
                    <select
                      value={interviewType}
                      onChange={(e) => setInterviewType(e.target.value as 'phone' | 'video' | 'onsite' | 'technical')}
                      className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
                    >
                      <option value="phone">Phone</option>
                      <option value="video">Video</option>
                      <option value="onsite">On-site</option>
                      <option value="technical">Technical</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={manualData.notes}
                  onChange={(e) =>
                    setManualData({ ...manualData, notes: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488] resize-none"
                  placeholder="Add any notes about this application..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0D9488] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0D9488]/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? (isEditing ? 'Updating...' : 'Adding...')
                  : (isEditing ? 'Update Application' : 'Add Application')
                }
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

AddApplicationModal.displayName = 'AddApplicationModal'
