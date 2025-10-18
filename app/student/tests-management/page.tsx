import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import TestManagementPage from '@/components/students/test/test-management'
import React from 'react'

/**
 * Student Test Management Page
 */

const page = () => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <TestManagementPage />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default page
