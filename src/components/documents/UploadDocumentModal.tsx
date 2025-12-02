'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { awardXP } from '@/lib/gamification/award-xp'
import { XP_REWARDS } from '@/lib/gamification/xp-system'

interface UploadDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const router = useRouter()
  const { wpUserId } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const [formData, setFormData] = useState({
    file: null as File | null,
    documentType: 'resume' as 'resume' | 'cover_letter' | 'portfolio' | 'reference' | 'other',
    title: '',
  })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      file,
      title: prev.title || file.name.replace(/\.[^/.]+$/, ''), // Remove extension for title
    }))
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.file) {
      setError('Please select a file')
      return
    }

    setUploading(true)
    setError(null)

    try {
      if (!wpUserId) {
        throw new Error('You must be logged in to upload documents')
      }

      const uploadFormData = new FormData()
      uploadFormData.append('file', formData.file)
      uploadFormData.append('documentType', formData.documentType)
      uploadFormData.append('title', formData.title)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          'x-user-id': String(wpUserId),
        },
        body: uploadFormData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to upload document')
      }

      // Award XP for uploading document
      await awardXP(
        XP_REWARDS.DOCUMENT_UPLOADED,
        'document_uploaded',
        `Uploaded ${formData.title}`
      )

      router.refresh()
      if (onSuccess) onSuccess()
      onClose()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      file: null,
      documentType: 'resume',
      title: '',
    })
    setError(null)
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="border-b border-[#1E293B] px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Upload Document</h2>
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

          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              File <span className="text-red-400">*</span>
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? 'border-[#0D9488] bg-[#0D9488]/10'
                  : 'border-[#1E293B] hover:border-[#1E293B]/50'
              }`}
            >
              <input
                type="file"
                onChange={handleFileInput}
                accept=".pdf,.doc,.docx,.txt"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="pointer-events-none">
                <div className="text-4xl mb-2">📁</div>
                {formData.file ? (
                  <>
                    <p className="text-white font-medium mb-1">{formData.file.name}</p>
                    <p className="text-gray-400 text-sm">
                      {(formData.file.size / 1024).toFixed(1)} KB
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-white font-medium mb-1">
                      Drag and drop your file here, or click to browse
                    </p>
                    <p className="text-gray-400 text-sm">PDF, DOC, DOCX, TXT (max 10MB)</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Document Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Document Type <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'resume', label: 'Resume', icon: '📄' },
                { value: 'cover_letter', label: 'Cover Letter', icon: '✉️' },
                { value: 'portfolio', label: 'Portfolio', icon: '💼' },
                { value: 'reference', label: 'Reference', icon: '📝' },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, documentType: type.value as any }))
                  }
                  className={`p-4 rounded-lg border-2 transition-colors text-left ${
                    formData.documentType === type.value
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

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
              placeholder="e.g., Software Engineer Resume 2025"
              className="w-full bg-[#0F1629] text-white px-4 py-3 rounded-lg border-2 border-[#1E293B] focus:border-[#0D9488] focus:outline-none transition-colors"
            />
          </div>

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
              disabled={uploading || !formData.file}
              className="flex-1 px-6 py-3 rounded-lg bg-[#0D9488] text-white hover:bg-[#0D9488]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

UploadDocumentModal.displayName = 'UploadDocumentModal'
