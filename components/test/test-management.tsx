'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Test } from '@/types/interfaces/model';
import { testAttemptService } from '@/services/test/testAttemptService';
import { useAuth } from '@/providers/auth-provider';
import { testService } from '@/services/test/testService';
import { formatDate } from '@/utils/formatDate';
import { Award, Brain, BrainCircuit, Calendar, Clock, NotebookPen, RotateCcw, Sparkles, SquarePen, Trash, Trash2, Users } from 'lucide-react';
import { getDifficultyLabel, getStatusLabel } from '@/utils/test';
import TestDataTable from './table/test-data-table';
import { getVisibilityIcon } from '@/utils/tests';
import { Input } from '../ui/input';
import Link from 'next/link';
import ConfirmModal from '../modals/confirm-modal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface Question {
  id: string;
  type: 'multiple-choice' | 'multiple-select' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  userAnswer?: string | string[];
}

interface TestResult {
  test_id: string;
  testName: string;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  questions: Question[];
}
const TestManagement = () => {
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedtest, setSelectedtest] = useState<string | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const router = useRouter();
  const { user } = useAuth();

  /**
   * Search
   */
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<"all" | "hoat_dong" | "ban_nhap" | "luu_tru">('all');

  const filteredTests = useMemo(() => {
    return tests
      .filter(test => {
        if (statusFilter === 'all') return true;
        return test.trang_thai === statusFilter;
      })
      .filter(test =>
        test.tieu_de.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [tests, searchQuery, statusFilter]);

  const status = {
    total: tests.length,
    active: tests.filter(t => t.trang_thai === 'hoat_dong').length,
    drafts: tests.filter(t => t.trang_thai === 'ban_nhap').length,
    totalAttempts: tests.reduce((sum, t) => sum + t.so_lan_lam_toi_da, 0),
  };
  console.log(user)
  useEffect(() => {
    if (!user) return;
    const fetchTests = async () => {
      setLoading(false);
      try {
        const [resTest] = await Promise.all([
          testService.getTestsByInstructorId(user?.ma_nguoi_dung)
        ]);

        resTest.success && setTests(resTest.data);
      } catch (error) {
        console.log(error);
        toast.error(`Error when fetching test: ${error}`);
      } finally {
        setLoading(false);
      }
    }

    if (user?.ma_nguoi_dung) {
      fetchTests()
    }
  }, [user?.ma_nguoi_dung]);

  const handleCreatePage = () => {
    router.push('/tests/create');
  }

  const handleCreateTest = async () => {

  }

  const handleStartTest = async (test_id: number, student_id: number) => {
    try {
      const data = await testAttemptService.startTestAttempt(test_id, student_id);
      if (data.success) {
        const attempt_id = data.data.ma_lan_lam;
        router.push(`/tests/${test_id}/take?attempt=${attempt_id}`);
      }
    } catch (error) {
      toast.error(`Failed when starting test: ${error}`)
    }
  }

  const handleViewResultDetail = async (test_id: number) => {
    // router.push(`/tests/${test_id}/result-detail?attempt=${attempt_id}`)
    router.push(`/tests/${test_id}/results`);
  }

  const handleDetailTest = async (test_id: number) => {

  }

  const handleEditingPage = async (test_id: number) => {
    router.push(`/tests/${test_id}/edit`);
  }

  const handleRestore = async (test_id: number) => {
    try {
      await testService.restoreTest(test_id);
      setTests((prev) =>
        prev.map((test) =>
          test.ma_kiem_tra === test_id
            ? { ...test, trang_thai: 'ban_nhap' }
            : test
        )
      );
      toast.success('Test has been restored successfully!');
    } catch (error) {
      toast.error(`Failded to restore test: ${error}`);
    }
  }

  const handleDeleteTest = async (test_id: number) => {
    try {
      console.log("[v0] Deleting test:", test_id)
      await testService.deleteTest(test_id);
      setTests((prev) =>
        prev.map((t) =>
          t.ma_kiem_tra === test_id
            ? { ...t, trang_thai: 'luu_tru' }
            : t
        ));
      toast.success('Test has been archived successfully!');
    } catch (error) {
      toast.error(`Failed to archive test: ${error}`);
    }
  }

  const handleForceDelete = async (test_id: number) => {
    try {
      await testService.deleteTest(test_id, true);
      setTests((prev) => prev.filter((test) => test.ma_kiem_tra !== test_id));
      toast.success('Test deleted successfully!');
    } catch (error) {
      toast.error(`Failed to force delete test: ${error}`)
    }
  }

  const getQuizStats = () => {
    const total = tests.length
    const active = tests.filter((q) => q.trang_thai === "hoat_dong").length
    const draft = tests.filter((q) => q.trang_thai === "ban_nhap").length
    const archived = tests.filter((q) => q.trang_thai === "luu_tru").length

    return { total, active, draft, archived }
  }

  const archivedTests = tests.filter((test) => test.trang_thai === 'luu_tru');

  const stats = getQuizStats();

  return (
    <div className="">
      {/* Header Section */}
      <div className="mb-4">
        <div className="-m-4 bg-[#232f3e] flex flex-col lg:flex-row p-5 lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Quản lý bài thi</h2>
            <p className="text-white mt-2">Tạo, chỉnh sửa và theo dõi bài thi của bạn</p>
          </div>
          <div className="flex gap-2">
            <Button className='rounded-[3px] cursor-pointer' onClick={() => router.push('/tests/ai-generation')}>
              <Sparkles />
              Sử dụng AI để tạo bài thi
            </Button>
            <Button onClick={() => handleCreatePage()} className="bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-[3px]">
              + Tạo bài thi mới
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className='gap-0 rounded-[3px] hover:shadow-lg transition-all cursor-pointer'>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                Số bài kiểm tra
                <span><NotebookPen size={18} className='mr-2' color='blue' /></span>
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{tests.length}</div>
              <div className="text-sm text-gray-600">Tổng số bài test đã được tạo</div>
            </CardContent>
          </Card>
          <Card className='gap-1 rounded-[3px] hover:shadow-lg transition-all cursor-pointer'>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                Tổng số lượt nộp
                <span><Users size={18} className='mr-2' color='green' /></span>
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-gray-600">Trên tất cả các bài test</div>
            </CardContent>
          </Card>
          <Card className='gap-1 rounded-[3px] hover:shadow-lg transition-all cursor-pointer'>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                Đang chờ chấm điểm
                <span><Clock size={18} className='mr-2' color='red' /></span>
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-gray-600">Drafts</div>
            </CardContent>
          </Card>
          <Card className='gap-1 rounded-[3px] hover:shadow-lg transition-all cursor-pointer'>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                Điểm trung bình
                <span><Award size={18} className='mr-2 font-bold' color='orange' /></span>
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-600">1,245</div>
              <div className="text-sm text-gray-600">Total Attempts</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className='gap-1'>
        <div className="flex items-center mb-2">
          <Input
            placeholder="Tìm kiếm theo tên bài test..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="max-w-sm shadow-none border border-gray-300 rounded-[3px]"
          />
          <select
            className="ml-4 h-9 rounded-[3px] border border-gray-300 bg-background px-3 py-2 text-sm cursor-pointer"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as "all" | "hoat_dong" | "ban_nhap" | "luu_tru")}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="hoat_dong">Hoạt động</option>
            <option value="ban_nhap">Bản nháp</option>
            <option value="luu_tru">Đã lưu trữ</option>
          </select>
        </div>

        <TabsContent value="all" className="">
          <div className="bg-white rounded-[3px] border overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="border-r border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-600">#</th>
                  <th className="border-r border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-600">Tên bài kiểm tra</th>
                  <th className="border-r border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-600">Trạng thái</th>
                  {/* <th className="p-3 text-left text-sm font-medium text-gray-600">Số lượng câu hỏi</th> */}
                  <th className="border-r border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-600">Số lần làm</th>
                  <th className="border-r border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-600">Điểm trung bình</th>
                  <th className="border-r border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-600">Tỉ lệ pass</th>
                  <th className="border-r border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-600">Chỉnh sửa lần cuối</th>
                  <th className="border-r border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-600">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTests.map((test, index) => (
                  <tr key={test.ma_kiem_tra} className="hover:bg-gray-50">
                    <td className='border-r border-gray-200 text-center'>{index + 1}</td>
                    <td className="border-r border-gray-200 w-96 p-3">
                      <div className="flex items-center font-medium text-gray-900 hover:underline mb-1 cursor-pointer transition-all">
                        <Link href={`/tests/${test.ma_kiem_tra}/detail`}>{test.tieu_de}</Link>
                        {getVisibilityIcon(test?.pham_vi_hien_thi)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mb-1">
                        <div className=''>
                          <span>Mức độ: </span>
                          {getDifficultyLabel(test.do_kho)}
                        </div>
                        <span className='px-1'>|</span>
                        <div>
                          <span>Số câu hỏi: </span>
                          {test?.cau_hoi_kiem_tra?.length}
                        </div>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {(JSON.parse(test?.danh_muc))?.map((item: string, index: number) => (
                          <span key={index} className='text-xs border border-blue-400 px-2 py-1 rounded-[3px]'>
                            {item}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="border-r border-gray-200 p-3 ">
                      <span className={`px-2 py-1 text-nowrap rounded-full text-xs font-medium ${test.trang_thai === 'hoat_dong' ? 'bg-green-100 text-green-700' :
                        test.trang_thai === 'ban_nhap' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                        {getStatusLabel(test.trang_thai)}
                      </span>
                    </td>
                    {/* <td className="border-r border-gray-200 p-3 text-sm">{test?.cau_hoi_kiem_tra?.length}</td > */}
                    <td className="border-r border-gray-200 p-3 text-sm">{test.so_lan_lam_toi_da}</td>
                    <td className="border-r border-gray-200 p-3 text-sm font-medium">{test.avgScore}%</td>
                    <td className="border-r border-gray-200 p-3 text-sm">{test.passRate}%</td>
                    <td className="border-r border-gray-200 p-3 text-sm text-gray-500 ">
                      <div className='flex items-center'>
                        <Calendar size={16} className='mr-2' />
                        {formatDate(test.ngay_cap_nhat)}
                      </div>
                    </td>
                    <td className="border-r border-gray-200 p-3 ">
                      <div className="flex gap-1">
                        <Button onClick={() => handleEditingPage(test.ma_kiem_tra)} variant="ghost" size="sm" className='cursor-pointer'>
                          <SquarePen />
                        </Button>
                        {/* <Button onClick={() => handleViewResultDetail(test.ma_kiem_tra)} variant="ghost" size="sm" className='cursor-pointer'>Results</Button> */}
                        {/* <Button onClick={() => handleDetailTest(test.ma_kiem_tra)} variant="ghost" size="sm" className='cursor-pointer'>Detail</Button> */}
                        {
                          test.trang_thai === 'luu_tru' &&
                          <Button onClick={() => handleRestore(test.ma_kiem_tra)} variant="ghost" size="sm" className='cursor-pointer'>
                            <RotateCcw />
                          </Button>
                        }
                        {test.trang_thai !== 'luu_tru' && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => handleDeleteTest(test.ma_kiem_tra)}
                                  variant="ghost"
                                  size="sm"
                                  className='cursor-pointer text-red-600'>
                                  <Trash2 />
                                  {/* Xoá */}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Xoá</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                        {test.trang_thai === 'luu_tru' &&
                          <ConfirmModal
                            onConfirm={() => handleForceDelete(test.ma_kiem_tra)}
                            title="Bạn chắc chắn muốn xoá bài thi? Hành động này không thể hoàn tác"
                            description='Xoá vĩnh viễn bài thi'
                          >
                            <Button
                              onClick={() => handleDeleteTest(test.ma_kiem_tra)}
                              variant="ghost"
                              size="sm"
                              className='cursor-pointer text-red-600'>
                              <Button variant="ghost" size="sm" className='cursor-pointer text-red-600'>
                                <Trash />
                              </Button>
                            </Button>
                          </ConfirmModal>
                        }
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTests.length === 0 && (
              <div className='w-full text-center py-4 italic text-gray-500'>
                Không tìm thấy bài test nào!
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tests.filter(e => e.trang_thai === 'hoat_dong').map(test => (
              <Card key={test.ma_kiem_tra}>
                <CardHeader>
                  <CardTitle>{test.tieu_de}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attempts:</span>
                      <span className="font-medium">{test.so_lan_lam_toi_da}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Score:</span>
                      <span className="font-medium">test.avgScore%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tests.filter(e => e.trang_thai === 'ban_nhap').map(test => (
              <Card key={test.ma_kiem_tra}>
                <CardHeader>
                  <CardTitle>{test.tieu_de}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Created: {test.ngay_tao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="archived" className="mt-6">
          {/* <p className="text-gray-600 text-center py-8">No archived tests</p> */}
          <TestDataTable
            tests={archivedTests}
            handleRestore={handleRestore}
            handleForceDelete={handleForceDelete}
          />
        </TabsContent>
      </Tabs>

      {/* Create test Dialog */}
      <AlertDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Create New test</AlertDialogTitle>
            <AlertDialogDescription>
              Fill in the details to create a new assessment
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">test Name</label>
              <input type="text" className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="e.g., Advanced JavaScript" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea className="w-full mt-1 px-3 py-2 border rounded-lg" rows={3} placeholder="Describe the test content..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Duration (minutes)</label>
                <input type="number" className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="60" />
              </div>
              <div>
                <label className="text-sm font-medium">Difficulty</label>
                <select className="w-full mt-1 px-3 py-2 border rounded-lg">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Create test</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete test?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the test and all associated data including student attempts and results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default TestManagement
