import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import QuizResultsPage from '@/components/quizzes/quiz-results'
import React from 'react'

interface QuizResultsProps {
  params: { id: number }, 
}

const page = ({ params }: QuizResultsProps) => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <QuizResultsPage quiz_id={params.id}></QuizResultsPage>
      </DashboardLayout>
    </AuthGuard>
  )
}

export default page