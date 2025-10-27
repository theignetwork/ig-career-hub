import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand - Teal
        primary: {
          teal: '#14B8A6',
          'teal-dark': '#0D9488',
          'teal-light': '#5EEAD4',
        },
        // Backgrounds
        bg: {
          black: '#000000',
          'card-dark': 'rgba(10, 14, 26, 0.6)',
          'card-darker': 'rgba(10, 14, 26, 0.8)',
          overlay: 'rgba(0, 0, 0, 0.8)',
        },
        // Borders & Overlays
        border: {
          subtle: 'rgba(255, 255, 255, 0.06)',
          light: 'rgba(255, 255, 255, 0.10)',
          teal: '#14B8A6',
        },
        // Status Colors
        status: {
          success: '#10B981',
          'success-bg': 'rgba(16, 185, 129, 0.1)',
          'success-border': 'rgba(16, 185, 129, 0.3)',
          warning: '#F59E0B',
          'warning-bg': 'rgba(245, 158, 11, 0.1)',
          'warning-border': 'rgba(245, 158, 11, 0.3)',
          error: '#EF4444',
          'error-bg': 'rgba(239, 68, 68, 0.1)',
          'error-border': 'rgba(239, 68, 68, 0.3)',
          info: '#3B82F6',
          'info-bg': 'rgba(59, 130, 246, 0.1)',
          'info-border': 'rgba(59, 130, 246, 0.3)',
        },
        // Text
        text: {
          primary: 'rgba(255, 255, 255, 0.95)',
          secondary: 'rgba(255, 255, 255, 0.70)',
          tertiary: 'rgba(255, 255, 255, 0.50)',
          disabled: 'rgba(255, 255, 255, 0.30)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
      },
      backdropBlur: {
        '20': '20px',
      },
      boxShadow: {
        'teal-glow': '0 20px 40px rgba(20, 184, 166, 0.15)',
        'teal-glow-lg': '0 30px 60px rgba(20, 184, 166, 0.20)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
