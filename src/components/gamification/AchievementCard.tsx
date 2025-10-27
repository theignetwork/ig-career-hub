'use client'

import React from 'react'
import { getRarityColor, getRarityGlow, type Achievement } from '@/lib/gamification/achievements'

interface AchievementCardProps {
  achievement: Achievement
  earned?: boolean
  earnedAt?: string
  size?: 'sm' | 'md' | 'lg'
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  earned = false,
  earnedAt,
  size = 'md',
}) => {
  const rarityColor = getRarityColor(achievement.rarity)
  const rarityGlow = getRarityGlow(achievement.rarity)

  const sizes = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  const iconSizes = {
    sm: 'text-3xl',
    md: 'text-4xl',
    lg: 'text-5xl',
  }

  return (
    <div
      className={`${sizes[size]} rounded-xl border-2 transition-all ${
        earned
          ? 'bg-white/5 border-opacity-100 hover:scale-105'
          : 'bg-white/[0.02] border-white/10 opacity-50'
      }`}
      style={{
        borderColor: earned ? rarityColor : undefined,
        boxShadow: earned ? rarityGlow : undefined,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`${iconSizes[size]} ${earned ? '' : 'grayscale'}`}
          style={{ filter: earned ? 'none' : 'grayscale(100%)' }}
        >
          {achievement.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`font-semibold ${earned ? 'text-white' : 'text-gray-500'}`}>
              {achievement.name}
            </h3>
            <span
              className="px-2 py-0.5 rounded text-xs font-semibold"
              style={{ backgroundColor: `${rarityColor}20`, color: rarityColor }}
            >
              {achievement.rarity}
            </span>
          </div>
          <p className={`text-sm ${earned ? 'text-gray-300' : 'text-gray-600'}`}>
            {achievement.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span
              className="text-xs font-semibold"
              style={{ color: earned ? rarityColor : '#6B7280' }}
            >
              +{achievement.xpReward} XP
            </span>
            {earned && earnedAt && (
              <span className="text-xs text-gray-500">
                {new Date(earnedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {earned && (
        <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
          <span>✓</span>
          <span>Unlocked!</span>
        </div>
      )}
    </div>
  )
}
