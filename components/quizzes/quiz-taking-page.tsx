"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, ChevronLeft, ChevronRight, Send } from "lucide-react"
import { api, type Quiz, type QuizAttempt, type QuizQuestion } from "@/services/api"
import { useRouter } from "next/navigation"
import { quizService } from "@/services/quizService"
import { useAuth } from "@/providers/auth-provider"

interface QuizTakingPageProps {
  quizId: number
  attemptId?: number
}

export function QuizTakingPage({ quizId, attemptId }: QuizTakingPageProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | number>>({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter();
  const { user } = useAuth();

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && quiz && attempt) {
      // Auto-submit when time runs out
      handleSubmitQuiz();
    }
  }, [timeRemaining, quiz, attempt])

  // Load quiz and attempt data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizData = await quizService.getQuizById(quizId)
        if (!quizData) {
          router.push("/quizzes")
          return
        }

        setQuiz(quizData);

        if (attemptId) {
          const attempts = await quizService.getQuizAttempt(quizId, user?.user_id)
          const currentAttempt = attempts.find((a: any) => a.quizAttempt_id === Number(attemptId))

          if (currentAttempt) {
            setAttempt(currentAttempt)
            setAnswers(currentAttempt.answers || {})

            // Calculate time remaining
            const startTime = new Date(currentAttempt.start_time).getTime()
            const now = new Date().getTime()
            const elapsed = Math.floor((now - startTime) / 1000)
            const remaining = Math.max(0, quizData.duration * 60 - elapsed)
            setTimeRemaining(remaining)
          }
        }
      } catch (error) {
        console.error("Failed to fetch quiz data:", error)
        router.push("/quizzes")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [quizId, attemptId, router])

  const handleAnswerChange = async (question_id: number, answer: string | number) => {
    const newAnswers = { ...answers, [question_id]: answer } // object
    setAnswers(newAnswers)

    if (attemptId) {
      try {
        await quizService.submitQuizAnswer(attemptId, newAnswers)
      } catch (error) {
        console.error("Failed to save answer:", error)
      }
    }
  }

  // Handle submit quiz, redirect to result page
  const handleSubmitQuiz = useCallback(async () => {
    if (!attemptId || submitting) return

    setSubmitting(true)
    try {
      const result = await quizService.submitQuizAttempt(attemptId);
      if (result) {
        router.push(`/quizzes/${quizId}/result?attempt=${attemptId}`)
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error)
    } finally {
      setSubmitting(false)
    }
  }, [attemptId, quizId, router, submitting])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const renderQuestion = (question: QuizQuestion) => {
    const userAnswer = answers[question.quizQuestion_id];
    let options: string[] = [];
    try {
      options = typeof question.options === 'string'
        ? JSON.parse(question.options)
        : question.options || []
    } catch (error) {
      console.error("Invalid options format:", question.options);
    }

    switch (question.type) {
      case "multiple-choice":
        return (
          <RadioGroup
            value={userAnswer?.toString() || ""}
            onValueChange={(value) => handleAnswerChange(question.quizQuestion_id, Number.parseInt(value))}
          >
            {options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "true-false":
        return (
          <RadioGroup
            value={userAnswer?.toString() || ""}
            onValueChange={(value) => handleAnswerChange(question.quizQuestion_id, Number.parseInt(value))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="true" />
              <Label htmlFor="true" className="cursor-pointer">
                True
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="false" />
              <Label htmlFor="false" className="cursor-pointer">
                False
              </Label>
            </div>
          </RadioGroup>
        )

      case "short-answer":
        return (
          <Textarea
            value={userAnswer?.toString() || ""}
            onChange={(e) => handleAnswerChange(question.quizQuestion_id, e.target.value)}
            placeholder="Enter your answer..."
            className="min-h-[100px]"
          />
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!quiz) {
    return <div>Quiz not found</div>
  }


  const currentQuestion = quiz?.quiz_questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.quiz_questions.length) * 100
  const isLastQuestion = currentQuestionIndex === quiz.quiz_questions.length - 1;



  return (
    // <>quiz taking page</>
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p className="text-white">{quiz.course}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={timeRemaining > 180 ? "default" : "destructive"} className="text-lg px-3 py-1">
            <Clock className="h-4 w-4 mr-2" />
            {formatTime(timeRemaining)}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>
            Question {currentQuestionIndex + 1} of {quiz.quiz_questions.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
              <CardDescription className="text-base leading-relaxed">{currentQuestion.question}</CardDescription>
            </div>
            <Badge variant="outline">{currentQuestion.points} pts</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">{renderQuestion(currentQuestion)}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {quiz.quiz_questions.map((_, index) => (
            <Button
              key={index}
              variant={
                index === currentQuestionIndex ? "default" : answers[quiz.quiz_questions[index].quizQuestion_id] ? "secondary" : "outline"
              }
              size="sm"
              onClick={() => setCurrentQuestionIndex(index)}
              className="w-10 h-10"
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {isLastQuestion ? (
          <Button onClick={handleSubmitQuiz} disabled={submitting} className="bg-green-600 hover:bg-green-700 cursor-pointer">
            <Send className="h-4 w-4 mr-2" />
            {submitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestionIndex((prev) => Math.min(quiz.quiz_questions.length - 1, prev + 1))}
            disabled={currentQuestionIndex === quiz.quiz_questions.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
