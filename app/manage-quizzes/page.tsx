import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { QuizManagementPage } from "@/components/quizzes/quiz-management-page"

export default function ManageQuizzes() {
  return (
    <AuthGuard allowedRoles={["instructor", "admin"]}>
      <DashboardLayout>
        <QuizManagementPage />
      </DashboardLayout>
    </AuthGuard>
  )
}
