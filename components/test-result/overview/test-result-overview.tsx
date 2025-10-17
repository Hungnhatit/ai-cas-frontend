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
import { testAttemptService } from "@/services/test/testAttemptService"
import { testService } from "@/services/test/testService"
import { Test, TestQuestion } from "@/types/interfaces/model"
import { TestAttempt } from "@/types/interfaces/test"

interface TestResultOverviewPageProps {
  test_id: number
  testAttempt_id?: number
}

// this component is used for the result page after submitting the quiz
export function TestResultOverview({ test_id, testAttempt_id }: TestResultOverviewPageProps) {
  const [test, setTest] = useState<Test | null>(null)
  const [attempt, setAttempt] = useState<TestAttempt | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const [testData, attempts] = await Promise.all([api.getQuiz(test_id), api.getQuizAttempts(test_id)]);
        const [testsRes, attemptListRes] = await Promise.all([
          testService.getTestById(test_id),
          testAttemptService.getTestAttemptById(Number(testAttempt_id))
        ]);

        if (!testsRes) {
          router.push("/tests")
          return
        }

        const testData = testsRes.data;
        const attemptData = attemptListRes.data;

        if (attemptData?.cau_tra_loi && typeof attemptData.cau_tra_loi === "string") {
          attemptData.cau_tra_loi = JSON.parse(attemptData.cau_tra_loi);
        }

        setTest(testData);
        setAttempt(attemptData);

        // console.log(attemptListRes)

        // if (testAttempt_id) {
        //   const currentAttempt = attemptList.find((a: any) => a.testAttempt_id === testAttempt_id)
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

        // if (testAttempt_id) {
        //   setAttempt(attemptList)
        // }

      } catch (error) {
        console.error("Failed to fetch quiz results:", error)
        // router.push("/tests")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [test_id, testAttempt_id, router]);

  test && console.log('test: ', test);
  attempt && console.log('attempt: ', attempt);


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getTimeTaken = () => {
    if (!attempt?.thoi_gian_bat_dau || !attempt?.thoi_gian_ket_thuc) return "N/A"
    const start = new Date(attempt.thoi_gian_bat_dau).getTime()
    const end = new Date(attempt.thoi_gian_ket_thuc).getTime()
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
    if (!test || !attempt) return 0
    let correct = 0
    test.cau_hoi.forEach((question) => {
      const userAnswer = attempt?.cau_tra_loi?.[question.ma_cau_hoi];
      console.log(userAnswer);
      if (userAnswer?.toString() === question.dap_an_dung) {
        correct++
      }
    })
    return correct;
  }

  // render detail question
  const renderQuestionResult = (question: TestQuestion, index: number) => {
    const userAnswer = attempt?.cau_tra_loi?.[question.ma_cau_hoi]
    const isCorrect = userAnswer?.toString() === question.dap_an_dung.toString();

    return (
      <Card key={question.ma_cau_hoi} className={`border-l-4 ${isCorrect ? "border-l-sky-600" : "border-l-red-500"} gap-0.5 py-4`}>
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
              <CardDescription className="text-sm leading-relaxed">{question.cau_hoi}</CardDescription>
            </div>
            <div className="text-right">
              <Badge variant={isCorrect ? "default" : "destructive"}>
                {isCorrect ? question.diem : 0}/{question.diem} pts
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.loai === "trac_nghiem" && question.lua_chon && (
            <div className="space-y-2">
              {question.lua_chon.map((option, optionIndex) => {
                const isUserAnswer = userAnswer === optionIndex
                const isCorrectAnswer = question.dap_an_dung === optionIndex.toString();
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

          {question.loai === "dung_sai" && (
            <div className="space-y-2">
              {["False", "True"].map((option, optionIndex) => {
                const isUserAnswer = userAnswer === optionIndex
                const isCorrectAnswer = question.dap_an_dung === optionIndex

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

          {question.loai === "tra_loi_ngan" && (
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-1">Your Answer:</p>
                <p className="text-sm">{userAnswer || "No answer provided"}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium mb-1">Correct Answer:</p>
                <p className="text-sm">{question.dap_an_dung}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!test || !attempt) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Test result not found</h2>
        <p className="text-muted-foreground mb-4">The test result you're looking for don't exist.</p>
        <Button onClick={() => router.push("/tests-management")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to tests
        </Button>
      </div>
    )
  }

  const score = attempt?.diem || 0
  const total_points = test.tong_diem
  const percentage = Math.round((score / total_points) * 100)
  const correctAnswers = getCorrectAnswers()
  const totalQuestions = test.cau_hoi.length
  const timeTaken = getTimeTaken()

  return (
    // <></>
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/tests")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
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
          <CardTitle className="text-2xl mb-2">{test.tieu_de}</CardTitle>
          <CardDescription className="text-base">{test.tieu_de}</CardDescription>
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
            <p className="text-xs text-muted-foreground">of {test.thoi_luong} minutes allowed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attempt</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">of {test.so_lan_lam_toi_da} allowed</p>
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
                <p>• Course: {test.tieu_de}</p>
                <p>• Total Questions: {totalQuestions}</p>
                <p>• Total Points: {total_points}</p>
                <p>• Time Limit: {test.thoi_luong} minutes</p>
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
                <p>• Completion Date: {new Date(attempt?.thoi_gian_ket_thuc || "").toLocaleDateString()}</p>
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
          {test.cau_hoi.map((question, index) => renderQuestionResult(question, index))}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => router.push("/tests")}>
              <BookOpen className="h-4 w-4 mr-2" />
              View All tests
            </Button>
            {test.so_lan_lam_toi_da > 1 && (
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
