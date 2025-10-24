'use client'
import { useAuth } from '@/providers/auth-provider';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Clock, Edit, GraduationCap, MessageCircleQuestion, MessageCircleQuestionIcon, Notebook, ShieldQuestion, Sigma, Trash2, Trophy } from 'lucide-react';
import { Button } from '../ui/button';
import { useParams, useRouter } from 'next/navigation';
import { testService } from '@/services/test/testService';
import { Test, TestAttempt } from '@/types/interfaces/model';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { getStatusLabel } from '@/utils/test';
import { calculateDuration, formatDate } from '@/utils/formatDate';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import Link from 'next/link';
import { QuestionMarkCircleSolidIcon } from '../ui/icons/heroicons-question-mark-circle-solid';


interface TestResultsProps {
  test_id: number
}

// general result page
const TestResultsPage = ({ test_id }: TestResultsProps) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<TestAttempt[]>([]);
  const [test, setTest] = useState<Test | null>(null);
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const [test, testResults] = await Promise.all([
          testService.getTestById(test_id),
          testService.getTestResults(test_id, user?.ma_nguoi_dung)
        ]);
        setTest(test?.data)
        setResults(testResults.data);
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    }

    fetchTestResults();
  }, []);

  const handleResultPage = async (test_id: number, attempt_id: number) => {
    // router.push(`/quizzes/${test_id}/result?attempt=${attempt_id}`);
    router.push(`/tests/${test_id}/result-detail?attempt=${attempt_id}`);
  }

  const getHighestResult = (results: TestAttempt[]) => {
    if (!results.length) return 0
    return Math.max(...results.map(r => r.diem || 0))
  }

  return (
    <div className='space-y-6'>
      <div className='bg-[#232f3e] p-5'>
        <h1 className="text-2xl font-bold text-white mb-2">Kết quả của bài thi <span>"{test?.tieu_de}"</span> </h1>
        <p className="text-white">Test your knowledge and track your progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2">
        <Card className='md:gap-2'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Tổng số lần làm bài</CardTitle>
            <Sigma size={22} className='text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{results.length}</div>
            <CardDescription>Tổng số lượt bạn đã tham gia làm bài thi, bao gồm cả những lần làm lại</CardDescription>
          </CardContent>
        </Card>
        <Card className='md:gap-2'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Điểm cao nhất</CardTitle>
            <GraduationCap size={22} className="text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{getHighestResult(results)}</div>
            <CardDescription>Kết quả tốt nhất bạn đạt được cho bài thi này — để bạn biết mốc cần vượt qua</CardDescription>
          </CardContent>
        </Card>
        <Card className='md:gap-2'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Điểm trung bình</CardTitle>
            <Edit size={22} className=" text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">stats.draft</div>
            <CardDescription>Điểm trung bình phản ánh mức độ ổn định của bạn qua các lần làm bài</CardDescription>
          </CardContent>
        </Card>
        <Card className='md:gap-2'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Thời gian trung bình</CardTitle>
            <Clock size={22} className='text-cyan-700' />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2 text-wrap">stats.archived</div>
            <CardDescription>Trung bình bạn mất bao lâu để hoàn thành mỗi bài</CardDescription>
          </CardContent>
        </Card>
      </div>


      <div className=''>
        <div className='mb-2'>
          <div className="flex items-center text-2xl font-bold">
            <span className='mr-2'>Lịch sử làm bài</span>
            <Tooltip>
              <TooltipTrigger className='cursor-pointer'>
                <QuestionMarkCircleSolidIcon size={18} className=' font-light text-gray-500' />
              </TooltipTrigger>
              <TooltipContent side='right'>
                <p>Toàn bộ lịch sử làm bài và các thông tin liên quan</p>
              </TooltipContent>
            </Tooltip>
          </div>
          {/* <p className="text-muted-foreground">Result of all your attempt</p> */}
        </div>
        <Table className='border'>
          <TableCaption className='text-md'>Lịch sử các lần làm bài của <span className='font-medium italic'>{test?.tieu_de}</span></TableCaption>
          <TableHeader className='bg-gray-200/80'>
            <TableRow>
              <TableHead className="border-r border-gray-300">
                <span className='flex items-center justify-start'>
                  Lần làm
                  <QuestionMarkCircleSolidIcon size={16} className='ml-2 font-light text-gray-500' />
                </span>
              </TableHead>
              <TableHead className="border-r border-gray-300">
                <span className='flex items-center justify-start'>
                  Điểm số
                  <QuestionMarkCircleSolidIcon size={16} className='ml-2 font-light text-gray-500' />
                </span>
              </TableHead>
              <TableHead className="border-r border-gray-300">
                <span className='flex items-center justify-start'>
                  Số câu đúng
                  <QuestionMarkCircleSolidIcon size={16} className='ml-2 font-light text-gray-500' />
                </span>
              </TableHead>
              <TableHead className="border-r border-gray-300">
                <span className='flex items-center justify-start'>
                  Số câu sai
                  <QuestionMarkCircleSolidIcon size={16} className='ml-2 font-light text-gray-500' />
                </span>
              </TableHead>
              <TableHead className="border-r border-gray-300">
                <span className='flex items-center justify-start'>
                  Trạng thái
                  <QuestionMarkCircleSolidIcon size={16} className='ml-2 font-light text-gray-500' />
                </span>
              </TableHead>
              <TableHead className="border-r border-gray-300">
                <span className='flex items-center justify-start'>
                  Thời gian bắt đầu
                  <QuestionMarkCircleSolidIcon size={16} className='ml-2 font-light text-gray-500' />
                </span>
              </TableHead>
              <TableHead className="border-r border-gray-300">
                <span className='flex items-center justify-start'>
                  Thời gian nộp bài
                  <QuestionMarkCircleSolidIcon size={16} className='ml-2 font-light text-gray-500' />
                </span>
              </TableHead>
              <TableHead className="border-r border-gray-300">
                <span className='flex items-center justify-start'>
                  Thời gian làm
                  <QuestionMarkCircleSolidIcon size={16} className='ml-2 font-light text-gray-500' />
                </span>
              </TableHead>
              <TableHead className="text-right">
                <span className='flex items-center justify-start'>
                  Hành động
                  <QuestionMarkCircleSolidIcon size={16} className='ml-2 font-light text-gray-500' />
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              results.map((item, index) => (
                <TableRow key={item.ma_lan_lam} className='h-10'>
                  <TableCell className="border-r border-gray-300">#{index + 1}</TableCell>
                  <TableCell className="border-r border-gray-300">{item.diem}</TableCell>
                  <TableCell className="border-r border-gray-300">{item.diem}</TableCell>
                  <TableCell className="border-r border-gray-300">{item.diem}</TableCell>
                  <TableCell className='border-r border-gray-300'>{getStatusLabel(item.trang_thai)}</TableCell>
                  <TableCell className='border-r border-gray-300'>{formatDate(item.thoi_gian_bat_dau)}</TableCell>
                  <TableCell className='border-r border-gray-300'>{formatDate(item.thoi_gian_ket_thuc) || (<span className='text-red-600 font-bold'>Không xác định</span>)}</TableCell>
                  <TableCell className='border-r border-gray-300'>
                    {calculateDuration(item.thoi_gian_bat_dau, item.thoi_gian_ket_thuc)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/tests/${item.ma_kiem_tra}/result-detail?attempt=${item.ma_lan_lam}`}
                      className='cursor-pointer hover:text-sky-600'
                    // onClick={() => handleResultPage(item.ma_kiem_tra, item.ma_lan_lam)}
                    >
                      Xem chi tiết
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            }

          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default TestResultsPage