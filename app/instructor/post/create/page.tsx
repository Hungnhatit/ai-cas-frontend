'use client'
import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import PostCreation from '@/components/admin/post/PostCreation'
import React from 'react'

const CreationPage = () => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <PostCreation />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default CreationPage