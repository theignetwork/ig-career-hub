'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function DemoCardPage() {
  return (
    <main className="min-h-screen bg-black p-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-bold text-teal-gradient mb-2">
            Card Component Demo
          </h1>
          <p className="text-text-secondary">
            Glassmorphic container with flexible layouts
          </p>
        </div>

        {/* Basic Card with Text */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">
            Basic Card with Text
          </h2>
          <Card>
            <h3 className="text-lg font-semibold text-white/90 mb-2">
              Application Submitted
            </h3>
            <p className="text-white/70 text-sm">
              Your application to Acme Corporation has been successfully submitted.
              You'll receive a confirmation email shortly.
            </p>
          </Card>
        </section>

        {/* Card with Header */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">
            Card with Header
          </h2>
          <Card
            header={
              <h3 className="text-lg font-semibold text-white/90">
                Recent Applications
              </h3>
            }
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white/90 font-medium">Senior Software Engineer</p>
                  <p className="text-white/50 text-sm">Google - Applied 2 days ago</p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-[#0D9488]/20 text-[#0D9488] border border-[#0D9488]/30">
                  Interview
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white/90 font-medium">Frontend Developer</p>
                  <p className="text-white/50 text-sm">Meta - Applied 5 days ago</p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-white/10 text-white/70 border border-white/10">
                  Applied
                </span>
              </div>
            </div>
          </Card>
        </section>

        {/* Card with Header and Footer */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">
            Card with Header and Footer
          </h2>
          <Card
            header={
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white/90">
                  Weekly Goal Progress
                </h3>
                <span className="text-sm text-white/50">3 / 10 Applications</span>
              </div>
            }
            footer={
              <div className="flex justify-end gap-3">
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
                <Button variant="primary" size="sm">
                  Update Goal
                </Button>
              </div>
            }
          >
            <div className="space-y-3">
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-[#0D9488] h-2 rounded-full transition-all duration-300"
                  style={{ width: '30%' }}
                />
              </div>
              <p className="text-white/70 text-sm">
                You're 30% of the way to your weekly goal. Keep it up!
              </p>
            </div>
          </Card>
        </section>

        {/* Different Padding Sizes */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">
            Different Padding Sizes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card padding="sm">
              <p className="text-white/70 text-sm">
                <span className="text-[#0D9488] font-medium">Small padding (p-4)</span> -
                Compact card for tight layouts
              </p>
            </Card>
            <Card padding="md">
              <p className="text-white/70 text-sm">
                <span className="text-[#0D9488] font-medium">Medium padding (p-6)</span> -
                Default balanced spacing
              </p>
            </Card>
            <Card padding="lg">
              <p className="text-white/70 text-sm">
                <span className="text-[#0D9488] font-medium">Large padding (p-8)</span> -
                Spacious card for emphasis
              </p>
            </Card>
            <Card padding="none">
              <div className="p-4">
                <p className="text-white/70 text-sm">
                  <span className="text-[#0D9488] font-medium">No padding (p-0)</span> -
                  Full control over internal spacing
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Nested Cards */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">
            Nested Cards
          </h2>
          <Card padding="lg">
            <h3 className="text-lg font-semibold text-white/90 mb-4">
              Application Details
            </h3>
            <div className="space-y-4">
              <Card padding="sm" className="bg-white/3">
                <p className="text-white/70 text-sm">
                  <span className="text-white/90 font-medium">Company:</span> Acme Corporation
                </p>
              </Card>
              <Card padding="sm" className="bg-white/3">
                <p className="text-white/70 text-sm">
                  <span className="text-white/90 font-medium">Position:</span> Senior Product Designer
                </p>
              </Card>
              <Card padding="sm" className="bg-white/3">
                <p className="text-white/70 text-sm">
                  <span className="text-white/90 font-medium">Status:</span> Interview Scheduled
                </p>
              </Card>
            </div>
          </Card>
        </section>
      </div>
    </main>
  )
}
