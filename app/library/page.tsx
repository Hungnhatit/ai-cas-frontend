import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import TestLibrary from '@/components/test/test-library'
import React from 'react'

const page = () => {
  return (
    <>
      <AuthGuard>
        <DashboardLayout>
          <TestLibrary />
        </DashboardLayout>
      </AuthGuard>
    </>
  )
}

export default page
