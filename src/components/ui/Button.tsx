import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Base styles - always applied
    const baseStyles = `
      relative inline-flex items-center justify-center
      font-normal rounded-lg
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-primary-teal focus:ring-offset-2 focus:ring-offset-bg-black
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    `

    // Variant styles
    const variantStyles = {
      primary: `
        bg-[#0D9488] text-white
        hover:bg-[#0F766E]
        hover:-translate-y-0.5
        hover:shadow-[0_0_0_1px_rgba(13,148,136,0.5),0_4px_12px_rgba(13,148,136,0.4)]
        active:scale-[0.98]
      `,
      secondary: `
        bg-white/5 border border-white/10 text-white/90
        hover:bg-white/10
        hover:-translate-y-0.5
        hover:shadow-[0_0_0_1px_rgba(13,148,136,0.4),0_4px_12px_rgba(13,148,136,0.3)]
        active:scale-[0.98]
      `,
      ghost: `
        bg-transparent text-white/70
        hover:bg-white/5 hover:text-white
        active:scale-[0.98]
      `,
      danger: `
        bg-[#7F1D1D] text-red-300
        hover:bg-[#991B1B]
        hover:-translate-y-0.5
        active:scale-[0.98]
      `,
    }

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    // Width style
    const widthStyle = fullWidth ? 'w-full' : ''

    // Disabled hover/active effects when loading or disabled
    const interactionStyles =
      loading || disabled
        ? 'hover:transform-none hover:shadow-none active:scale-100'
        : ''

    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${widthStyle}
      ${interactionStyles}
      ${className}
    `
      .trim()
      .replace(/\s+/g, ' ')

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={combinedClassName}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
