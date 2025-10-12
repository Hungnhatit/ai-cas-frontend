import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import TestPage from '@/components/test/test-page'
import React from 'react'

interface TestTakePageProps {
  params: { id: number }
  searchParams: { attempt?: number }
}

const TestTakePage = ({ params , searchParams}: TestTakePageProps) => {
  return (
    <AuthGuard>
      <TestPage test_id={params.id} attempt_id={searchParams.attempt} />
    </AuthGuard>
  )
}

export default TestTakePage
