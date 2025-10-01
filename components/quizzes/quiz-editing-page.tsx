'use client'
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Check, Plus, Save, Trash2 } from 'lucide-react';
import { Question, QuizSetup as QuizSetupType } from '@/types/quiz';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Course, Quiz, QuizQuestion, Student } from '@/services/api';

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
import { Checkbox } from '@radix-ui/react-checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface QuizEditorProp {
  quiz_id: number,
  setup: QuizSetupType,
}

const QuizEditor = ({ quiz_id, setup }: QuizEditorProp) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [search, setSearch] = useState("")
  const [quizStatus, setQuizStatus] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user } = useAuth();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [newQuiz, setNewQuiz] = useState({
    title: "",
    course: "",
    description: "",
    duration: 30,
    attempts: 3,
  });

  const [newStudent, setNewStudent] = useState({
    student_id: '',
    name: ''
  })

  const [questions, setQuestions] = useState<Partial<QuizQuestion>[]>([])
  const router = useRouter();

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await quizService.getQuizById(Number(id));
        const parsedData = (data.quiz_questions || []).map((question: any) => ({
          ...question,
          options: typeof question.options === 'string' ? JSON.parse(question.options) : question.options,
          correctAnwer: question.correctAnswer !== undefined ? Number(question.correctAnswer) : undefined
        }));

        const res = await studentService.getStudentByInstructorId(user?.user_id);

        setStudents(res.data.instructor.students);

        setQuizzes(data);
        setNewQuiz({
          title: data.title || "",
          course: data.course || "",
          description: data.description || "",
          duration: data.duration || 30,
          attempts: data.attempts || 3,
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
        id: `q${questions.length + 1}`,
        question: "",
        type: "multiple-choice",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 10,
      },
    ])
  }

  console.log(questions);

  const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
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
    const student = students.find((s) => s.student_id.toString() === student_id)
    if (student) {
      setNewStudent({
        student_id: student.student_id.toString(),
        name: student.name,
      })
    }
  }

  console.log(selectedStudents)

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]) // clear
    } else {
      setSelectedStudents(students.map((s) => s.student_id)) // chọn all
    }
  }

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const placeholder =
    selectedStudents.length === 0
      ? "Select students..."
      : selectedStudents.length === students.length
        ? "All students selected"
        : `${selectedStudents.length} students selected`

  // handle create quiz when submit
  const handleCreateQuiz = async () => {
    try {
      const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0)
      const quizData = {
        ...newQuiz,
        instructor_id: user?.user_id,
        questions: questions as QuizQuestion[],
        totalPoints,
        status: "draft" as const,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
      }

      console.log("[v0] Creating quiz:", quizData)
      const res = await quizService.publishQuiz(quiz_id, quizData);
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

  const handleUpdateQuiz = async () => {
    try {
      const totalPoints = quizzes.quiz_questions.reduce((sum, q) => sum + (q.points || 0), 0)
      const updatedData = {
        ...newQuiz,
        instructor_id: user?.user_id,
        questions: questions as QuizQuestion[],
        totalPoints,
        status: 'active',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0]
      }

      console.log("[v0] Updating quiz:", updatedData);

      const res = await quizService.updateQuiz(quiz_id, updatedData);
      await quizService.assignQuiz(quiz_id, selectedStudents);
      setIsCreateDialogOpen(false)
      setNewQuiz({
        title: "",
        course: "",
        description: "",
        duration: 30,
        attempts: 3,
      });
      setQuestions([]);
      toast.success("Quiz has been updated successfully!");
      router.push("/manage-quizzes");
    } catch (error) {
      console.log(error)
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

  const deleteQuiz = async (quizId: string) => {
    try {
      console.log("[v0] Deleting quiz:", quizId)
      // In a real app, you would call api.deleteQuiz(quizId)
      setQuizzes(quizzes?.filter((q) => q.id !== quizId))
    } catch (error) {
      console.error("Failed to delete quiz:", error)
    }
  }

  // const getQuizStats = () => {
  //   const total = quizzes?.length
  //   const active = quizzes?.filter((q) => q.status === "active")?.length
  //   const draft = quizzes?.filter((q) => q.status === "draft")?.length
  //   const archived = quizzes?.filter((q) => q.status === "archived")?.length

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
  const handleSetupChange = (setup: QuizSetupType) => {
    setQuizzes(prev => ({ ...prev, setup }));
  };

  const handleQuestionsChange = (questions: Question[]) => {
    setQuizzes(prev => ({ ...prev, questions }));
  };

  // const handleCancel = () => {
  //   if (quizzes.setup.title || quizzes?.questions?.length > 0) {
  //     if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
  //       setQuizzes({
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

  const totalPoints = quizzes?.quiz_questions?.reduce((sum, question) => sum + (question.points || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border py-2 border-gray-300 sticky top-0 z-10 mb-4">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className='cursor-pointer'
                // handle cancel
                onClick={() => router.push('/manage-quizzes')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <div className='flex items-center'>
                  <h1 className="text-xl font-semibold text-gray-900 mr-2">{quizzes?.title}</h1>
                  {quizzes.status === 'active'
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
                <p className="text-sm text-gray-500">
                  {quizzes?.quiz_questions?.length} question{quizzes?.quiz_questions?.length !== 1 ? 's' : ''} • {totalPoints} points total
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
                onClick={quizzes.status === 'active' ? handleUpdateQuiz : handleCreateQuiz}
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
                    {quizzes.status === 'active' ? 'Save' : 'Publish'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* quiz info */}
      <div className='bg-card p-4 rounded-sm mb-4 border border-gray-300'>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quiz-title" className='mb-2'>Quiz Title</Label>
              <Input
                id="quiz-title"
                value={newQuiz.title}
                onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                placeholder="Enter quiz title"
              />
            </div>
            <div>
              <Label htmlFor="quiz-course" className='mb-2'>Course</Label>
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
            <Label htmlFor="quiz-description" className='mb-2'>Description</Label>
            <Textarea
              id="quiz-description"
              value={newQuiz.description}
              onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
              placeholder="Describe what this quiz covers"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quiz-duration" className='mb-2'>Duration (minutes)</Label>
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
              <Label htmlFor="quiz-attempts" className='mb-2'>Attempts Allowed</Label>
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

      {/* assign quiz section */}
      <div className='bg-card p-4 rounded-sm mb-4 border border-gray-300'>
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
                  key={student.student_id}
                  className={cn(
                    "cursor-pointer flex items-center justify-between p-2 hover:bg-gray-100 rounded transition",
                    selectedStudents.includes(student.student_id) && 'bg-gray-200'
                  )}
                  onClick={() => toggleStudent(student.student_id)}
                >
                  <span>{student.name} ({student.email})</span>
                  {selectedStudents.includes(student.student_id) && <Check size={16} className='ml-2' />}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* question section */}
      <div className='bg-card p-4 rounded-sm mb-4 border border-gray-300'>
        <div className="flex items-center justify-between">
          <Label className='text-xl font-bold'>Questions</Label>
          <Button type="button" variant="outline" onClick={addQuestion} className='cursor-pointer'>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>

        <div className="space-y-4 mt-3">
          <div className='grid lg:grid-cols-2 gap-4'>
            {questions.map((question, index) => (
              <Card key={index} className='gap-4'>
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
                      value={question.question}
                      onChange={(e) => updateQuestion(index, { question: e.target.value })}
                      placeholder="Enter your question"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className='mb-3'>Question Type</Label>
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
                      <Label className='mb-3'>Points</Label>
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
                      <Label className="mb-3">Answer Options</Label>
                      <div className="space-y-2">
                        <RadioGroup
                          value={question.correctAnswer?.toString()}
                          onValueChange={(value) =>
                            updateQuestion(index, { correctAnswer: Number.parseInt(value) })
                          }
                        >
                          {question?.options.map((option, optionIndex) => {
                            const optionLabel = String.fromCharCode(65 + optionIndex); // A, B, C, D
                            const isCorrect = question.correctAnswer === optionIndex;

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
                                    const newOptions = [...(question.options || [])];
                                    newOptions[optionIndex] = e.target.value;
                                    updateQuestion(index, { options: newOptions });
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

      </div>

      {quizzes.status === 'draft' && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className='cursor-pointer'>
            Cancel
          </Button>
          <Button
            onClick={handleCreateQuiz}
            disabled={!newQuiz.title || !newQuiz.course || questions.length === 0}
            className='cursor-pointer'
          >
            Create Quiz
          </Button>
        </div>
      )}
    </div>
  );
}

export default QuizEditor