import { AuthGuard } from '@/components/auth/auth-guard'
import TopBar from '@/components/layout/topbar/topbar'
import TestPage from '@/components/test/test-page'
import React from 'react'

interface TestTakePageProps {
  params: { id: number }
  searchParams: { attempt: number }
}

const page = ({ params, searchParams }: TestTakePageProps) => {
  return (
    <AuthGuard>
      <TopBar />
      <TestPage test_id={params.id} attempt_id={searchParams.attempt} />
    </AuthGuard>
  )
}
export default page
