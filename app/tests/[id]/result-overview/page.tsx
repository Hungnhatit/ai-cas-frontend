import { AuthGuard } from '@/components/auth/auth-guard'
import ClientLayout from '@/components/layout/client-layout'
import { TestResultOverview } from '@/components/test-result/overview/test-result-overview'
import React from 'react'

interface TestResultProps {
  params: { id: number },
  searchParams: { attempt?: number }
}

const TestResultPage = ({ params, searchParams }: TestResultProps) => {
  return (
    <AuthGuard>
      <ClientLayout>
        <TestResultOverview test_id={params.id} testAttempt_id={searchParams.attempt} />
      </ClientLayout>
    </AuthGuard>
  )
}

export default TestResultPage
