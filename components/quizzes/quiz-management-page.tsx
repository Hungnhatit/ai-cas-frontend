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
import { Plus, Edit, Trash2, Eye, Users, Clock, Trophy, Copy } from "lucide-react"
import { type Quiz, type QuizQuestion, type Course } from "@/services/api"
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { quizService } from "@/services/quizService"
import { useAuth } from "@/providers/auth-provider"
import { courseService } from "@/services/courseService"
import ConfirmModal from "../modals/confirm-modal";
import { capitalizeFirstLetter } from "@/utils/string"

export function QuizManagementPage() {
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
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const [quizzesData, coursesData] = await Promise.all([api.getQuizzes(), api.getCourses()]);
        const [quizzesData, coursesData] = await Promise.all([
          quizService.getQuizByInstructorId(user?.user_id),
          courseService.getCourseByUser(user?.user_id)
        ]);
        setQuizzes(quizzesData)
        setCourses(coursesData.data)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []);

  console.log('Quiz: ', quizzes);

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

  const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
    setQuestions(questions.map((q, i) => (i === index ? { ...q, ...updates } : q)))
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleCreateQuiz = async () => {
    try {
      const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0)
      const quizData = {
        ...newQuiz,
        questions: questions as QuizQuestion[],
        totalPoints,
        status: "draft" as const,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
      }

      console.log("[v0] Creating quiz:", quizData)
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

  const duplicateQuiz = async (quiz: Quiz) => {
    try {
      console.log("[v0] Duplicating quiz:", quiz.id)
      // In a real app, you would call api.duplicateQuiz(quiz.id)
    } catch (error) {
      console.error("Failed to duplicate quiz:", error)
    }
  }

  const deleteQuiz = async (quiz_id: number) => {
    try {
      console.log("[v0] Deleting quiz:", quiz_id)
      await quizService.deleteQuiz(quiz_id);
      // setQuizzes((prev) => prev.filter((q) => q.quiz_id !== quiz_id));
      setQuizzes((prev) =>
        prev.map((q) =>
          q.quiz_id === quiz_id
            ? { ...q, status: 'archived' }
            : q
        )
      )
      toast.success('Quiz has been archived successfully!');
    } catch (error) {
      toast.error(`Failed to archive quiz: ${error}`);
    }
  }

  const forceDeleteQuiz = async (quiz_id: number) => {
    try {
      await quizService.deleteQuiz(quiz_id, true);
      setQuizzes((prev) => prev.filter((q) => q.quiz_id !== quiz_id));
      toast.success('Quiz has been deleted permanently!');
    } catch (error) {
      toast.error(`Failed to force delete quiz: ${error}`);
    }
  }

  const restoreQuiz = async (quiz_id: number) => {
    try {
      await quizService.restoreQuiz(quiz_id);
      setQuizzes((prev) =>
        prev.map((q) =>
          q.quiz_id === quiz_id
            ? { ...q, status: 'draft' }
            : q
        )
      )
      toast.success('Quiz has been restored successfully!');
    } catch (error) {
      toast.error(`Failed to restore quiz: ${error}`)
    }
  }

  const handleEditQuiz = async (quiz_id: number) => {
    try {
      router.push(`/quizzes/${quiz_id}/edit`);
    } catch (error) {
      console.log(error)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quiz Management</h1>
          <p className="text-muted-foreground">Create and manage quizzes for your courses</p>
        </div>
        {/* <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}> */}
        <Dialog open={isCreateDialogOpen}>
          <Button onClick={() => router.push('/create-quizzes')} className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Create Quiz
          </Button>

          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Quiz</DialogTitle>
              <DialogDescription>Set up a new quiz for your students</DialogDescription>
            </DialogHeader>
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
                        <SelectItem key={course.course_id} value={course.title}>
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

              <div>
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
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateQuiz}
                  disabled={!newQuiz.title || !newQuiz.course || questions.length === 0}
                >
                  Create Quiz (Quiz management page)
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        {/* -------------------------------Quiz status--------------------------------- */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Edit className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.archived}</div>
          </CardContent>
        </Card>
        {/* ---------------------------------------------------------------- */}

      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="cursor-pointer">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="draft" className="cursor-pointer">Draft ({stats.draft})</TabsTrigger>
          <TabsTrigger value="archived" className="cursor-pointer">Archived ({stats.archived})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quizzes
              .filter((quiz) => quiz.status === "active")
              .map((quiz) => (
                <Card key={quiz.quiz_id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        <CardDescription>{quiz.course}</CardDescription>
                      </div>
                      <Badge variant="default">{capitalizeFirstLetter(quiz.status)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{quiz.description}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {quiz.duration} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        {quiz.totalPoints} pts
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {quiz.quiz_questions.length} questions
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="cursor-pointer" variant="outline" size="sm" onClick={() => router.push(`/quizzes/${quiz.quiz_id}/preview`)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button className="cursor-pointer" variant="outline" size="sm" onClick={() => duplicateQuiz(quiz)}>
                        <Copy className="h-4 w-4 mr-1" />
                        Duplicate
                      </Button>
                      <Button onClick={() => handleEditQuiz(quiz.quiz_id)} className="cursor-pointer" variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* draft quizzes */}
        <TabsContent value="draft" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quizzes
              .filter((quiz) => quiz.status === "draft")
              .map((quiz) => (
                <Card key={quiz.quiz_id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        <CardDescription>{quiz.course}</CardDescription>
                      </div>
                      <Badge variant="secondary">{quiz.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{quiz.description}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {quiz.duration} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        {quiz.totalPoints} pts
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {quiz.quiz_questions.length} questions
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="cursor-pointer" onClick={() => handleEditQuiz(quiz.quiz_id)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Continue Editing
                      </Button>
                      <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => deleteQuiz(parseInt(quiz.quiz_id))}>
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
            {quizzes
              .filter((quiz) => quiz.status === "archived")
              .map((quiz) => (
                <Card key={quiz.quiz_id} className="hover:shadow-md transition-shadow opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        <CardDescription>{quiz.course}</CardDescription>
                      </div>
                      <Badge variant="outline">{quiz.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{quiz.description}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {quiz.duration} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        {quiz.totalPoints} pts
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {quiz.quiz_questions.length} questions
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => restoreQuiz(quiz.quiz_id)} variant="outline" size="sm" className="cursor-pointer">
                        Restore
                      </Button>
                      <ConfirmModal
                        onConfirm={() => forceDeleteQuiz(quiz.quiz_id)}
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
