import TestCategories from '@/components/admin/test-category/TestCategories'
import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import React from 'react'

const TestCategoriesPage = () => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <TestCategories />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default TestCategoriesPage