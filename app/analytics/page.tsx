"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AnalyticsPage } from "@/components/analytics/analytics-page"

export default function Analytics() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <AnalyticsPage />
      </DashboardLayout>
    </AuthGuard>
  )
}
