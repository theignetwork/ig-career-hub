import React from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export interface Interview {
  id: string
  company: string
  position: string
  date: string
  time: string
  type: 'phone' | 'video' | 'onsite' | 'technical'
}

export interface UpcomingInterviewsProps {
  interviews: Interview[]
}

export const UpcomingInterviews: React.FC<UpcomingInterviewsProps> = ({ interviews }) => {
  const typeColors = {
    phone: 'info' as const,
    video: 'info' as const,
    onsite: 'warning' as const,
    technical: 'success' as const,
  }

  const typeLabels = {
    phone: 'Phone',
    video: 'Video',
    onsite: 'On-site',
    technical: 'Technical',
  }

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white/90">
            Upcoming Interviews
          </h2>
          <span className="text-sm text-white/50">{interviews.length} scheduled</span>
        </div>
      }
    >
      {interviews.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-white/30 mb-2">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p className="text-white/50 text-sm">No upcoming interviews</p>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#0D9488]/20 flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#0D9488]"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-white/90 mb-1 truncate">
                  {interview.company}
                </h3>
                <p className="text-sm text-white/70 mb-2 truncate">
                  {interview.position}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant={typeColors[interview.type]}>
                    {typeLabels[interview.type]}
                  </Badge>
                  <span className="text-xs text-white/50">
                    {interview.date} at {interview.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

UpcomingInterviews.displayName = 'UpcomingInterviews'
