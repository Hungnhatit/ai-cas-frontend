import { AuthGuard } from "@/components/auth/auth-guard"
import { SystemSettings } from "@/components/admin/system-settings"

export default function AdminSystemPage() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground">Configure platform settings and system preferences</p>
        </div>
        <SystemSettings />
      </div>
    </AuthGuard>
  )
}
