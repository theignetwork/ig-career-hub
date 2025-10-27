import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import { HelpContent } from '@/components/help/HelpContent'

export default function HelpPage() {
  return (
    <DashboardLayout>
      <DashboardClient>
        <HelpContent />
      </DashboardClient>
    </DashboardLayout>
  )
}
