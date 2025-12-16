"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import QuizIcon from '@/assets/icons/quiz.png'
import TestIcon from '@/assets/icons/exam.png';
import StudentIcon from '@/assets/icons/student.png'
import AssignmentIcon from '@/assets/icons/assignment.png'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, MessageSquare, BarChart3, Plus, Clock } from "lucide-react"
import { useCourses } from "@/hooks/use-courses"
import { useAuth } from "@/providers/auth-provider"
import Image from "next/image";
import { useRouter } from "next/navigation";

export function InstructorDashboard() {
  const { courses, loading } = useCourses()
  const { user } = useAuth();
  const router = useRouter();

  const myCourses = courses.filter((course) => course.instructor === user?.name)
  const totalStudents = myCourses.reduce((sum, course) => sum + course.students, 0)

  const recentMessages = [
    { id: "1", student: "Alice Johnson", course: "React Basics", message: "Question about hooks", time: "2h ago" },
    { id: "2", student: "Bob Smith", course: "JavaScript Advanced", message: "Assignment submission", time: "4h ago" },
    { id: "3", student: "Carol Davis", course: "UI/UX Design", message: "Project feedback request", time: "1d ago" },
  ]

  const upcomingTasks = [
    { id: "1", task: "Grade React assignments", course: "Introduction to React", due: "Today" },
    { id: "2", task: "Prepare next week's lecture", course: "Advanced JavaScript", due: "Tomorrow" },
    { id: "3", task: "Review project submissions", course: "UI/UX Design", due: "Dec 28" },
  ]

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  //     </div>
  //   )
  // }

  return (
    <div className="">
      <div className="bg-[#232f3e] flex items-center justify-between mb-6 -mx-4 -mt-4 p-5">
        <div className="">
          <h1 className="text-3xl font-bold text-white mb-2">Trang quản trị dành cho giảng viên</h1>
          <p className="text-white">Quản lý bài thi, học viên của bạn</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myCourses.length}</div>
              <p className="text-xs text-muted-foreground">Active courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">Across all courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Require response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">Course ratings</p>
            </CardContent>
          </Card>
        </div>

        {/* quick access */}
        <div>
          <div>
            <h1 className="text-2xl font-bold mb-1">Quick access</h1>
            <p className="text-muted-foreground">Manage your courses and students</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card onClick={() => router.push('/create-quizzes')} className="hover:bg-gray-100 transition cursor-pointer">
              <CardHeader className="">
                <div className="flex items-center justify-center mb-4">
                  <Image src={QuizIcon} alt="quiz-logo" width={32} height={32} />
                </div>
                <div>
                  <CardTitle className="text-center mb-2">Create a quiz</CardTitle>
                  <CardDescription className="text-center">Quickly build a custom quiz with questions and answers</CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card onClick={() => router.push('/assignments/create')} className="hover:bg-gray-100 transition cursor-pointer">
              <CardHeader className="">
                <div className="flex items-center justify-center mb-4">
                  <Image src={AssignmentIcon} alt="quiz-logo" width={32} height={32} />
                </div>
                <div>
                  <CardTitle className="text-center mb-2">Create an assignment</CardTitle>
                  <CardDescription className="text-center">Assign tasks or homework to students</CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card onClick={() => router.push('/')} className="hover:bg-gray-100 transition cursor-pointer">
              <CardHeader className="">
                <div className="flex items-center justify-center mb-4">
                  <Image src={TestIcon} alt="quiz-logo" width={32} height={32} />
                </div>
                <div>
                  <CardTitle className="text-center mb-2">Find a test</CardTitle>
                  <CardDescription className="text-center">Search and access available tests in the system</CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card onClick={() => router.push('/')} className="hover:bg-gray-100 transition cursor-pointer">
              <CardHeader className="">
                <div className="flex items-center justify-center mb-4">
                  <Image src={StudentIcon} alt="quiz-logo" width={32} height={32} />
                </div>
                <div>
                  <CardTitle className="text-center mb-2">Add a student</CardTitle>
                  <CardDescription className="text-center">Enroll a new student into your class or course</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Courses */}
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Courses you're teaching</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {myCourses.slice(0, 3).map((course) => (
                <div key={course.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">{course.students} students</p>
                    </div>
                  </div>
                  <Badge variant={course.status === "active" ? "default" : "secondary"}>{course.status}</Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                View All Courses
              </Button>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Student communications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentMessages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{message.student}</h4>
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{message.message}</p>
                  <p className="text-xs text-muted-foreground">Course: {message.course}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                View All Messages
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Things that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{task.task}</h4>
                    <p className="text-sm text-muted-foreground">{task.course}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      <Clock className="mr-1 h-3 w-3" />
                      {task.due}
                    </Badge>
                    <Button size="sm">Complete</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
