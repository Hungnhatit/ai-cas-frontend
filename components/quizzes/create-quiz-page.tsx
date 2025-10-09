'use client'
import React, { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { api, Course, Quiz, QuizQuestion } from '@/services/api'
import { useRouter } from 'next/navigation'
import { quizService } from '@/services/quizService'
import { useAuth } from '@/providers/auth-provider'
import toast from 'react-hot-toast'

const CreateQuizzes = () => {
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
  })
  const [questions, setQuestions] = useState<Partial<QuizQuestion>[]>([])
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
        id: `q${questions.length + 1}`,
        question: "",
        type: "multiple-choice",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 10,
      },
    ])
  }

  console.log(user)
  const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
    setQuestions(questions.map((q, i) => (
      i === index
        ? { ...q, ...updates }
        : q)))
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }


  // handle create quiz when submit
  const handleCreateQuiz = async () => {
    try {
      const total_points = questions.reduce((sum, q) => sum + (q.points || 0), 0)
      const quizData = {
        ...newQuiz,
        ma_giang_vien: user?.user_id,
        questions: questions as QuizQuestion[],
        total_points,
        status: "draft" as const,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
      }

      console.log("[v0] Creating quiz:", quizData)
      const res = await quizService.createQuiz(quizData);
      // In a real app, you would call api.createQuiz(quizData)

      setIsCreateDialogOpen(false)
      setNewQuiz({ title: "", course: "", description: "", duration: 30, attempts: 3 })
      setQuestions([]);
      toast.success('Quiz has been created successfully!');
      router.push('/quizzes');
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
      <Button onClick={() => router.push('/manage-quizzes')} className='mb-4 cursor-pointer'>
        <ArrowLeft />
        Back
      </Button>
      <header className='mb-4 bg-[#232f3e] p-4'>
        <h1 className='text-2xl font-bold mb-2 text-white'>Create New Quiz</h1>
        <div className='text-white'>Set up a new quiz for your students</div>
      </header>
      <div className='bg-card p-4 rounded-sm mb-4 border border-gray-300'>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quiz-title">Quiz Title</Label>
              <Input
                id="quiz-title"
                value={newQuiz.title}
                onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                placeholder="Enter quiz title"
              />
            </div>
            <div>
              <Label htmlFor="quiz-course">Course</Label>
              <Select value={newQuiz.course} onValueChange={(value) => setNewQuiz({ ...newQuiz, course: value })}>
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
            </div>
          </div>

          <div>
            <Label htmlFor="quiz-description">Description</Label>
            <Textarea
              id="quiz-description"
              value={newQuiz.description}
              onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
              placeholder="Describe what this quiz covers"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quiz-duration">Duration (minutes)</Label>
              <Input
                id="quiz-duration"
                type="number"
                value={newQuiz.duration}
                onChange={(e) => setNewQuiz({ ...newQuiz, duration: Number.parseInt(e.target.value) })}
                min="5"
                max="180"
              />
            </div>
            <div>
              <Label htmlFor="quiz-attempts">Attempts Allowed</Label>
              <Input
                id="quiz-attempts"
                type="number"
                value={newQuiz.attempts}
                onChange={(e) => setNewQuiz({ ...newQuiz, attempts: Number.parseInt(e.target.value) })}
                min="1"
                max="10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* question section */}
      <div className='bg-card p-4 rounded-sm mb-4 border border-gray-300'>
        <div className="flex items-center justify-between mb-4">
          <Label>Questions</Label>
          <Button type="button" variant="outline" onClick={addQuestion}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => removeQuestion(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Question Text</Label>
                  <Textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(index, { question: e.target.value })}
                    placeholder="Enter your question"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Question Type</Label>
                    <Select
                      value={question.type}
                      onValueChange={(value) =>
                        updateQuestion(index, {
                          type: value as QuizQuestion["type"],
                          options: value === "multiple-choice" ? ["", "", "", ""] : undefined,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="true-false">True/False</SelectItem>
                        <SelectItem value="short-answer">Short Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Points</Label>
                    <Input
                      type="number"
                      value={question.points}
                      onChange={(e) => updateQuestion(index, { points: Number.parseInt(e.target.value) })}
                      min="1"
                      max="50"
                    />
                  </div>
                </div>

                {question.type === "multiple-choice" && (
                  <div>
                    <Label>Answer Options</Label>
                    <div className="space-y-2">
                      <RadioGroup
                        value={question.correctAnswer?.toString()}
                        onValueChange={(value) =>
                          updateQuestion(index, { correctAnswer: Number.parseInt(value) })
                        }
                      >
                        {question.options?.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <RadioGroupItem value={optionIndex.toString()} />
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(question.options || [])]
                                newOptions[optionIndex] = e.target.value
                                updateQuestion(index, { options: newOptions })
                              }}
                              placeholder={`Option ${optionIndex + 1}`}
                              className="flex-1"
                            />
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {question.type === "true-false" && (
                  <div>
                    <Label>Correct Answer</Label>
                    <RadioGroup
                      value={question.correctAnswer?.toString()}
                      onValueChange={(value) =>
                        updateQuestion(index, { correctAnswer: Number.parseInt(value) })
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

                {question.type === "short-answer" && (
                  <div>
                    <Label>Correct Answer</Label>
                    <Input
                      value={question.correctAnswer?.toString()}
                      onChange={(e) => updateQuestion(index, { correctAnswer: e.target.value })}
                      placeholder="Enter the correct answer"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className='cursor-pointer'>
          Cancel
        </Button>
        <Button
          onClick={handleCreateQuiz}
          disabled={!newQuiz.title || !newQuiz.course || questions.length === 0}
          className='cursor-pointer'
        >
          Create quiz
        </Button>
      </div>

    </div>
  )
}

export default CreateQuizzes