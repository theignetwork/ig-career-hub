/**
 * Context builder - creates ToolContext from application data
 */

import type { ToolContext } from './types'
import type { Application } from '@/lib/api/applications'
import { authenticatedPost } from '@/lib/utils/authenticatedFetch'

/**
 * Build a complete ToolContext from an application
 * @param application - Application data from database
 * @param wpUserData - WordPress user data (from JWT auth)
 */
export async function buildToolContext(
  application: Application,
  wpUserData: {
    user_id: number
    email: string
    name: string
    membership_level: string
  }
): Promise<ToolContext> {
  // Call server API to generate token (keeps secret server-side!)
  const response = await authenticatedPost('/api/context/generate', {
    applicationId: application.id,
    wpUserData  // Pass WordPress user data to include in token
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to generate context token')
  }

  const { token, expiresAt } = await response.json()

  const context: ToolContext = {
    source: 'career-hub',
    version: '1.0',
    timestamp: Date.now(),
    userId: wpUserData.user_id.toString(),
    applicationId: application.id,
    companyName: application.company_name,
    positionTitle: application.position_title,
    token,
    expiresAt,
    careerHubUrl: process.env.NEXT_PUBLIC_CAREER_HUB_URL || (typeof window !== 'undefined' ? window.location.origin : ''),
  }

  return context
}
