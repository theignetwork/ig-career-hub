/**
 * React hook for launching tools with context
 */

'use client'

import { useCallback } from 'react'
import { buildToolContext } from './builder'
import { buildToolUrl } from './encoder'
import type { Application } from '@/lib/api/applications'
import type { ToolType } from './types'

// Tool URL mapping
const TOOL_URLS: Record<ToolType, string> = {
  'interview-coach': process.env.NEXT_PUBLIC_INTERVIEW_COACH_URL || '',
  'resume-analyzer': process.env.NEXT_PUBLIC_RESUME_ANALYZER_URL || '',
  'cover-letter': process.env.NEXT_PUBLIC_COVER_LETTER_URL || '',
  'oracle-pro': process.env.NEXT_PUBLIC_ORACLE_PRO_URL || '',
  'hidden-boards': process.env.NEXT_PUBLIC_HIDDEN_BOARDS_URL || '',
  'interview-guide': process.env.NEXT_PUBLIC_INTERVIEW_MASTER_GUIDE_URL || '',
}

export function useToolLauncher() {
  const launchTool = useCallback(
    async (
      toolType: ToolType,
      application?: Application,
      userId: string = 'demo-user-123' // TODO: Get from auth context
    ) => {
      const baseUrl = TOOL_URLS[toolType]
      if (!baseUrl) {
        console.error(`No URL configured for tool: ${toolType}`)
        return
      }

      // If no application context, just open the tool
      if (!application) {
        window.open(baseUrl, '_blank')
        return
      }

      try {
        // Build context with JWT token
        console.log('[Tool Launcher] Building context for:', application.company_name)
        const context = await buildToolContext(application, userId)
        console.log('[Tool Launcher] Context built, token length:', context.token.length)

        // Build URL with context parameter
        const toolUrl = buildToolUrl(baseUrl, context)
        console.log('[Tool Launcher] Full URL:', toolUrl)

        // Open in new tab (or could be iframe)
        window.open(toolUrl, '_blank', 'noopener,noreferrer')

        // Optional: Track analytics
        console.log('[Tool Launched]', {
          tool: toolType,
          application: application.id,
          company: application.company_name,
          url: toolUrl,
        })
      } catch (error) {
        console.error('[Tool Launcher] Failed to launch tool with context:', error)
        // Fallback: open without context
        window.open(baseUrl, '_blank')
      }
    },
    []
  )

  return { launchTool }
}
