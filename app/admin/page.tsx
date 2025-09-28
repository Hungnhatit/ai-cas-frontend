import { AuthGuard } from "@/components/auth/auth-guard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

export default function AdminPage() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <AdminDashboard />
    </AuthGuard>
  )
}
