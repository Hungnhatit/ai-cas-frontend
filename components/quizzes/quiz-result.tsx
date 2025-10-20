"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle, XCircle, Clock, Trophy, Target, BookOpen, ArrowLeft, Download, Share2, RotateCcw,
} from "lucide-react"
import { api, type Quiz, type QuizAttempt, type QuizQuestion } from "@/services/api"
import { useParams, useRouter } from "next/navigation"
import { quizService } from "@/services/quizService"
import { attemptService } from "@/services/attemptService"
import { useAuth } from "@/providers/auth-provider"

interface QuizResultPageProps {
  quiz_id: number
  quizAttempt_id?: number
}

// this component is used for the result page after submitting the quiz
export function QuizResultPage({ quiz_id, quizAttempt_id }: QuizResultPageProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizData, attempts] = await Promise.all([api.getQuiz(quiz_id), api.getQuizAttempts(quiz_id)]);
        const [quizzes, attemptList] = await Promise.all([
          quizService.getQuizById(quiz_id),
          attemptService.getAttemptById(quizAttempt_id)
        ]);

        if (!quizzes) {
          router.push("/quizzes")
          return
        }

        setQuiz(quizzes);
        setAttempt(attemptList.attempt);

        // if (quizAttempt_id) {
        //   const currentAttempt = attemptList.find((a: any) => a.quizAttempt_id === quizAttempt_id)
        //   if (currentAttempt) {
        //     setAttempt(currentAttempt)
        //   }
        // } else {
        //   // Get the latest attempt
        //   const latestAttempt = attemptList
        //     .filter((a) => a.status === "submitted")
        //     .sort((a, b) => new Date(b.endTime || "").getTime() - new Date(a.endTime || "").getTime())[0]
        //   setAttempt(latestAttempt)
        // }

        if (quizAttempt_id) {
          setAttempt(attemptList)
        }

      } catch (error) {
        console.error("Failed to fetch quiz results:", error)
        // router.push("/quizzes")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [quiz_id, quizAttempt_id, router]);


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getTimeTaken = () => {
    if (!attempt?.start_time || !attempt?.end_time) return "N/A"
    const start = new Date(attempt.start_time).getTime()
    const end = new Date(attempt.end_time).getTime()
    const seconds = Math.floor((end - start) / 1000)
    return formatTime(seconds)
  }

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 70) return "text-blue-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getGradeLetter = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 90) return "A"
    if (percentage >= 80) return "B"
    if (percentage >= 70) return "C"
    if (percentage >= 60) return "D"
    return "F"
  }

  const getCorrectAnswers = () => {
    if (!quiz || !attempt) return 0
    let correct = 0
    quiz.quiz_questions.forEach((question) => {
      const userAnswer = JSON.parse(attempt?.answers)[question.quizQuestion_id];
      if (userAnswer.toString() === question.correctAnswer) {
        correct++
      }
    })
    return correct;
  }

  // render detail question
  const renderQuestionResult = (question: QuizQuestion, index: number) => {
    const userAnswer = JSON.parse(attempt?.answers)[question.quizQuestion_id]
    const isCorrect = userAnswer.toString() === question.correctAnswer

    return (
      <Card key={question.quizQuestion_id} className={`border-l-4 ${isCorrect ? "border-l-sky-600" : "border-l-red-500"} gap-0.5 py-4`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-base flex items-center gap-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-sky-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Question {index + 1}
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">{question.question}</CardDescription>
            </div>
            <div className="text-right">
              <Badge variant={isCorrect ? "default" : "destructive"}>
                {isCorrect ? question.points : 0}/{question.points} pts
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.type === "multiple-choice" && question.options && (
            <div className="space-y-2">
              {JSON.parse(question.options).map((option, optionIndex) => {
                const isUserAnswer = userAnswer === optionIndex
                const isCorrectAnswer = question.correctAnswer === optionIndex.toString();
                return (
                  <div
                    key={optionIndex}
                    className={`p-2 rounded-lg border ${isCorrectAnswer
                      ? "bg-sky-200 border-sky-200 text-blue-900"
                      : isUserAnswer
                        ? "bg-red-50 border-red-200 text-red-800"
                        : "bg-gray-50 border-gray-200"
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isCorrectAnswer && <CheckCircle className="h-4 w-4 text-sky-600" />}
                        {isUserAnswer && !isCorrectAnswer && <XCircle className="h-4 w-4 text-red-600" />}
                        <span className="text-sm">{option}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isUserAnswer && (
                          <Badge variant="outline" className="ml-auto text-xs border border-green-600">
                            Your Answer
                          </Badge>
                        )}
                        {isCorrectAnswer && (
                          <Badge variant="outline" className="ml-auto text-xs border border-sky-600">
                            Correct
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {question.type === "true-false" && (
            <div className="space-y-2">
              {["False", "True"].map((option, optionIndex) => {
                const isUserAnswer = userAnswer === optionIndex
                const isCorrectAnswer = question.correctAnswer === optionIndex

                return (
                  <div
                    key={optionIndex}
                    className={`p-2 rounded-lg border ${isCorrectAnswer
                      ? "bg-green-50 border-green-200 text-green-800"
                      : isUserAnswer
                        ? "bg-red-50 border-red-200 text-red-800"
                        : "bg-gray-50 border-gray-200"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      {isCorrectAnswer && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {isUserAnswer && !isCorrectAnswer && <XCircle className="h-4 w-4 text-red-600" />}
                      <span className="text-sm">{option}</span>
                      {isUserAnswer && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          Your Answer
                        </Badge>
                      )}
                      {isCorrectAnswer && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          Correct
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {question.type === "short-answer" && (
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-1">Your Answer:</p>
                <p className="text-sm">{userAnswer || "No answer provided"}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium mb-1">Correct Answer:</p>
                <p className="text-sm">{question.correctAnswer}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!quiz || !attempt) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Quiz results not found</h2>
        <p className="text-muted-foreground mb-4">The quiz results you're looking for don't exist.</p>
        <Button onClick={() => router.push("/quizzes")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quizzes
        </Button>
      </div>
    )
  }

  const score = attempt?.score || 0
  const total_points = quiz.total_points
  const percentage = Math.round((score / total_points) * 100)
  const correctAnswers = getCorrectAnswers()
  const totalQuestions = quiz.quiz_questions.length
  const timeTaken = getTimeTaken()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/quizzes")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quizzes
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Results
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Results Header */}
      <Card className="border-2">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className={`p-4 rounded-full ${percentage >= 70 ? "bg-green-100" : "bg-red-100"}`}>
              <Trophy className={`h-8 w-8 ${percentage >= 70 ? "text-green-600" : "text-red-600"}`} />
            </div>
          </div>
          <CardTitle className="text-2xl mb-2">{quiz.title}</CardTitle>
          <CardDescription className="text-base">{quiz.course}</CardDescription>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant={percentage >= 70 ? "default" : "destructive"} className="text-lg px-4 py-2">
              {percentage}% ({getGradeLetter(score, total_points)})
            </Badge>
            <Badge variant="outline" className="text-base px-3 py-1">
              {score}/{total_points} points
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Final Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(score, total_points)}`}>
              {score}/{total_points}
            </div>
            <p className="text-xs text-muted-foreground">
              {percentage}% ({getGradeLetter(score, total_points)} Grade)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Correct Answers</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {correctAnswers}/{totalQuestions}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((correctAnswers / totalQuestions) * 100)}% accuracy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Taken</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeTaken}</div>
            <p className="text-xs text-muted-foreground">of {quiz.duration} minutes allowed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attempt</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">of {quiz.attempts} allowed</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Score</span>
              <span className="font-medium">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-2">Quiz Information</p>
              <div className="space-y-1 text-muted-foreground">
                <p>• Course: {quiz.course}</p>
                <p>• Total Questions: {totalQuestions}</p>
                <p>• Total Points: {total_points}</p>
                <p>• Time Limit: {quiz.duration} minutes</p>
              </div>
            </div>
            <div>
              <p className="font-medium mb-2">Your Performance</p>
              <div className="space-y-1 text-muted-foreground">
                <p>
                  • Correct Answers: {correctAnswers}/{totalQuestions}
                </p>
                <p>
                  • Points Earned: {score}/{total_points}
                </p>
                <p>• Time Used: {timeTaken}</p>
                <p>• Completion Date: {new Date(attempt?.endTime || "").toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question-by-Question Review */}
      <Card>
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
          <CardDescription>Review your answers and see the correct solutions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {quiz.quiz_questions.map((question, index) => renderQuestionResult(question, index))}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => router.push("/quizzes")}>
              <BookOpen className="h-4 w-4 mr-2" />
              View All Quizzes
            </Button>
            {quiz.attempts > 1 && (
              <Button variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
