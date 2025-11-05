import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AiExamPage } from '@/components/test/creation/ai-test-creation-page'
import React from 'react'

const AITestGenerationPage = () => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <AiExamPage />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default AITestGenerationPage