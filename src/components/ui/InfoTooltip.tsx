'use client'

import React, { useState } from 'react'

interface InfoTooltipProps {
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ 
  content, 
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="text-gray-400 hover:text-[#0D9488] transition-colors cursor-help"
        aria-label="More information"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </button>

      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} w-64 pointer-events-none`}
        >
          <div className="bg-[#1E293B] border border-[#334155] rounded-lg shadow-xl p-3">
            <div className="text-sm text-gray-200 leading-relaxed">
              {content}
            </div>
            {/* Arrow */}
            <div
              className={`absolute w-2 h-2 bg-[#1E293B] border-[#334155] transform rotate-45 ${
                position === 'top'
                  ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r'
                  : position === 'bottom'
                    ? 'top-[-5px] left-1/2 -translate-x-1/2 border-t border-l'
                    : position === 'left'
                      ? 'right-[-5px] top-1/2 -translate-y-1/2 border-r border-t'
                      : 'left-[-5px] top-1/2 -translate-y-1/2 border-l border-b'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

InfoTooltip.displayName = 'InfoTooltip'
