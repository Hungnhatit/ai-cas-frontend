"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { LiveSessionsPage } from "@/components/sessions/live-sessions-page"

export default function Sessions() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <LiveSessionsPage />
      </DashboardLayout>
    </AuthGuard>
  )
}
