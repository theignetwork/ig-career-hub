import { AddApplicationForm } from '@/components/applications/AddApplicationForm'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export default function NewApplicationPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Add New Application</h1>
        <AddApplicationForm />
      </div>
    </DashboardLayout>
  )
}
