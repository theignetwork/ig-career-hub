import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import { JourneyOverview } from '@/components/dashboard/JourneyOverview'
import { PriorityWidget } from '@/components/dashboard/PriorityWidget'
import { ThisWeekWidget } from '@/components/dashboard/ThisWeekWidget'
import { QuickActionsWidget } from '@/components/dashboard/QuickActionsWidget'
import { ApplicationPipeline } from '@/components/dashboard/ApplicationPipeline'
import { ToolkitGrid } from '@/components/dashboard/ToolkitGrid'
import { SmartSuggestionsWidget } from '@/components/dashboard/SmartSuggestionsWidget'
import {
  getDashboardStats,
  getUpcomingInterviews,
  getRecentApplications,
  getApplicationPipeline,
  getFollowUpCompanies,
} from '@/lib/api/dashboard'

// Server Component - Fetches real data from Supabase
export default async function DashboardPage() {
  // TODO: Implement proper server-side auth
  // For now using demo user ID - will be replaced with:
  // - WordPress user ID from cookies/headers when embedded
  // - Session-based auth for standalone mode
  const userId = 'demo-user-123'

  // Fetch all dashboard data in parallel
  const [stats, upcomingInterviews, recentApplications, pipeline, followUpCompanies] =
    await Promise.all([
      getDashboardStats(userId),
      getUpcomingInterviews(userId),
      getRecentApplications(userId, 3),
      getApplicationPipeline(userId),
      getFollowUpCompanies(userId),
    ])

  // Get next interview and this week's interviews
  const nextInterview = upcomingInterviews[0] || null
  const thisWeekInterviews = upcomingInterviews.filter((interview) => {
    const interviewDate = new Date(interview.date)
    const today = new Date()
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return interviewDate >= today && interviewDate <= weekFromNow
  })

  return (
    <DashboardLayout>
      <DashboardClient>
        <div className="space-y-6">
          {/* Section 1: Your Journey at a Glance */}
          <JourneyOverview stats={stats} />

          {/* Section 1.5: Smart Suggestions - Status-based recommendations */}
          <SmartSuggestionsWidget applications={pipeline} />

        {/* Section 2: Three-Column Widget Grid */}
        <div className="grid grid-cols-3 gap-4">
          <PriorityWidget
            nextInterview={nextInterview}
            followUpCompanies={followUpCompanies}
          />
          <ThisWeekWidget interviews={thisWeekInterviews} />
          <QuickActionsWidget />
        </div>

        {/* Section 3: Application Pipeline */}
        <ApplicationPipeline applications={pipeline} />

        {/* Section 4: Your Toolkit */}
        <ToolkitGrid />
        </div>
      </DashboardClient>
    </DashboardLayout>
  )
}
