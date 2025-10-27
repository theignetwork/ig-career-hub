'use client'

import React, { useState } from 'react'

export const HelpContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('quickstart')

  const sections = [
    { id: 'quickstart', label: 'Quick Start', icon: '🚀' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'applications', label: 'Applications', icon: '📝' },
    { id: 'smartcontext', label: 'Smart Context', icon: '✨' },
    { id: 'toolkit', label: 'Toolkit', icon: '🛠️' },
    { id: 'tips', label: 'Pro Tips', icon: '💡' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Help Center</h1>
        <p className="text-gray-400">
          Everything you need to know to master IG Career Hub
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3">
          <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl p-4 sticky top-8">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Topics
            </h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left ${
                    activeSection === section.id
                      ? 'bg-[#0D9488] text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="col-span-9">
          <div className="bg-[#0A0E1A] border-2 border-[#1E293B] rounded-2xl p-8">
            {activeSection === 'quickstart' && <QuickStartSection />}
            {activeSection === 'dashboard' && <DashboardSection />}
            {activeSection === 'applications' && <ApplicationsSection />}
            {activeSection === 'smartcontext' && <SmartContextSection />}
            {activeSection === 'toolkit' && <ToolkitSection />}
            {activeSection === 'tips' && <TipsSection />}
          </div>
        </div>
      </div>
    </div>
  )
}

const QuickStartSection = () => (
  <div>
    <h2 className="text-2xl font-bold text-white mb-4">🚀 Quick Start Guide</h2>
    <p className="text-gray-300 mb-6">Get up and running in 3 easy steps:</p>

    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-lg p-5">
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-[#0D9488] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            1
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Add Applications</h3>
            <p className="text-gray-400 mb-2">
              Click <strong className="text-white">Applications</strong> in sidebar → <strong className="text-white">Add Application</strong>
            </p>
            <ul className="text-sm text-gray-400 space-y-1 ml-4 list-disc">
              <li><strong className="text-white">Quick Add:</strong> Paste job description (AI extracts details)</li>
              <li><strong className="text-white">Manual Entry:</strong> Fill in fields yourself</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-5">
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-[#0D9488] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            2
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Track Progress</h3>
            <p className="text-gray-400 mb-2">
              <strong className="text-white">Drag tiles</strong> in Kanban View to update status
            </p>
            <p className="text-sm text-gray-400">
              Applied → Phone Screen → Interview → Offer
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-5">
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-[#0D9488] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            3
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Use Smart Context</h3>
            <p className="text-gray-400">
              Click any application → <strong className="text-white">Launch with Smart Context</strong> → Tool opens with job details pre-filled!
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-[#0D9488]/20 to-teal-500/20 border-2 border-[#0D9488]/50 rounded-lg p-5 mt-6">
      <div className="flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div>
          <h4 className="text-white font-semibold mb-1">Pro Tip</h4>
          <p className="text-gray-300 text-sm">
            Add applications immediately after applying - helps you stay organized and prepared when they reach out!
          </p>
        </div>
      </div>
    </div>
  </div>
)

const DashboardSection = () => (
  <div className="space-y-5">
    <h2 className="text-2xl font-bold text-white mb-2">📊 Your Dashboard</h2>
    <p className="text-gray-300">Mission control for your job search</p>

    <div>
      <h3 className="text-xl font-semibold text-white mb-2">Journey Overview</h3>
      <p className="text-gray-400">
        Quick stats: <strong className="text-white">Total Applications</strong>, <strong className="text-white">Active</strong> (in progress), <strong className="text-white">Interviews</strong> scheduled, and <strong className="text-white">Offers</strong> received.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-white mb-2">Smart Suggestions (Big Tile)</h3>
      <p className="text-gray-400 mb-3">
        The highlighted tile shows what to focus on <strong className="text-white">right now</strong>:
      </p>
      <ul className="text-sm text-gray-400 space-y-2 ml-4 list-disc">
        <li><strong className="text-blue-300">Interview Prep</strong> (Blue) - You have upcoming interviews!</li>
        <li><strong className="text-purple-300">Just Applied</strong> (Purple) - Optimize your materials</li>
        <li><strong className="text-teal-300">Supercharge</strong> (Teal) - General boost suggestions</li>
      </ul>
      <p className="text-sm text-[#0D9488] mt-2">Click the tool buttons to launch with Smart Context!</p>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-white mb-2">Three Widgets</h3>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <h4 className="text-white font-semibold text-sm mb-1">Priority</h4>
          <p className="text-xs text-gray-400">Next interview or follow-ups needed</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <h4 className="text-white font-semibold text-sm mb-1">This Week</h4>
          <p className="text-xs text-gray-400">All interviews in next 7 days</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <h4 className="text-white font-semibold text-sm mb-1">Quick Actions</h4>
          <p className="text-xs text-gray-400">Common shortcuts</p>
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-white mb-2">Application Pipeline</h3>
      <p className="text-gray-400">
        Recent applications shown as cards. Click to view details, hover for edit button.
      </p>
    </div>
  </div>
)

const ApplicationsSection = () => (
  <div className="space-y-5">
    <h2 className="text-2xl font-bold text-white mb-2">📝 Managing Applications</h2>

    <div>
      <h3 className="text-xl font-semibold text-white mb-3">Two Views</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">📋 Kanban View</h4>
          <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
            <li>Drag-and-drop to update status</li>
            <li>Visual pipeline by column</li>
            <li>Perfect for quick updates</li>
          </ul>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">📊 Table View</h4>
          <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
            <li>Spreadsheet format</li>
            <li>Sort and filter options</li>
            <li>See all details at once</li>
          </ul>
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-white mb-2">Status Flow</h3>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-3 py-1 bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded text-sm">Applied</span>
        <span className="text-gray-500">→</span>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-sm">Phone Screen</span>
        <span className="text-gray-500">→</span>
        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded text-sm">Interview</span>
        <span className="text-gray-500">→</span>
        <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded text-sm">Offer</span>
      </div>
      <p className="text-sm text-gray-400 mt-3">
        Can also mark as <strong className="text-red-400">Rejected</strong> or <strong className="text-gray-400">Withdrawn</strong> anytime.
      </p>
    </div>
  </div>
)

const SmartContextSection = () => (
  <div className="space-y-5">
    <h2 className="text-2xl font-bold text-white mb-2">✨ Smart Context</h2>
    <p className="text-gray-300">The killer feature that saves you tons of time!</p>

    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
      <h3 className="text-white font-semibold mb-3">How It Works:</h3>
      <ol className="space-y-2 list-decimal list-inside text-gray-400">
        <li>Add application with job details (description, company, position)</li>
        <li>Click the application tile</li>
        <li>See "Smart Tools" section at top</li>
        <li>Click any tool - opens with everything pre-filled!</li>
      </ol>
    </div>

    <div>
      <h3 className="text-xl font-semibold text-white mb-3">Compatible Tools</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🎤</span>
            <h4 className="text-white font-semibold text-sm">Interview Coach</h4>
          </div>
          <p className="text-xs text-gray-400">Practice with job context</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🔮</span>
            <h4 className="text-white font-semibold text-sm">Oracle Pro</h4>
          </div>
          <p className="text-xs text-gray-400">Predict questions</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">✍️</span>
            <h4 className="text-white font-semibold text-sm">Cover Letter</h4>
          </div>
          <p className="text-xs text-gray-400">Generate tailored letters</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📄</span>
            <h4 className="text-white font-semibold text-sm">Resume Analyzer</h4>
          </div>
          <p className="text-xs text-gray-400">Role-specific feedback</p>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50 rounded-lg p-5">
      <h4 className="text-white font-semibold mb-2">⚡ Time Saved</h4>
      <p className="text-gray-300 text-sm mb-2">
        <strong>Without:</strong> Copy job description → Open tool → Paste → Fill company/position → Start (5+ min)
      </p>
      <p className="text-gray-300 text-sm">
        <strong>With:</strong> Click button → Everything ready → Start (5 seconds)
      </p>
      <p className="text-[#0D9488] text-sm font-semibold mt-2">
        = 20+ minutes saved per application!
      </p>
    </div>
  </div>
)

const ToolkitSection = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-white mb-2">🛠️ Your Toolkit</h2>
    <p className="text-gray-300 mb-4">All Interview Guys PRO tools, one click away</p>

    <div className="space-y-3">
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex gap-3">
          <span className="text-2xl">🎤</span>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">IG Interview Coach</h3>
            <p className="text-sm text-gray-400">AI-powered practice with real-time feedback. Voice or text responses.</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex gap-3">
          <span className="text-2xl">🔮</span>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Interview Oracle PRO</h3>
            <p className="text-sm text-gray-400">Predict questions and prep SOAR answers. Save sessions for review.</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex gap-3">
          <span className="text-2xl">✍️</span>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Cover Letter Generator PRO</h3>
            <p className="text-sm text-gray-400">Generate professional cover letters in seconds. Customize tone.</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex gap-3">
          <span className="text-2xl">📄</span>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Resume Analyzer PRO</h3>
            <p className="text-sm text-gray-400">Upload resume for AI feedback. Best with Smart Context.</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex gap-3">
          <span className="text-2xl">📚</span>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Interview Master Guide</h3>
            <p className="text-sm text-gray-400">Complete guide covering prep to negotiation. PDF download.</p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex gap-3">
          <span className="text-2xl">🔍</span>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Hidden Job Boards</h3>
            <p className="text-sm text-gray-400">Find industry-specific boards with less competition.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const TipsSection = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-white mb-2">💡 Jeff & Mike's Pro Tips</h2>
    <p className="text-gray-300 mb-4">15+ years of career coaching distilled</p>

    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-lg p-5">
      <h3 className="text-lg font-semibold text-white mb-3">Application Strategy</h3>
      <ul className="space-y-2 text-gray-300">
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span className="text-sm"><strong>Quality over quantity</strong> - 5 tailored apps beat 50 generic ones</span>
        </li>
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span className="text-sm"><strong>Apply within 48 hours</strong> of posting for 10x more attention</span>
        </li>
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span className="text-sm"><strong>Follow up after 1-2 weeks</strong> - check Priority widget for reminders</span>
        </li>
      </ul>
    </div>

    <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/50 rounded-lg p-5">
      <h3 className="text-lg font-semibold text-white mb-3">Interview Prep</h3>
      <ul className="space-y-2 text-gray-300">
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span className="text-sm"><strong>Start 3 days before</strong> - use Coach and Oracle Pro immediately</span>
        </li>
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span className="text-sm"><strong>Practice out loud</strong> - use voice mode in Interview Coach</span>
        </li>
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span className="text-sm"><strong>Prep 3 SOAR stories</strong> - Situation, Obstacle, Action, Result</span>
        </li>
      </ul>
    </div>

    <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border-2 border-green-500/50 rounded-lg p-5">
      <h3 className="text-lg font-semibold text-white mb-3">Time Management</h3>
      <ul className="space-y-2 text-gray-300">
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span className="text-sm"><strong>Batch applications</strong> - 2-3 hours, add 5-10 apps with Smart Context</span>
        </li>
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span className="text-sm"><strong>Check dashboard daily</strong> - 5 min reviewing Smart Suggestions</span>
        </li>
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span className="text-sm"><strong>Update status immediately</strong> - keeps everything accurate</span>
        </li>
      </ul>
    </div>
  </div>
)

HelpContent.displayName = 'HelpContent'
