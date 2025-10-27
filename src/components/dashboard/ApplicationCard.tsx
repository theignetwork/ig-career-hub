import React from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export interface ApplicationCardProps {
  companyName: string
  positionTitle: string
  status: 'applied' | 'phone_screen' | 'interview' | 'offer' | 'rejected'
  dateApplied: string
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  companyName,
  positionTitle,
  status,
  dateApplied,
  onView,
  onEdit,
  onDelete,
}) => {
  const statusVariant = {
    applied: 'default' as const,
    phone_screen: 'info' as const,
    interview: 'warning' as const,
    offer: 'success' as const,
    rejected: 'error' as const,
  }

  const statusLabel = {
    applied: 'Applied',
    phone_screen: 'Phone Screen',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected',
  }

  return (
    <Card padding="md" className="group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(13,148,136,0.1)] transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white/90 mb-1 truncate">
            {companyName}
          </h3>
          <p className="text-sm text-white/70 mb-3 truncate">
            {positionTitle}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant={statusVariant[status]}>
              {statusLabel[status]}
            </Badge>
            <span className="text-xs text-white/50">
              Applied {dateApplied}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {onView && (
            <button
              onClick={onView}
              className="p-2 text-white/50 hover:text-white/90 hover:bg-white/5 rounded-lg transition-colors"
              aria-label="View application"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 text-white/50 hover:text-white/90 hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Edit application"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              aria-label="Delete application"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}

ApplicationCard.displayName = 'ApplicationCard'
