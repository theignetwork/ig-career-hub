'use client'

import React, { useState, useEffect } from 'react'
import { XPBar } from '@/components/gamification/XPBar'
import { AchievementCard } from '@/components/gamification/AchievementCard'
import { StreakCounter } from '@/components/gamification/StreakCounter'
import { ACHIEVEMENTS } from '@/lib/gamification/achievements'

interface GamificationStats {
  xp: number
  level: number
  achievements: Array<{
    badge_type: string
    earned_at: string
  }>
  streaks: {
    application_streak: number
    longest_application_streak: number
    goal_completion_streak: number
    longest_goal_streak: number
  }
}

export const GoalsClient: React.FC = () => {
  const [stats, setStats] = useState<GamificationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'streaks'>('overview')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/gamification/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching gamification stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading your progress...</div>
      </div>
    )
  }

  const earnedAchievements = stats?.achievements || []
  const earnedBadgeTypes = new Set(earnedAchievements.map((a) => a.badge_type))

  const allAchievements = Object.values(ACHIEVEMENTS)
  const earnedCount = earnedAchievements.length
  const totalCount = allAchievements.length

  return (
    <div>
      {/* Header with XP Bar */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-4">Goals & Progress</h1>
        <div className="bg-white/5 border-2 border-white/10 rounded-xl p-6">
          <XPBar xp={stats?.xp || 0} size="lg" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/10">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'achievements', label: 'Achievements', icon: '🏆' },
          { id: 'streaks', label: 'Streaks', icon: '🔥' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 font-medium transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-[#0D9488]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 border-2 border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-[#0D9488] mb-2">{stats?.xp || 0}</div>
              <div className="text-sm text-gray-400">Total XP Earned</div>
            </div>
            <div className="bg-white/5 border-2 border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {earnedCount}/{totalCount}
              </div>
              <div className="text-sm text-gray-400">Achievements Unlocked</div>
            </div>
            <div className="bg-white/5 border-2 border-white/10 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">
                {stats?.streaks.application_streak || 0}
              </div>
              <div className="text-sm text-gray-400">Current Streak</div>
            </div>
          </div>

          {/* Streaks */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Your Streaks</h2>
            <div className="grid grid-cols-2 gap-4">
              <StreakCounter
                currentStreak={stats?.streaks.application_streak || 0}
                longestStreak={stats?.streaks.longest_application_streak || 0}
                type="application"
                icon="🔥"
              />
              <StreakCounter
                currentStreak={stats?.streaks.goal_completion_streak || 0}
                longestStreak={stats?.streaks.longest_goal_streak || 0}
                type="goal"
                icon="🎯"
              />
            </div>
          </div>

          {/* Recent Achievements */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Recent Achievements</h2>
            {earnedAchievements.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {earnedAchievements.slice(0, 4).map((earned) => {
                  const achievement = ACHIEVEMENTS[earned.badge_type]
                  return achievement ? (
                    <AchievementCard
                      key={earned.badge_type}
                      achievement={achievement}
                      earned={true}
                      earnedAt={earned.earned_at}
                    />
                  ) : null
                })}
              </div>
            ) : (
              <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-xl p-12 text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-white mb-2">No achievements yet</h3>
                <p className="text-gray-400">Start applying to jobs to earn your first badge!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">All Achievements</h2>
              <p className="text-sm text-gray-400">
                Unlocked {earnedCount} of {totalCount} achievements
              </p>
            </div>
            <div className="px-4 py-2 bg-purple-500/20 border-2 border-purple-500/50 rounded-lg">
              <span className="text-purple-300 font-semibold">
                {((earnedCount / totalCount) * 100).toFixed(0)}% Complete
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {allAchievements.map((achievement) => {
              const earned = earnedBadgeTypes.has(achievement.id)
              const earnedData = earnedAchievements.find((a) => a.badge_type === achievement.id)
              return (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  earned={earned}
                  earnedAt={earnedData?.earned_at}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Streaks Tab */}
      {activeTab === 'streaks' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Your Streaks</h2>
            <p className="text-sm text-gray-400 mb-6">
              Build momentum and stay consistent with your job search!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <StreakCounter
              currentStreak={stats?.streaks.application_streak || 0}
              longestStreak={stats?.streaks.longest_application_streak || 0}
              type="application"
              icon="🔥"
            />
            <StreakCounter
              currentStreak={stats?.streaks.goal_completion_streak || 0}
              longestStreak={stats?.streaks.longest_goal_streak || 0}
              type="goal"
              icon="🎯"
            />
          </div>

          {/* Streak Tips */}
          <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
              <span>💡</span>
              <span>Tips for Building Streaks</span>
            </h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>• Apply to at least one job per day to maintain your application streak</li>
              <li>• Set realistic weekly goals and complete them consistently</li>
              <li>• Use reminders to stay on track with your daily activities</li>
              <li>• Celebrate milestones - every streak day counts!</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

GoalsClient.displayName = 'GoalsClient'
