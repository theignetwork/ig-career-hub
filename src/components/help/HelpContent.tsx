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
    <p className="text-gray-300 mb-6">
      Welcome to IG Career Hub! This guide will walk you through the three essential steps to get started.
      Don't worry if you're not tech-savvy - we'll explain everything clearly.
    </p>

    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-[#0D9488] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            1
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Add Your First Application</h3>

            <div className="space-y-3">
              <p className="text-gray-300">
                First, let's add a job application you've submitted (or are about to submit). This helps you keep track of everything in one place.
              </p>

              <div className="bg-black/30 rounded p-3 text-sm text-gray-300">
                <strong className="text-white">How to do it:</strong>
                <ol className="mt-2 space-y-1 ml-4 list-decimal">
                  <li>Look at the left sidebar (the menu on the left side of your screen)</li>
                  <li>Click on <strong className="text-[#0D9488]">Applications</strong> (it has a 📝 icon)</li>
                  <li>You'll see a button that says <strong className="text-[#0D9488]">"Add Application"</strong> - click it</li>
                  <li>A window will pop up with two options...</li>
                </ol>
              </div>

              <div className="ml-6 space-y-3">
                <div>
                  <h4 className="text-white font-semibold mb-1">Option A: Quick Add (Recommended for beginners)</h4>
                  <p className="text-sm text-gray-400 mb-2">
                    This is the easiest way! Our AI will read the job posting and automatically fill in all the details for you.
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1 ml-4 list-disc">
                    <li>Go to the job posting website (like LinkedIn, Indeed, etc.)</li>
                    <li>Select ALL the text in the job description (click and drag, or press Ctrl+A on Windows / Cmd+A on Mac)</li>
                    <li>Copy it (press Ctrl+C on Windows / Cmd+C on Mac)</li>
                    <li>Come back here and paste it into the big text box (press Ctrl+V on Windows / Cmd+V on Mac)</li>
                    <li>Click "Generate" and watch the magic happen! The AI will fill in the company name, position, requirements, and more</li>
                    <li>Review the information, make any corrections, and click "Save"</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-1">Option B: Manual Entry</h4>
                  <p className="text-sm text-gray-400 mb-2">
                    Prefer to type it in yourself? No problem! Just fill in the form fields one by one:
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1 ml-4 list-disc">
                    <li><strong className="text-white">Company Name:</strong> Where you're applying (e.g., "Google", "Local Hospital")</li>
                    <li><strong className="text-white">Position:</strong> The job title (e.g., "Software Engineer", "Nurse Practitioner")</li>
                    <li><strong className="text-white">Job Description:</strong> Copy and paste the full job posting here</li>
                    <li><strong className="text-white">Status:</strong> Usually start with "Applied" if you've already submitted your application</li>
                    <li><strong className="text-white">URL:</strong> The web address of the job posting (optional but helpful)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 mt-3">
                <p className="text-sm text-blue-300">
                  <strong>💡 Why this matters:</strong> Having all your applications in one place means you won't forget to follow up,
                  you'll be prepared when they call, and you can see your progress at a glance!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-[#0D9488] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            2
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Track Your Progress</h3>

            <div className="space-y-3">
              <p className="text-gray-300">
                As you move through the interview process, you'll want to update each application's status.
                We make this super easy with our drag-and-drop Kanban board (it's like digital sticky notes!).
              </p>

              <div className="bg-black/30 rounded p-3 text-sm text-gray-300">
                <strong className="text-white">How to update status:</strong>
                <ol className="mt-2 space-y-1 ml-4 list-decimal">
                  <li>Go to the <strong className="text-[#0D9488]">Applications</strong> page (click it in the left sidebar)</li>
                  <li>Make sure you're in <strong className="text-white">"Kanban View"</strong> (there's a toggle at the top)</li>
                  <li>You'll see columns: Applied, Phone Screen, Interview, Offer</li>
                  <li>Find your application card (it shows the company name and position)</li>
                  <li>Click and hold on the card, then drag it to the new column</li>
                  <li>Release your mouse/finger and it's updated!</li>
                </ol>
              </div>

              <div className="ml-6 space-y-2">
                <h4 className="text-white font-semibold">Understanding the Stages:</h4>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li className="flex gap-2">
                    <span className="px-2 py-0.5 bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded text-xs flex-shrink-0">Applied</span>
                    <span>You've submitted your application and are waiting to hear back</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-xs flex-shrink-0">Phone Screen</span>
                    <span>You've been contacted for an initial phone conversation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded text-xs flex-shrink-0">Interview</span>
                    <span>You're scheduled for (or have completed) a formal interview</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-300 border border-green-500/30 rounded text-xs flex-shrink-0">Offer</span>
                    <span>Congratulations! You received a job offer</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded p-3 mt-3">
                <p className="text-sm text-purple-300">
                  <strong>📊 Prefer a spreadsheet view?</strong> Click the "Table View" toggle to see all your applications
                  in a traditional table format. You can sort by company, date, status, and more!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-[#0D9488] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            3
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Use Smart Context - The Game Changer!</h3>

            <div className="space-y-3">
              <p className="text-gray-300">
                This is where IG Career Hub really shines! Instead of copying and pasting job details every time you use a tool,
                Smart Context automatically fills everything in for you. It's like having a personal assistant!
              </p>

              <div className="bg-black/30 rounded p-3 text-sm text-gray-300">
                <strong className="text-white">How to use Smart Context:</strong>
                <ol className="mt-2 space-y-2 ml-4 list-decimal">
                  <li>
                    <strong className="text-white">Click on any application</strong>
                    <p className="text-xs mt-1">From your Dashboard or Applications page, click on any application card. A detail window will open.</p>
                  </li>
                  <li>
                    <strong className="text-white">Look for "Smart Tools" section</strong>
                    <p className="text-xs mt-1">At the top of the detail window, you'll see colorful buttons for different tools like "Interview Coach", "Cover Letter Generator", etc.</p>
                  </li>
                  <li>
                    <strong className="text-white">Click any tool button</strong>
                    <p className="text-xs mt-1">The tool will open in a new window with the job description, company name, position, and all other details already filled in!</p>
                  </li>
                  <li>
                    <strong className="text-white">Start working immediately</strong>
                    <p className="text-xs mt-1">No copy-pasting required! Just start using the tool right away.</p>
                  </li>
                </ol>
              </div>

              <div className="ml-6 space-y-2">
                <h4 className="text-white font-semibold">What Tools Work with Smart Context?</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>🎤 <strong className="text-white">Interview Coach</strong> - Practice answers tailored to this specific job</li>
                  <li>🔮 <strong className="text-white">Interview Oracle PRO</strong> - Get predicted questions for this exact role</li>
                  <li>✍️ <strong className="text-white">Cover Letter Generator</strong> - Create a personalized cover letter instantly</li>
                  <li>📄 <strong className="text-white">Resume Analyzer</strong> - Get feedback on how your resume matches this job</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50 rounded-lg p-4 mt-3">
                <h4 className="text-white font-semibold mb-2">⏱️ Time Savings Example:</h4>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-300">
                    <strong className="text-red-300">❌ Without Smart Context:</strong>
                    <ol className="ml-6 mt-1 list-decimal space-y-1 text-gray-400">
                      <li>Open job posting in browser</li>
                      <li>Select and copy job description (30 seconds)</li>
                      <li>Open the tool (15 seconds)</li>
                      <li>Paste job description (10 seconds)</li>
                      <li>Type company name (15 seconds)</li>
                      <li>Type position title (15 seconds)</li>
                      <li>Finally start using the tool</li>
                    </ol>
                    <p className="mt-2 text-red-300"><strong>Total: 5-7 minutes of setup</strong></p>
                  </div>

                  <div className="text-gray-300">
                    <strong className="text-green-300">✅ With Smart Context:</strong>
                    <ol className="ml-6 mt-1 list-decimal space-y-1 text-gray-400">
                      <li>Click application card</li>
                      <li>Click tool button</li>
                      <li>Start using the tool immediately</li>
                    </ol>
                    <p className="mt-2 text-green-300"><strong>Total: 5 seconds!</strong></p>
                  </div>
                </div>
                <p className="text-[#0D9488] font-semibold mt-3">
                  💡 That's 20-30 minutes saved per application when you use multiple tools!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-[#0D9488]/20 to-teal-500/20 border-2 border-[#0D9488]/50 rounded-lg p-6 mt-6">
      <div className="flex items-start gap-3">
        <span className="text-3xl">🎯</span>
        <div>
          <h4 className="text-white font-semibold mb-2">You're All Set!</h4>
          <p className="text-gray-300 text-sm mb-3">
            You now know the three core features that make IG Career Hub so powerful. As you get comfortable with these basics,
            explore the other sections of this Help Center to learn about the Dashboard, individual tools, and pro tips from Jeff & Mike!
          </p>
          <p className="text-gray-300 text-sm">
            <strong className="text-[#0D9488]">Pro Tip:</strong> Add applications right after you submit them. This way, you'll be organized
            and ready when companies reach out. Plus, all your job details will be saved for Smart Context!
          </p>
        </div>
      </div>
    </div>
  </div>
)

const DashboardSection = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">📊 Understanding Your Dashboard</h2>
      <p className="text-gray-300 mb-4">
        Your Dashboard is like mission control for your job search. When you first log in, this is what you'll see.
        Let's walk through each section so you know exactly what everything does!
      </p>
      <p className="text-sm text-gray-400 italic">
        💡 To access your Dashboard at any time, click "Dashboard" (📊 icon) in the left sidebar.
      </p>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
      <h3 className="text-xl font-semibold text-white mb-3">📈 Journey Overview (Top Section)</h3>
      <p className="text-gray-300 mb-3">
        This is the first thing you'll see - four big numbers that give you a snapshot of your job search at a glance.
      </p>

      <div className="space-y-3 ml-4">
        <div>
          <h4 className="text-white font-semibold text-sm mb-1">📊 Total Applications</h4>
          <p className="text-sm text-gray-400">
            Every job you've added to the system, no matter what stage it's in. This includes active applications,
            rejected ones, withdrawn ones - everything. It shows your overall effort and activity!
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-1">🎯 Active</h4>
          <p className="text-sm text-gray-400">
            Applications that are currently "in play" - meaning Applied, Phone Screen, or Interview status.
            Once you get an Offer or marked as Rejected/Withdrawn, they're no longer "Active". This number tells
            you how many irons you have in the fire right now.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-1">🎤 Interviews</h4>
          <p className="text-sm text-gray-400">
            How many applications are currently in the Interview stage (scheduled or completed interviews).
            This is a great milestone - it means companies are seriously interested in you!
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-1">🎉 Offers</h4>
          <p className="text-sm text-gray-400">
            The golden number! This shows how many job offers you've received. When you get an offer, celebrate -
            you're almost there! (And yes, it's totally normal to have multiple offers to choose from!)
          </p>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 mt-4">
        <p className="text-sm text-blue-300">
          <strong>💡 Tip:</strong> Check these numbers daily to stay motivated! Seeing your total applications grow
          reminds you of your progress, and watching Active applications increase shows momentum.
        </p>
      </div>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
      <h3 className="text-xl font-semibold text-white mb-3">✨ Smart Suggestions Widget (The Big Colorful Tile)</h3>
      <p className="text-gray-300 mb-3">
        This is your AI-powered personal assistant! It looks at all your applications and tells you the most important
        thing to focus on RIGHT NOW. The widget changes based on what's happening in your job search.
      </p>

      <div className="space-y-4 ml-4">
        <div>
          <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-xs">BLUE</span>
            Interview Prep Mode
          </h4>
          <p className="text-sm text-gray-400 mb-2">
            <strong className="text-white">When you'll see this:</strong> You have one or more upcoming interviews scheduled!
          </p>
          <p className="text-sm text-gray-400 mb-2">
            <strong className="text-white">What it means:</strong> Time to prepare! This is the most urgent priority because
            you have a specific deadline (your interview date).
          </p>
          <p className="text-sm text-gray-400 mb-2">
            <strong className="text-white">What to do:</strong> Click the tool buttons right on the widget:
          </p>
          <ul className="text-xs text-gray-400 space-y-1 ml-6 list-disc">
            <li><strong>Interview Coach</strong> - Practice answering questions out loud</li>
            <li><strong>Oracle Pro</strong> - See predicted questions and prepare SOAR stories</li>
            <li><strong>Interview Guide</strong> - Read tips on body language, follow-up questions, etc.</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded text-xs">PURPLE</span>
            Just Applied Mode
          </h4>
          <p className="text-sm text-gray-400 mb-2">
            <strong className="text-white">When you'll see this:</strong> You recently added applications but don't have interviews yet.
          </p>
          <p className="text-sm text-gray-400 mb-2">
            <strong className="text-white">What it means:</strong> Now's the time to polish your materials and improve your chances
            of getting called for an interview!
          </p>
          <p className="text-sm text-gray-400 mb-2">
            <strong className="text-white">What to do:</strong> Use the suggested tools to strengthen your application:
          </p>
          <ul className="text-xs text-gray-400 space-y-1 ml-6 list-disc">
            <li><strong>Resume Analyzer</strong> - Make sure your resume is optimized for each role</li>
            <li><strong>Cover Letter Generator</strong> - Create compelling, tailored cover letters</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded text-xs">TEAL</span>
            Supercharge Mode
          </h4>
          <p className="text-sm text-gray-400 mb-2">
            <strong className="text-white">When you'll see this:</strong> You don't have applications yet, or you're looking to level up your job search.
          </p>
          <p className="text-sm text-gray-400 mb-2">
            <strong className="text-white">What it means:</strong> Time to boost your overall job search strategy and find more opportunities!
          </p>
          <p className="text-sm text-gray-400 mb-2">
            <strong className="text-white">What to do:</strong> Explore tools to expand your search:
          </p>
          <ul className="text-xs text-gray-400 space-y-1 ml-6 list-disc">
            <li><strong>Hidden Job Boards</strong> - Find industry-specific boards with less competition</li>
            <li><strong>Resume Analyzer</strong> - General resume improvement</li>
          </ul>
        </div>
      </div>

      <div className="bg-purple-500/10 border border-purple-500/30 rounded p-3 mt-4">
        <p className="text-sm text-purple-300">
          <strong>✨ The Magic Part:</strong> All the tool buttons on this widget use Smart Context! That means if it's
          suggesting tools for a specific application (like interview prep), clicking the button will automatically open
          the tool with that job's details pre-filled. No copy-pasting!
        </p>
      </div>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
      <h3 className="text-xl font-semibold text-white mb-3">📋 Three Quick Info Widgets</h3>
      <p className="text-gray-300 mb-3">
        Below the Smart Suggestions widget, you'll see three smaller boxes that give you quick access to important information.
      </p>

      <div className="space-y-3">
        <div className="bg-black/30 rounded p-3">
          <h4 className="text-white font-semibold text-sm mb-1">🔔 Priority Widget (Left)</h4>
          <p className="text-sm text-gray-400 mb-2">
            <strong className="text-white">What it shows:</strong> Your next upcoming interview OR applications that need follow-up.
          </p>
          <p className="text-sm text-gray-400 mb-2">
            <strong className="text-white">How it helps:</strong> Keeps you from missing important deadlines! If you applied somewhere
            2 weeks ago and haven't heard back, this widget will remind you to send a follow-up email.
          </p>
          <p className="text-xs text-gray-400">
            Example: "Google - Software Engineer | Interview in 3 days" or "Microsoft - Follow up needed (14 days ago)"
          </p>
        </div>

        <div className="bg-black/30 rounded p-3">
          <h4 className="text-white font-semibold text-sm mb-1">📅 This Week Widget (Middle)</h4>
          <p className="text-sm text-gray-400 mb-2">
            <strong className="text-white">What it shows:</strong> All interviews scheduled for the next 7 days.
          </p>
          <p className="text-sm text-gray-400 mb-2">
            <strong className="text-white">How it helps:</strong> Gives you a bird's-eye view of your week so you can plan your prep time.
            If you see multiple interviews coming up, you know it's going to be a busy week!
          </p>
          <p className="text-xs text-gray-400">
            Example: Shows 3 interviews with dates, so you can prioritize which ones to prep for first.
          </p>
        </div>

        <div className="bg-black/30 rounded p-3">
          <h4 className="text-white font-semibold text-sm mb-1">⚡ Quick Actions Widget (Right)</h4>
          <p className="text-sm text-gray-400 mb-2">
            <strong className="text-white">What it shows:</strong> One-click shortcuts to common tasks.
          </p>
          <p className="text-sm text-gray-400 mb-2">
            <strong className="text-white">How it helps:</strong> Instead of navigating through menus, just click a button here to quickly:
          </p>
          <ul className="text-xs text-gray-400 space-y-1 ml-6 list-disc">
            <li>Add a new application</li>
            <li>Open your full applications list</li>
            <li>Launch commonly used tools</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
      <h3 className="text-xl font-semibold text-white mb-3">🗂️ Application Pipeline (Bottom Section)</h3>
      <p className="text-gray-300 mb-3">
        This section shows your recent applications as visual cards. It's like a quick preview of what's in your full Applications page.
      </p>

      <div className="space-y-3 ml-4">
        <div>
          <h4 className="text-white font-semibold text-sm mb-1">What You'll See:</h4>
          <p className="text-sm text-gray-400 mb-2">
            Each card shows:
          </p>
          <ul className="text-xs text-gray-400 space-y-1 ml-6 list-disc">
            <li><strong className="text-white">Company name</strong> (e.g., "Google")</li>
            <li><strong className="text-white">Position</strong> (e.g., "Senior Developer")</li>
            <li><strong className="text-white">Current status</strong> (Applied, Phone Screen, Interview, Offer) with color coding</li>
            <li><strong className="text-white">How long ago</strong> you applied (e.g., "2 days ago", "1wk ago")</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-1">What You Can Do:</h4>
          <ul className="text-xs text-gray-400 space-y-1 ml-6 list-disc">
            <li><strong className="text-white">Click any card</strong> to open full details and access Smart Context tools</li>
            <li><strong className="text-white">Hover over a card</strong> to see an "Edit" button appear (pencil icon)</li>
            <li><strong className="text-white">Click the edit button</strong> to quickly update information</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-1">Color Meanings:</h4>
          <ul className="text-xs text-gray-400 space-y-1 ml-6">
            <li><span className="text-gray-300">Gray</span> = Applied (waiting)</li>
            <li><span className="text-blue-300">Blue</span> = Phone Screen or Interview (in progress)</li>
            <li><span className="text-green-300">Green (with glow!)</span> = Offer (celebrate! 🎉)</li>
            <li><span className="text-red-300">Red</span> = Rejected (learn and move forward)</li>
          </ul>
        </div>
      </div>

      <div className="bg-teal-500/10 border border-teal-500/30 rounded p-3 mt-4">
        <p className="text-sm text-teal-300">
          <strong>🔗 Want to see everything?</strong> Click "Applications" in the left sidebar to see your full list
          with Kanban and Table views, filters, sorting, and more options!
        </p>
      </div>
    </div>

    <div className="bg-gradient-to-r from-[#0D9488]/20 to-teal-500/20 border-2 border-[#0D9488]/50 rounded-lg p-5">
      <h4 className="text-white font-semibold mb-2">💡 Pro Dashboard Tips</h4>
      <ul className="space-y-2 text-sm text-gray-300">
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span><strong>Check daily:</strong> Spend 2-3 minutes each morning reviewing your Dashboard. It keeps you focused on priorities.</span>
        </li>
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span><strong>Follow the Smart Suggestions:</strong> The AI knows what's urgent. If it says prep for interviews, do that first!</span>
        </li>
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span><strong>Watch your Active number:</strong> If it's dropping, time to submit more applications. Keep that momentum!</span>
        </li>
      </ul>
    </div>
  </div>
)

