import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import TestPage from '@/components/test/test-page'
import React from 'react'

interface TestTakePageProps {
  params: { id: number }
}

const TestTakePage = ({ params }: TestTakePageProps) => {
  return (
    <AuthGuard>
      <TestPage test_id={params.id} />
    </AuthGuard>
  )
}

export default TestTakePage
