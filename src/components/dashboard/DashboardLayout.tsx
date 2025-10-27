'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CelebrationToast } from '@/components/gamification/CelebrationToast'

export interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/applications', label: 'Applications', icon: '📝' },
    { href: '/dashboard/interviews', label: 'Interviews', icon: '🎤' },
    { href: '/dashboard/documents', label: 'Documents', icon: '📄' },
    { href: '/dashboard/goals', label: 'Goals', icon: '🎯' },
    { href: '/dashboard/help', label: 'Help', icon: '❓' },
  ]

  return (
    <>
      <CelebrationToast />
      <div className="min-h-screen bg-black flex">
        {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white/5 border-r border-white/10 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <h1 className={`text-xl font-semibold text-teal-gradient ${!isSidebarOpen && 'text-center'}`}>
            {isSidebarOpen ? 'IG Career Hub' : 'IG'}
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive
                    ? 'bg-[#0D9488]/20 text-white border-l-4 border-[#0D9488]'
                    : 'text-white/70 hover:bg-white/5 hover:text-white/90 border-l-4 border-transparent'
                  }
                  ${!isSidebarOpen && 'justify-center'}
                `}
              >
                <span className="text-xl">{item.icon}</span>
                {isSidebarOpen && <span className="font-normal">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Toggle Sidebar */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full p-3 text-white/50 hover:text-white/90 hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`mx-auto transition-transform ${!isSidebarOpen && 'rotate-180'}`}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white/5 border-b border-white/10 px-8 flex items-center">
          <div>
            <h2 className="text-lg font-semibold text-white/90">Welcome back!</h2>
            <p className="text-sm text-white/50">Track your job search progress</p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
    </>
  )
}

DashboardLayout.displayName = 'DashboardLayout'
