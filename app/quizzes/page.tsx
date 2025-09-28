import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { QuizzesPage } from "@/components/quizzes/quizzes-page"

export default function Quizzes() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <QuizzesPage />
      </DashboardLayout>
    </AuthGuard>
  )
}
