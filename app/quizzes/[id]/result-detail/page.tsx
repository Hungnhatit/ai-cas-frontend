import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import QuizResultDetail from '@/components/quiz-result/quiz-result-detail';
import React from 'react';

interface QuizResultDetailPageProps {
  params: { id: number },
  searchParams: { attempt?: number }
}

const QuizResultDetailPage = ({ params, searchParams }: QuizResultDetailPageProps) => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <QuizResultDetail quiz_id={params.id} quizAttempt_id={searchParams.attempt}/>
      </DashboardLayout>
    </AuthGuard>
  )
}

export default QuizResultDetailPage