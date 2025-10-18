import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import TestEditor from '@/components/test/test-editing-page';
import { TestSetup } from '@/types/interfacess/quiz';
import React from 'react';

interface TestEditingPageProps {
  params: { id: number },
  setup: TestSetup
}

const TestEditingPage = ({ params, setup }: TestEditingPageProps) => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <TestEditor test_id={params.id} setup={setup} />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default TestEditingPage