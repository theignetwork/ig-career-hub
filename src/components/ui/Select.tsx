import React from 'react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    const selectId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`

    const baseStyles = `
      w-full px-4 py-3 rounded-lg font-normal
      bg-white/5 text-white/90
      transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
      appearance-none cursor-pointer
      [color-scheme:dark]
      [&>option]:bg-black [&>option]:text-white/90
      [&>option]:checked:bg-[#0D9488]
    `

    const borderStyles = error
      ? 'border border-red-400/50 focus:border-red-400 focus:ring-1 focus:ring-red-400'
      : 'border border-white/10 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]'

    const focusStyles = 'focus:outline-none outline-none'

    const combinedClassName = `${baseStyles} ${borderStyles} ${focusStyles} ${className}`
      .trim()
      .replace(/\s+/g, ' ')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-normal text-white/70 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={combinedClassName}
            style={{
              colorScheme: 'dark',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-black text-white/90"
              >
                {option.label}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              className="text-white/50"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-400 font-normal">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
