import { Suspense } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import ApplicationsTableContent from './ApplicationsTableContent'

export default function ApplicationsTablePage() {
  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading applications...</div>
        </div>
      }>
        <ApplicationsTableContent />
      </Suspense>
    </DashboardLayout>
  )
}
