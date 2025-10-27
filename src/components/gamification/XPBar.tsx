'use client'

import React from 'react'
import { getLevelInfo } from '@/lib/gamification/xp-system'

interface XPBarProps {
  xp: number
  showDetails?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const XPBar: React.FC<XPBarProps> = ({ xp, showDetails = true, size = 'md' }) => {
  const levelInfo = getLevelInfo(xp)
  const { currentLevel, nextLevel, progress, xpToNextLevel } = levelInfo

  const heights = { sm: 'h-2', md: 'h-3', lg: 'h-4' }
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentLevel.icon}</span>
          <div>
            <p className={`${textSizes[size]} font-semibold text-white`}>
              Level {currentLevel.level} - {currentLevel.name}
            </p>
            {showDetails && nextLevel && (
              <p className="text-xs text-gray-400">
                {xpToNextLevel} XP to Level {nextLevel.level}
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className={`${textSizes[size]} font-bold text-white`}>{xp} XP</p>
        </div>
      </div>

      <div className={`w-full bg-white/10 rounded-full ${heights[size]} overflow-hidden`}>
        <div
          className={`${heights[size]} rounded-full transition-all duration-500 ease-out`}
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel?.color || currentLevel.color})`,
            boxShadow: `0 0 10px ${currentLevel.color}`,
          }}
        />
      </div>

      {showDetails && nextLevel && (
        <p className="text-xs text-gray-500 mt-1 text-center">
          {progress.toFixed(0)}% to next level
        </p>
      )}
    </div>
  )
}
