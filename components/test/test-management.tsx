'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Test } from '@/types/interfaces/test';
import { testAttemptService } from '@/services/test/testAttemptService';
import { useAuth } from '@/providers/auth-provider';
import { testService } from '@/services/test/testService';
import { formatDate } from '@/utils/formatDate';
import { Calendar, Slash } from 'lucide-react';
import { getDifficultyLabel, getStatusLabel } from '@/utils/test';
import TestDataTable from './table/test-data-table';

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

  useEffect(() => {
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

    fetchTests()
  }, [user?.ma_nguoi_dung]);

  console.log(tests)

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
      console.log(data.data.ma_lan_lam);
    } catch (error) {
      toast.error(`Failed when starting test: ${error}`)
    }
  }

  const handleViewResultDetail = async (test_id: number) => {
    // router.push(`/tests/${test_id}/result-detail?attempt=${attempt_id}`)
    router.push(`/tests/${test_id}/results`);
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
      toast.success(`Failed to force delete test: ${error}`)
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
  console.log(archivedTests)

  const stats = getQuizStats()

  return (
    <div className="">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-[#232f3e] flex flex-col lg:flex-row p-5 lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Tests Management</h2>
            <p className="text-white mt-2">Create, edit, and monitor your assessments</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleCreatePage()} className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
              + Create new test
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className='gap-1'>
            <CardHeader>
              <CardTitle>Total tests</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{tests.length}</div>
              <div className="text-sm text-gray-600">Total tests</div>
            </CardContent>
          </Card>
          <Card className='gap-1'>
            <CardHeader>
              <CardTitle>Total tests</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-gray-600">Active</div>
            </CardContent>
          </Card>
          <Card className='gap-1'>
            <CardHeader>
              <CardTitle>Total tests</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-gray-600">Drafts</div>
            </CardContent>
          </Card>
          <Card className='gap-1'>
            <CardHeader>
              <CardTitle>Total tests</CardTitle>
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
      <Tabs defaultValue="all">
        <div className='flex items-center justify-between'>
          <TabsList>
            <TabsTrigger value="all" className='cursor-pointer'>All tests ({stats.total})</TabsTrigger>
            <TabsTrigger value="active" className='cursor-pointer'>Active ({stats.active})</TabsTrigger>
            <TabsTrigger value="draft" className='cursor-pointer'>Drafts ({stats.draft})</TabsTrigger>
            <TabsTrigger value="archived" className='cursor-pointer'>Archived ({stats.archived})</TabsTrigger>
          </TabsList>
          <Button variant="outline" className='cursor-pointer' onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}>
            {viewMode === 'grid' ? 'Table View' : 'Grid View'}
          </Button>
        </div>

        <TabsContent value="all" className="mt-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {tests.map(test => (
                <Card key={test.ma_kiem_tra} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg">{test.tieu_de}</CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${test.trang_thai === 'hoat_dong' ? 'bg-green-100 text-green-700' :
                        test.trang_thai === 'ban_nhap' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                        {test.trang_thai.charAt(0).toUpperCase() + test.trang_thai.slice(1)}
                      </span>
                    </div>
                    <CardDescription className="line-clamp-2">{test.mo_ta}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-gray-600">Duration</div>
                          <div className="font-medium">{test.thoi_luong / 60} min</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Questions</div>
                          <div className="font-medium">{test?.cau_hoi?.length}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Attempts</div>
                          <div className="font-medium">{test.so_lan_lam_toi_da}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Avg Score</div>
                          <div className="font-medium">test.avgScore%</div>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="text-xs text-gray-500">
                          Last modified: {test.ngay_cap_nhat}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" size="sm" className="flex-1 cursor-pointer">
                        Edit
                      </Button>
                      <Button onClick={() => handleStartTest(test.ma_kiem_tra, user?.ma_nguoi_dung)} variant="default" size="sm" className="flex-1 cursor-pointer">
                        Start
                      </Button>
                    </div>
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" size="sm" className="flex-1 cursor-pointer"
                        onClick={() => {
                          handleViewResultDetail(test.ma_kiem_tra)
                        }}
                      >
                        Results
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 cursor-pointer">
                        Duplicate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 cursor-pointer"
                        onClick={() => {
                          setSelectedtest(test.ma_kiem_tra.toString());
                          setShowDeleteDialog(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Tên bài kiểm tra</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Trạng thái</th>
                    {/* <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Số lượng câu hỏi</th> */}
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Số lần làm</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Điểm trung bình</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Tỉ lệ pass</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Chỉnh sửa lần cuối</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {tests.map(test => (
                    <tr key={test.ma_kiem_tra} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 mb-1">{test.tieu_de}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <div>
                            <span>Mức độ: </span>
                            {getDifficultyLabel(test.do_kho)}
                          </div>
                          <span className='px-1'>|</span>
                          <div>
                            <span>Số câu hỏi: </span>
                            {test?.cau_hoi_kiem_tra?.length}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${test.trang_thai === 'hoat_dong' ? 'bg-green-100 text-green-700' :
                          test.trang_thai === 'ban_nhap' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                          {/* {test.trang_thai.charAt(0).toUpperCase() + test.trang_thai.slice(1)} */}
                          {getStatusLabel(test.trang_thai)}
                        </span>
                      </td>
                      {/* <td className="px-6 py-4 text-sm">{test?.cau_hoi_kiem_tra?.length}</td> */}
                      <td className="px-6 py-4 text-sm">{test.so_lan_lam_toi_da}</td>
                      <td className="px-6 py-4 text-sm font-medium">{test.avgScore}%</td>
                      <td className="px-6 py-4 text-sm">{test.passRate}%</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className='flex items-center'>
                          <Calendar size={16} className='mr-2' />
                          {formatDate(test.ngay_cap_nhat)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <Button onClick={() => handleEditingPage(test.ma_kiem_tra)} variant="ghost" size="sm" className='cursor-pointer'>Edit</Button>
                          <Button onClick={() => handleViewResultDetail(test.ma_kiem_tra)} variant="ghost" size="sm" className='cursor-pointer'>Results</Button>
                          <Button onClick={() => handleDeleteTest(test.ma_kiem_tra)} variant="ghost" size="sm" className='cursor-pointer text-red-600'>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
