import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { QuizResultPage } from '@/components/quizzes/quiz-result'

import React from 'react';

interface QuizResultProps {
  params: { id: number },
  searchParams: { attempt?: number }
}

// result page after submit quiz
const QuizResults = ({ params, searchParams }: QuizResultProps) => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <QuizResultPage quiz_id={params.id} quizAttempt_id={searchParams.attempt} />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default QuizResults