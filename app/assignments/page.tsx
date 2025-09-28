"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AssignmentsPage } from "@/components/assignments/assignments-page"

export default function Assignments() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <AssignmentsPage />
      </DashboardLayout>
    </AuthGuard>
  )
}
