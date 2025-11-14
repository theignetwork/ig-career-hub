'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { ApplicationsClient } from '@/components/applications/ApplicationsClient'
import { getApplications } from '@/lib/api/applications'
import { getUserId } from '@/lib/utils/getUserId'

export default function ApplicationsTablePage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<any[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const userId = getUserId()

      if (!userId) {
        console.error('[ApplicationsTable] No user ID available')
        setLoading(false)
        return
      }

      try {
        // Fetch applications with filters from URL params
        const { applications: apps, total: count } = await getApplications(userId, {
          search: searchParams.get('search') || undefined,
          status: searchParams.get('status') || undefined,
          remoteType: searchParams.get('remoteType') || undefined,
          sortBy: (searchParams.get('sortBy') as any) || 'date_applied',
          sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
          limit: 50,
        })
        setApplications(apps)
        setTotal(count)
      } catch (error) {
        console.error('[ApplicationsTable] Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading applications...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <ApplicationsClient initialApplications={applications} initialTotal={total} />
    </DashboardLayout>
  )
}
