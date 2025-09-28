import { AuthGuard } from "@/components/auth/auth-guard"
import { UserManagement } from "@/components/admin/user-management"

export default function AdminUsersPage() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage all users, roles, and permissions</p>
        </div>
        <UserManagement />
      </div>
    </AuthGuard>
  )
}
