"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, BookOpen, Trophy, Play, CheckCircle } from "lucide-react"
import { api, type Quiz, type QuizAttempt } from "@/services/api"
import { useRouter } from "next/navigation"
import { useFormField } from "../ui/form"
import { quizService } from "@/services/quizService"
import { useAuth } from "@/providers/auth-provider"

export function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter();
  const { user } = useAuth();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [quizzesData, attemptsData] = await Promise.all([api.getQuizzes(), api.getQuizAttempts()])
  //       setQuizzes(quizzesData)
  //       setAttempts(attemptsData)
  //     } catch (error) {
  //       console.error("Failed to fetch quizzes:", error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchData()
  // }, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // const res = await quizService.getQuizByInstructorId(user?.user_id);
        // setQuizzes(res.quizzes);
        const [quizzesData, attemptsData] = await Promise.all([
          quizService.getQuizByInstructorId(user?.user_id),
          quizService.getQuizAttempts(user?.user_id)])
        setQuizzes(quizzesData)
        setAttempts(attemptsData)

      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  // const handleStartQuiz = async (quizId: string) => {
  //   try {
  //     const attempt = await api.startQuizAttempt(quizId)
  //     router.push(`/quizzes/${quizId}/take?attempt=${attempt.id}`)
  //   } catch (error) {
  //     console.error("Failed to start quiz:", error)
  //   }
  // }

  const handleStartQuiz = async (quiz_id: number, student_id: number) => {
    try {
      const data = await quizService.startQuizAttempt(quiz_id, student_id);
      if (data.success) {
        const attempt_id = data.attempt.quizAttempt_id
        router.push(`/quizzes/${quiz_id}/take?attempt=${attempt_id}`)
      }
      console.log(quiz_id, student_id);
    } catch (error) {
      console.error("Failed to start quiz:", error)
    }
  }

  const handleViewResult = async (quiz_id: number) => {
    router.push(`/quizzes/${quiz_id}/results`)
  }

  console.log('attempts: ', attempts);

  const getQuizStats = () => {
    const total = quizzes.length;
    const completed = attempts.filter((a) => a.status === "submitted").length
    const inProgress = attempts.filter((a) => a.status === "in-progress").length
    const averageScore =
      attempts.filter((a) => a.score !== undefined).reduce((sum, a) => sum + (a.score || 0), 0) / Math.max(completed, 1)

    return { total, completed, inProgress, averageScore }
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
    // <>Quiz page</>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <p className="text-muted-foreground">Test your knowledge and track your progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.averageScore)}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available" className="cursor-pointer">Available Quizzes ({stats.total})</TabsTrigger>
          <TabsTrigger value="completed" className="cursor-pointer">Completed ({stats.completed})</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quizzes
              .filter((quiz) => !attempts.some((a) => a.quiz_id === quiz.id && a.status === "submitted"))
              .map((quiz) => (
                <Card key={quiz.quiz_id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        <CardDescription>{quiz.course}</CardDescription>
                      </div>
                      <Badge variant={quiz.status === "active" ? "default" : "secondary"}>{quiz.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{quiz.description}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {quiz.duration} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        {quiz.total_points} pts
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="font-medium">{quiz?.quiz_questions?.length}</span> questions
                      <span className="text-muted-foreground"> • </span>
                      <span className="font-medium">{quiz.attempts}</span> attempts allowed
                    </div>

                    <Button
                      onClick={() => handleStartQuiz(quiz.quiz_id, user?.user_id)}
                      className="w-full cursor-pointer"
                      disabled={quiz.status !== "active"}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {attempts
              .filter((attempt) => attempt.status === "completed")
              .map((attempt) => {
                const quiz = quizzes.find((q) => q.quiz_id === attempt.quiz_id);

                if (!quiz) return null

                const scorePercentage = attempt.score ? Math.round((attempt.score / quiz.total_points) * 100) : 0

                return (
                  <Card key={attempt.quizAttempt_id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{quiz.title}</CardTitle>
                          <CardDescription>{quiz.course}</CardDescription>
                        </div>
                        <Badge variant={scorePercentage >= 70 ? "default" : "destructive"}>{scorePercentage}%</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Score:</span>
                        <span className="font-medium">
                          {attempt.score}/{quiz.total_points} points
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Completed:</span>
                        <span className="font-medium">
                          {attempt.endTime ? new Date(attempt.endTime).toLocaleDateString() : "N/A"}
                        </span>
                      </div>

                      <Button onClick={() => handleViewResult(attempt.quiz_id)} variant="outline" className="w-full bg-transparent cursor-pointer">
                        View Results {attempt.quiz_id}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
