/**
 * Smart Suggestions Widget - Status-based tool recommendations
 * Shows on dashboard with contextual next steps
 */

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useToolLauncher } from '@/lib/context/useToolLauncher'
import type { Application } from '@/lib/api/applications'
import type { ToolType } from '@/lib/context/types'

interface SmartSuggestionsWidgetProps {
  applications: Application[]
}

interface Suggestion {
  title: string
  description: string
  icon: string
  urgency: 'high' | 'medium' | 'low'
  tools: Array<{
    type: ToolType
    label: string
    icon: string
  }>
  ctaText: string
}

export const SmartSuggestionsWidget: React.FC<SmartSuggestionsWidgetProps> = ({
  applications,
}) => {
  const router = useRouter()
  const { launchTool } = useToolLauncher()

  // Find the most relevant application and generate suggestions
  const getSmartSuggestion = (): { application: Application; suggestion: Suggestion } | null => {
    if (!applications || applications.length === 0) return null

    // Priority 1: Upcoming interviews (phone_screen or interview status)
    const upcomingInterview = applications.find(
      (app) => app.status === 'phone_screen' || app.status === 'interview'
    )
    if (upcomingInterview) {
      return {
        application: upcomingInterview,
        suggestion: {
          title:
            upcomingInterview.status === 'phone_screen'
              ? '⚡ PHONE SCREEN PREP'
              : '⚡ INTERVIEW PREP',
          description: 'Get ready with AI-powered practice',
          icon: '🎤',
          urgency: 'high',
          tools: [
            { type: 'interview-coach', label: 'Practice', icon: '🎤' },
            { type: 'oracle-pro', label: 'Predict Q&A', icon: '🔮' },
          ],
          ctaText: 'Start Practicing',
        },
      }
    }

    // Priority 2: Recently applied (within last 3 days)
    const recentlyApplied = applications
      .filter((app) => app.status === 'applied')
      .sort(
        (a, b) =>
          new Date(b.date_applied).getTime() - new Date(a.date_applied).getTime()
      )[0]

    if (recentlyApplied) {
      const daysAgo = Math.floor(
        (Date.now() - new Date(recentlyApplied.date_applied).getTime()) /
          (1000 * 60 * 60 * 24)
      )

      if (daysAgo <= 3) {
        return {
          application: recentlyApplied,
          suggestion: {
            title: '✅ JUST APPLIED',
            description: 'Stand out with optimized materials',
            icon: '📄',
            urgency: 'medium',
            tools: [
              { type: 'resume-analyzer', label: 'Optimize Resume', icon: '📄' },
              { type: 'cover-letter', label: 'Cover Letter', icon: '✍️' },
            ],
            ctaText: 'Improve Your Application',
          },
        }
      }
    }

    // Priority 3: Any application (general suggestion)
    const anyApp = applications[0]
    if (anyApp) {
      return {
        application: anyApp,
        suggestion: {
          title: '💡 SUPERCHARGE THIS APPLICATION',
          description: 'AI tools pre-loaded with job details',
          icon: '🚀',
          urgency: 'low',
          tools: [
            { type: 'interview-coach', label: 'Practice', icon: '🎤' },
            { type: 'resume-analyzer', label: 'Optimize', icon: '📄' },
          ],
          ctaText: 'Launch Tools',
        },
      }
    }

    return null
  }

  const smartSuggestion = getSmartSuggestion()

  if (!smartSuggestion) {
    return null
  }

  const { application, suggestion } = smartSuggestion

  const urgencyColors = {
    high: {
      bg: 'from-red-500/20 to-orange-500/20',
      border: 'border-red-500/40',
      text: 'text-red-400',
      pulse: 'animate-pulse',
    },
    medium: {
      bg: 'from-blue-500/20 to-purple-500/20',
      border: 'border-blue-500/40',
      text: 'text-blue-400',
      pulse: '',
    },
    low: {
      bg: 'from-[#0D9488]/20 to-teal-500/20',
      border: 'border-[#0D9488]/40',
      text: 'text-[#0D9488]',
      pulse: '',
    },
  }

  const colors = urgencyColors[suggestion.urgency]

  return (
    <div
      className={`bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-2xl p-6 relative overflow-hidden`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className={`flex items-center gap-2 mb-2 ${colors.pulse}`}>
              <span className="text-2xl">{suggestion.icon}</span>
              <h3 className={`text-lg font-bold ${colors.text}`}>{suggestion.title}</h3>
            </div>
            <div className="bg-black/20 rounded-lg p-3 mb-2">
              <p className="text-white font-semibold text-base">
                {application.company_name}
              </p>
              <p className="text-gray-300 text-sm">{application.position_title}</p>
            </div>
            <p className="text-sm text-gray-300">{suggestion.description}</p>
          </div>

          {/* Quick view button */}
          <button
            onClick={() => router.push('/applications')}
            className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="View application"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-400"
            >
              <path d="M15 3h6v6" />
              <path d="M10 14L21 3" />
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            </svg>
          </button>
        </div>

        {/* Tools */}
        <div className="space-y-2 mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
            Recommended Actions:
          </p>
          <div className="flex gap-2">
            {suggestion.tools.map((tool) => (
              <button
                key={tool.type}
                onClick={() => launchTool(tool.type, application)}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-lg p-3 transition-all hover:scale-105 group"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">{tool.icon}</span>
                  <span className="text-white text-sm font-medium">{tool.label}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-white/60 group-hover:translate-x-1 transition-transform"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span>All details auto-loaded</span>
          </div>
          <button
            onClick={() => router.push('/applications')}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            View all applications →
          </button>
        </div>
      </div>
    </div>
  )
}

SmartSuggestionsWidget.displayName = 'SmartSuggestionsWidget'
