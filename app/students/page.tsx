"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StudentsManagement } from "@/components/students/students-management"

export default function StudentsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <StudentsManagement />
      </DashboardLayout>
    </AuthGuard>
  )
}
