import React from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export interface ToolCardProps {
  icon: React.ReactNode
  name: string
  description: string
  onLaunch: () => void
}

export const ToolCard: React.FC<ToolCardProps> = ({
  icon,
  name,
  description,
  onLaunch,
}) => {
  return (
    <Card
      padding="lg"
      className="group hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(13,148,136,0.25)] transition-all duration-300"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icon */}
        <div className="text-[#0D9488] group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>

        {/* Tool Name */}
        <h3 className="text-2xl font-semibold text-white/90">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/60 min-h-[40px]">
          {description}
        </p>

        {/* Launch Button */}
        <Button
          onClick={onLaunch}
          variant="primary"
          size="md"
          className="w-full mt-2"
        >
          Launch
        </Button>
      </div>
    </Card>
  )
}

ToolCard.displayName = 'ToolCard'
