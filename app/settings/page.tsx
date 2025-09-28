"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SettingsPage } from "@/components/settings/settings-page"

export default function Settings() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <SettingsPage />
      </DashboardLayout>
    </AuthGuard>
  )
}
