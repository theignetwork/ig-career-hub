import React from 'react'

export const QuickActionsWidget: React.FC = () => {
  const actions = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        </svg>
      ),
      label: 'Practice Interview',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      ),
      label: 'Generate Questions',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
      label: 'Write Cover Letter',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
      label: 'Scan Resume',
    },
  ]

  return (
    <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl p-4">
      {/* Header */}
      <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
        <span>⚡</span>
        QUICK ACTIONS
      </h3>

      {/* Action Buttons */}
      <div className="space-y-2">
        {actions.map((action, index) => (
          <button
            key={index}
            className="w-full bg-[#0A0E1A] border border-[#1E293B] rounded-lg p-3 flex items-center gap-3 text-left hover:border-[#0D9488] hover:bg-[#0D9488]/20 transition-all duration-200"
          >
            <div className="text-[#0D9488] flex-shrink-0">{action.icon}</div>
            <span className="text-sm text-white font-normal">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

QuickActionsWidget.displayName = 'QuickActionsWidget'
