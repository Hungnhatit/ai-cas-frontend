import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import ExamDetailsPage from '@/components/test/test-detail/test-detail'
import React from 'react';

interface TestDetailPageProps {
  params: { id: number }
}

const TestDetailPage = ({ params }: TestDetailPageProps) => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <ExamDetailsPage test_id={params.id} />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default TestDetailPage