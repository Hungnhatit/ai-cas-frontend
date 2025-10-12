import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import TestResultDetail from '@/components/test-result/detail/test-result-detail'
import React from 'react'

interface TestResultDetailProps {
  params: { id: number },
  searchParams: { attempt: number }
}

const page = ({ params, searchParams }: TestResultDetailProps) => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <TestResultDetail test_id={params.id} attempt_id={searchParams.attempt} />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default page