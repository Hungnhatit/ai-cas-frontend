import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AssignmentManagementPage } from "@/components/assignments/assignment-management-page"

export default function ManageAssignments() {
  return (
    <AuthGuard allowedRoles={["instructor", "admin"]}>
      <DashboardLayout>
        <AssignmentManagementPage />
      </DashboardLayout>
    </AuthGuard>
  )
}
