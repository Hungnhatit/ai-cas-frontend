import React from 'react'
import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import CreateQuizzes from '@/components/quizzes/create-quiz-page'


const CreateQuizzesPage = () => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <CreateQuizzes />
      </DashboardLayout>
    </AuthGuard>

  )
}

export default CreateQuizzesPage