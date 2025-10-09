'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Save } from 'lucide-react';
import { Test } from '@/types/test';
import React, { useEffect } from 'react'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { api, Course, Quiz, QuizQuestion } from '@/services/api'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import toast from 'react-hot-toast';
import { TestQuestion } from '@/types/interface/test';
import { testService } from '@/services/test/testService';

const CreateTestPage = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user } = useAuth();
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    course: "",
    description: "",
    duration: 30,
    attempts: 3,
  });

  const [newTest, setNewTest] = useState({
    tieu_de: '',
    mo_ta: '',
    thoi_luong: 30,
    tong_diem: 0,
    so_lan_lam_toi_da: 1,
    do_kho: '',
    trang_thai: '',
  })
  const [questions, setQuestions] = useState<Partial<TestQuestion>[]>([])
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesData, coursesData] = await Promise.all([api.getQuizzes(), api.getCourses()])
        setQuizzes(quizzesData)
        setCourses(coursesData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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

  // handle create quiz when submit
  const handleCreateTest = async () => {
    try {
      const total_points = questions.reduce((sum, q) => sum + (q.diem || 0), 0)
      // const quizData = {
      //   ...newQuiz,
      //   ma_giang_vien: user?.ma_nguoi_dung,
      //   tong_diem,
      //   status: "draft" as const,
      //   dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
      // }

      const testData = {
        ...newTest,
        ma_giang_vien: user?.ma_nguoi_dung,
        cau_hoi: questions as TestQuestion[],
        tong_diem: total_points,
        trang_thai: 'ban_nhap' as const,
        ngay_ket_thuc: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')
      }

      // console.log("[v0] Creating quiz:", quizData)
      console.log("[v0] Creating test:", testData)
      const res = await testService.createTest(testData);
      console.log(res);

      if (res.status) {
        setIsCreateDialogOpen(false)
        setNewTest({ ...newTest, tieu_de: "", mo_ta: "", thoi_luong: 30, so_lan_lam_toi_da: 3 });
        setQuestions([]);
        toast.success('Test has been created successfully!');
        window.history.back();
      }
    } catch (error) {
      console.error("Failed to create quiz:", error)
    }
  }

  console.log('New quiz: ', newQuiz)

  const duplicateQuiz = async (quiz: Quiz) => {
    try {
      console.log("[v0] Duplicating quiz:", quiz.id)
      // In a real app, you would call api.duplicateQuiz(quiz.id)
    } catch (error) {
      console.error("Failed to duplicate quiz:", error)
    }
  }

  const deleteQuiz = async (quizId: string) => {
    try {
      console.log("[v0] Deleting quiz:", quizId)
      // In a real app, you would call api.deleteQuiz(quizId)
      setQuizzes(quizzes.filter((q) => q.id !== quizId))
    } catch (error) {
      console.error("Failed to delete quiz:", error)
    }
  }

  const getQuizStats = () => {
    const total = quizzes.length
    const active = quizzes.filter((q) => q.status === "active").length
    const draft = quizzes.filter((q) => q.status === "draft").length
    const archived = quizzes.filter((q) => q.status === "archived").length

    return { total, active, draft, archived }
  }

  const stats = getQuizStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (

    <div className=" overflow-y-auto mb-4">
      {/* new quizz section */}
      <Button onClick={() => window.history.back()} className='mb-4 cursor-pointer'>
        <ArrowLeft />
        Back
      </Button>
      <header className='mb-4 bg-[#232f3e] p-4'>
        <h1 className='text-2xl font-bold mb-2 text-white'>Create New Test</h1>
        <div className='text-white'>Set up a new test for your students</div>
      </header>
      <div className='bg-card p-4 rounded-sm mb-4 border border-gray-300'>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className='mb-2' htmlFor="quiz-title">Test Title</Label>
              <Input
                id="quiz-title"
                value={newTest.tieu_de}
                onChange={(e) => setNewTest({ ...newTest, tieu_de: e.target.value })}
                placeholder="Enter test title"
                className="rounded-sm h-12 text-base border-gray-300 shadow-none"
              />
            </div>
            {/* <div>
              <Label className='mb-2' htmlFor="quiz-course">Course</Label>
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
            <Label className='mb-2' htmlFor="quiz-description">Description</Label>
            <Textarea
              id="quiz-description"
              value={newTest.mo_ta}
              onChange={(e) => setNewTest({ ...newTest, mo_ta: e.target.value })}
              placeholder="Describe what this quiz covers"
              className="rounded-sm text-base border-gray-300 shadow-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className='mb-2' htmlFor="quiz-duration">Duration (minutes)</Label>
              <Input
                id="quiz-duration"
                type="number"
                value={newTest.thoi_luong}
                onChange={(e) => setNewTest({ ...newTest, thoi_luong: Number.parseInt(e.target.value) })}
                min="5"
                max="180"
                className="rounded-sm h-12 text-base border-gray-300 shadow-none"
              />
            </div>
            <div>
              <Label className='mb-2' htmlFor="quiz-attempts">Attempts Allowed</Label>
              <Input
                id="quiz-attempts"
                type="number"
                value={newTest.so_lan_lam_toi_da}
                onChange={(e) => setNewTest({ ...newTest, so_lan_lam_toi_da: Number.parseInt(e.target.value) })}
                min="1"
                max="10"
                className="rounded-sm h-12 text-base border-gray-300 shadow-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* question section */}
      <div className="flex items-center justify-between mb-4">
        <Label className='text-2xl font-bold'>Questions</Label>
        <Button type="button" variant="outline" onClick={addQuestion} className='cursor-pointer'>
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {
        questions.length === 0 && (
          <div>
            <Card className='shadow-none'>
              <CardHeader className='justify-centerF'>
                <CardTitle className='text-center text-xl font-bold'>No questions added yet</CardTitle>
                <CardDescription className='text-center text-md'>Click 'Add Question' to create your question</CardDescription>
              </CardHeader>
            </Card>
          </div>
        )

      }

      <div className="space-y-4 mb-4">
        {questions.map((question, index) => (
          <Card key={index} className='shadow-none border-gray-400 gap-1'>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Question {index + 1}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => removeQuestion(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-3">Question Text</Label>
                <Textarea
                  value={question.cau_hoi}
                  onChange={(e) => updateQuestion(index, { cau_hoi: e.target.value })}
                  placeholder="Enter your question"
                  className="rounded-sm text-base border-gray-300 shadow-none"
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
                      <SelectItem value="trac_nghiem">Multiple Choice</SelectItem>
                      <SelectItem value="dung_sai">True/False</SelectItem>
                      <SelectItem value="tra_loi_ngan">Short Answer</SelectItem>
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
                    className="rounded-sm h-12 text-base border-gray-300 shadow-none"
                  />
                </div>
              </div>

              {question.loai === "trac_nghiem" && (
                <div>
                  <Label className='mb-3'>Answer Options</Label>
                  <div className="space-y-2">
                    <RadioGroup
                      value={question.dap_an_dung?.toString()}
                      onValueChange={(value) =>
                        updateQuestion(index, { dap_an_dung: Number.parseInt(value) })
                      }
                    >
                      {question.lua_chon?.map((option, optionIndex) => {
                        const isSelected = question.dap_an_dung === optionIndex;
                        return (
                          <div key={optionIndex} className={`flex items-center space-x-2 rounded-md cursor-pointer`}
                            onClick={() => updateQuestion(index, { dap_an_dung: optionIndex })}
                          >
                            <RadioGroupItem
                              value={optionIndex.toString()}
                              className='border-gray-400' />
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(question.lua_chon || [])]
                                newOptions[optionIndex] = e.target.value
                                updateQuestion(index, { lua_chon: newOptions })
                              }}
                              placeholder={`Option ${optionIndex + 1}`}
                              className={`flex-1 rounded-sm h-12 text-black border-gray-300 shadow-none cursor-pointer ${isSelected ? "bg-blue-50 border border-blue-500" : "border border-gray-300"}`}
                            />
                            {isSelected && (
                              <span className="ml-2 text-sm font-semibold text-sky-600">
                                ✓ Correct answer will be this one
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </RadioGroup>
                  </div>
                </div>
              )}

              {question.loai === "dung_sai" && (
                <div>
                  <Label className='mb-3'>Correct Answer</Label>
                  <RadioGroup
                    value={question.dap_an_dung?.toString()}
                    onValueChange={(value) =>
                      updateQuestion(index, { dap_an_dung: Number.parseInt(value) })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" />
                      <Label className='mb-3'>True</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" />
                      <Label className='mb-3'>False</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {question.loai === "tra_loi_ngan" && (
                <div>
                  <Label className='mb-3'>Correct Answer</Label>
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
    </div>
  )
}

export default CreateTestPage