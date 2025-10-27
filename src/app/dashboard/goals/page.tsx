import React from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { GoalsClient } from '@/components/goals/GoalsClient'

export const metadata = {
  title: 'Goals & Progress | IG Career Hub',
  description: 'Track your goals and level up your job search',
}

export default function GoalsPage() {
  return (
    <DashboardLayout>
      <GoalsClient />
    </DashboardLayout>
  )
}
