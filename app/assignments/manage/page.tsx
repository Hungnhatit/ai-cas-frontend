import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import React from 'react'

const AssignmentManagementPage = () => {
  return (
    <AuthGuard>
      <DashboardLayout>
        
      </DashboardLayout>
    </AuthGuard>
  )
}

export default AssignmentManagementPage
