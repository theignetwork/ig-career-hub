'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export const AddApplicationForm: React.FC = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_name: formData.get('company_name'),
          position_title: formData.get('position_title'),
          job_url: formData.get('job_url'),
          location: formData.get('location'),
          salary_range: formData.get('salary_range'),
          remote_type: formData.get('remote_type'),
          status: formData.get('status') || 'applied',
          notes: formData.get('notes'),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create application')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl p-6 space-y-4">
        {/* Company Name */}
        <div>
          <label htmlFor="company_name" className="block text-sm font-medium text-gray-300 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            required
            className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
            placeholder="e.g., Google"
          />
        </div>

        {/* Position Title */}
        <div>
          <label htmlFor="position_title" className="block text-sm font-medium text-gray-300 mb-2">
            Position Title *
          </label>
          <input
            type="text"
            id="position_title"
            name="position_title"
            required
            className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
            placeholder="e.g., Senior Software Engineer"
          />
        </div>

        {/* Job URL */}
        <div>
          <label htmlFor="job_url" className="block text-sm font-medium text-gray-300 mb-2">
            Job URL
          </label>
          <input
            type="url"
            id="job_url"
            name="job_url"
            className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
            placeholder="https://..."
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
            placeholder="e.g., San Francisco, CA"
          />
        </div>

        {/* Remote Type */}
        <div>
          <label htmlFor="remote_type" className="block text-sm font-medium text-gray-300 mb-2">
            Work Type
          </label>
          <select
            id="remote_type"
            name="remote_type"
            className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
          >
            <option value="">Select work type</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>

        {/* Salary Range */}
        <div>
          <label htmlFor="salary_range" className="block text-sm font-medium text-gray-300 mb-2">
            Salary Range
          </label>
          <input
            type="text"
            id="salary_range"
            name="salary_range"
            className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
            placeholder="e.g., $120k - $150k"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
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

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="w-full px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0D9488]"
            placeholder="Add any notes about this application..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-[#0D9488] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0D9488]/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding Application...' : 'Add Application'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 bg-[#1E293B] text-white rounded-lg font-semibold hover:bg-[#334155]"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

AddApplicationForm.displayName = 'AddApplicationForm'
