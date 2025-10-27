/**
 * New Badge - Subtle indicator for new features
 */

'use client'

import React, { useState, useEffect } from 'react'

interface NewBadgeProps {
  id: string // Unique ID for this badge
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export const NewBadge: React.FC<NewBadgeProps> = ({ id, position = 'top-right' }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has seen this badge before
    const seen = localStorage.getItem(`new-badge-${id}`)
    if (!seen) {
      setIsVisible(true)
    }
  }, [id])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem(`new-badge-${id}`, 'true')
  }

  if (!isVisible) return null

  const positionClasses = {
    'top-right': '-top-2 -right-2',
    'top-left': '-top-2 -left-2',
    'bottom-right': '-bottom-2 -right-2',
    'bottom-left': '-bottom-2 -left-2',
  }

  return (
    <div
      onClick={handleDismiss}
      className={`absolute ${positionClasses[position]} z-10 cursor-pointer animate-pulse`}
      title="Click to dismiss"
    >
      <div className="relative">
        {/* Pulsing glow effect */}
        <div className="absolute inset-0 bg-[#0D9488] rounded-full blur-md opacity-60 animate-pulse" />

        {/* Badge */}
        <div className="relative bg-gradient-to-br from-[#0D9488] to-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-lg border border-white/30">
          NEW
        </div>
      </div>
    </div>
  )
}

NewBadge.displayName = 'NewBadge'
