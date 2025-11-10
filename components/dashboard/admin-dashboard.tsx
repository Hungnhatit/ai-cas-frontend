"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, BookOpen, GraduationCap, AlertTriangle, DollarSign, Activity, UserPlus } from "lucide-react"
import { useCourses } from "@/hooks/use-courses"

export function AdminDashboard() {
  const { courses, loading } = useCourses()

  const totalStudents = 1250
  const totalInstructors = 45
  const totalRevenue = 125000
  const activeUsers = 890

  const systemAlerts = [
    { id: "1", type: "warning", message: "Server maintenance scheduled for Dec 30", priority: "medium" },
    { id: "2", type: "info", message: "New course approval pending", priority: "low" },
    { id: "3", type: "error", message: "Payment gateway issue reported", priority: "high" },
  ]

  const recentActivity = [
    { id: "1", action: "New instructor registered", user: "Dr. Sarah Wilson", time: "2h ago" },
    { id: "2", action: "Course published", user: "Mike Johnson", time: "4h ago" },
    { id: "3", action: "Student enrolled", user: "Alice Cooper", time: "6h ago" },
    { id: "4", action: "Payment processed", user: "Bob Smith", time: "8h ago" },
  ]

  const topCourses = courses
    .sort((a, b) => b.students - a.students)
    .slice(0, 5)
    .map((course, index) => ({ ...course, rank: index + 1 }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#232f3e] -mx-4 -mt-4 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white">System overview and management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="rounded-[3px] cursor-pointer">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
          <Button className="rounded-[3px] cursor-pointer">System Settings</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instructors</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInstructors}</div>
            <p className="text-xs text-muted-foreground">+3 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Important notifications and issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3">
                <AlertTriangle
                  className={`h-5 w-5 mt-0.5 ${alert.priority === "high"
                    ? "text-red-500"
                    : alert.priority === "medium"
                      ? "text-yellow-500"
                      : "text-blue-500"
                    }`}
                />
                <div className="flex-1">
                  <p className="font-medium">{alert.message}</p>
                  <Badge variant={alert.priority === "high" ? "destructive" : "secondary"} className="mt-1">
                    {alert.priority} priority
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent">
              View All Alerts
            </Button>
          </CardContent>
        </Card>

        {/* Top Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Top Courses</CardTitle>
            <CardDescription>Most popular courses by enrollment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{course.rank}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">{course.instructor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{course.students} students</p>
                  <p className="text-sm text-muted-foreground">⭐ {course.rating}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system activity and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Server Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span>45%</span>
              </div>
              <Progress value={45} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>RAM</span>
                <span>68%</span>
              </div>
              <Progress value={68} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
