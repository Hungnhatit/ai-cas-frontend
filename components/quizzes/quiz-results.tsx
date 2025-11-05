'use client'
import { useAuth } from '@/providers/auth-provider';
import { Quiz, QuizAttempt } from '@/services/api';
import { quizService } from '@/services/quizService';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Edit, Eye, Trash2, Trophy } from 'lucide-react';
import { Button } from '../ui/button';
import { useParams, useRouter } from 'next/navigation';

interface QuizResultsPageProps {
  quiz_id: number
}

// general result page
const QuizResultsPage = ({ quiz_id }: QuizResultsPageProps) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<QuizAttempt[]>([]);
  const [quiz, setQuiz] = useState<Quiz[]>([]);
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const [quiz, quizResults] = await Promise.all([
          quizService.getQuizById(quiz_id),
          quizService.getQuizResults(quiz_id, user?.user_id)
        ]);

        setQuiz(quiz)
        setResults(quizResults);
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    }

    fetchQuizResults();
  }, []);

  const handleResultPage = async (quiz_id: number, quizAttempt_id: number) => {
    // router.push(`/quizzes/${quiz_id}/result?attempt=${quizAttempt_id}`);
    router.push(`/quizzes/${quiz_id}/result-detail?attempt=${quizAttempt_id}`);
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className="text-2xl font-bold">Quiz Results for <span>"{quiz?.title}"</span> </h1>
        <p className="text-muted-foreground">Test your knowledge and track your progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attempt</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">stats.active</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Edit className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">stats.draft</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">stats.archived</div>
          </CardContent>
        </Card>
      </div>


      <div>
        <div>
          <h1 className="text-2xl font-bold">Recent Attempts</h1>
          <p className="text-white">Result of all your attempt</p>
        </div>

        <div className=''>
          <div className='flex flex-col gap-3'>
            {
              results.map((item) => (
                <div key={item.quizAttempt_id}>
                  <Card className='flex flex-row justify-between pr-4'>
                    <div className='w-full'>
                      <CardHeader>Attempt #{item.quizAttempt_id} - Result</CardHeader>
                      <CardContent>
                        <div>Score: {item.score}</div>
                      </CardContent>
                    </div>

                    {/* redirect to quiz result detail page */}
                    <Button onClick={() => handleResultPage(quiz_id, item.quizAttempt_id)} className='cursor-pointer'>View detail</Button>
                  </Card>
                </div>
              ))
            }
          </div>
        </div>

      </div>
    </div>
  )
}

export default QuizResultsPage