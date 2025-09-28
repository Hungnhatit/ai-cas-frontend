"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CalendarPage } from "@/components/calendar/calendar-page"

export default function Calendar() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <CalendarPage />
      </DashboardLayout>
    </AuthGuard>
  )
}
