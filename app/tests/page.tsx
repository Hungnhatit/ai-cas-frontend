import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import TestManagement from '@/components/test/test-management'
import React from 'react'

const Page = () => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <TestManagement />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default Page
