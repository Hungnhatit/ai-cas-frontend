import AssignmentForm from '@/components/assignments/assignment-creation';
import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import React from 'react'

const AssignmentCreationPage = () => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <AssignmentForm />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default AssignmentCreationPage