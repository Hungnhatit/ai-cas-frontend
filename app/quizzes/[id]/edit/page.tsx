import { AuthGuard } from '@/components/auth/auth-guard';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import QuizEditor from '@/components/quizzes/quiz-editing-page';
import { QuizSetup } from '@/types/interfacess/quiz';
import React from 'react';

interface EditQuizPageProps {
  params: { id: number },
  setup: QuizSetup
}

const EditQuizPage = ({ params, setup }: EditQuizPageProps) => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <QuizEditor quiz_id={params.id} setup={setup} />
      </DashboardLayout>
    </AuthGuard>

  )
}

export default EditQuizPage