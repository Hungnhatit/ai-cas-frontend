"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"
import { InstructorDashboard } from "@/components/dashboard/instructor-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { useAuth } from "@/providers/auth-provider"

export default function DashboardPage() {
  const { user } = useAuth()

  const renderDashboard = () => {
    switch (user?.vai_tro) {
      case "admin":
        return <AdminDashboard />
      case "instructor":
        return <InstructorDashboard />
      case "student":
      default:
        return <StudentDashboard />
    }
  }

  return (
    <AuthGuard>
      <DashboardLayout>{renderDashboard()}</DashboardLayout>
    </AuthGuard>
  )
}
