"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MessagesPage } from "@/components/messages/messages-page"

export default function Messages() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <MessagesPage />
      </DashboardLayout>
    </AuthGuard>
  )
}
