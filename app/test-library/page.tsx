'use client'
import { AuthGuard } from '@/components/auth/auth-guard'
import TestLibrary from '@/components/guess/test-library/TestLibrary'
import ClientLayout from '@/components/layout/client-layout'
import { LandingLayout } from '@/components/layout/landing-layout'
import React from 'react'

const TestLibraryPage = () => {
  return (
    <LandingLayout>
      <TestLibrary />
    </LandingLayout>
  )
}

export default TestLibraryPage