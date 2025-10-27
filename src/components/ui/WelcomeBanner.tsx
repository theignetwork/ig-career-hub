'use client'

import React, { useState, useEffect } from 'react'

export const WelcomeBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the banner before
    const dismissed = localStorage.getItem('welcomeBannerDismissed')
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem('welcomeBannerDismissed', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-[#0D9488]/20 to-teal-500/20 border-2 border-[#0D9488]/50 rounded-2xl p-6 mb-6 relative animate-fade-in">
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        aria-label="Dismiss welcome message"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="flex items-start gap-4 pr-8">
        <div className="flex-shrink-0 w-12 h-12 bg-[#0D9488]/30 rounded-full flex items-center justify-center">
          <span className="text-2xl">👋</span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">
            Welcome to IG Career Hub!
          </h3>
          <p className="text-gray-300 mb-4">
            Your command center for job search success. Here's how to get started:
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <span className="text-[#0D9488] font-bold">1.</span>
              <p className="text-gray-300 text-sm">
                <strong className="text-white">Add Applications</strong> - Click "Applications" in the sidebar and add your job applications
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0D9488] font-bold">2.</span>
              <p className="text-gray-300 text-sm">
                <strong className="text-white">Track Progress</strong> - Drag tiles in kanban view to update status, or use the table view
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#0D9488] font-bold">3.</span>
              <p className="text-gray-300 text-sm">
                <strong className="text-white">Use Smart Context</strong> - Click "Launch with Smart Context" to auto-fill prep tools with job details
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

WelcomeBanner.displayName = 'WelcomeBanner'
