import React from 'react'
import { Card } from '@/components/ui/Card'

export interface StatsCardProps {
  label: string
  value: number | string
  icon?: React.ReactNode
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon,
  trend,
}) => {
  return (
    <Card padding="lg" className="hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(13,148,136,0.15)] transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-white/60 uppercase tracking-wide mb-2">
            {label}
          </p>
          <p className="text-6xl font-light tracking-tighter text-white mb-2">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.direction === 'up' ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-[#10B981]"
                >
                  <path
                    d="M8 4L12 8L8 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="rotate(-90 8 8)"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-[#EF4444]"
                >
                  <path
                    d="M8 4L12 8L8 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="rotate(90 8 8)"
                  />
                </svg>
              )}
              <span
                className={`text-sm font-medium ${
                  trend.direction === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'
                }`}
              >
                {trend.value}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-white/30 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}

StatsCard.displayName = 'StatsCard'
