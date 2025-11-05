import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import TestEditor from '@/components/test/test-editing-page copy';
import React from 'react';

interface TestEditingPageProps {
  params: { id: number },
}

const TestEditingPage = ({ params }: TestEditingPageProps) => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <TestEditor test_id={params.id} />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default TestEditingPage