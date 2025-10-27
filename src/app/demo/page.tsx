'use client'

import { Button } from '@/components/ui/Button'

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-black p-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-bold text-teal-gradient mb-2">
            Button Component Demo
          </h1>
          <p className="text-text-secondary">
            All variants, sizes, and states on dark background
          </p>
        </div>

        {/* All 4 Variants */}
        <section className="glass-card p-8 space-y-4">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            All 4 Variants
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </section>

        {/* All 3 Sizes */}
        <section className="glass-card p-8 space-y-4">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            All 3 Sizes
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium (default)</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        {/* Loading State */}
        <section className="glass-card p-8 space-y-4">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Loading State
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button loading>Loading Primary</Button>
            <Button variant="secondary" loading>
              Loading Secondary
            </Button>
            <Button variant="ghost" loading>
              Loading Ghost
            </Button>
          </div>
        </section>

        {/* Disabled State */}
        <section className="glass-card p-8 space-y-4">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Disabled State
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button disabled>Disabled Primary</Button>
            <Button variant="secondary" disabled>
              Disabled Secondary
            </Button>
            <Button variant="danger" disabled>
              Disabled Danger
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}
