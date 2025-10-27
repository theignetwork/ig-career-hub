'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Application } from '@/lib/api/applications'
import { QuickActions } from './QuickActions'

interface ApplicationCardProps {
  application: Application
  onEdit: (id: string) => void
  onView?: (id: string) => void
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onEdit, onView }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: application.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getRemoteIcon = (remoteType: string) => {
    switch (remoteType) {
      case 'remote':
        return '🏠'
      case 'hybrid':
        return '🔄'
      case 'onsite':
        return '🏢'
      default:
        return '📍'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-[#0D9488] transition-colors group"
    >
      {/* Company & Position */}
      <div className="mb-3">
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
          {application.company_name}
        </h3>
        <p className="text-gray-400 text-xs line-clamp-2">{application.position_title}</p>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
        {application.remote_type && (
          <div className="flex items-center gap-1">
            <span>{getRemoteIcon(application.remote_type)}</span>
            <span className="capitalize">{application.remote_type}</span>
          </div>
        )}
        {application.date_applied && (
          <div className="flex items-center gap-1">
            <span>📅</span>
            <span>{formatDate(application.date_applied)}</span>
          </div>
        )}
      </div>

      {/* Location & Salary (if available) */}
      {(application.location || application.salary_range) && (
        <div className="text-xs text-gray-500 mb-3 space-y-1">
          {application.location && (
            <div className="flex items-center gap-1">
              <span>📍</span>
              <span className="line-clamp-1">{application.location}</span>
            </div>
          )}
          {application.salary_range && (
            <div className="flex items-center gap-1">
              <span>💰</span>
              <span>{application.salary_range}</span>
            </div>
          )}
        </div>
      )}

      {/* Source Tag */}
      {application.source && (
        <div className="mb-3">
          <span className="inline-block px-2 py-1 bg-white/5 text-gray-400 text-xs rounded">
            {application.source}
          </span>
        </div>
      )}

      {/* Notes Preview */}
      {application.notes && (
        <div className="mb-3 p-2 bg-white/5 rounded text-xs text-gray-400 line-clamp-2">
          {application.notes}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 mt-2">
        {/* Smart AI Tools - Always Visible with Animation */}
        <div className="opacity-100">
          <QuickActions application={application} />
        </div>

        {/* Primary Actions - Show on Hover */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onView && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onView(application.id)
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 text-white text-xs rounded-lg hover:bg-white/20 transition-colors"
            >
              View
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(application.id)
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className={`${onView ? 'flex-1' : 'w-full'} px-3 py-2 border-2 border-[#1E293B] text-white text-xs rounded-lg hover:bg-white/5 transition-colors`}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

ApplicationCard.displayName = 'ApplicationCard'
