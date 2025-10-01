// Mock API service - replace with real API calls
export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  students: number
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  category: string
  thumbnail: string
  progress?: number
  rating: number
  price: number
  status: "active" | "draft" | "archived"
}

export interface Student {
  student_id: number
  name: string
  email: string
  avatar: string
  enrolledCourses: number
  completedCourses: number
  progress: number
  joinDate: string
  instructor_id?: string
}

export interface Assignment {
  id: string
  title: string
  course: string
  dueDate: string
  status: "pending" | "submitted" | "graded"
  grade?: number
  description: string
}

export interface QuizQuestion {
  quizQuestion_id: number
  question: string
  type: "multiple-choice" | "true-false" | "short-answer"
  options?: string[]
  correctAnswer: string | number
  points: number
}

export interface Quiz {
  id: string
  title: string
  course: string
  description: string
  duration: number // in minutes
  totalPoints: number
  quiz_questions: QuizQuestion[]
  attempts: number
  status: "active" | "draft" | "archived",
  visibility: string,
  dueDate: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  studentId: string
  answers: Record<string, string | number>
  score?: number
  start_time: string
  end_time?: string
  status: "in-progress" | "completed" | "submitted"
}

// Mock data
const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to React",
    description: "Learn the fundamentals of React development",
    instructor: "John Doe",
    students: 150,
    duration: "8 weeks",
    level: "Beginner",
    category: "Web Development",
    thumbnail: "/react-course.png",
    progress: 65,
    rating: 4.8,
    price: 99,
    status: "active",
  },
  {
    id: "2",
    title: "Advanced JavaScript",
    description: "Master advanced JavaScript concepts and patterns",
    instructor: "Jane Smith",
    students: 89,
    duration: "12 weeks",
    level: "Advanced",
    category: "Programming",
    thumbnail: "/javascript-course.png",
    progress: 30,
    rating: 4.9,
    price: 149,
    status: "active",
  },
  {
    id: "3",
    title: "UI/UX Design Principles",
    description: "Learn design thinking and user experience principles",
    instructor: "Mike Johnson",
    students: 200,
    duration: "6 weeks",
    level: "Intermediate",
    category: "Design",
    thumbnail: "/design-course-concept.png",
    progress: 80,
    rating: 4.7,
    price: 79,
    status: "active",
  },
]

const mockStudents: Student[] = [
  {
    student_id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "/student-avatar.png",
    enrolledCourses: 3,
    completedCourses: 1,
    progress: 75,
    joinDate: "2024-01-15",
  },
  {
    student_id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    avatar: "/student-avatar.png",
    enrolledCourses: 2,
    completedCourses: 2,
    progress: 100,
    joinDate: "2024-02-20",
  },
]

const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "React Component Exercise",
    course: "Introduction to React",
    dueDate: "2024-12-30",
    status: "pending",
    description: "Create a functional React component with props and state",
  },
  {
    id: "2",
    title: "JavaScript Algorithms",
    course: "Advanced JavaScript",
    dueDate: "2024-12-25",
    status: "submitted",
    grade: 85,
    description: "Implement sorting and searching algorithms",
  },
]

const mockQuizzes: Quiz[] = [
  // {
  //   id: "1",
  //   title: "React Fundamentals Quiz",
  //   course: "Introduction to React",
  //   description: "Test your knowledge of React basics including components, props, and state",
  //   duration: 30,
  //   totalPoints: 100,
  //   attempts: 3,
  //   status: "active",
  //   dueDate: "2024-12-31",
  //   quiz_questions: [
  //     {
  //       quizQuestion_id: "q1",
  //       question: "What is JSX?",
  //       type: "multiple-choice",
  //       options: ["A JavaScript extension syntax", "A CSS framework", "A database query language", "A testing library"],
  //       correctAnswer: 0,
  //       points: 10,
  //     },
  //     {
  //       quizQuestion_id: "q2",
  //       question: "React components must return a single parent element.",
  //       type: "true-false",
  //       correctAnswer: 1,
  //       points: 10,
  //     },
  //     {
  //       quizQuestion_id: "q3",
  //       question: "What hook is used to manage state in functional components?",
  //       type: "short-answer",
  //       correctAnswer: "useState",
  //       points: 15,
  //     },
  //   ],
  // },
  // {
  //   id: "2",
  //   title: "JavaScript Advanced Concepts",
  //   course: "Advanced JavaScript",
  //   description: "Advanced JavaScript concepts including closures, promises, and async/await",
  //   duration: 45,
  //   totalPoints: 150,
  //   attempts: 2,
  //   status: "active",
  //   dueDate: "2024-12-28",
  //   quiz_questions: [
  //     {
  //       quizQuestion_id: "q1",
  //       question: "What is a closure in JavaScript?",
  //       type: "multiple-choice",
  //       options: [
  //         "A function that has access to variables in its outer scope",
  //         "A way to close browser windows",
  //         "A method to end loops",
  //         "A type of error handling",
  //       ],
  //       correctAnswer: 0,
  //       points: 20,
  //     },
  //   ],
  // },
]

