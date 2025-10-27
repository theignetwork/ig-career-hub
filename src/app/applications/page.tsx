import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { KanbanClient } from '@/components/applications/KanbanClient'
import { getApplications } from '@/lib/api/applications'

export default async function ApplicationsPage() {
  // TODO: Implement proper server-side auth
  // For now using demo user ID - will be replaced with:
  // - WordPress user ID from cookies/headers when embedded
  // - Session-based auth for standalone mode
  const userId = 'demo-user-123'

  // Fetch all applications (no pagination for kanban view)
  const { applications, total } = await getApplications(userId, {
    limit: 200, // Get more applications for kanban view
  })

  return (
    <DashboardLayout>
      <KanbanClient initialApplications={applications} initialTotal={total} />
    </DashboardLayout>
  )
}
