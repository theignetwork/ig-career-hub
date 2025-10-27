import React from 'react'
import { DashboardStats } from '@/lib/api/dashboard'

interface JourneyOverviewProps {
  stats: DashboardStats
}

export const JourneyOverview: React.FC<JourneyOverviewProps> = ({ stats }) => {
  const { applicationsCount, interviewsCount, offersCount, responseRate, responseRateTrend } = stats

  return (
    <div className="space-y-3">
      {/* Heading */}
      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
        <span>🎯</span>
        Your Journey at a Glance
      </h2>

      {/* Stats Card */}
      <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl p-5">
        {/* Top Stats Row */}
        <div className="grid grid-cols-3 gap-8 mb-4">
          {/* Applications */}
          <div>
            <div className="text-4xl font-bold text-white mb-1">{applicationsCount}</div>
            <div className="text-sm text-gray-400">Applications</div>
          </div>

          {/* Interviews */}
          <div>
            <div className="text-4xl font-bold text-white mb-1">{interviewsCount}</div>
            <div className="text-sm text-gray-400">Interviews</div>
          </div>

          {/* Offers */}
          <div>
            <div className="text-4xl font-bold text-white mb-1">{offersCount}</div>
            <div className="text-sm text-gray-400">Offers</div>
          </div>
        </div>

        {/* Progress Bar with Milestone Markers */}
        <div className="mb-4 relative">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0D9488] to-[#14B8A6]"
              style={{ width: `${Math.min(responseRate, 100)}%` }}
            />
          </div>
          {/* Milestone Markers */}
          <div className="absolute top-0 left-0 right-0 flex justify-between h-2">
            <div className="w-px h-full bg-white/20" style={{ marginLeft: '33.3%' }} />
            <div className="w-px h-full bg-white/20" style={{ marginRight: '33.3%' }} />
          </div>
        </div>

        {/* Response Rate */}
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">{responseRate}%</span>
          <span className="text-sm text-gray-400">Response Rate</span>
          <span className="text-base text-[#10B981] font-semibold flex items-center gap-1">
            {responseRateTrend >= 0 ? '↑' : '↓'}
            {Math.abs(responseRateTrend)}% vs industry avg
          </span>
        </div>
      </div>
    </div>
  )
}

JourneyOverview.displayName = 'JourneyOverview'
