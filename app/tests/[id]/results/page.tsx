import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import TestResultsPage from '@/components/test-result/test-results'
import React from 'react';

interface TestResultPageProps {
  params: { id: number }
}

const page = ({ params }: TestResultPageProps) => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <TestResultsPage test_id={params.id} />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default page
