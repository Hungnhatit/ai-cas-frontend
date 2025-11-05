"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, Plus, Save, CheckCircle2, Clock, Users, BarChart3, BookOpen, ChevronLeft, TriangleAlert } from "lucide-react"
import { QuestionCard, type Question } from "./question-card"
import { AiExamForm, GenerateExamParams } from "./ai-test-creation-form";
import toast from "react-hot-toast"

interface GeneratedExam {
  id: string
  questions: Question[]
  generatedAt: Date
  topic: string
  category: string
  numberOfQuestions: number
  difficulty: string
  questionTypes: string[]
  timeLimit: number
  passingScore: number
  instructions: string
  examName: string
  course: string
  estimatedDuration: number
}

export function AiExamPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [examSaved, setExamSaved] = useState(false)
  const [currentGenerateParams, setCurrentGenerateParams] = useState<GenerateExamParams | null>(null);
  const [isWarning, setIsWarning] = useState(true);

  const hasShownRef = useRef(false)

  useEffect(() => {
    if (hasShownRef.current) return
    hasShownRef.current = true

    const toastId = toast.custom(
      (t) => (
        <div className={`max-w-md w-full bg-[#ff9900f7] text-black rounded-[3px] flex p-4 animate-collapsible-down transition-all ease-in-out`}>
          <TriangleAlert className="mr-2 mt-[2px]" />
          <div>
            <p className="font-semibold">Lưu ý:</p>
            <p className="text-sm italic">
              Các câu hỏi được tạo bởi AI có thể chưa hoàn toàn chính xác về nội dung hoặc ngữ pháp.
            </p>
          </div>
        </div>
      ),
      { duration: 3000, position: 'top-center' }
    )
  }, [])


  const generateExamWithAI = async (params: GenerateExamParams) => {
    setIsGenerating(true)
    setExamSaved(false)
    setQuestions([])

    await new Promise((resolve) => setTimeout(resolve, 2500))

    const mockExam: Question[] = [
      {
        id: "q1",
        question: `What is a fundamental concept in ${params.topic}?`,
        choices: ["Option A", "Option B", "Option C", "Option D"],
        correct: 0,
      },
      {
        id: "q2",
        question: `Which of the following best describes ${params.topic}?`,
        choices: ["Definition 1", "Definition 2", "Definition 3", "Definition 4"],
        correct: 1,
      },
      {
        id: "q3",
        question: `How is ${params.topic} applied in practice?`,
        choices: ["Application A", "Application B", "Application C", "Application D"],
        correct: 2,
      },
      {
        id: "q4",
        question: `What is the primary benefit of understanding ${params.topic}?`,
        choices: ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4"],
        correct: 3,
      },
      {
        id: "q5",
        question: `In the context of ${params.category}, ${params.topic} is primarily used for?`,
        choices: ["Purpose 1", "Purpose 2", "Purpose 3", "Purpose 4"],
        correct: 0,
      },
    ]

    const allQuestions: Question[] = []
    for (let i = 0; i < params.numberOfQuestions; i++) {
      const question = mockExam[i % mockExam.length]
      allQuestions.push({
        ...question,
        id: `q${i + 1}`,
        question: `${question.question} (Question ${i + 1})`,
      })
    }

    setQuestions(allQuestions)
    setCurrentGenerateParams(params)
    setIsGenerating(false)
    toast({
      title: "Success",
      description: `Generated ${params.numberOfQuestions} questions for "${params.examName}"`,
    });
  }

  const regenerateQuestion = async (index: number) => {
    setRegeneratingIndex(index)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const updatedQuestions = [...questions]
    const newCorrectAnswer = Math.floor(Math.random() * 4)
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      question: updatedQuestions[index].question.replace(
        /$$Question \d+ - Regenerated$$/,
        "(Question " + (index + 1) + " - Regenerated)",
      ),
      correct: newCorrectAnswer,
    }
    setQuestions(updatedQuestions)
    setRegeneratingIndex(null)

    toast({
      title: "Question Regenerated",
      description: `Question ${index + 1} has been regenerated`,
    })
  }

  const handleSaveExam = async () => {
    if (questions.length === 0 || !currentGenerateParams) return

    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const exam: GeneratedExam = {
      id: `exam-${Date.now()}`,
      questions,
      generatedAt: new Date(),
      topic: currentGenerateParams.topic,
      category: currentGenerateParams.category,
      numberOfQuestions: questions.length,
      difficulty: currentGenerateParams.difficulty,
      questionTypes: currentGenerateParams.questionTypes,
      timeLimit: currentGenerateParams.timeLimit,
      passingScore: currentGenerateParams.passingScore,
      instructions: currentGenerateParams.instructions,
      examName: currentGenerateParams.examName,
      course: currentGenerateParams.course,
      estimatedDuration: currentGenerateParams.estimatedDuration,
    }

    const savedExams = JSON.parse(localStorage.getItem("savedExams") || "[]")
    savedExams.push({
      ...exam,
      generatedAt: exam.generatedAt.toISOString(),
    })
    localStorage.setItem("savedExams", JSON.stringify(savedExams))

    setIsSaving(false)
    setExamSaved(true)

    toast({
      title: "Exam Saved Successfully",
      description: `"${exam.examName}" has been saved with ${questions.length} questions`,
    })

    setTimeout(() => {
      setExamSaved(false)
    }, 3000)
  }

  return (
    <div className="space-y-4">
      <div className='flex items-center bg-[#232f3e] -mx-4 -mt-4 p-5 mb-4'>
        <Button onClick={() => window.history.back()} className='mr-4 cursor-pointer'>
          <ChevronLeft className='h-10 w-10 rounded-sm text-white font-bold hover:bg-[#42546b] transition-all cursor-pointer' />
        </Button>
        <header className=''>
          <h1 className='text-2xl font-bold mb-2 text-white'>Sử dụng AI để tạo bài kiểm tra</h1>
          <div className='text-white'>
            Tạo bài kiểm tra toàn diện ngay lập tức bằng AI
          </div>
        </header>
      </div>

      {/* Main Form - Always Visible */}
      {/* {isWarning && (
        <Card className="shadow-none bg-[#ff9900] gap-3 mb-4">
          <CardHeader>
            <CardTitle className="flex items-center text-black">
              <TriangleAlert size={20} className="font-bold mr-2" />
              Lưu ý:
            </CardTitle>
            <CardDescription className="text-md italic text-black">
              Các câu hỏi được tạo bởi AI có thể chứa sai sót hoặc chưa hoàn toàn chính xác về nội dung, ngữ pháp hoặc đáp án.
              Vui lòng kiểm tra và chỉnh sửa kỹ lưỡng trước khi lưu hoặc sử dụng bài kiểm tra chính thức.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="rounded-[3px] shadow-none bg-transparent border border-black text-black cursor-pointer">Tôi đã hiểu và tiếp tục</Button>
          </CardContent>
        </Card>)
      } */}


      <AiExamForm onGenerate={generateExamWithAI} isLoading={isGenerating} />

      {/* Loading Skeleton State */}
      {isGenerating && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span className="text-sm text-blue-900 dark:text-blue-100 font-medium">
              AI is generating your exam with {currentGenerateParams?.numberOfQuestions} questions...
            </span>
          </div>
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-2xl">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 rounded" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-12 w-full rounded" />
                <Skeleton className="h-12 w-full rounded" />
                <Skeleton className="h-12 w-full rounded" />
                <Skeleton className="h-12 w-full rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Generated Questions */}
      {!isGenerating && questions.length > 0 && currentGenerateParams && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-700/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle className="text-green-900 dark:text-green-100">Exam Generated Successfully</CardTitle>
              </div>
              <CardDescription className="text-green-800 dark:text-green-200">
                {currentGenerateParams.examName} - {currentGenerateParams.course}
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{questions.length}</div>
                <p className="text-xs text-muted-foreground mt-1">{currentGenerateParams.difficulty} difficulty</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  Time Limit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentGenerateParams.timeLimit}</div>
                <p className="text-xs text-muted-foreground mt-1">minutes</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Passing Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentGenerateParams.passingScore}%</div>
                <p className="text-xs text-muted-foreground mt-1">required to pass</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold capitalize">{currentGenerateParams.category}</div>
                <p className="text-xs text-muted-foreground mt-1">{currentGenerateParams.questionTypes.length} types</p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-xl border-dashed">
            <CardHeader>
              <CardTitle className="text-sm">Exam Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-foreground">Topic:</span>
                  <p className="text-muted-foreground">{currentGenerateParams.topic}</p>
                </div>
                <div>
                  <span className="font-medium text-foreground">Question Types:</span>
                  <p className="text-muted-foreground capitalize">{currentGenerateParams.questionTypes.join(", ")}</p>
                </div>
                <div>
                  <span className="font-medium text-foreground">Estimated Duration:</span>
                  <p className="text-muted-foreground">{currentGenerateParams.estimatedDuration} minutes</p>
                </div>
                <div>
                  <span className="font-medium text-foreground">Generated:</span>
                  <p className="text-muted-foreground">Just now</p>
                </div>
              </div>
              {currentGenerateParams.instructions && (
                <div className="mt-4 pt-4 border-t">
                  <span className="font-medium text-foreground block mb-2">Instructions:</span>
                  <p className="text-sm text-muted-foreground">{currentGenerateParams.instructions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Questions Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Questions ({questions.length})</h3>
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                onRegenerate={regenerateQuestion}
                isRegenerating={regeneratingIndex === index}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 sticky bottom-6 bg-background/95 backdrop-blur p-4 rounded-lg border shadow-lg">
            <Button
              onClick={handleSaveExam}
              disabled={isSaving || examSaved}
              size="lg"
              className="flex-1 rounded-lg h-11 text-base font-semibold"
            >
              {isSaving ? (
                <>
                  <div className="h-5 w-5 mr-2 animate-spin rounded-full border-b-2 border-white"></div>
                  Saving...
                </>
              ) : examSaved ? (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Saved Successfully
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Exam
                </>
              )}
            </Button>
            <Button variant="outline" size="lg" className="rounded-lg h-11 text-base font-semibold bg-transparent">
              <Download className="h-5 w-5 mr-2" />
              Export as PDF
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isGenerating && questions.length === 0 && (
        <Card className="rounded-[3px] text-center py-12 border-dashed">
          <CardContent className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Chưa có bài kiểm tra nào được tạo</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Cấu hình cài đặt bài kiểm tra ở trên và nhấp vào 'Tạo bài kiểm tra bằng AI' để tạo bài kiểm tra của bạn
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
