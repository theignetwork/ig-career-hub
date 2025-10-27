/**
 * Smart Tools Section - Featured context-aware tool launcher
 * Prominently displays in ApplicationDetailsModal
 */

'use client'

import React from 'react'
import { useToolLauncher } from '@/lib/context/useToolLauncher'
import type { Application } from '@/lib/api/applications'
import type { ToolType } from '@/lib/context/types'

interface SmartToolsSectionProps {
  application: Application
}

export const SmartToolsSection: React.FC<SmartToolsSectionProps> = ({ application }) => {
  const { launchTool } = useToolLauncher()

  const tools: Array<{
    type: ToolType
    label: string
    icon: string
    description: string
    color: string
  }> = [
    {
      type: 'interview-coach',
      label: 'Practice Interview',
      icon: '🎤',
      description: 'AI coach with job context',
      color: 'from-purple-500 to-purple-600',
    },
    {
      type: 'resume-analyzer',
      label: 'Optimize Resume',
      icon: '📄',
      description: 'Tailored to this role',
      color: 'from-blue-500 to-blue-600',
    },
    {
      type: 'cover-letter',
      label: 'Cover Letter',
      icon: '✍️',
      description: 'Pre-filled with details',
      color: 'from-green-500 to-green-600',
    },
    {
      type: 'oracle-pro',
      label: 'Interview Prep',
      icon: '🔮',
      description: 'Predict questions',
      color: 'from-orange-500 to-orange-600',
    },
  ]

  return (
    <div className="bg-gradient-to-br from-[#0D9488]/20 via-[#0D9488]/10 to-transparent border-2 border-[#0D9488]/30 rounded-xl p-6 relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0D9488]/5 to-transparent animate-shimmer" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🚀</span>
              <h3 className="text-xl font-bold text-white">Smart Tools</h3>
              <span className="px-2 py-0.5 bg-[#0D9488] text-white text-xs font-bold rounded-full uppercase tracking-wide">
                AI-Powered
              </span>
            </div>
            <p className="text-sm text-gray-300">
              Pre-loaded with "{application.company_name}" job details
            </p>
          </div>
          <div className="text-[#0D9488]">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="animate-pulse"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <span className="text-lg">💡</span>
            <div>
              <p className="text-sm text-white font-medium mb-1">Everything Auto-Filled!</p>
              <p className="text-xs text-gray-400">
                Job description, company details, and your notes are automatically loaded into
                each tool. No copy-pasting required!
              </p>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool) => (
            <button
              key={tool.type}
              onClick={() => launchTool(tool.type, application)}
              className={`group relative bg-gradient-to-br ${tool.color} p-4 rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300 overflow-hidden`}
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

              {/* Content */}
              <div className="relative z-10 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{tool.icon}</span>
                  <span className="text-white font-bold text-sm">{tool.label}</span>
                </div>
                <p className="text-white/80 text-xs">{tool.description}</p>

                {/* Arrow icon */}
                <div className="absolute top-3 right-3 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer tip */}
        <div className="mt-4 text-center">
          <p className="text-xs text-[#0D9488] font-medium">
            ⚡ Launch in seconds • ✨ No setup needed • 🎯 Context-aware AI
          </p>
        </div>
      </div>
    </div>
  )
}

SmartToolsSection.displayName = 'SmartToolsSection'
