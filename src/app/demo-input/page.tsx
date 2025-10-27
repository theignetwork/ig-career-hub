'use client'

import { Input } from '@/components/ui/Input'

export default function DemoInputPage() {
  return (
    <main className="min-h-screen bg-black p-12">
      <div className="max-w-2xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-bold text-teal-gradient mb-2">
            Input Component Demo
          </h1>
          <p className="text-text-secondary">
            All states and variations on dark background
          </p>
        </div>

        {/* Input with Label */}
        <section className="glass-card p-8 space-y-4">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Input with Label
          </h2>
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
          />
        </section>

        {/* Input with Error State */}
        <section className="glass-card p-8 space-y-4">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Input with Error State
          </h2>
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error="Password must be at least 8 characters"
          />
        </section>

        {/* Disabled Input */}
        <section className="glass-card p-8 space-y-4">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Disabled Input
          </h2>
          <Input
            label="Username"
            type="text"
            placeholder="johndoe"
            disabled
            value="This field is disabled"
          />
        </section>

        {/* Input with Placeholder Only */}
        <section className="glass-card p-8 space-y-4">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Input with Placeholder Only (No Label)
          </h2>
          <Input
            type="text"
            placeholder="Search applications..."
          />
        </section>

        {/* All States Combined */}
        <section className="glass-card p-8 space-y-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Multiple Inputs in a Form
          </h2>
          <Input
            label="Company Name"
            type="text"
            placeholder="Acme Corporation"
          />
          <Input
            label="Position Title"
            type="text"
            placeholder="Senior Software Engineer"
          />
          <Input
            label="Application URL"
            type="url"
            placeholder="https://..."
          />
        </section>
      </div>
    </main>
  )
}
