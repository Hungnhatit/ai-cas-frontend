"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CourseManagement } from "@/components/courses/course-management"

export default function ManageCoursesPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <CourseManagement />
      </DashboardLayout>
    </AuthGuard>
  )
}
