'use client'
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Check, Plus, Save, Trash2 } from 'lucide-react';
import { TestSetup } from '@/types/interfacess/quiz';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Course, Quiz, QuizQuestion } from '@/services/api';
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { quizService } from '@/services/quizService';
import { studentService } from '@/services/studentService';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { testService } from '@/services/test/testService';
import { Student } from '@/types/interfaces/model';
import { Test, TestQuestion } from '@/types/interfaces/test';

interface TestEditProp {
  test_id: number,
  setup: TestSetup,
}

const TestEditor = ({ test_id, setup }: TestEditProp) => {
  const [test, setTest] = useState<Test[]>([])
  const [search, setSearch] = useState("")
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [testStatus, setTestStatus] = useState('');
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user } = useAuth();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const router = useRouter();

  const [newTest, setNewTest] = useState({
    tieu_de: "",
    mo_ta: "",
    thoi_luong: 30,
    so_lan_lam_toi_da: 3,
  });

  const [newStudent, setNewStudent] = useState({
    ma_hoc_vien: '',
    ten: ''
  })

  const [questions, setQuestions] = useState<Partial<TestQuestion>[]>([])

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await testService.getTestById(test_id);

        const parsedData = (data.data.cau_hoi || []).map((question: any) => ({
          ...question,
          lua_chon: typeof question.lua_chon === 'string' ? JSON.parse(question.lua_chon) : question.lua_chon,
          dap_an_dung: question.dap_an_dung !== undefined ? Number(question.dap_an_dung) : undefined
        }));

        const res = await studentService.getStudentByInstructorId(user?.ma_nguoi_dung);

        setStudents(res.data.hoc_vien);
        setTest(data.data);
        setNewTest({
          tieu_de: data.data.tieu_de || "",
          // course: data.data.course || "",
          mo_ta: data.data.mo_ta || "",
          thoi_luong: data.data.thoi_luong || 30,
          so_lan_lam_toi_da: data.data.so_lan_lam_toi_da || 3,
        });
        setQuestions(parsedData);
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        ma_cau_hoi: questions.length + 1,
        cau_hoi: "",
        loai: "trac_nghiem",
        lua_chon: ["", "", "", ""],
        dap_an_dung: 0,
        diem: 10,
      },
    ])
  }

  const updateQuestion = (index: number, updates: Partial<TestQuestion>) => {
    setQuestions(questions.map((q, i) => (
      i === index
        ? { ...q, ...updates }
        : q)))
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  // handle select student
  const handleSelectStudent = (student_id: string) => {
    const student = students.find((s) => s.ma_hoc_vien.toString() === student_id)
    if (student) {
      setNewStudent({
        ma_hoc_vien: student.ma_hoc_vien.toString(),
        ten: student.ten,
      })
    }
  }

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]) // clear
    } else {
      setSelectedStudents(students.map((s) => s.ma_hoc_vien.toString())) // select all
    }
  }

  const filtered = students.filter((s) =>
    s.ten.toLowerCase().includes(search.toLowerCase())
  )

  const placeholder =
    selectedStudents.length === 0
      ? "Select students..."
      : selectedStudents.length === students.length
        ? "All students selected"
        : `${selectedStudents.length} students selected`

  // handle create test when submit
  const handleCreateTest = async () => {
    try {
      const total_points = questions.reduce((sum, q) => sum + (q.diem || 0), 0)
      const testData = {
        ...newTest,
        ma_giang_vien: user?.user_id,
        cau_hoi: questions as TestQuestion[],
        tong_diem: total_points,
        trang_thai: "draft" as const,
        ngay_ket_thuc: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
      }

      console.log("[v0] Creating test:", testData)
      const res = await testService.createTest(testData);
      // In a real app, you would call api.createQuiz(quizData)

      setIsCreateDialogOpen(false)
      setNewTest({ tieu_de: "", mo_ta: "", thoi_luong: 30, so_lan_lam_toi_da: 3 })
      setQuestions([]);
      toast.success('Test has been created successfully!');
      router.push('/test');
    } catch (error) {
      console.error("Failed to create test:", error)
    }
  }

  const handleUpdateTest = async () => {
    try {
      const total_points = test?.cau_hoi?.reduce((sum, q) => sum + (q.diem || 0), 0) ?? 0;
      const updatedData = {
        ...newTest,
        ma_giang_vien: user?.ma_nguoi_dung,
        cau_hoi: questions as TestQuestion[],
        tong_diem: total_points,
        trang_thai: 'hoat_dong',
        ngay_het_han: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0]
      }

      console.log(updatedData);

      console.log("[v0] Updating test:", updatedData);

      const res = await testService.updateTest(test_id, updatedData);

      // await quizService.assignQuiz(test_id, selectedStudents);
      setIsCreateDialogOpen(false)
      setNewTest({
        tieu_de: "",
        mo_ta: "",
        thoi_luong: 30,
        so_lan_lam_toi_da: 3,
      });
      setQuestions([]);
      toast.success("Test has been updated successfully!");
      router.push("/tests");
    } catch (error) {
      console.log(error)
    }
  }

  const duplicateTest = async (quiz: Quiz) => {
    try {
      console.log("[v0] Duplicating quiz:", quiz.id)
      // In a real app, you would call api.duplicateTest(quiz.id)
    } catch (error) {
      console.error("Failed to duplicate quiz:", error)
    }
  }

  const deleteTest = async (test_id: number) => {
    try {
      console.log("[v0] Deleting test:", test_id)
      // In a real app, you would call api.deleteTest(test_id)
      setTest(test?.filter((q) => q.ma_kiem_tra !== test_id))
    } catch (error) {
      console.error("Failed to delete test:", error)
    }
  }

  // const getQuizStats = () => {
  //   const total = test?.length
  //   const active = test?.filter((q) => q.trang_thai === "active")?.length
  //   const draft = test?.filter((q) => q.trang_thai === "draft")?.length
  //   const archived = test?.filter((q) => q.trang_thai === "archived")?.length

  //   return { total, active, draft, archived }
  // }

  // const stats = getQuizStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  const handleSetupChange = (setup: TestSetup) => {
    setTest(prev => ({ ...prev, setup }));
  };

  const handleQuestionsChange = (questions: TestQuestion[]) => {
    setTest(prev => ({ ...prev, questions }));
  };

  // const handleCancel = () => {
  //   if (test.setup.title || test?.questions?.length > 0) {
  //     if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
  //       setTest({
  //         setup: {
  //           title: '',
  //           course: '',
  //           description: '',
  //           duration: 60,
  //           attemptsAllowed: 3
  //         },
  //         questions: [],
  //         quiz: []
  //       });
  //       toast.info('Quiz creation cancelled');
  //     }
  //   }
  // };

  const total_points = test?.cau_hoi?.reduce((sum, q) => sum + (q.diem || 0), 0) ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#232f3e] border py-2 border-gray-300 sticky top-0 z-10 mb-4">
        <div className="mx-auto px-4 sm:px-6 lg:px-8  py-2">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className='cursor-pointer flex items-center justify-center hover:bg-gray-600'
                // handle cancel
                onClick={() => router.push('/tests')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" color='white' />
                <span className='text-white'>Back</span>
              </Button>
              <div>
                <div className='flex items-center'>
                  <h1 className="text-xl font-semibold text-white mr-2">{test.tieu_de}</h1>
                  {test.trang_thai === 'hoat_dong'
                    ? (
                      <Badge className={cn('bg-blue-500')}>
                        Active
                      </Badge>
                    )
                    : (
                      <Badge className={cn('bg-gray-400')}>
                        Draft
                      </Badge>
                    )}

                </div>
                <p className="text-sm text-white">
                  {test?.cau_hoi?.length} question{test?.cau_hoi?.length !== 1 ? 's' : ''} • {total_points} points total
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline"
              // onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                onClick={test.trang_thai === 'hoat_dong' ? handleUpdateTest : handleCreateTest}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className='h-4 w-4' />
                    {test.trang_thai === 'hoat_dong' ? 'Save' : 'Publish'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* quiz info */}
      <div className='bg-card p-4 rounded-xs shadow-sm mb-4 border border-gray-300'>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="test-title" className='mb-2'>Test title</Label>
              <Input
                id="test-title"
                value={newTest.tieu_de}
                onChange={(e) => setNewTest({ ...newTest, tieu_de: e.target.value })}
                placeholder="Enter test title"
                className="rounded-sm h-12 text-base border-gray-400/70 shadow-none"
              />
            </div>
            {/* <div>
              <Label htmlFor="quiz-course" className='mb-2'>Course</Label>
              <Select value={newTest.course} onValueChange={(value) => setNewTest({ ...newTest, course: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.title}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
          </div>

          <div>
            <Label htmlFor="test-description" className='mb-2'>Description</Label>
            <Textarea
              id="test-description"
              value={newTest.mo_ta}
              onChange={(e) => setNewTest({ ...newTest, mo_ta: e.target.value })}
              placeholder="Describe what this test covers"
              className="rounded-sm h-12 text-base border-gray-400/70 shadow-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="test-duration" className='mb-2'>Duration (minutes)</Label>
              <Input
                id="test-duration"
                type="number"
                value={newTest.thoi_luong}
                onChange={(e) => setNewTest({ ...newTest, thoi_luong: Number.parseInt(e.target.value) })}
                min="5"
                max="180"
                className="rounded-sm h-12 text-base border-gray-400/80 shadow-none"
              />
            </div>
            <div>
              <Label htmlFor="test-attempts" className='mb-2'>Attempts Allowed</Label>
              <Input
                id="test-attempts"
                type="number"
                value={newTest.so_lan_lam_toi_da}
                onChange={(e) => setNewTest({ ...newTest, so_lan_lam_toi_da: Number(e.target.value) })}
                min="1"
                max="10"
                className="rounded-sm h-12 text-base border-gray-400/80 shadow-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* assign test section */}
      <div className='bg-card p-4 rounded-xs shadow-sm mb-4 border border-gray-300'>
        <div className="flex items-center justify-between mb-3">
          <Label className='text-xl font-bold'>Assign to</Label>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-3xs justify-between cursor-pointer">
              {placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-3xs p-2 space-y-2">
            {/* Search box */}
            <Input
              placeholder="Type a name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Select All */}
            <div
              className="cursor-pointer flex items-center justify-between px-2 hover:bg-gray-100 rounded"
              onClick={selectAll}
            >
              <span className="font-medium">Select All</span>
              {selectedStudents.length === students.length && <Check size={16} />}
            </div>

            {/* Students list */}
            <div className="max-h-[200px] overflow-y-auto space-y-1">
              {filtered.map((student) => (
                <div
                  key={student.ma_hoc_vien}
                  className={cn(
                    "cursor-pointer flex items-center justify-between p-2 hover:bg-gray-100 rounded transition",
                    selectedStudents.includes(student.ma_hoc_vien.toString()) && 'bg-gray-200'
                  )}
                  onClick={() => toggleStudent(student.ma_hoc_vien.toString())}
                >
                  <span>{student.ten} ({student.email})</span>
                  {selectedStudents.includes(student.ma_hoc_vien.toString()) && <Check size={16} className='ml-2' />}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* question section */}
      <div className='bg-card p-4 rounded-xs shadow-sm mb-4 border border-gray-300'>
        <div className="flex items-center justify-between">
          <Label className='text-xl font-bold'>Questions</Label>
          <Button type="button" variant="outline" onClick={addQuestion} className='cursor-pointer'>
            <Plus className="h-4 w-4 mr-2" />
            Add question
          </Button>
        </div>

        <div className="space-y-4 mt-3">
          <div className='grid lg:grid-cols-2 gap-4'>
            {questions.map((question, index) => (
              <Card key={question.ma_cau_hoi} className='gap-4 shadow-none border-gray-300'>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => removeQuestion(index)} className='cursor-pointer'>
                      <Trash2 className="h-10 w-10" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className='mb-3'>Question Text</Label>
                    <Textarea
                      value={question.cau_hoi}
                      onChange={(e) => updateQuestion(index, { cau_hoi: e.target.value })}
                      placeholder="Enter your question"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className='mb-3'>Question Type</Label>
                      <Select
                        value={question.loai}
                        onValueChange={(value) =>
                          updateQuestion(index, {
                            loai: value as TestQuestion["loai"],
                            lua_chon: value === "trac_nghiem" ? ["", "", "", ""] : undefined,
                          })
                        }
                      >                      
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trac_nghiem">Trắc nghiệm</SelectItem>
                          <SelectItem value="dung_sai">Đúng/Sai</SelectItem>
                          <SelectItem value="tra_loi_ngan">Trả lời ngắn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className='mb-3'>Points</Label>
                      <Input
                        type="number"
                        value={question.diem}
                        onChange={(e) => updateQuestion(index, { diem: Number.parseInt(e.target.value) })}
                        min="1"
                        max="50"

                      />
                    </div>
                  </div>

                  {question.loai === "trac_nghiem" && (
                    <div>
                      <Label className="mb-3">Answer Options</Label>
                      <div className="space-y-2">
                        <RadioGroup
                          value={question.dap_an_dung?.toString()}
                          onValueChange={(value) =>
                            updateQuestion(index, { dap_an_dung: Number.parseInt(value) })
                          }
                        >
                          {question?.lua_chon?.map((option, optionIndex) => {
                            const optionLabel = String.fromCharCode(65 + optionIndex); // A, B, C, D
                            const isCorrect = question.dap_an_dung === optionIndex;

                            return (
                              <div
                                key={optionIndex}
                                className={`flex items-center space-x-2 p-2 rounded-md border transition-colors ${isCorrect ? "border-sky-400 bg-sky-50" : "border-gray-200"}`}
                              >
                                <RadioGroupItem
                                  value={optionIndex.toString()}
                                  className="cursor-pointer"
                                />
                                <span className="font-medium w-6">{optionLabel}.</span>
                                <Input
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...(question.lua_chon || [])];
                                    newOptions[optionIndex] = e.target.value;
                                    updateQuestion(index, { lua_chon: newOptions });
                                  }}
                                  placeholder={`Option ${optionLabel}`}
                                  className="flex-1 border border-gray-200"
                                />
                                {isCorrect && (
                                  <span className="ml-2 text-sm font-semibold text-sky-600">
                                    ✓ Correct answer will be this one
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </RadioGroup>
                      </div>
                    </div>

                  )}

                  {question.loai === "dung_sai" && (
                    <div>
                      <Label>Correct Answer</Label>
                      <RadioGroup
                        value={question.dap_an_dung?.toString()}
                        onValueChange={(value) =>
                          updateQuestion(index, { dap_an_dung: Number.parseInt(value) })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" />
                          <Label>True</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" />
                          <Label>False</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {question.loai === "tra_loi_ngan" && (
                    <div>
                      <Label>Correct Answer</Label>
                      <Input
                        value={question.dap_an_dung?.toString()}
                        onChange={(e) => updateQuestion(index, { dap_an_dung: e.target.value })}
                        placeholder="Enter the correct answer"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>

      {test.trang_thai === 'draft' && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className='cursor-pointer'>
            Cancel
          </Button>
          <Button
            onClick={handleCreateTest}
            disabled={!newTest.tieu_de || questions.length === 0}
            className='cursor-pointer'
          >
            Create test
          </Button>
        </div>
      )}
    </div>
  );
}

export default TestEditor