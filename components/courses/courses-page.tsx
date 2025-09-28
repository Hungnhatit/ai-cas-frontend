"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Clock, Users, PlayCircle } from "lucide-react"
import { useCourses } from "@/hooks/use-courses"
import { useAuth } from "@/providers/auth-provider"
import { courseService } from "@/services/courseService";

interface Course  {
  course_id: number;
  category_id: number;
  isPublished: boolean;
  title: string;
  imageUrl: string;
  description: string;
  progress: string;
};

export function CoursesPage() {
  const { courses, loading } = useCourses()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")

  const categories = ["all", "Web Development", "Programming", "Design", "Data Science", "Mobile Development"]
  const levels = ["all", "Beginner", "Intermediate", "Advanced"]

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel
    return matchesSearch && matchesCategory && matchesLevel
  });

  const [getCourses, setGetCourses] = useState<Course[]>([]);
  const userId = user?.user_id ?? null;
  console.log(user?.user_id)

  useEffect(() => {
    try {
      if (!user?.user_id) return;
      const fetchCourses = async () => {
        const res = await courseService.getCourseByUser(userId);
        console.log(res)
        setGetCourses(res.data);
      }
      fetchCourses();
    } catch (error) {
      console.log(error)
    }
  }, []);

  console.log('Get courses: ', getCourses);

  const enrolledCourses = courses.filter((course) => course.progress !== undefined)
  const availableCourses = courses.filter((course) => course.progress === undefined)

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
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Discover and learn new skills</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>
                {level === "all" ? "All Levels" : level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Enrolled Courses */}
      {user?.role === "student" && enrolledCourses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">My Courses</h2>
          zsdfzd
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getCourses.map((course) => (
              <Card key={course.course_id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={course.imageUrl || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-48 object-contain rounded-t-lg"
                  />
                  <Badge className="absolute top-2 right-2 bg-primary">{course.progress}% Complete</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      {course.students} students
                    </span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {course.duration}
                    </span>
                  </div>
                  <Progress value={course.progress} className="w-full" />
                  <Button className="w-full">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Courses */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {user?.role === "student" ? "Discover More Courses" : "All Courses"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-48 object-contain rounded-t-lg"
                />
                <Badge
                  variant={
                    course.level === "Beginner" ? "secondary" : course.level === "Advanced" ? "destructive" : "default"
                  }
                  className="absolute top-2 left-2"
                >
                  {course.level}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">By {course.instructor}</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    {course.students} students
                  </span>
                  <span className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {course.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">${course.price}</span>
                  <Button>{course.progress !== undefined ? "Continue" : "Enroll Now"}</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No courses found matching your criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory("all")
              setSelectedLevel("all")
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
