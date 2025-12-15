import { AuthGuard } from '@/components/auth/auth-guard'
import { LandingLayout } from '@/components/layout/landing-layout'
import SettingsPage from '@/components/students/setting/SettingPage'
import React from 'react'

const StudentSettingPage = () => {
  return (
    <AuthGuard>
      <LandingLayout>
        <SettingsPage />
      </LandingLayout>
    </AuthGuard>
  )
}

export default StudentSettingPage