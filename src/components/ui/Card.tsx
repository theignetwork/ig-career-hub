import React from 'react'

export interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  header?: React.ReactNode
  footer?: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  header,
  footer,
}) => {
  // Base glassmorphism styles
  const baseStyles = `
    backdrop-blur-xl bg-white/5
    border border-white/10
    rounded-xl shadow-lg
  `

  // Padding variants
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  // Apply padding only to the main content area, not header/footer
  const contentPadding = paddingStyles[padding]

  const combinedClassName = `${baseStyles} ${className}`.trim().replace(/\s+/g, ' ')

  return (
    <div className={combinedClassName}>
      {header && (
        <div className="px-6 py-4 border-b border-white/10">
          {header}
        </div>
      )}
      <div className={contentPadding}>
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-white/10">
          {footer}
        </div>
      )}
    </div>
  )
}

Card.displayName = 'Card'
