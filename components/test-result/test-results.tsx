'use client'
import { useAuth } from '@/providers/auth-provider';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Check, Clock, Edit, GraduationCap, Info, MessageCircleQuestion, MessageCircleQuestionIcon, Notebook, ShieldQuestion, Sigma, Trash2, Trophy } from 'lucide-react';
import { Button } from '../ui/button';
import { useParams, useRouter } from 'next/navigation';
import { testService } from '@/services/test/testService';
import { Test, TestAttempt } from '@/types/interfaces/model';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { getStatusLabel } from '@/utils/test';
import { calculateDuration, formatDate } from '@/utils/formatDate';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import Link from 'next/link';
import { getAttemptStatusBadge, getAttemptStatusLabel } from '@/utils/string';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';


interface TestResultsProps {
  test_id: number
}

const ITEMS_PER_PAGE = 10;

// general result page
const TestResultsPage = ({ test_id }: TestResultsProps) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<TestAttempt[]>([]);
  const [test, setTest] = useState<Test | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
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
  }, [user, test_id]);

  const handleResultPage = async (test_id: number, attempt_id: number) => {
    // router.push(`/quizzes/${test_id}/result?attempt=${attempt_id}`);
    router.push(`/tests/${test_id}/result-detail?attempt=${attempt_id}`);
  }

  const getHighestResult = (results: TestAttempt[]) => {
    if (!results.length) return 0
    return Math.max(...results.map(r => r.diem || 0))
  }

  /**
   * Pagination
   */
  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentResults = results.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  return (
    <div className='space-y-6'>
      <div className='bg-[#232f3e] p-5 -mx-4 -mt-4'>
        <h1 className="text-2xl font-bold text-white mb-2">Kết quả của bài thi <span>"{test?.tieu_de}"</span> </h1>
        <p className="text-white">Trang kết quả "Đánh giá năng lực sử dụng AI" cho phép bạn theo dõi tiến độ học tập, xem điểm chi tiết, lịch sử kiểm tra và số liệu thống kê về hiệu suất.</p>
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
                <Info size={18} className=' font-light text-gray-500' />
              </TooltipTrigger>
              <TooltipContent side='right' className='text-sm'>
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
              <TableHead className="border-r text-center border-gray-300">
                <span className='text-center'>
                  STT
                </span>
              </TableHead>
              <TableHead className="border-r text-center border-gray-300">
                <span className='text-center'>
                  ID
                </span>
              </TableHead>
              <TableHead className="border-r text-center border-gray-300">
                <span className='flex items-center justify-around text-center'>
                  Điểm số
                  <Info size={16} className='font-light text-gray-500' />
                </span>
              </TableHead>
              <TableHead className="border-r text-center border-gray-300">
                <span className='text-center justify-start'>
                  Số câu đúng
                </span>
              </TableHead>
              <TableHead className="border-r text-center border-gray-300">
                <span className='text-center'>
                  Số câu sai
                </span>
              </TableHead>
              <TableHead className="border-r text-center border-gray-300">
                <span className='text-center'>
                  Trạng thái
                </span>
              </TableHead>
              <TableHead className="border-r text-center border-gray-300">
                <span className='flex items-center justify-evenly cursor-pointer'>
                  Thời gian bắt đầu
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={16} className='font-light text-gray-500' />
                      </TooltipTrigger>
                      <TooltipContent className='text-sm'>Định dạng: giờ:phút:giây ngày/tháng/năm</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </TableHead>
              <TableHead className="border-r text-center border-gray-300">
                <span className='flex items-center justify-evenly cursor-pointer'>
                  Thời gian nộp bài
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={16} className='ml-2 font-light text-gray-500' />
                      </TooltipTrigger>
                      <TooltipContent>Định dạng: giờ:phút:giây ngày/tháng/năm</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </TableHead>
              <TableHead className="border-r text-center border-gray-300">
                <span className='text-center'>
                  Thời gian làm
                </span>
              </TableHead>
              <TableHead className=' border-r border-gray-300'>
                <span className='flex items-center justify-around text-center'>
                  Đánh giá
                  <Info size={16} className='font-light text-gray-500' />
                </span>
              </TableHead>
              <TableHead className="text-center ">
                <span className=' text-center'>
                  Hành động
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              currentResults.map((item, index) => (
                <TableRow key={item.ma_lan_lam} className='h-10'>
                  <TableCell className="border-r text-center border-gray-300">{index + 1}</TableCell>
                  <TableCell className="border-r text-center border-gray-300">{item.ma_lan_lam}</TableCell>
                  <TableCell className="border-r text-center border-gray-300">{item.diem}</TableCell>
                  <TableCell className="border-r text-center border-gray-300">{item.diem}</TableCell>
                  <TableCell className="border-r text-center border-gray-300">{item.diem}</TableCell>
                  <TableCell className={`border-r text-center border-gray-300`}>
                    <span className={`text-[13px] px-3 py-[3px] rounded-[4px] ${getAttemptStatusBadge(item.trang_thai)}`}>
                      {getAttemptStatusLabel(item.trang_thai)}
                    </span>
                  </TableCell>
                  <TableCell className='border-r text-center border-gray-300'>{formatDate(item.thoi_gian_bat_dau)}</TableCell>
                  <TableCell className='border-r text-center border-gray-300'>{formatDate(item.thoi_gian_ket_thuc) || (<span className='text-red-700 font-bold'>Không xác định</span>)}</TableCell>
                  <TableCell className='border-r text-center border-gray-300'>
                    {calculateDuration(item.thoi_gian_bat_dau, item.thoi_gian_ket_thuc)}
                  </TableCell>
                  <TableCell className='border-r border-gray-300'>
                    <div className='flex items-center justify-center'>
                      <Check size={20} className='text-center' />
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-blue-600">
                    <Button
                      variant='ghost'
                      // href={`/tests/${item.ma_kiem_tra}/result-detail?attempt=${item.ma_lan_lam}`}
                      className='cursor-pointer font-semibold hover:text-blue-700 transition-all'
                      onClick={() => handleResultPage(item.ma_kiem_tra, item.ma_lan_lam)}
                    >
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            }

          </TableBody>
        </Table>

        {results.length > ITEMS_PER_PAGE && (
          <div className="mt-5">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                </PaginationItem>

                {/* Render số trang */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (totalPages > 7 && Math.abs(page - currentPage) > 2 && page !== 1 && page !== totalPages) {
                    if (Math.abs(page - currentPage) === 3) {
                      return <PaginationItem key={page}><PaginationEllipsis /></PaginationItem>
                    }
                    return null;
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => handlePageChange(page)}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                <PaginationItem>
                  <PaginationNext
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestResultsPage