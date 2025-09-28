"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GradesPage } from "@/components/grades/grades-page"

export default function Grades() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <GradesPage />
      </DashboardLayout>
    </AuthGuard>
  )
}
