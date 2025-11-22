/**
 * React hook for launching tools with context
 */

'use client'

import { useCallback } from 'react'
import { buildToolContext } from './builder'
import { buildToolUrl } from './encoder'
import { useAuth } from '@/contexts/AuthContext'
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
  const { user } = useAuth()

  const launchTool = useCallback(
    async (
      toolType: ToolType,
      application?: Application
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

      // Ensure we have WordPress user data
      if (!user || !user.user_id) {
        console.error('[Tool Launcher] No WordPress user data available')
        window.open(baseUrl, '_blank')
        return
      }

      try {
        // Build context with JWT token (includes WordPress user data)
        console.log('[Tool Launcher] Building context for:', application.company_name)
        const context = await buildToolContext(application, {
          user_id: user.user_id,
          email: user.email,
          name: user.name,
          membership_level: user.membership_level
        })
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
    [user]
  )

  return { launchTool }
}
