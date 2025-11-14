'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ApplicationsClient } from '@/components/applications/ApplicationsClient'
import { getUserId } from '@/lib/utils/getUserId'

export default function ApplicationsTableContent() {
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
        // Build query params
        const params = new URLSearchParams({
          limit: '50',
          sortBy: searchParams.get('sortBy') || 'date_applied',
          sortOrder: searchParams.get('sortOrder') || 'desc',
        })

        if (searchParams.get('search')) params.append('search', searchParams.get('search')!)
        if (searchParams.get('status')) params.append('status', searchParams.get('status')!)
        if (searchParams.get('remoteType')) params.append('remoteType', searchParams.get('remoteType')!)

        // Fetch applications via API route
        const response = await fetch(`/api/applications?${params.toString()}`, {
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
        console.error('[ApplicationsTable] Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading applications...</div>
      </div>
    )
  }

  return (
    <ApplicationsClient initialApplications={applications} initialTotal={total} />
  )
}
