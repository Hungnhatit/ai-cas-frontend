import { AuthGuard } from "@/components/auth/auth-guard"
import { UserManagement } from "@/components/admin/user-management"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function AdminUsersPage() {
  return (
    <AuthGuard requiredRole='admin'>
      <DashboardLayout>
        <UserManagement />
      </DashboardLayout>
     
    </AuthGuard>
  )
}
