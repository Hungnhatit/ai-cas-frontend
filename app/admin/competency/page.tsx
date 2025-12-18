'use client'
import { CompetencyApp } from '@/components/admin/competency/Competency';
import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import React from 'react';

const CompetencyPage = () => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <CompetencyApp />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default CompetencyPage