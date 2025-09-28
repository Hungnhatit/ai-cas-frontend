import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { QuizTakingPage } from "@/components/quizzes/quiz-taking-page"

interface QuizTakePageProps {
  params: { id: number }
  searchParams: { attempt?: number }
}

export default function QuizTakePage({ params, searchParams }: QuizTakePageProps) {
  return (
    <AuthGuard>
      <DashboardLayout>
        <QuizTakingPage quizId={params.id} attemptId={searchParams.attempt} />
      </DashboardLayout>
    </AuthGuard>
  )
}
