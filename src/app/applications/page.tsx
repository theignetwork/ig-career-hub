'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { KanbanClient } from '@/components/applications/KanbanClient'
import { getUserId } from '@/lib/utils/getUserId'

export default function ApplicationsPage() {
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<any[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const userId = getUserId()

      if (!userId) {
        console.error('[Applications] No user ID available')
        setLoading(false)
        return
      }

      try {
        // Fetch all applications via API route
        const response = await fetch('/api/applications?limit=200', {
          headers: {
            'x-user-id': userId,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch applications')
        }

        const data = await response.json()
        setApplications(data.applications)
        setTotal(data.total)
      } catch (error) {
        console.error('[Applications] Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
      <KanbanClient initialApplications={applications} initialTotal={total} />
    </DashboardLayout>
  )
}
