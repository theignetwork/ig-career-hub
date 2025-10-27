/**
 * Tutorial Tooltip - First-time user onboarding
 * Shows helpful tips for new features
 */

'use client'

import React, { useState, useEffect } from 'react'

interface TutorialTooltipProps {
  id: string // Unique ID for this tooltip
  title: string
  description: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  children: React.ReactNode
  onTryIt?: () => void // Optional callback when "Try It Now!" is clicked
}

export const TutorialTooltip: React.FC<TutorialTooltipProps> = ({
  id,
  title,
  description,
  position = 'top',
  children,
  onTryIt,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenSeen, setHasBeenSeen] = useState(true)

  useEffect(() => {
    // Check if user has seen this tooltip before
    const seen = localStorage.getItem(`tutorial-${id}`)
    if (!seen) {
      // Show tooltip after a brief delay
      const timer = setTimeout(() => {
        setHasBeenSeen(false)
        setIsVisible(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [id])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem(`tutorial-${id}`, 'true')
    setHasBeenSeen(true)
  }

  const handleTryIt = () => {
    // Execute the callback (e.g., open the dropdown)
    if (onTryIt) {
      onTryIt()
    }
    // Then dismiss the tooltip
    setIsVisible(false)
    localStorage.setItem(`tutorial-${id}`, 'true')
    setHasBeenSeen(true)
  }

  if (hasBeenSeen) {
    return <>{children}</>
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#0D9488] border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#0D9488] border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#0D9488] border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#0D9488] border-t-transparent border-b-transparent border-l-transparent',
  }

  return (
    <div className="relative">
      {children}

      {isVisible && (
        <>
          {/* Backdrop with pulse effect */}
          <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in" onClick={handleDismiss} />

          {/* Spotlight effect */}
          <div className="absolute inset-0 rounded-lg ring-4 ring-[#0D9488] ring-opacity-60 animate-pulse z-50 pointer-events-none" />

          {/* Tooltip */}
          <div
            className={`absolute ${positionClasses[position]} z-50 w-72 animate-slide-in`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Arrow */}
            <div
              className={`absolute ${arrowClasses[position]} border-8`}
              style={{ width: 0, height: 0 }}
            />

            {/* Content */}
            <div className="bg-gradient-to-br from-[#0D9488] to-teal-600 rounded-xl p-5 shadow-2xl border-2 border-[#0D9488]">
              {/* Icon & Title */}
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl">💡</div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-base mb-1">{title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">{description}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleTryIt}
                  className="flex-1 px-4 py-2 bg-white text-[#0D9488] font-semibold text-sm rounded-lg hover:bg-white/90 transition-colors"
                >
                  Try It Now!
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 bg-white/20 text-white font-medium text-sm rounded-lg hover:bg-white/30 transition-colors"
                >
                  Got It
                </button>
              </div>

              {/* Progress indicator */}
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="h-1 w-8 bg-white/50 rounded-full" />
                <div className="h-1 w-8 bg-white rounded-full" />
                <div className="h-1 w-8 bg-white/50 rounded-full" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

TutorialTooltip.displayName = 'TutorialTooltip'