const mockQuizAttempts: QuizAttempt[] = [
  // {
  //   id: "1",
  //   quizId: "1",
  //   studentId: "current-user",
  //   answers: {},
  //   startTime: new Date().toISOString(),
  //   status: "in-progress",
  // },
]

// API functions
export const api = {
  // Courses
  getCourses: async (): Promise<Course[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
    return mockCourses
  },

  getCourse: async (id: string): Promise<Course | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockCourses.find((course) => course.id === id) || null
  },

  createCourse: async (course: Omit<Course, "id">): Promise<Course> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newCourse = { ...course, id: Date.now().toString() }
    mockCourses.push(newCourse)
    return newCourse
  },

  updateCourse: async (id: string, updates: Partial<Course>): Promise<Course | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockCourses.findIndex((course) => course.id === id)
    if (index === -1) return null
    mockCourses[index] = { ...mockCourses[index], ...updates }
    return mockCourses[index]
  },

  deleteCourse: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = mockCourses.findIndex((course) => course.id === id)
    if (index === -1) return false
    mockCourses.splice(index, 1)
    return true
  },

  // Students
  getStudents: async (): Promise<Student[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockStudents
  },

  getStudent: async (id: string): Promise<Student | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockStudents.find((student) => student.student_id === id) || null
  },

  // Assignments
  getAssignments: async (): Promise<Assignment[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockAssignments
  },

  getAssignment: async (id: string): Promise<Assignment | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockAssignments.find((assignment) => assignment.id === id) || null
  },

  submitAssignment: async (id: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const assignment = mockAssignments.find((a) => a.id === id)
    if (assignment) {
      assignment.status = "submitted"
      return true
    }
    return false
  },

  // Quizzes
  getQuizzes: async (): Promise<Quiz[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockQuizzes
  },

  getQuiz: async (id: number): Promise<Quiz | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockQuizzes.find((quiz) => quiz.id === id) || null
  },

  startQuizAttempt: async (quizId: string): Promise<QuizAttempt> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      quizId,
      studentId: "current-user",
      answers: {},
      startTime: new Date().toISOString(),
      status: "in-progress",
    }
    mockQuizAttempts.push(attempt)
    return attempt
  },

  submitQuizAnswer: async (attemptId: number, questionId: string, answer: string | number): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const attempt = mockQuizAttempts.find((a) => a.id === attemptId.toString())
    if (attempt) {
      attempt.answers[questionId] = answer
      return true
    }
    return false
  },

  submitQuizAttempt: async (attemptId: string): Promise<QuizAttempt | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const attempt = mockQuizAttempts.find((a) => a.id === attemptId)
    if (attempt) {
      attempt.status = "submitted"
      attempt.endTime = new Date().toISOString()

      // Calculate score
      const quiz = mockQuizzes.find((q) => q.id === attempt.quizId)
      if (quiz) {
        let score = 0
        quiz.quiz_questions.forEach((question) => {
          const userAnswer = attempt.answers[question.quizQuestion_id]
          if (userAnswer === question.correctAnswer) {
            score += question.points
          }
        })
        attempt.score = score
      }

      return attempt
    }
    return null
  },

  getQuizAttempts: async (quizId?: number): Promise<QuizAttempt[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return quizId ? mockQuizAttempts.filter((attempt) => attempt.quizId === quizId) : mockQuizAttempts
  },
}