const ApplicationsSection = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">📝 Managing Your Applications</h2>
      <p className="text-gray-300 mb-4">
        The Applications page is where you'll spend most of your time managing your job search. Think of it like your
        personal job application organizer - everything you need in one place!
      </p>
      <p className="text-sm text-gray-400 italic">
        💡 Access it anytime by clicking "Applications" (📝 icon) in the left sidebar.
      </p>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
      <h3 className="text-xl font-semibold text-white mb-3">🔄 Two Ways to View Your Applications</h3>
      <p className="text-gray-300 mb-4">
        We offer two different views so you can work however feels most natural to you. Use the toggle buttons
        at the top of the Applications page to switch between them.
      </p>

      <div className="space-y-4">
        <div className="bg-black/30 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            📋 Kanban View (Board View)
          </h4>
          <p className="text-sm text-gray-400 mb-3">
            This is the visual, drag-and-drop view. Imagine a physical board with sticky notes organized in columns -
            that's exactly what this is, but digital!
          </p>

          <div className="space-y-3 ml-4">
            <div>
              <h5 className="text-white font-semibold text-sm mb-1">What You'll See:</h5>
              <p className="text-xs text-gray-400 mb-2">
                Four columns labeled: Applied | Phone Screen | Interview | Offer
              </p>
              <p className="text-xs text-gray-400">
                Each application appears as a card in the column matching its current status. Cards show company name,
                position, and date applied.
              </p>
            </div>

            <div>
              <h5 className="text-white font-semibold text-sm mb-1">How to Use It:</h5>
              <ul className="text-xs text-gray-400 space-y-2">
                <li className="flex gap-2">
                  <span className="text-[#0D9488] font-bold">1.</span>
                  <span><strong className="text-white">To update status:</strong> Click and hold any card, drag it to the new column, and release. That's it!</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#0D9488] font-bold">2.</span>
                  <span><strong className="text-white">To view details:</strong> Click on any card to open a detailed view with all information and Smart Context tools.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#0D9488] font-bold">3.</span>
                  <span><strong className="text-white">To edit:</strong> Hover over a card to see the edit button (pencil icon) appear, then click it.</span>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-semibold text-sm mb-1">Best For:</h5>
              <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
                <li>Quick status updates (just drag and drop!)</li>
                <li>Visual people who like to "see" their progress</li>
                <li>Getting a quick overview of where everything stands</li>
                <li>Moving multiple applications at once during batch updates</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 mt-3">
            <p className="text-xs text-blue-300">
              <strong>💡 Pro Tip:</strong> Kanban view is perfect for your daily check-ins. Spend 2 minutes each morning
              dragging cards to update their status!
            </p>
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
            📊 Table View (List View)
          </h4>
          <p className="text-sm text-gray-400 mb-3">
            This is the spreadsheet-style view. If you're comfortable with Excel or Google Sheets, you'll feel right at home here!
          </p>

          <div className="space-y-3 ml-4">
            <div>
              <h5 className="text-white font-semibold text-sm mb-1">What You'll See:</h5>
              <p className="text-xs text-gray-400 mb-2">
                A table with columns for Company, Position, Status, Date Applied, Interview Date, Notes, and Actions.
                All your applications are listed in rows, one per application.
              </p>
            </div>

            <div>
              <h5 className="text-white font-semibold text-sm mb-1">How to Use It:</h5>
              <ul className="text-xs text-gray-400 space-y-2">
                <li className="flex gap-2">
                  <span className="text-[#0D9488] font-bold">1.</span>
                  <span><strong className="text-white">To sort:</strong> Click any column header to sort by that field (click again to reverse order).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#0D9488] font-bold">2.</span>
                  <span><strong className="text-white">To filter:</strong> Use the filter controls at the top to show only specific statuses or date ranges.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#0D9488] font-bold">3.</span>
                  <span><strong className="text-white">To edit:</strong> Click the edit button (pencil icon) on the right side of any row.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#0D9488] font-bold">4.</span>
                  <span><strong className="text-white">To update status:</strong> Click on the status badge and select a new status from the dropdown.</span>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-semibold text-sm mb-1">Best For:</h5>
              <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
                <li>Viewing ALL details at once</li>
                <li>Sorting applications by date, company name, or status</li>
                <li>Finding specific applications quickly</li>
                <li>People who prefer spreadsheet-style organization</li>
                <li>Exporting data or taking notes in bulk</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded p-3 mt-3">
            <p className="text-xs text-purple-300">
              <strong>💡 Pro Tip:</strong> Use Table View to sort by date and identify applications that need follow-up.
              If you applied 2 weeks ago and haven't heard back, time to send that follow-up email!
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
      <h3 className="text-xl font-semibold text-white mb-3">📊 Understanding Application Status Flow</h3>
      <p className="text-gray-300 mb-4">
        Every application moves through stages as you progress through the hiring process. Here's how it works:
      </p>

      <div className="bg-black/30 rounded p-4 mb-4">
        <h4 className="text-white font-semibold text-sm mb-3">The Typical Journey:</h4>
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="px-3 py-1 bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded text-sm">Applied</span>
          <span className="text-gray-500">→</span>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-sm">Phone Screen</span>
          <span className="text-gray-500">→</span>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded text-sm">Interview</span>
          <span className="text-gray-500">→</span>
          <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded text-sm">Offer</span>
        </div>
      </div>

      <div className="space-y-3 ml-4">
        <div>
          <h5 className="text-gray-300 font-semibold text-sm mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded text-xs">Applied</span>
            Waiting to Hear Back
          </h5>
          <p className="text-xs text-gray-400">
            You've submitted your application and you're waiting for the company to respond. This is the starting point for
            every application. Keep checking your email and the Priority widget for follow-up reminders!
          </p>
        </div>

        <div>
          <h5 className="text-blue-300 font-semibold text-sm mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-xs">Phone Screen</span>
            Initial Conversation
          </h5>
          <p className="text-xs text-gray-400">
            Great news! The company reached out for an initial phone conversation. This is usually a 15-30 minute call with
            a recruiter to discuss your background and the role. Move your application here as soon as you schedule this call.
          </p>
        </div>

        <div>
          <h5 className="text-purple-300 font-semibold text-sm mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded text-xs">Interview</span>
            Formal Interview Process
          </h5>
          <p className="text-xs text-gray-400">
            You're scheduled for (or have completed) a formal interview! This could be video, phone, or in-person. This stage
            is critical - use Interview Coach and Oracle Pro to prepare thoroughly. Update to this status as soon as your
            interview is scheduled.
          </p>
        </div>

        <div>
          <h5 className="text-green-300 font-semibold text-sm mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-green-500/20 text-green-300 border border-green-500/30 rounded text-sm">Offer</span>
            Job Offer Received! 🎉
          </h5>
          <p className="text-xs text-gray-400">
            Congratulations! You received a formal job offer. Move applications here once you get that offer letter or verbal
            offer. Now it's time to evaluate, negotiate if needed, and make your decision!
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <h4 className="text-white font-semibold text-sm mb-2">Other Status Options:</h4>
        <div className="space-y-2 ml-4">
          <div className="flex items-start gap-2">
            <span className="px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded text-xs flex-shrink-0 mt-0.5">Rejected</span>
            <p className="text-xs text-gray-400">
              The company decided to go with another candidate. It happens to everyone - don't take it personally!
              Learn from the experience and move forward. You can filter these out in Table View to keep your board clean.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded text-xs flex-shrink-0 mt-0.5">Withdrawn</span>
            <p className="text-xs text-gray-400">
              You decided to withdraw your application (maybe you accepted another offer, or realized the role wasn't a fit).
              This helps keep your stats accurate.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
      <h3 className="text-xl font-semibold text-white mb-3">✏️ Editing and Managing Applications</h3>

      <div className="space-y-3">
        <div>
          <h4 className="text-white font-semibold text-sm mb-2">What Information is Tracked:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-[#0D9488]">✓</span> Company Name
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#0D9488]">✓</span> Position Title
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#0D9488]">✓</span> Job Description
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#0D9488]">✓</span> Date Applied
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#0D9488]">✓</span> Current Status
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#0D9488]">✓</span> Interview Date (if applicable)
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#0D9488]">✓</span> Job Posting URL
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#0D9488]">✓</span> Personal Notes
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-2">Common Actions:</h4>
          <ul className="text-xs text-gray-400 space-y-2 ml-4">
            <li><strong className="text-white">Edit</strong> - Click the pencil icon to update any details</li>
            <li><strong className="text-white">Delete</strong> - Remove an application if you added it by mistake</li>
            <li><strong className="text-white">View Details</strong> - Click any card/row to see full information</li>
            <li><strong className="text-white">Launch Tools</strong> - Open Smart Context tools directly from the detail view</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-[#0D9488]/20 to-teal-500/20 border-2 border-[#0D9488]/50 rounded-lg p-5">
      <h4 className="text-white font-semibold mb-2">💡 Pro Application Management Tips</h4>
      <ul className="space-y-2 text-sm text-gray-300">
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span><strong>Update immediately:</strong> As soon as you hear from a company, update the status. Don't wait!</span>
        </li>
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span><strong>Add notes:</strong> After calls or interviews, jot down quick notes. You'll thank yourself later!</span>
        </li>
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span><strong>Use both views:</strong> Kanban for daily updates, Table for planning and follow-ups.</span>
        </li>
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span><strong>Save the job posting:</strong> Companies often take down job postings. Save the URL and paste the description!</span>
        </li>
      </ul>
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
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">🛠️ Your Complete Toolkit</h2>
      <p className="text-gray-300 mb-4">
        These are your Interview Guys PRO tools - professional-grade resources to help you at every stage of your job search.
        Each tool is designed by career coaches with 15+ years of experience. Best of all, they work with Smart Context!
      </p>
      <p className="text-sm text-gray-400 italic">
        💡 Access all tools from the Dashboard "Your Toolkit" section, or from the "Toolkit" link in the sidebar (coming soon).
      </p>
    </div>

    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-lg p-5">
        <div className="flex gap-4 mb-3">
          <span className="text-3xl">🎤</span>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">IG Interview Coach</h3>
            <p className="text-sm text-gray-300 mb-3">
              Practice interviews with an AI coach that acts like a real interviewer. Get real-time feedback on your answers
              and improve your interview skills in a safe, judgment-free environment.
            </p>
          </div>
        </div>

        <div className="ml-12 space-y-3">
          <div>
            <h4 className="text-white font-semibold text-sm mb-1">How It Works:</h4>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li>The AI asks you interview questions one at a time (just like a real interviewer)</li>
              <li>You answer using voice (speak your answer) or text (type it out)</li>
              <li>The AI listens/reads your answer and gives you instant feedback</li>
              <li>It asks follow-up questions based on your responses (just like real interviews!)</li>
              <li>At the end, you get a summary of your performance and areas to improve</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1">When to Use It:</h4>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li><strong className="text-white">3 days before an interview</strong> - Start practicing to build confidence</li>
              <li><strong className="text-white">Daily practice</strong> - 15-20 minutes per day makes a huge difference</li>
              <li><strong className="text-white">After you get rejected</strong> - Figure out what went wrong and improve</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1">Pro Tips:</h4>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li>Use voice mode! Practicing out loud is 10x more effective than typing</li>
              <li>Record yourself (on your phone) so you can review your body language and tone</li>
              <li>With Smart Context, questions are tailored to your specific job - super valuable!</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 mt-3 ml-12">
          <p className="text-xs text-blue-300">
            <strong>✨ Smart Context Bonus:</strong> When launched from an application, the Coach already knows the job requirements
            and asks role-specific questions. It's like having a practice interview for your actual job!
          </p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-5">
        <div className="flex gap-4 mb-3">
          <span className="text-3xl">🔮</span>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Interview Oracle PRO</h3>
            <p className="text-sm text-gray-300 mb-3">
              Predict the exact questions you'll be asked in your interview! Our AI analyzes the job description and generates
              a list of likely questions, then helps you prepare perfect answers using the SOAR method.
            </p>
          </div>
        </div>

        <div className="ml-12 space-y-3">
          <div>
            <h4 className="text-white font-semibold text-sm mb-1">What You Get:</h4>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li><strong className="text-white">Predicted Questions:</strong> 15-20 questions the interviewer will likely ask</li>
              <li><strong className="text-white">Question Categories:</strong> Behavioral, technical, situational, and company-specific</li>
              <li><strong className="text-white">SOAR Framework Help:</strong> Guided template to structure your answers</li>
              <li><strong className="text-white">Save Sessions:</strong> Come back later to review and practice your prepared answers</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1">SOAR Method Explained:</h4>
            <p className="text-xs text-gray-400 mb-2">
              SOAR is a proven framework for answering behavioral interview questions. It stands for:
            </p>
            <ul className="text-xs text-gray-400 space-y-1 ml-6">
              <li><strong className="text-white">S</strong>ituation - Describe the context (where, when, what was happening)</li>
              <li><strong className="text-white">O</strong>bstacle - What challenge or problem did you face?</li>
              <li><strong className="text-white">A</strong>ction - What specific steps did YOU take to solve it?</li>
              <li><strong className="text-white">R</strong>esult - What was the outcome? Include numbers if possible!</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1">When to Use It:</h4>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li><strong className="text-white">Right after scheduling an interview</strong> - Prepare immediately!</li>
              <li><strong className="text-white">48 hours before interview</strong> - Review your prepared answers</li>
              <li><strong className="text-white">Evening before interview</strong> - Quick refresher on key questions</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1">Pro Tips:</h4>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li>Prepare 3 strong SOAR stories that you can adapt to multiple questions</li>
              <li>Include specific numbers and metrics in your Results (e.g., "increased sales by 25%")</li>
              <li>Save your session and review it the morning of your interview</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-5">
        <div className="flex gap-4 mb-3">
          <span className="text-3xl">✍️</span>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Cover Letter Generator PRO</h3>
            <p className="text-sm text-gray-300 mb-3">
              Generate professional, tailored cover letters in seconds! Our AI writes compelling cover letters that highlight
              your relevant experience and explain why you're perfect for the role.
            </p>
          </div>
        </div>

        <div className="ml-12 space-y-3">
          <div>
            <h4 className="text-white font-semibold text-sm mb-1">What It Does:</h4>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li>Analyzes the job description to understand what the company wants</li>
              <li>Creates a personalized cover letter highlighting your relevant skills</li>
              <li>Uses professional language and proper formatting</li>
              <li>Customizable tone (professional, enthusiastic, creative, etc.)</li>
              <li>Editable output - make any changes you want before sending</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1">How to Get Best Results:</h4>
            <ul className="text-xs text-gray-400 space-y-2 ml-6">
              <li>
                <strong className="text-white">Use Smart Context!</strong> When launched from an application, it already has
                all the details. Just click generate!
              </li>
              <li>
                <strong className="text-white">Add your background:</strong> Include 2-3 sentences about your most relevant experience
              </li>
              <li>
                <strong className="text-white">Choose the right tone:</strong> Tech startups = enthusiastic, Law firms = professional
              </li>
              <li>
                <strong className="text-white">Always customize:</strong> Edit the output to add personal touches and specific examples
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1">When to Use It:</h4>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li><strong className="text-white">Jobs that require cover letters</strong> - Obviously!</li>
              <li><strong className="text-white">Competitive positions</strong> - Stand out from applicants who skip it</li>
              <li><strong className="text-white">Career changes</strong> - Explain why you're transitioning industries/roles</li>
              <li><strong className="text-white">When you're overqualified/underqualified</strong> - Address the elephant in the room</li>
            </ul>
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/30 rounded p-3 mt-3 ml-12">
          <p className="text-xs text-purple-300">
            <strong>⚡ Speed Tip:</strong> With Smart Context, you can generate a customized cover letter in under 30 seconds.
            That's faster than finding your old cover letter and manually updating it!
          </p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-5">
        <div className="flex gap-4 mb-3">
          <span className="text-3xl">📄</span>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Resume Analyzer PRO</h3>
            <p className="text-sm text-gray-300 mb-3">
              Get AI-powered feedback on your resume! Upload your resume and our AI will analyze it for content, formatting,
              keywords, and ATS compatibility. Even better with Smart Context for role-specific feedback!
            </p>
          </div>
        </div>

        <div className="ml-12 space-y-3">
          <div>
            <h4 className="text-white font-semibold text-sm mb-1">What It Analyzes:</h4>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li><strong className="text-white">Content:</strong> Are your bullet points strong and results-focused?</li>
              <li><strong className="text-white">Keywords:</strong> Does your resume include terms from the job description?</li>
              <li><strong className="text-white">Formatting:</strong> Is it clean, readable, and ATS-friendly?</li>
              <li><strong className="text-white">Relevance:</strong> Does your experience match what they're looking for?</li>
              <li><strong className="text-white">Red Flags:</strong> Gaps, typos, or anything that might concern recruiters</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1">Two Ways to Use It:</h4>
            <div className="space-y-2">
              <div className="bg-black/30 rounded p-2">
                <p className="text-xs text-white mb-1">Option 1: General Analysis (No Smart Context)</p>
                <p className="text-xs text-gray-400">
                  Upload your resume for general feedback on content, formatting, and best practices. Good for overall resume improvement.
                </p>
              </div>
              <div className="bg-black/30 rounded p-2">
                <p className="text-xs text-white mb-1">Option 2: Role-Specific Analysis (With Smart Context) ⭐</p>
                <p className="text-xs text-gray-400">
                  Launch from an application to get feedback on how well your resume matches THAT specific job. Shows exactly
                  what's missing and what to emphasize. This is incredibly valuable!
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1">When to Use It:</h4>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li><strong className="text-white">Before applying to a competitive role</strong> - Make sure your resume is optimized</li>
              <li><strong className="text-white">After rejections</strong> - Figure out why you're not getting callbacks</li>
              <li><strong className="text-white">When updating your resume</strong> - Get feedback before finalizing changes</li>
              <li><strong className="text-white">For each major application</strong> - Tailor your resume to match the specific role</li>
            </ul>
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded p-3 mt-3 ml-12">
          <p className="text-xs text-green-300">
            <strong>🎯 Smart Context Power Move:</strong> Use this tool for every important application. Upload your resume,
            get role-specific feedback, update your resume based on the suggestions, then apply. Your callback rate will skyrocket!
          </p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-5">
        <div className="flex gap-4 mb-3">
          <span className="text-3xl">📚</span>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Interview Master Guide</h3>
            <p className="text-sm text-gray-300 mb-3">
              The complete Interview Guys guide covering everything from preparation to salary negotiation. Written by Jeff & Mike,
              this comprehensive resource has helped thousands of people land their dream jobs.
            </p>
          </div>
        </div>

        <div className="ml-12 space-y-3">
          <div>
            <h4 className="text-white font-semibold text-sm mb-1">What's Inside:</h4>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li><strong className="text-white">Interview Preparation:</strong> How to research companies and prepare mentally</li>
              <li><strong className="text-white">Question & Answer Strategies:</strong> How to tackle any interview question</li>
              <li><strong className="text-white">Body Language & Presence:</strong> Non-verbal communication that wins interviews</li>
              <li><strong className="text-white">Common Interview Questions:</strong> 50+ questions with example answers</li>
              <li><strong className="text-white">Follow-Up Best Practices:</strong> What to do after the interview</li>
              <li><strong className="text-white">Salary Negotiation:</strong> How to negotiate your best compensation package</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1">Best For:</h4>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li>First-time job seekers who want to understand the whole interview process</li>
              <li>People who haven't interviewed in years and need a refresher</li>
              <li>Anyone who wants deep knowledge beyond quick tips</li>
              <li>Reading on your commute or before bed (it's downloadable!)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-5">
        <div className="flex gap-4 mb-3">
          <span className="text-3xl">🔍</span>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Hidden Job Boards Tool</h3>
            <p className="text-sm text-gray-300 mb-3">
              Discover industry-specific and niche job boards that most people don't know about. These hidden gems have
              less competition and often higher-quality opportunities than the big job boards.
            </p>
          </div>
        </div>

        <div className="ml-12 space-y-3">
          <div>
            <h4 className="text-white font-semibold text-sm mb-1">Why It Matters:</h4>
            <p className="text-xs text-gray-400 mb-2">
              Everyone applies on LinkedIn and Indeed. That means 500+ applicants per job! Hidden job boards often have
              only 20-50 applicants per posting. Better odds = more interviews.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1">How It Works:</h4>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li>Select your industry (tech, healthcare, finance, education, etc.)</li>
              <li>Get a curated list of niche job boards specific to that industry</li>
              <li>Each board includes a description and direct link</li>
              <li>Many boards focus on remote work, startups, or specific specialties</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1">When to Use It:</h4>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li><strong className="text-white">Starting your job search</strong> - Expand beyond the obvious sites</li>
              <li><strong className="text-white">Not getting traction</strong> - Try less competitive platforms</li>
              <li><strong className="text-white">Looking for niche roles</strong> - Specialized boards have specialized jobs</li>
              <li><strong className="text-white">Remote work hunting</strong> - Many hidden boards focus on remote opportunities</li>
            </ul>
          </div>
        </div>

        <div className="bg-teal-500/10 border border-teal-500/30 rounded p-3 mt-3 ml-12">
          <p className="text-xs text-teal-300">
            <strong>💎 Hidden Gem Tip:</strong> Set up job alerts on 2-3 niche boards in your industry. You'll see opportunities
            as soon as they're posted, often before they hit the major job boards!
          </p>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-[#0D9488]/20 to-teal-500/20 border-2 border-[#0D9488]/50 rounded-lg p-5">
      <h4 className="text-white font-semibold mb-2">💡 Toolkit Best Practices</h4>
      <ul className="space-y-2 text-sm text-gray-300">
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span><strong>Use Smart Context whenever possible</strong> - It's the #1 time-saver and makes tools 10x more effective</span>
        </li>
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span><strong>Start with Oracle Pro</strong> - Get predicted questions first, then practice with Interview Coach</span>
        </li>
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span><strong>Don't skip the Resume Analyzer</strong> - Even experienced professionals get valuable feedback</span>
        </li>
        <li className="flex gap-2">
          <span className="text-[#0D9488] font-bold">•</span>
          <span><strong>Read the Interview Guide once</strong> - Then use the other tools for hands-on practice</span>
        </li>
      </ul>
    </div>
  </div>
)

const TipsSection = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">💡 Jeff & Mike's Pro Tips</h2>
      <p className="text-gray-300 mb-3">
        Jeff Gillis and Mike Simpson are The Interview Guys - career coaches who've helped thousands of people land their dream jobs.
        With 15+ years of combined experience, they know what works (and what doesn't).
      </p>
      <p className="text-sm text-gray-400 italic">
        Here are their battle-tested strategies for job search success, organized by topic.
      </p>
    </div>

    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        📋 Application Strategy
      </h3>
      <p className="text-sm text-gray-300 mb-4">
        How you apply matters just as much as where you apply. These strategies will help you get more interviews from fewer applications.
      </p>

      <div className="space-y-4">
        <div>
          <div className="flex gap-2 mb-2">
            <span className="text-[#0D9488] font-bold text-lg">•</span>
            <h4 className="text-white font-semibold">Quality Over Quantity (The #1 Mistake People Make)</h4>
          </div>
          <p className="text-sm text-gray-300 ml-6 mb-2">
            <strong className="text-purple-300">The Problem:</strong> Most people spray-and-pray - sending the same generic resume to 100 jobs.
            Result? Zero interviews.
          </p>
          <p className="text-sm text-gray-300 ml-6 mb-2">
            <strong className="text-purple-300">The Solution:</strong> 5 tailored applications beat 50 generic ones. Every. Single. Time.
          </p>
          <div className="bg-black/30 rounded p-3 ml-6 mt-2">
            <p className="text-xs text-gray-400 mb-2"><strong className="text-white">How to do it:</strong></p>
            <ul className="text-xs text-gray-400 space-y-1 list-decimal ml-6">
              <li>Read the job description carefully - what are they really looking for?</li>
              <li>Use Resume Analyzer (with Smart Context!) to tailor your resume to match</li>
              <li>Write a custom cover letter that addresses their specific needs</li>
              <li>Reference the company's mission, recent news, or values in your materials</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="flex gap-2 mb-2">
            <span className="text-[#0D9488] font-bold text-lg">•</span>
            <h4 className="text-white font-semibold">Apply Within 48 Hours (The Early Bird Really Does Get the Worm)</h4>
          </div>
          <p className="text-sm text-gray-300 ml-6 mb-2">
            Recruiters review applications in batches. The first 50-100 applicants get the most attention. After that, they're often just
            skimming or have already found candidates to interview.
          </p>
          <div className="bg-black/30 rounded p-3 ml-6 mt-2">
            <p className="text-xs text-gray-400 mb-2"><strong className="text-white">Pro move:</strong></p>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li>Set up job alerts on LinkedIn, Indeed, and niche job boards (use Hidden Job Boards tool!)</li>
              <li>Check alerts 2x per day - morning and evening</li>
              <li>When you see a great match, apply that same day if possible</li>
              <li>Use Smart Context to apply faster - no need to start from scratch!</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="flex gap-2 mb-2">
            <span className="text-[#0D9488] font-bold text-lg">•</span>
            <h4 className="text-white font-semibold">Follow Up After 1-2 Weeks (Most People Don't - Be Different!)</h4>
          </div>
          <p className="text-sm text-gray-300 ml-6 mb-2">
            Following up shows initiative and keeps you top-of-mind. The Priority widget will remind you when it's time!
          </p>
          <div className="bg-black/30 rounded p-3 ml-6 mt-2">
            <p className="text-xs text-gray-400 mb-2"><strong className="text-white">Follow-up email template:</strong></p>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded p-2 text-xs text-gray-300">
              <p className="mb-2">Subject: Following up on [Position] Application</p>
              <p className="mb-1">Hi [Hiring Manager Name],</p>
              <p className="mb-2">I wanted to follow up on my application for the [Position] role submitted on [Date]. I'm very interested in
              this opportunity because [specific reason related to the company/role].</p>
              <p className="mb-2">I'd love to discuss how my [relevant skill/experience] could benefit your team.</p>
              <p>Best regards,<br/>[Your Name]</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex gap-2 mb-2">
            <span className="text-[#0D9488] font-bold text-lg">•</span>
            <h4 className="text-white font-semibold">LinkedIn is Your Secret Weapon</h4>
          </div>
          <p className="text-sm text-gray-300 ml-6 mb-2">
            Don't just apply through the company website. Find the hiring manager on LinkedIn and send them a connection request with a note!
          </p>
          <div className="bg-black/30 rounded p-3 ml-6 mt-2">
            <p className="text-xs text-gray-400 mb-1"><strong className="text-white">Connection request message:</strong></p>
            <p className="text-xs text-gray-300 italic">
              "Hi [Name], I just applied for the [Position] role at [Company]. I'm excited about [specific aspect of the role].
              Would love to connect and learn more about the team!"
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/50 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        🎤 Interview Preparation
      </h3>
      <p className="text-sm text-gray-300 mb-4">
        Interviews are won in the preparation phase, not during the interview itself. Here's how to prepare like a pro.
      </p>

      <div className="space-y-4">
        <div>
          <div className="flex gap-2 mb-2">
            <span className="text-[#0D9488] font-bold text-lg">•</span>
            <h4 className="text-white font-semibold">Start Preparing 3 Days Before (Minimum!)</h4>
          </div>
          <p className="text-sm text-gray-300 ml-6 mb-2">
            Cramming the night before doesn't work for interviews. Your brain needs time to process and internalize your preparation.
          </p>
          <div className="bg-black/30 rounded p-3 ml-6 mt-2">
            <p className="text-xs text-gray-400 mb-2"><strong className="text-white">3-Day Prep Schedule:</strong></p>
            <ul className="text-xs text-gray-400 space-y-2">
              <li><strong className="text-blue-300">Day 1 (3 days before):</strong> Use Interview Oracle PRO to get predicted questions. Start writing SOAR answers for behavioral questions.</li>
              <li><strong className="text-blue-300">Day 2 (2 days before):</strong> Practice with Interview Coach (voice mode!). Refine your SOAR stories based on feedback.</li>
              <li><strong className="text-blue-300">Day 3 (1 day before):</strong> Light review of your prepared answers. Research the company culture. Prepare 3 good questions to ask them.</li>
              <li><strong className="text-blue-300">Interview Day:</strong> Quick 10-minute review in the morning. Then STOP - over-preparing makes you nervous!</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="flex gap-2 mb-2">
            <span className="text-[#0D9488] font-bold text-lg">•</span>
            <h4 className="text-white font-semibold">Practice Out Loud (This is NON-NEGOTIABLE)</h4>
          </div>
          <p className="text-sm text-gray-300 ml-6 mb-2">
            Thinking about answers in your head is NOT the same as saying them out loud. Your brain works differently when speaking!
          </p>
          <div className="bg-black/30 rounded p-3 ml-6 mt-2">
            <p className="text-xs text-gray-400 mb-2"><strong className="text-white">Why it matters:</strong></p>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li>You discover filler words you didn't know you used ("um", "like", "you know")</li>
              <li>You realize which answers are too long or too short</li>
              <li>You build muscle memory - answers flow naturally during the real interview</li>
              <li>You hear yourself and can adjust tone, pace, and confidence</li>
            </ul>
            <p className="text-xs text-green-300 mt-3"><strong>💡 Use Interview Coach's voice mode!</strong> It simulates a real interview and gives you feedback on your spoken answers.</p>
          </div>
        </div>

        <div>
          <div className="flex gap-2 mb-2">
            <span className="text-[#0D9488] font-bold text-lg">•</span>
            <h4 className="text-white font-semibold">Prepare 3 Strong SOAR Stories</h4>
          </div>
          <p className="text-sm text-gray-300 ml-6 mb-2">
            Most behavioral questions can be answered with variations of 3 core stories from your experience. Have these locked and loaded!
          </p>
          <div className="bg-black/30 rounded p-3 ml-6 mt-2">
            <p className="text-xs text-gray-400 mb-2"><strong className="text-white">Your 3 Stories Should Show:</strong></p>
            <ol className="text-xs text-gray-400 space-y-2 list-decimal ml-6">
              <li>
                <strong className="text-white">Leadership/Initiative:</strong> A time you took charge or went above and beyond
                <p className="text-gray-500 mt-1 italic">Can adapt for: "Tell me about a time you showed leadership", "How do you handle challenges?", etc.</p>
              </li>
              <li>
                <strong className="text-white">Problem-Solving/Overcoming Obstacles:</strong> A time you solved a difficult problem
                <p className="text-gray-500 mt-1 italic">Can adapt for: "Tell me about a difficult situation", "Describe a time you failed", "How do you handle pressure?"</p>
              </li>
              <li>
                <strong className="text-white">Teamwork/Collaboration:</strong> A time you worked with difficult people or achieved results through teamwork
                <p className="text-gray-500 mt-1 italic">Can adapt for: "Tell me about working with a difficult person", "Describe your teamwork style", etc.</p>
              </li>
            </ol>
            <p className="text-xs text-blue-300 mt-3"><strong>💡 Use Interview Oracle PRO to craft these stories with the SOAR framework!</strong></p>
          </div>
        </div>

        <div>
          <div className="flex gap-2 mb-2">
            <span className="text-[#0D9488] font-bold text-lg">•</span>
            <h4 className="text-white font-semibold">Research the Company (10 Minutes of Research = Huge Advantage)</h4>
          </div>
          <p className="text-sm text-gray-300 ml-6 mb-2">
            Interviewers can ALWAYS tell when you've done your homework. It shows genuine interest!
          </p>
          <div className="bg-black/30 rounded p-3 ml-6 mt-2">
            <p className="text-xs text-gray-400 mb-2"><strong className="text-white">Quick research checklist:</strong></p>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li>Company's mission/values (usually on "About Us" page)</li>
              <li>Recent news or achievements (Google "[Company Name] news")</li>
              <li>Check their LinkedIn page for recent posts and company culture</li>
              <li>Read reviews on Glassdoor to understand challenges/culture</li>
              <li>Look up your interviewer on LinkedIn - find common ground!</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="flex gap-2 mb-2">
            <span className="text-[#0D9488] font-bold text-lg">•</span>
            <h4 className="text-white font-semibold">Always Have Questions Ready</h4>
          </div>
          <p className="text-sm text-gray-300 ml-6 mb-2">
            "Do you have any questions for us?" is NOT optional. Saying "No" makes you look uninterested!
          </p>
          <div className="bg-black/30 rounded p-3 ml-6 mt-2">
            <p className="text-xs text-gray-400 mb-2"><strong className="text-white">Great questions to ask:</strong></p>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li>"What does success look like in this role in the first 90 days?"</li>
              <li>"What do you enjoy most about working here?"</li>
              <li>"How does this role contribute to the company's larger goals?"</li>
              <li>"What are the biggest challenges facing the team right now?"</li>
              <li>"What's the next step in your hiring process?"</li>
            </ul>
            <p className="text-xs text-red-300 mt-3"><strong>❌ Avoid asking about:</strong> Salary/benefits (save for later), basic info on their website, "What does your company do?"</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border-2 border-green-500/50 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        ⏰ Time Management & Organization
      </h3>
      <p className="text-sm text-gray-300 mb-4">
        Job searching while working (or managing life) is tough. These strategies help you stay organized without burning out.
      </p>

      <div className="space-y-4">
        <div>
          <div className="flex gap-2 mb-2">
            <span className="text-[#0D9488] font-bold text-lg">•</span>
            <h4 className="text-white font-semibold">Batch Your Applications (Work Smarter, Not Harder)</h4>
          </div>
          <p className="text-sm text-gray-300 ml-6 mb-2">
            Instead of applying randomly throughout the week, block out dedicated time for applications. You'll be more focused and efficient!
          </p>
          <div className="bg-black/30 rounded p-3 ml-6 mt-2">
            <p className="text-xs text-gray-400 mb-2"><strong className="text-white">The Batch Application System:</strong></p>
            <ol className="text-xs text-gray-400 space-y-2 list-decimal ml-6">
              <li><strong className="text-white">Find jobs (30 minutes):</strong> Search job boards, save 10-15 interesting positions</li>
              <li><strong className="text-white">Narrow down (15 minutes):</strong> Pick the 5 best fits</li>
              <li><strong className="text-white">Add to Career Hub (10 minutes):</strong> Use Quick Add to save all details</li>
              <li><strong className="text-white">Tailor & Apply (2 hours):</strong> Use Smart Context with Resume Analyzer and Cover Letter Generator for each one</li>
            </ol>
            <p className="text-xs text-green-300 mt-3"><strong>Result:</strong> 5 quality applications in one focused 3-hour session. Much better than scattered, generic applications!</p>
          </div>
        </div>

        <div>
          <div className="flex gap-2 mb-2">
            <span className="text-[#0D9488] font-bold text-lg">•</span>
            <h4 className="text-white font-semibold">Check Your Dashboard Daily (5 Minutes That Matter)</h4>
          </div>
          <p className="text-sm text-gray-300 ml-6 mb-2">
            Start each day with a quick dashboard check. It keeps you on top of priorities and prevents things from slipping through the cracks.
          </p>
          <div className="bg-black/30 rounded p-3 ml-6 mt-2">
            <p className="text-xs text-gray-400 mb-2"><strong className="text-white">Your 5-minute morning routine:</strong></p>
            <ul className="text-xs text-gray-400 space-y-1 list-decimal ml-6">
              <li>Check Smart Suggestions - What should you focus on today?</li>
              <li>Look at Priority widget - Any interviews coming up or follow-ups needed?</li>
              <li>Review This Week widget - Prepare for upcoming interviews</li>
              <li>Check your email for responses from companies</li>
              <li>Update any application statuses in Career Hub</li>
            </ul>
            <p className="text-xs text-teal-300 mt-3"><strong>💡 Do this before coffee!</strong> Make it part of your morning routine.</p>
          </div>
        </div>

        <div>
          <div className="flex gap-2 mb-2">
            <span className="text-[#0D9488] font-bold text-lg">•</span>
            <h4 className="text-white font-semibold">Update Status Immediately (Future You Will Thank You)</h4>
          </div>
          <p className="text-sm text-gray-300 ml-6 mb-2">
            The moment something happens - you get a callback, schedule an interview, receive a rejection - update it in Career Hub.
            If you wait, you'll forget important details!
          </p>
          <div className="bg-black/30 rounded p-3 ml-6 mt-2">
            <p className="text-xs text-gray-400 mb-2"><strong className="text-white">Why this matters:</strong></p>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li>Dashboard stats stay accurate - you know your real progress</li>
              <li>Smart Suggestions gives you the right guidance</li>
              <li>Priority widget reminds you of actual deadlines</li>
              <li>You won't double-apply or forget who you've talked to</li>
            </ul>
            <p className="text-xs text-green-300 mt-3"><strong>Quick tip:</strong> In Kanban View, dragging a card takes 2 seconds. Do it right away!</p>
          </div>
        </div>

        <div>
          <div className="flex gap-2 mb-2">
            <span className="text-[#0D9488] font-bold text-lg">•</span>
            <h4 className="text-white font-semibold">Set Weekly Goals (Measure What Matters)</h4>
          </div>
          <p className="text-sm text-gray-300 ml-6 mb-2">
            Job searching without goals is like driving without a destination. Set concrete weekly targets!
          </p>
          <div className="bg-black/30 rounded p-3 ml-6 mt-2">
            <p className="text-xs text-gray-400 mb-2"><strong className="text-white">Sample weekly goals:</strong></p>
            <ul className="text-xs text-gray-400 space-y-1 list-disc ml-6">
              <li><strong className="text-white">Applications:</strong> Submit 5 quality applications</li>
              <li><strong className="text-white">Networking:</strong> Connect with 3 people on LinkedIn in your field</li>
              <li><strong className="text-white">Preparation:</strong> If you have an interview, complete Oracle Pro + Coach practice</li>
              <li><strong className="text-white">Follow-ups:</strong> Send follow-up emails to any applications older than 2 weeks</li>
            </ul>
            <p className="text-xs text-teal-300 mt-3"><strong>Track it:</strong> Check your Journey Overview stats each Friday to see your progress!</p>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-r from-[#0D9488]/20 to-teal-500/20 border-2 border-[#0D9488]/50 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <span className="text-3xl">🎯</span>
        <div>
          <h4 className="text-white font-semibold mb-3 text-lg">Final Wisdom from Jeff & Mike</h4>
          <p className="text-sm text-gray-300 mb-3">
            "Job searching is a marathon, not a sprint. Stay consistent, stay organized, and trust the process. Most people give up
            right before they would have gotten their breakthrough. Don't be most people."
          </p>
          <p className="text-sm text-gray-300 mb-3">
            "Use IG Career Hub to remove the chaos from your job search. When you're organized, you can focus on what really matters -
            preparing great applications and crushing your interviews."
          </p>
          <p className="text-sm text-[#0D9488] font-semibold">
            You've got this! 💪
          </p>
        </div>
      </div>
    </div>
  </div>
)

HelpContent.displayName = 'HelpContent'
