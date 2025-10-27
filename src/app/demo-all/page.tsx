'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'

export default function DemoAllPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-black p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-bold text-teal-gradient mb-2">
            Complete UI Component Library
          </h1>
          <p className="text-text-secondary">
            All 6 base components with dark glassmorphic aesthetic
          </p>
        </div>

        {/* Component 1: Buttons */}
        <Card
          header={
            <h2 className="text-xl font-semibold text-text-primary">
              1. Buttons - All Variants
            </h2>
          }
        >
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="secondary" disabled>Disabled</Button>
          </div>
        </Card>

        {/* Component 2: Inputs */}
        <Card
          header={
            <h2 className="text-xl font-semibold text-text-primary">
              2. Inputs - All States
            </h2>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              placeholder="Enter company name"
            />
            <Input
              label="Position"
              placeholder="e.g. Senior Developer"
              error="This field is required"
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
            />
            <Input
              label="Disabled Input"
              disabled
              value="Cannot edit this"
            />
          </div>
        </Card>

        {/* Component 3: Select */}
        <Card
          header={
            <h2 className="text-xl font-semibold text-text-primary">
              3. Select Dropdown
            </h2>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Application Status"
              options={[
                { value: 'applied', label: 'Applied' },
                { value: 'phone_screen', label: 'Phone Screen' },
                { value: 'interview', label: 'Interview' },
                { value: 'offer', label: 'Offer' },
                { value: 'rejected', label: 'Rejected' },
              ]}
            />
            <Select
              label="Remote Type"
              options={[
                { value: 'remote', label: 'Remote' },
                { value: 'hybrid', label: 'Hybrid' },
                { value: 'onsite', label: 'On-site' },
                { value: 'flexible', label: 'Flexible' },
              ]}
            />
          </div>
        </Card>

        {/* Component 4: Badges */}
        <Card
          header={
            <h2 className="text-xl font-semibold text-text-primary">
              4. Badge Status Pills
            </h2>
          }
        >
          <div className="flex flex-wrap gap-3">
            <Badge variant="success">Active</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="error">Rejected</Badge>
            <Badge variant="info">Interview</Badge>
            <Badge variant="default">Applied</Badge>
          </div>
        </Card>

        {/* Component 5: Cards (Different Layouts) */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-text-primary">
            5. Card Layouts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card padding="sm">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Applications</span>
                  <Badge variant="info">24</Badge>
                </div>
                <p className="text-2xl font-semibold text-white/90">24</p>
              </div>
            </Card>
            <Card padding="sm">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Interviews</span>
                  <Badge variant="success">8</Badge>
                </div>
                <p className="text-2xl font-semibold text-white/90">8</p>
              </div>
            </Card>
            <Card padding="sm">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Offers</span>
                  <Badge variant="warning">2</Badge>
                </div>
                <p className="text-2xl font-semibold text-white/90">2</p>
              </div>
            </Card>
          </div>

          <Card
            header={
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white/90">
                  Recent Activity
                </h3>
                <Badge variant="info">3 new</Badge>
              </div>
            }
            footer={
              <div className="flex justify-end">
                <Button variant="ghost" size="sm">View All</Button>
              </div>
            }
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white/90">Applied to Google</p>
                  <p className="text-white/50 text-sm">2 hours ago</p>
                </div>
                <Badge variant="success">New</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white/90">Interview with Meta</p>
                  <p className="text-white/50 text-sm">1 day ago</p>
                </div>
                <Badge variant="warning">Scheduled</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Component 6: Modal */}
        <Card
          header={
            <h2 className="text-xl font-semibold text-text-primary">
              6. Modal Dialog
            </h2>
          }
        >
          <div className="space-y-4">
            <p className="text-white/70 text-sm">
              Click the button to open a modal overlay with glassmorphic styling
            </p>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Open Modal
            </Button>
          </div>
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Application"
        >
          <div className="space-y-4">
            <Input
              label="Company Name"
              placeholder="Enter company name"
            />
            <Input
              label="Position Title"
              placeholder="e.g. Senior Software Engineer"
            />
            <Select
              label="Status"
              options={[
                { value: 'applied', label: 'Applied' },
                { value: 'phone_screen', label: 'Phone Screen' },
                { value: 'interview', label: 'Interview' },
              ]}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Save Application
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  )
}
