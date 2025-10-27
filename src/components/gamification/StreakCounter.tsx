'use client'

import React from 'react'

interface StreakCounterProps {
  currentStreak: number
  longestStreak: number
  type: 'application' | 'goal'
  icon?: string
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  currentStreak,
  longestStreak,
  type,
  icon = '🔥',
}) => {
  const isActive = currentStreak > 0

  return (
    <div className="bg-white/5 border-2 border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{icon}</span>
        <div>
          <h3 className="text-lg font-semibold text-white">
            {type === 'application' ? 'Application' : 'Goal Completion'} Streak
          </h3>
          <p className="text-sm text-gray-400">Keep the momentum going!</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div
            className={`text-3xl font-bold mb-1 ${
              isActive ? 'text-orange-400' : 'text-gray-500'
            }`}
          >
            {currentStreak}
          </div>
          <div className="text-xs text-gray-400">Current Streak</div>
          {isActive && (
            <div className="text-xs text-orange-400 mt-1 animate-pulse">● Active</div>
          )}
        </div>

        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-[#0D9488] mb-1">{longestStreak}</div>
          <div className="text-xs text-gray-400">Best Streak</div>
          {currentStreak === longestStreak && currentStreak > 0 && (
            <div className="text-xs text-[#0D9488] mt-1">🏆 Record!</div>
          )}
        </div>
      </div>

      {currentStreak === 0 && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-xs text-yellow-300 text-center">
            Start a new streak today! {type === 'application' ? 'Apply to a job' : 'Complete a goal'}
          </p>
        </div>
      )}
    </div>
  )
}
