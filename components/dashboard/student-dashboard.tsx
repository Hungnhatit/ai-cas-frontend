"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Award, TrendingUp, Calendar, PlayCircle } from "lucide-react"
import { useCourses } from "@/hooks/use-courses"
import { useAuth } from "@/providers/auth-provider"

export function StudentDashboard() {
  const { courses, loading } = useCourses()
  const { user } = useAuth()

  const enrolledCourses = courses.filter((course) => course.progress !== undefined)
  const completedCourses = enrolledCourses.filter((course) => course.progress === 100)
  const inProgressCourses = enrolledCourses.filter((course) => course.progress && course.progress < 100)

  const upcomingAssignments = [
    { id: "1", title: "React Component Exercise", course: "Introduction to React", dueDate: "Dec 30, 2024" },
    { id: "2", title: "JavaScript Algorithms", course: "Advanced JavaScript", dueDate: "Jan 5, 2025" },
    { id: "3", title: "Design Portfolio", course: "UI/UX Design", dueDate: "Jan 10, 2025" },
  ]

  const recentActivity = [
    { id: "1", type: "completed", title: "Completed lesson: React Hooks", time: "2 hours ago" },
    { id: "2", type: "submitted", title: "Submitted assignment: Component Design", time: "1 day ago" },
    { id: "3", type: "enrolled", title: "Enrolled in Advanced JavaScript", time: "3 days ago" },
  ]

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
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>
        <Button>
          <BookOpen className="mr-2 h-4 w-4" />
          Browse Courses
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrolledCourses.length}</div>
            <p className="text-xs text-muted-foreground">Active learning paths</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCourses.length}</div>
            <p className="text-xs text-muted-foreground">Courses finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Continue Learning */}
        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {inProgressCourses.slice(0, 3).map((course) => (
              <div key={course.id} className="flex items-center space-x-4">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium">{course.title}</h4>
                  <div className="flex items-center space-x-2">
                    <Progress value={course.progress} className="flex-1" />
                    <span className="text-sm text-muted-foreground">{course.progress}%</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Continue
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>Don't miss these deadlines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAssignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">{assignment.title}</h4>
                  <p className="text-sm text-muted-foreground">{assignment.course}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">
                    <Calendar className="mr-1 h-3 w-3" />
                    {assignment.dueDate}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent">
              View All Assignments
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your learning progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
