'use client'

import React from 'react'
import { PipelineApplication } from '@/lib/api/dashboard'
import { useDashboard } from './DashboardClient'

interface ApplicationPipelineProps {
  applications: PipelineApplication[]
}

export const ApplicationPipeline: React.FC<ApplicationPipelineProps> = ({ applications }) => {
  const { onEdit } = useDashboard()
  // Map status to color and display text
  const getStageDisplay = (stage: string) => {
    switch (stage) {
      case 'applied':
        return { text: 'Applied', color: 'text-gray-400', glow: false }
      case 'phone_screen':
        return { text: 'Phone Screen', color: 'text-blue-400', glow: false }
      case 'interview':
        return { text: 'Interview', color: 'text-blue-400', glow: false }
      case 'offer':
        return { text: 'Offer', color: 'text-green-400', glow: true }
      case 'rejected':
        return { text: 'Rejected', color: 'text-red-400', glow: false }
      default:
        return { text: stage, color: 'text-gray-400', glow: false }
    }
  }

  // Format date to relative time (e.g., "2wks ago")
  const formatRelativeDate = (dateString?: string) => {
    if (!dateString) return null

    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 14) return '1wk ago'
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}wks ago`
    if (diffDays < 60) return '1mo ago'
    return `${Math.floor(diffDays / 30)}mos ago`
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
        <span>📊</span>
        Application Pipeline
      </h2>

      {/* Application Cards Grid */}
      {applications.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {applications.map((app, index) => {
            const stageDisplay = getStageDisplay(app.stage)
            const relativeDate = formatRelativeDate(app.date)
            const isOffer = app.stage === 'offer'

            return (
              <div
                key={index}
                className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl p-4 group hover:border-[#0D9488] transition-colors relative"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-base font-semibold text-white flex items-center gap-1">
                    {app.company}
                    {isOffer && <span className="text-yellow-400">!</span>}
                  </div>
                  <button
                    onClick={() => onEdit(app.id)}
                    className="p-1.5 text-white/40 hover:text-white/90 hover:bg-white/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Edit application"
                  >
                    <svg
                      width="16"
                      height="16"
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
                </div>
                <div className="text-sm text-gray-400 mb-3">{app.position}</div>
                <div
                  className={`text-sm font-medium ${stageDisplay.color} ${
                    stageDisplay.glow ? 'drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]' : ''
                  }`}
                >
                  {stageDisplay.text}
                </div>
                {relativeDate && (
                  <div className="text-sm text-gray-500 mt-1">{relativeDate}</div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl p-8 text-center">
          <div className="text-sm text-gray-500 italic">
            No applications yet. Start tracking your job applications!
          </div>
        </div>
      )}
    </div>
  )
}

ApplicationPipeline.displayName = 'ApplicationPipeline'
