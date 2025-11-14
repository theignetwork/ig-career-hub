import { NextRequest, NextResponse } from 'next/server'
import {
  getDashboardStats,
  getUpcomingInterviews,
  getRecentApplications,
  getApplicationPipeline,
  getFollowUpCompanies,
  getApplicationsForSuggestions,
} from '@/lib/api/dashboard'

/**
 * GET /api/dashboard
 * Fetch all dashboard data for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Get user ID from header (set by WordPress authentication)
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - No user ID provided' },
        { status: 401 }
      )
    }

    // Fetch all dashboard data in parallel
    const [stats, upcomingInterviews, recentApplications, pipeline, followUpCompanies, applications] =
      await Promise.all([
        getDashboardStats(userId),
        getUpcomingInterviews(userId),
        getRecentApplications(userId, 3),
        getApplicationPipeline(userId),
        getFollowUpCompanies(userId),
        getApplicationsForSuggestions(userId),
      ])

    // Get next interview and this week's interviews
    const nextInterview = upcomingInterviews[0] || null
    const thisWeekInterviews = upcomingInterviews.filter((interview) => {
      const interviewDate = new Date(interview.date)
      const today = new Date()
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      return interviewDate >= today && interviewDate <= weekFromNow
    })

    return NextResponse.json({
      stats,
      nextInterview,
      thisWeekInterviews,
      pipeline,
      followUpCompanies,
      applications,
    })
  } catch (error) {
    console.error('[API /dashboard] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
