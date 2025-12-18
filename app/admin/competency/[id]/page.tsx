import CompetencyDetails from '@/components/admin/competency/CompetencyDetailPage'
import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import React from 'react'

interface CompetencyDetailPageProps {
  params: { id: number }
}

const CompetencyDetailPage = ({ params }: CompetencyDetailPageProps) => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <CompetencyDetails competency_id={params.id} />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default CompetencyDetailPage