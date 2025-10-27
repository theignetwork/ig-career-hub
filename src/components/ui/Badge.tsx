import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center text-xs px-2 py-1 rounded-full font-medium'

  const variantStyles = {
    success: 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30',
    warning: 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30',
    error: 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30',
    info: 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30',
    default: 'bg-white/10 text-white/70 border border-white/10',
  }

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`
    .trim()
    .replace(/\s+/g, ' ')

  return <span className={combinedClassName}>{children}</span>
}

Badge.displayName = 'Badge'
