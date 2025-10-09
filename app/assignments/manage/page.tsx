import AssignmentManagement from '@/components/assignments/management/assignment-management'
import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import React from 'react'

const AssignmentManagementPage = () => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <AssignmentManagement />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default AssignmentManagementPage
