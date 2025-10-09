import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import CreateTestPage from '@/components/test/test-creation'
import React from 'react'

const TestCreationPage = () => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <CreateTestPage />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default TestCreationPage
