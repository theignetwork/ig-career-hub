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
import { useAuth } from '@/contexts/AuthContext'

// Client Component - Fetches data via API route
export default function DashboardPage() {
  const { wpUserId, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      // Wait for authentication to complete
      if (authLoading) {
        return
      }

      const userId = wpUserId

      if (!userId) {
        console.error('[Dashboard] No user ID available')
        setLoading(false)
        return
      }

      try {
        // Fetch dashboard data from API route
        const response = await fetch('/api/dashboard', {
          headers: {
            'x-user-id': String(userId),
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (error) {
        console.error('[Dashboard] Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [wpUserId, authLoading])

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Authenticating...</div>
        </div>
      </DashboardLayout>
    )
  }

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
