'use client'

import React from 'react'

interface Document {
  id: string
  file_type: string
  title: string
  file_name: string
  file_size: number
  content: string // Public URL stored in content field
  created_at: string
}

interface DocumentCardProps {
  document: Document
  onDelete: (id: string) => void
  onDownload: (url: string, fileName: string) => void
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDelete,
  onDownload,
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'resume':
        return '📄'
      case 'cover_letter':
        return '✉️'
      case 'portfolio':
        return '💼'
      case 'reference':
        return '📝'
      default:
        return '📎'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'resume':
        return 'Resume'
      case 'cover_letter':
        return 'Cover Letter'
      case 'portfolio':
        return 'Portfolio'
      case 'reference':
        return 'Reference'
      default:
        return 'Other'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-xl p-6 hover:border-[#0D9488] transition-colors group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="text-3xl">{getTypeIcon(document.file_type)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold text-lg truncate">{document.title}</h3>
            </div>
            <p className="text-gray-400 text-sm">{getTypeLabel(document.file_type)}</p>
          </div>
        </div>
      </div>

      {/* File Info */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <span>📁</span>
          <span>{document.file_name}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>💾</span>
          <span>{formatFileSize(document.file_size)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>📅</span>
          <span>{formatDate(document.created_at)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onDownload(document.content, document.file_name)}
          className="flex-1 px-4 py-2 bg-[#0D9488] text-white rounded-lg text-sm font-medium hover:bg-[#0D9488]/90 transition-colors"
        >
          Download
        </button>
        <button
          onClick={() => onDelete(document.id)}
          className="px-4 py-2 border-2 border-red-500/50 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/10 transition-colors"
          title="Delete document"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

DocumentCard.displayName = 'DocumentCard'
