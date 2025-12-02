'use client'

import React, { useState, useEffect } from 'react'
import { DocumentCard } from './DocumentCard'
import { UploadDocumentModal } from './UploadDocumentModal'
import { useAuth } from '@/contexts/AuthContext'

interface Document {
  id: string
  file_type: string
  title: string
  file_name: string
  file_size: number
  content: string // Public URL stored in content field
  created_at: string
}

export const DocumentsClient: React.FC = () => {
  const { wpUserId, loading: authLoading } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const fetchDocuments = async () => {
    // Wait for authentication to complete
    if (authLoading) {
      return
    }

    try {
      setLoading(true)
      const userId = wpUserId

      if (!userId) {
        console.error('[DocumentsClient] No user ID available')
        setLoading(false)
        return
      }

      const url = filter === 'all'
        ? '/api/documents'
        : `/api/documents?type=${filter}`

      const response = await fetch(url, {
        headers: {
          'x-user-id': String(userId),
        },
      })
      const data = await response.json()

      if (response.ok) {
        setDocuments(data.documents || [])
      } else {
        console.error('Failed to fetch documents:', data.error)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [filter, wpUserId, authLoading])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const userId = wpUserId

      if (!userId) {
        console.error('[DocumentsClient] No user ID available')
        return
      }

      const response = await fetch(`/api/documents?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': String(userId),
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete document')
      }

      // Optimistically update UI
      setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    } catch (error) {
      console.error('Error deleting document:', error)
      // Refetch to restore correct state
      fetchDocuments()
    }
  }

  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Error downloading document:', error)
    }
  }

  const getFilteredDocuments = () => {
    if (filter === 'all') return documents
    return documents.filter((doc) => doc.file_type === filter)
  }

  const filteredDocuments = getFilteredDocuments()

  const documentTypes = [
    { value: 'all', label: 'All Documents', icon: '📚' },
    { value: 'resume', label: 'Resumes', icon: '📄' },
    { value: 'cover_letter', label: 'Cover Letters', icon: '✉️' },
  ]

  // Show authenticating state first
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Authenticating...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Document Library</h1>
          <p className="text-sm text-gray-400">
            Manage your resumes, cover letters, and other career documents
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-6 py-3 bg-[#0D9488] text-white rounded-lg font-medium hover:bg-[#0D9488]/90 transition-colors flex items-center gap-2"
        >
          <span className="text-xl">📤</span>
          Upload Document
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
        {documentTypes.map((type) => {
          const count = type.value === 'all'
            ? documents.length
            : documents.filter((doc) => doc.file_type === type.value).length

          return (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              className={`px-4 py-2 rounded-lg border-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                filter === type.value
                  ? 'border-[#0D9488] bg-[#0D9488]/20 text-white'
                  : 'border-[#1E293B] text-gray-400 hover:border-[#1E293B]/50'
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  filter === type.value ? 'bg-[#0D9488] text-white' : 'bg-white/10 text-gray-400'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading documents...</div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="bg-[#0A0E1A] border-2 border-dashed border-[#1E293B] rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-white mb-2">No documents yet</h3>
          <p className="text-gray-400 mb-6">
            {filter === 'all'
              ? 'Upload your first document to get started'
              : `No ${documentTypes.find((t) => t.value === filter)?.label.toLowerCase()} found`}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-6 py-3 bg-[#0D9488] text-white rounded-lg font-medium hover:bg-[#0D9488]/90 transition-colors"
            >
              Upload Document
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={fetchDocuments}
      />
    </div>
  )
}

DocumentsClient.displayName = 'DocumentsClient'
