'use client'

import React from 'react'
import { useToolLauncher } from '@/lib/context/useToolLauncher'
import type { ToolType } from '@/lib/context/types'

export const ToolkitGrid: React.FC = () => {
  const { launchTool } = useToolLauncher()

  const tools: Array<{ name: string; type: ToolType; icon: React.ReactNode }> = [
    {
      name: 'Interview Master Guide',
      type: 'interview-guide',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      name: 'Resume Analyzer PRO',
      type: 'resume-analyzer',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
    {
      name: 'IG Interview Coach',
      type: 'interview-coach',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        </svg>
      ),
    },
    {
      name: 'Cover Letter Generator PRO',
      type: 'cover-letter',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
    },
    {
      name: 'Interview Oracle PRO',
      type: 'oracle-pro',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      ),
    },
    {
      name: 'Hidden Job Boards Tool',
      type: 'hidden-boards',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      ),
    },
  ]

  return (
    <div className="space-y-3">
      {/* Header */}
      <h2 className="text-xl font-semibold text-white">Your Toolkit</h2>

      {/* Tools Grid - 3 columns, 2 rows */}
      <div className="grid grid-cols-3 gap-3">
        {tools.map((tool, index) => (
          <button
            key={index}
            onClick={() => launchTool(tool.type)}
            className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-[#0D9488] transition-colors cursor-pointer"
          >
            <div className="text-[#0D9488]">{tool.icon}</div>
            <span className="text-sm text-white font-normal text-center">
              {tool.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

ToolkitGrid.displayName = 'ToolkitGrid'
