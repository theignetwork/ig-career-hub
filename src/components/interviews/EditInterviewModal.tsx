'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Interview {
  id: string
  application_id: string
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

interface EditInterviewModalProps {
  interview: Interview | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const EditInterviewModal: React.FC<EditInterviewModalProps> = ({
  interview,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    interview_date: '',
    interview_time: '',
    interview_type: 'video' as 'phone' | 'video' | 'onsite' | 'technical',
    notes: '',
    prepared: false,
    outcome: '',
  })

  // Populate form when interview changes
  useEffect(() => {
    if (interview) {
      const date = new Date(interview.interview_date)
      const dateStr = date.toISOString().split('T')[0]
      const timeStr = date.toTimeString().slice(0, 5)

      setFormData({
        interview_date: dateStr,
        interview_time: timeStr,
        interview_type: interview.interview_type as any,
        notes: interview.notes || '',
        prepared: interview.prepared,
        outcome: interview.outcome || '',
      })
    }
  }, [interview])

  const resetForm = () => {
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!interview) return

    setSubmitting(true)
    setError(null)

    try {
      // Combine date and time into ISO string
      const dateTime = new Date(`${formData.interview_date}T${formData.interview_time}`)

      const response = await fetch('/api/interviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: interview.id,
          interview_date: dateTime.toISOString(),
          interview_type: formData.interview_type,
          notes: formData.notes,
          prepared: formData.prepared,
          outcome: formData.outcome || null,
        }),
      })

      if (!response.ok) throw new Error('Failed to update interview')

      router.refresh()
      if (onSuccess) onSuccess()
      onClose()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update interview')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  if (!isOpen || !interview) return null

  const isPastInterview = new Date(interview.interview_date) < new Date()

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#0A0E1A] border-b border-[#1E293B] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Interview</h2>
            <p className="text-sm text-gray-400 mt-1">
              {interview.application?.company_name} - {interview.application?.position_title}
            </p>
          </div>
          <button
            onClick={handleClose}
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
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border-2 border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={formData.interview_date}
                onChange={(e) => handleChange('interview_date', e.target.value)}
                required
                className="w-full bg-[#0F1629] text-white px-4 py-3 rounded-lg border-2 border-[#1E293B] focus:border-[#0D9488] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Time <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                value={formData.interview_time}
                onChange={(e) => handleChange('interview_time', e.target.value)}
                required
                className="w-full bg-[#0F1629] text-white px-4 py-3 rounded-lg border-2 border-[#1E293B] focus:border-[#0D9488] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Interview Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Interview Type <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'phone', label: 'Phone Screen', icon: '📞' },
                { value: 'video', label: 'Video Call', icon: '💻' },
                { value: 'onsite', label: 'On-site', icon: '🏢' },
                { value: 'technical', label: 'Technical', icon: '⚙️' },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleChange('interview_type', type.value)}
                  className={`p-4 rounded-lg border-2 transition-colors text-left ${
                    formData.interview_type === type.value
                      ? 'border-[#0D9488] bg-[#0D9488]/20'
                      : 'border-[#1E293B] hover:border-[#1E293B]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <span className="text-white font-medium">{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              placeholder="Add any notes about the interview..."
              className="w-full bg-[#0F1629] text-white px-4 py-3 rounded-lg border-2 border-[#1E293B] focus:border-[#0D9488] focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Prepared Checkbox */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.prepared}
                onChange={(e) => handleChange('prepared', e.target.checked)}
                className="w-5 h-5 rounded border-2 border-[#1E293B] bg-[#0F1629] checked:bg-[#0D9488] checked:border-[#0D9488] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-2 focus:ring-offset-[#0A0E1A] transition-colors"
              />
              <span className="text-white">I'm prepared for this interview</span>
            </label>
          </div>

          {/* Outcome (only for past interviews) */}
          {isPastInterview && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Outcome
              </label>
              <select
                value={formData.outcome}
                onChange={(e) => handleChange('outcome', e.target.value)}
                className="w-full bg-[#0F1629] text-white px-4 py-3 rounded-lg border-2 border-[#1E293B] focus:border-[#0D9488] focus:outline-none transition-colors"
              >
                <option value="">Not recorded</option>
                <option value="passed">✅ Passed - Moving forward</option>
                <option value="rejected">❌ Rejected</option>
                <option value="waiting">⏳ Waiting to hear back</option>
                <option value="cancelled">🚫 Cancelled</option>
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 rounded-lg border-2 border-[#1E293B] text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 rounded-lg bg-[#0D9488] text-white hover:bg-[#0D9488]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Updating...' : 'Update Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

EditInterviewModal.displayName = 'EditInterviewModal'
