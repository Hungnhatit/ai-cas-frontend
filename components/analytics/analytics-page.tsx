"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from "recharts"
import { TrendingUp, Users, BookOpen, Award, Download } from "lucide-react"
import { useCourses } from "@/hooks/use-courses"
import { useAuth } from "@/providers/auth-provider"
import { studentService } from "@/services/studentService"
import { Instructor, Student } from "@/types/interfaces/model"
import { testService } from "@/services/test/testService"

const engagementData = [
  { name: "Week 1", students: 45, completion: 85 },
  { name: "Week 2", students: 42, completion: 78 },
  { name: "Week 3", students: 40, completion: 82 },
  { name: "Week 4", students: 38, completion: 75 },
  { name: "Week 5", students: 36, completion: 88 },
  { name: "Week 6", students: 35, completion: 90 },
]

const performanceData = [
  { grade: "90-100", students: 12, color: "#22c55e" },
  { grade: "80-89", students: 18, color: "#3b82f6" },
  { grade: "70-79", students: 8, color: "#f59e0b" },
  { grade: "60-69", students: 4, color: "#ef4444" },
  { grade: "Below 60", students: 2, color: "#6b7280" },
]

const courseCompletionData = [
  { course: "React Basics", completed: 85, total: 100 },
  { course: "JavaScript Advanced", completed: 72, total: 89 },
  { course: "UI/UX Design", completed: 95, total: 120 },
]

export function AnalyticsPage() {
  const { courses } = useCourses();
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [tests, setTests] = useState<Instructor[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    if (!user) return;
    const fetchStudents = async () => {
      const [resTests, resStudent] = await Promise.all([
        testService.getTestsByInstructorId(user?.ma_nguoi_dung),
        studentService.getStudentByInstructorId(user?.ma_nguoi_dung)
      ])

      setTests(resTests.data);
      setStudents(resStudent.data.hoc_vien);
    }
    fetchStudents();
  }, []);

  console.log(tests);

  const myCourses = courses.filter((course) => course.instructor === user?.name)
  const totalStudents = students.length;
  const totalTests = tests.length;
  const avgRating =
    myCourses.length > 0 ? myCourses.reduce((sum, course) => sum + course.rating, 0) / myCourses.length : 0

  return (
    <div className="space-y-6">
      <div className="bg-[#232f3e] flex items-center justify-between -mx-4 -mt-4 p-5">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-white">Theo dõi hiệu suất làm bài kiểm tra và sự tham gia của học sinh</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-white cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="7d" className="cursor-pointer">Last 7 days</SelectItem>
              <SelectItem value="30d" className="cursor-pointer">Last 30 days</SelectItem>
              <SelectItem value="90d" className="cursor-pointer">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        {/* Total test */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Total tests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myCourses.filter((c) => c.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Avg. Rating</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> from last month
            </p>
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
            {myCourses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="completion">Completion</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Engagement Over Time</CardTitle>
                <CardDescription>Weekly active students and completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="students" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="completion" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Activity</CardTitle>
                <CardDescription>Recent student activity across courses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {myCourses.slice(0, 3).map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{course.title}</span>
                      <Badge variant="outline">{course.students} students</Badge>
                    </div>
                    <Progress value={Math.random() * 100} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Activity Score</span>
                      <span>{Math.floor(Math.random() * 40 + 60)}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Student performance across all courses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ grade, students }) => `${grade}: ${students}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="students"
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assignment Performance</CardTitle>
                <CardDescription>Average scores by assignment type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { type: "Quizzes", score: 85 },
                      { type: "Projects", score: 78 },
                      { type: "Exams", score: 82 },
                      { type: "Homework", score: 88 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="completion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Completion Rates</CardTitle>
              <CardDescription>Track student progress across your courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {courseCompletionData.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{course.course}</span>
                    <span className="text-sm text-muted-foreground">
                      {course.completed}/{course.total} students
                    </span>
                  </div>
                  <Progress value={(course.completed / course.total) * 100} className="h-3" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Completion Rate</span>
                    <span>{Math.round((course.completed / course.total) * 100)}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>AI-powered recommendations to improve your courses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">📈 Engagement Opportunity</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Students show 23% higher engagement with video content. Consider adding more interactive videos to your
              React course.
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">✅ Strong Performance</h4>
            <p className="text-sm text-green-800 dark:text-green-200">
              Your UI/UX Design course has the highest completion rate (95%). Students particularly enjoy the hands-on
              projects.
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">⚠️ Attention Needed</h4>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Week 4 shows a drop in engagement across courses. Consider reviewing content difficulty or adding more
              support materials.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
