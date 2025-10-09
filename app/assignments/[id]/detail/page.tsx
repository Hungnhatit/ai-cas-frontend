'use client'
import AssignmentDetailPage from '@/components/assignments/detail/assignment-detail-page'
import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import React from 'react'

interface AssignmentDetailPageProps {
  params: Promise<{ id: number }>
}


const AssignmentDetail = ({ params }: AssignmentDetailPageProps) => {
  const resolvedParams = React.use(params)
  const assignmentId = resolvedParams.id
  return (
    <AuthGuard>
      <DashboardLayout>
        <AssignmentDetailPage assignment_id={assignmentId} />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default AssignmentDetail
