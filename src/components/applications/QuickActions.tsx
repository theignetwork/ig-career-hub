/**
 * Quick Actions - Context-aware tool launcher buttons
 */

'use client'

import React, { useState } from 'react'
import { useToolLauncher } from '@/lib/context/useToolLauncher'
import { TutorialTooltip } from '@/components/ui/TutorialTooltip'
import type { Application } from '@/lib/api/applications'

interface QuickActionsProps {
  application: Application
}

export const QuickActions: React.FC<QuickActionsProps> = ({ application }) => {
  const { launchTool } = useToolLauncher()
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    {
      label: 'Practice Interview',
      icon: '🎤',
      tool: 'interview-coach' as const,
      description: 'Practice with AI coach',
    },
    {
      label: 'Optimize Resume',
      icon: '📄',
      tool: 'resume-analyzer' as const,
      description: 'Get resume feedback',
    },
    {
      label: 'Generate Cover Letter',
      icon: '✍️',
      tool: 'cover-letter' as const,
      description: 'AI-powered letter',
    },
    {
      label: 'Prepare with Oracle',
      icon: '🔮',
      tool: 'oracle-pro' as const,
      description: 'Interview predictions',
    },
  ]

  return (
    <TutorialTooltip
      id="smart-tools-tutorial"
      title="✨ AI-Powered Smart Tools"
      description="Click here to launch tools that are automatically pre-loaded with this job's details. No copy-pasting needed!"
      position="bottom"
      onTryIt={() => setIsOpen(true)}
    >
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className="w-full px-3 py-2 bg-gradient-to-r from-[#0D9488] to-teal-600 hover:from-[#0D9488]/90 hover:to-teal-600/90 text-white text-xs font-semibold rounded-lg transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 relative overflow-hidden group"
          title="Smart Tools - Auto-loaded with job context"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

          {/* Content */}
          <div className="relative z-10 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="animate-pulse-soft">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span>✨ AI Tools</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
              }}
            />

            {/* Actions Menu */}
            <div className="absolute left-0 top-full mt-2 w-64 bg-[#0A0E1A] border-2 border-[#1E293B] rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="p-2 border-b border-[#1E293B] bg-white/5">
                <p className="text-xs text-gray-400">Launch tools with context:</p>
                <p className="text-xs text-white font-medium truncate">
                  {application.company_name} - {application.position_title}
                </p>
              </div>

              <div className="p-1">
                {actions.map((action) => (
                  <button
                    key={action.tool}
                    onClick={(e) => {
                      e.stopPropagation()
                      launchTool(action.tool, application)
                      setIsOpen(false)
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="w-full flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="text-xl">{action.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium">{action.label}</div>
                      <div className="text-gray-400 text-xs">{action.description}</div>
                    </div>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-500"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </TutorialTooltip>
  )
}

QuickActions.displayName = 'QuickActions'
