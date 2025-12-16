"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Edit, Trash2, Eye, Users, Clock, Trophy, Copy, Earth, Lock, NotebookPen, Play, FileWarning, LayoutTemplate } from "lucide-react"
import { type Quiz, type QuizQuestion, type Course } from "@/services/api"
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { quizService } from "@/services/quizService"
import { useAuth } from "@/providers/auth-provider"
import { capitalizeFirstLetter } from "@/utils/string"
import { testService } from "@/services/test/testService"
import { Test, TestAttempt } from "@/types/interfaces/model"
import { testAttemptService } from "@/services/test/testAttemptService"
import { getStatusLabel, getVisibilityLabel } from "@/utils/test"
import ConfirmModal from "@/components/modals/confirm-modal"

const TestManagementPage = () => {
  const [tests, setTests] = useState<Test[]>([])
  const [courses, setCourses] = useState<Course[]>([]);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true)
  const [selectedTest, setSelectedTest] = useState<Quiz | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user } = useAuth();

  const [newTest, setNewTest] = useState({
    title: "",
    course: "",
    description: "",
    duration: 30,
    attempts: 3,
  })
  const [questions, setQuestions] = useState<Partial<QuizQuestion>[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testData] = await Promise.all([
          testAttemptService.getTestsAttemptByStudent(user?.ma_nguoi_dung)
        ]);
        setTests(testData.data);
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []);

  console.log(tests);

  const handleCreateQuiz = async () => {
    try {
      const total_points = questions.reduce((sum, q) => sum + (q.points || 0), 0)
      const quizData = {
        ...newTest,
        questions: questions as QuizQuestion[],
        total_points,
        trang_thai: "draft" as const,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
      }

      console.log("[v0] Creating quiz:", quizData)
      // In a real app, you would call api.createQuiz(quizData)

      setIsCreateDialogOpen(false)
      setNewTest({ title: "", course: "", description: "", duration: 30, attempts: 3 })
      setQuestions([]);
      toast.success('Quiz has been created successfully!');
      router.push('/tests');
    } catch (error) {
      console.error("Failed to create quiz:", error)
    }
  }

  const handleStartTest = async (test_id: number, student_id: number) => {
    try {
      const res = await testAttemptService.startTestAttempt(test_id, student_id);
      if (res.success) {
        const attempt_id = res.data.ma_lan_lam
        router.push(`/tests/${test_id}/take?attempt=${attempt_id}`)
      }
    } catch (error) {
      console.error("Failed to start test:", error)
    }
  }

  const deleteQuiz = async (ma_kiem_tra: number) => {
    try {
      console.log("[v0] Deleting quiz:", ma_kiem_tra)
      await quizService.deleteQuiz(ma_kiem_tra);
      // setTests((prev) => prev.filter((q) => q.ma_kiem_tra !== ma_kiem_tra));
      setTests((prev) =>
        prev.map((q) =>
          q.ma_kiem_tra === ma_kiem_tra
            ? { ...q, trang_thai: 'luu_tru' }
            : q
        )
      )
      toast.success('Quiz has been archived successfully!');
    } catch (error) {
      toast.error(`Failed to archive quiz: ${error}`);
    }
  }

  const forceDeleteQuiz = async (ma_kiem_tra: number) => {
    try {
      await quizService.deleteQuiz(ma_kiem_tra, true);
      setTests((prev) => prev.filter((q) => q.ma_kiem_tra !== ma_kiem_tra));
      toast.success('Quiz has been deleted permanently!');
    } catch (error) {
      toast.error(`Failed to force delete quiz: ${error}`);
    }
  }

  const restoreQuiz = async (ma_kiem_tra: number) => {
    try {
      await quizService.restoreQuiz(ma_kiem_tra);
      setTests((prev) =>
        prev.map((q) =>
          q.ma_kiem_tra === ma_kiem_tra
            ? { ...q, trang_thai: 'ban_nhap' }
            : q
        )
      )
      toast.success('Quiz has been restored successfully!');
    } catch (error) {
      toast.error(`Failed to restore quiz: ${error}`)
    }
  }

  const handleEditQuiz = async (ma_kiem_tra: number) => {
    try {
      router.push(`/tests/${ma_kiem_tra}/edit`);
    } catch (error) {
      console.log(error)
    }
  }

  const getTestStats = () => {
    const total = tests.length
    const active = tests.filter((q) => q.trang_thai === "hoat_dong").length
    const draft = tests.filter((q) => q.trang_thai === "ban_nhap").length
    const archived = tests.filter((q) => q.trang_thai === "luu_tru").length

    return { total, active, draft, archived }
  }

  const stats = getTestStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  console.log(tests[0]);

  return (
    // <>
    //   Student test management page
    // </>
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-[#232f3e] -mx-4 -mt-4 shadow-lg p-5">
        <div>
          <h1 className="text-3xl mb-2 font-bold text-white">Bài thi</h1>
          <p className="text-white">Xem tất cả các bài kiểm tra đã tham gia hoặc được giao bởi giảng viên của bạn</p>
        </div>
        {/* <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}> */}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* -------------------------------Quiz trang_thai--------------------------------- */}
        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Tổng số bài thi</CardTitle>
            <Trophy className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{stats.total}</div>
            <p className="text-[15px] text-base">Hiển thị tổng số bài thi mà bạn đang có trong hệ thống</p>
          </CardContent>
        </Card>
        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Đã tham gia</CardTitle>
            <Eye className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{stats.active}</div>
            <p className="text-[15px] text-base">Số bài thi bạn đã thực hiện ít nhất một lần</p>
          </CardContent>
        </Card>
        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Bài thi được giao</CardTitle>
            <Edit className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{stats.draft}</div>
            <p className="text-[15px] text-base">Số bài thi mà giảng viên hoặc hệ thống đã giao cho bạn</p>
          </CardContent>
        </Card>
        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Chưa hoàn thành</CardTitle>
            <FileWarning className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{stats.draft}</div>
            <p className="text-[15px] text-base">Số bài thi được giao bạn đã bắt đầu nhưng chưa hoàn tất hoặc chưa làm</p>
          </CardContent>
        </Card>
        {/* ---------------------------------------------------------------- */}

      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="">
          <TabsTrigger value="active" className="cursor-pointer">Bài thi đã tham gia ({stats.active})</TabsTrigger>
          <TabsTrigger value="draft" className="cursor-pointer">Đã tham gia ({stats.draft})</TabsTrigger>
          <TabsTrigger value="archived" className="cursor-pointer">Được giao ({stats.archived})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {tests
              .map((test) => (
                <Card key={test.ma_kiem_tra} className="hover:shadow-md transition-shadow gap-2 py-4">
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center justify-start gap-2">
                      <div className="space-y-1">
                        <CardTitle className="text-lg mb-0">{test.tieu_de}</CardTitle>
                        <CardDescription>Khoá học</CardDescription>
                      </div>
                      {/* <Badge variant="default">{getStatusLabel(test.trang_thai)}</Badge> */}
                    </div>
                    <Button className="cursor-pointer bg-blue-600 text-white rounded-[3px]" variant="outline" size="sm" onClick={() => handleStartTest(test.ma_kiem_tra, user?.ma_nguoi_dung)}>
                      <Play />
                      Thi lại
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{test.mo_ta}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {test.thoi_luong} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        {test.tong_diem} điểm
                      </div>
                      <div className="flex items-center gap-1">
                        <LayoutTemplate className="h-4 w-4" />
                        {test.tong_so_phan} phần
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {test?.cau_hoi_trac_nghiem?.length} câu hỏi
                      </div>
                      <div className="flex items-center gap-1">
                        {test.pham_vi_hien_thi === 'cong_khai' && <Earth className="h-4 w-4" />}
                        {test.pham_vi_hien_thi === 'rieng_tu' && <Lock className="h-4 w-4" />}
                        {test.pham_vi_hien_thi === 'lop_hoc' && <NotebookPen className="h-4 w-4" />}
                        {capitalizeFirstLetter(getVisibilityLabel(test.pham_vi_hien_thi))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button className="cursor-pointer rounded-[3px]" variant="outline" size="sm" onClick={() => router.push(`/tests/${test.ma_kiem_tra}/preview`)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Xem trước
                      </Button>
                      <Button className="cursor-pointer rounded-[3px]" variant="outline" size="sm" onClick={() => { router.push(`/tests/${test.ma_kiem_tra}/results`) }}>
                        <Copy className="h-4 w-4 mr-1" />
                        Xem kết quả
                      </Button>
                      {/* <Button onClick={() => handleEditQuiz(test.ma_kiem_tra)} className="cursor-pointer" variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button> */}
                      {/* <Button className="cursor-pointer" variant="outline" size="sm" onClick={() => handleStartTest(test.ma_kiem_tra, user?.ma_nguoi_dung)}>
                        <Play />
                        Vào thi
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* draft tests */}
        <TabsContent value="draft" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tests
              .filter((test) => test.trang_thai === "ban_nhap")
              .map((test) => (
                <Card key={test.ma_kiem_tra} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{test.tieu_de}</CardTitle>
                        <CardDescription>Course</CardDescription>
                      </div>
                      <Badge variant="secondary">{test.trang_thai}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{test.mo_ta}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {test.thoi_luong} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        {test.tong_diem} điểm
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {test?.cau_hoi_trac_nghiem?.length} câu hỏi
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="cursor-pointer" onClick={() => handleEditQuiz(test.ma_kiem_tra)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Continue Editing
                      </Button>
                      <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => deleteQuiz(test.ma_kiem_tra)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tests
              .filter((test) => test.trang_thai === "luu_tru")
              .map((test) => (
                <Card key={test.ma_kiem_tra} className="hover:shadow-md transition-shadow opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{test.tieu_de}</CardTitle>
                        <CardDescription>{test.ten_bai_kiem_tra}</CardDescription>
                      </div>
                      <Badge variant="outline">{test.trang_thai}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{test.mo_ta}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {test.thoi_luong} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        {test.tong_diem} điểm
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {test?.cau_hoi_trac_nghiem?.length} câu hỏi
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => restoreQuiz(test.ma_kiem_tra)} variant="outline" size="sm" className="cursor-pointer">
                        Restore
                      </Button>
                      <ConfirmModal
                        onConfirm={() => forceDeleteQuiz(test.ma_kiem_tra)}
                        title="Are you sure to delete this quiz permantly? This action can't be undone!"
                        description='Delete permantly quiz'
                      >
                        <Button variant="outline" size="sm" className='bg-red-700 hover:bg-red-500 cursor-pointer'>
                          <Trash2 className="h-4 w-4 mr-1" color="white" />
                          <span className="text-white">Delete Permanently</span>
                        </Button>
                      </ConfirmModal>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

    </div>
  )
}

export default TestManagementPage