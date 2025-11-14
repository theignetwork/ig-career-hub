'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import { JourneyOverview } from '@/components/dashboard/JourneyOverview'
import { PriorityWidget } from '@/components/dashboard/PriorityWidget'
import { ThisWeekWidget } from '@/components/dashboard/ThisWeekWidget'
import { QuickActionsWidget } from '@/components/dashboard/QuickActionsWidget'
import { ApplicationPipeline } from '@/components/dashboard/ApplicationPipeline'
import { ToolkitGrid } from '@/components/dashboard/ToolkitGrid'
import { SmartSuggestionsWidget } from '@/components/dashboard/SmartSuggestionsWidget'
import { WelcomeBanner } from '@/components/ui/WelcomeBanner'
import { getUserId } from '@/lib/utils/getUserId'
import {
  getDashboardStats,
  getUpcomingInterviews,
  getRecentApplications,
  getApplicationPipeline,
  getFollowUpCompanies,
  getApplicationsForSuggestions,
} from '@/lib/api/dashboard'

// Client Component - Fetches data with authenticated user ID
export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const userId = getUserId()

      if (!userId) {
        console.error('[Dashboard] No user ID available')
        setLoading(false)
        return
      }

      try {
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

        setData({
          stats,
          nextInterview,
          thisWeekInterviews,
          pipeline,
          followUpCompanies,
          applications
        })
      } catch (error) {
        console.error('[Dashboard] Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Unable to load dashboard data</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <DashboardClient>
        <div className="space-y-6">
          {/* Welcome Banner for first-time users */}
          <WelcomeBanner />

          {/* Section 1: Your Journey at a Glance */}
          <JourneyOverview stats={data.stats} />

          {/* Section 1.5: Smart Suggestions - Status-based recommendations */}
          <SmartSuggestionsWidget applications={data.applications} />

        {/* Section 2: Three-Column Widget Grid */}
        <div className="grid grid-cols-3 gap-4">
          <PriorityWidget
            nextInterview={data.nextInterview}
            followUpCompanies={data.followUpCompanies}
          />
          <ThisWeekWidget interviews={data.thisWeekInterviews} />
          <QuickActionsWidget />
        </div>

        {/* Section 3: Application Pipeline */}
        <ApplicationPipeline applications={data.pipeline} />

        {/* Section 4: Your Toolkit */}
        <ToolkitGrid />
        </div>
      </DashboardClient>
    </DashboardLayout>
  )
}
