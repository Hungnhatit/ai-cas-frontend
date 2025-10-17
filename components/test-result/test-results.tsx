'use client'
import { useAuth } from '@/providers/auth-provider';
import { QuizAttempt } from '@/services/api';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Clock, Edit, Eye, Notebook, Trash2, Trophy } from 'lucide-react';
import { Button } from '../ui/button';
import { useParams, useRouter } from 'next/navigation';
import { testService } from '@/services/test/testService';
import { Test, TestAttempt } from '@/types/interfaces/test';

interface TestResultsProps {
  test_id: number
}

// general result page
const TestResultsPage = ({ test_id }: TestResultsProps) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<TestAttempt[]>([]);
  const [test, setTest] = useState<Test[]>([]);
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const [test, testResults] = await Promise.all([
          // quizService.getQuizById(test_id),
          // quizService.getQuizResults(test_id, user?.user_id)
          testService.getTestById(test_id),
          testService.getTestResults(test_id, user?.ma_nguoi_dung)
        ]);
        setTest(test.data)
        setResults(testResults.data);
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    }

    fetchTestResults();
  }, []);

  console.log('test: ', test)
  console.log('results: ', results);

  const handleResultPage = async (test_id: number, attempt_id: number) => {
    // router.push(`/quizzes/${test_id}/result?attempt=${attempt_id}`);
    router.push(`/tests/${test_id}/result-detail?attempt=${attempt_id}`);
  }

  console.log(id);

  return (
    <div className='space-y-6'>
      <div className='bg-[#232f3e] p-5'>
        <h1 className="text-2xl font-bold text-white mb-2">Test Results for <span>"{test.tieu_de}"</span> </h1>
        <p className="text-white">Test your knowledge and track your progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2">
        <Card className='md:gap-2'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attempt</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
          </CardContent>
        </Card>
        <Card className='md:gap-2'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">stats.active</div>
          </CardContent>
        </Card>
        <Card className='md:gap-2'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Edit className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">stats.draft</div>
          </CardContent>
        </Card>
        <Card className='md:gap-2'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-wrap">stats.archived</div>
          </CardContent>
        </Card>
      </div>


      <div>
        <div className='mb-2'>
          <h1 className="text-2xl font-bold">Recent Attempts</h1>
          <p className="text-muted-foreground">Result of all your attempt</p>
        </div>

        <div className=''>
          <div className='flex flex-col gap-3'>
            {
              results.map((item) => (
                <div key={item.ma_lan_lam}>
                  <Card className='flex flex-row justify-between pr-4'>
                    <div className='w-full'>
                      <CardHeader>Result of Attempt #{item.ma_lan_lam}</CardHeader>
                      <CardContent>
                        <div className='flex items-center text-sm text-gray-500 mb-1'>
                          <span className='flex items-center'>
                            <Clock size={16} className='mr-1' />
                            Time submitted:
                          </span>
                          <span>{item.thoi_gian_ket_thuc}</span>
                        </div>
                        <div className='flex items-center'>
                          <Notebook size={16}  className='mr-1'/>
                          <span className='font-bold mr-1'>Score: </span>
                          {item.diem}
                        </div>
                      </CardContent>
                    </div>

                    {/* redirect to quiz result detail page */}
                    <Button onClick={() => handleResultPage(item.ma_kiem_tra, item.ma_lan_lam)} className='cursor-pointer'>View detail</Button>
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

export default TestResultsPage