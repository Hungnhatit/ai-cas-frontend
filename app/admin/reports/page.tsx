import { AuthGuard } from "@/components/auth/auth-guard"
import { ReportsPage } from "@/components/admin/reports-page"

export default function AdminReportsPage() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-white">Comprehensive platform analytics and reporting</p>
        </div>
        <ReportsPage />
      </div>
    </AuthGuard>
  )
}
