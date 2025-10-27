import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { ApplicationsClient } from '@/components/applications/ApplicationsClient'
import { getApplications } from '@/lib/api/applications'

interface PageProps {
  searchParams: Promise<{
    search?: string
    status?: string
    remoteType?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }>
}

export default async function ApplicationsTablePage({ searchParams }: PageProps) {
  // TODO: Implement proper server-side auth
  // For now using demo user ID - will be replaced with:
  // - WordPress user ID from cookies/headers when embedded
  // - Session-based auth for standalone mode
  const userId = 'demo-user-123'

  // Await searchParams in Next.js 15
  const params = await searchParams

  // Fetch applications with filters from URL params
  const { applications, total } = await getApplications(userId, {
    search: params.search,
    status: params.status,
    remoteType: params.remoteType,
    sortBy: (params.sortBy as any) || 'date_applied',
    sortOrder: params.sortOrder || 'desc',
    limit: 50,
  })

  return (
    <DashboardLayout>
      <ApplicationsClient initialApplications={applications} initialTotal={total} />
    </DashboardLayout>
  )
}
