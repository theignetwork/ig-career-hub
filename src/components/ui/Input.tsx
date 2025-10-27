import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  disabled?: boolean
  placeholder?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, disabled, className = '', ...props }, ref) => {
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`

    const baseStyles = `
      w-full px-4 py-3 rounded-lg font-normal
      bg-white/5 text-white/90 placeholder:text-white/30
      transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
    `

    const borderStyles = error
      ? 'border border-red-400/50 focus:border-red-400 focus:ring-1 focus:ring-red-400'
      : 'border border-white/10 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]'

    const focusStyles = 'focus:outline-none'

    const combinedClassName = `${baseStyles} ${borderStyles} ${focusStyles} ${className}`
      .trim()
      .replace(/\s+/g, ' ')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-normal text-white/70 mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={combinedClassName}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-400 font-normal">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
