import React from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DocumentsClient } from '@/components/documents/DocumentsClient'

export const metadata = {
  title: 'Document Library | IG Career Hub',
  description: 'Manage your resumes, cover letters, and career documents',
}

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <DocumentsClient />
    </DashboardLayout>
  )
}
