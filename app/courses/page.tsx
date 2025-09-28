"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CoursesPage } from "@/components/courses/courses-page"

export default function Courses() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <CoursesPage />
      </DashboardLayout>
    </AuthGuard>
  )
}
