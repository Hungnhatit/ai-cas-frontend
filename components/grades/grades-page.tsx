"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Award, Target, BookOpen, BarChart3 } from "lucide-react"
import { useCourses } from "@/hooks/use-courses"
import { api, type Assignment } from "@/services/api"

interface GradeData {
  courseId: string
  courseName: string
  assignments: Assignment[]
  averageGrade: number
  totalAssignments: number
  completedAssignments: number
}

export function GradesPage() {
  const { courses } = useCourses()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState("all")

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await api.getAssignments()
        setAssignments(data)
      } catch (error) {
        console.error("Failed to fetch assignments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  const enrolledCourses = courses.filter((course) => course.progress !== undefined)

  const gradeData: GradeData[] = enrolledCourses.map((course) => {
    const courseAssignments = assignments.filter((assignment) => assignment.course === course.title)
    const gradedAssignments = courseAssignments.filter((assignment) => assignment.grade !== undefined)
    const averageGrade =
      gradedAssignments.length > 0
        ? gradedAssignments.reduce((sum, assignment) => sum + (assignment.grade || 0), 0) / gradedAssignments.length
        : 0

    return {
      courseId: course.id,
      courseName: course.title,
      assignments: courseAssignments,
      averageGrade,
      totalAssignments: courseAssignments.length,
      completedAssignments: gradedAssignments.length,
    }
  })

  const overallAverage =
    gradeData.length > 0 ? gradeData.reduce((sum, course) => sum + course.averageGrade, 0) / gradeData.length : 0

  const totalAssignments = gradeData.reduce((sum, course) => sum + course.totalAssignments, 0)
  const completedAssignments = gradeData.reduce((sum, course) => sum + course.completedAssignments, 0)

  const filteredGradeData =
    selectedCourse === "all" ? gradeData : gradeData.filter((data) => data.courseId === selectedCourse)

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600"
    if (grade >= 80) return "text-blue-600"
    if (grade >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getGradeBadgeVariant = (grade: number) => {
    if (grade >= 90) return "default"
    if (grade >= 70) return "secondary"
    return "destructive"
  }

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
          <h1 className="text-3xl font-bold">Grades</h1>
          <p className="text-muted-foreground">Track your academic performance</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getGradeColor(overallAverage)}`}>{overallAverage.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3" />
              +2.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedAssignments}/{totalAssignments}
            </div>
            <p className="text-xs text-muted-foreground">Completed assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrolledCourses.length}</div>
            <p className="text-xs text-muted-foreground">Enrolled courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0}%
            </div>
            <Progress
              value={totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Course Filter */}
      <div className="flex items-center gap-4">
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {enrolledCourses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grades Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGradeData.map((courseData) => (
              <Card key={courseData.courseId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{courseData.courseName}</span>
                    <Badge variant={getGradeBadgeVariant(courseData.averageGrade)}>
                      {courseData.averageGrade.toFixed(1)}%
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {courseData.completedAssignments} of {courseData.totalAssignments} assignments graded
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {courseData.totalAssignments > 0
                          ? Math.round((courseData.completedAssignments / courseData.totalAssignments) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        courseData.totalAssignments > 0
                          ? (courseData.completedAssignments / courseData.totalAssignments) * 100
                          : 0
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Grade</span>
                      <span className={getGradeColor(courseData.averageGrade)}>
                        {courseData.averageGrade.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={courseData.averageGrade} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {filteredGradeData.map((courseData) => (
            <Card key={courseData.courseId}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{courseData.courseName}</span>
                  <Badge variant={getGradeBadgeVariant(courseData.averageGrade)}>
                    Average: {courseData.averageGrade.toFixed(1)}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courseData.assignments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No assignments for this course yet.</p>
                  ) : (
                    courseData.assignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <h4 className="font-medium">{assignment.title}</h4>
                          <p className="text-sm text-muted-foreground">{assignment.description}</p>
                        </div>
                        <div className="text-right space-y-1">
                          {assignment.grade !== undefined ? (
                            <>
                              <Badge variant={getGradeBadgeVariant(assignment.grade)}>{assignment.grade}%</Badge>
                              <p className="text-xs text-muted-foreground">Graded</p>
                            </>
                          ) : (
                            <>
                              <Badge variant="outline" className="capitalize">
                                {assignment.status}
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                {assignment.status === "pending" ? "Not submitted" : "Awaiting grade"}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
