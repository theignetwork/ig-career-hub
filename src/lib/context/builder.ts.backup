/**
 * Context builder - creates ToolContext from application data
 */

import { generateContextToken } from './token'
import type { ToolContext } from './types'
import type { Application } from '@/lib/api/applications'

/**
 * Build a complete ToolContext from an application
 * @param application - Application data from database
 * @param userId - Current user ID (from WordPress auth)
 */
export async function buildToolContext(
  application: Application,
  userId: string
): Promise<ToolContext> {
  // Prepare application data for JWT
  const applicationData = {
    companyName: application.company_name,
    positionTitle: application.position_title,
    jobDescription: application.job_description,
    location: application.location,
    salaryRange: application.salary_range,
    remoteType: application.remote_type,
    source: application.source,
    dateApplied: application.date_applied,
  }

  // Generate JWT token with full application data (15 min expiration)
  const token = await generateContextToken(userId, application.id, applicationData, 15)

  const expiresAt = Date.now() + (15 * 60 * 1000) // 15 minutes

  const context: ToolContext = {
    source: 'career-hub',
    version: '1.0',
    timestamp: Date.now(),
    userId,
    applicationId: application.id,
    companyName: application.company_name,
    positionTitle: application.position_title,
    token,
    expiresAt,
    careerHubUrl: process.env.NEXT_PUBLIC_CAREER_HUB_URL || window.location.origin,
  }

  return context
}
