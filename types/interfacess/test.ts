export interface Test {
  test_id: string;
  ma_giang_vien: number
  title: string
  description: string;
  name: string;
  duration: number;
  total_points: number;
  max_attempts: number;
  difficulty: 'easy' | 'medium' | 'hard'
  status: "active" | "draft" | "archived";
  start_date: string
  end_date: string;
  createdAt: string
  updatedAt: string
  questions: Question[];
}

export interface Question {
  question_id: number
  test_id: number;
  section_id: number;
  type: 'multiple-choice' | 'essay' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
  explanation?: string;
  createdAt: string;
  updatedAt: string
}


export interface UserAnswer {
  question_id: string;
  answer: string | number;
  timeSpent: number;
}

export interface TestSession {
  test_id: string;
  startTime: Date;
  answers: UserAnswer[];
  currentQuestionIndex: number;
  isCompleted: boolean;
}

export interface QuestionResult {
  question_id: string;
  question: string;
  userAnswer: string | number;
  correctAnswer?: string | number;
  isCorrect: boolean;
  points: number;
  earnedPoints: number;
  explanation?: string;
}

export interface TestResult {
  test_id: string;
  testName: string;
  totalQuestions: number;
  correctAnswers: number;
  total_points: number;
  earnedPoints: number;
  percentage: number;
  timeSpent: number;
  questionResults: QuestionResult[];
  completedAt: Date;
}

// Test Section
export interface TestSection {
  section_id: number;
  test_id: number;
  title: string;
  description?: string | null;
  order_index: number;
  points: number;
  createdAt: string; // ISO Date string
  updatedAt: string;
}

// Test Assignment
export type TestAssignmentStatus = "assigned" | "in_progress" | "completed" | "expired";

export interface TestAssignment {
  testAssignment_id: number;
  test_id: number;
  student_id: number;
  assigned_by: number; // ma_giang_vien
  assigned_at: string; // ISO Date string
  status: TestAssignmentStatus;
  createdAt: string;
  updatedAt: string;

  // optional relations
  test?: any; // bạn có thể thay bằng `Test` interface nếu đã định nghĩa
  student?: any; // thay bằng `Student`
  instructor?: any; // thay bằng `Instructor`
}

// Test Attempt
export type TestAttemptStatus = "in-progress" | "submitted" | "graded";

export interface TestAttempt {
  testAttempt_id: number;
  test_id: number;
  student_id: number;
  answers: Record<string, any> | null; // { questionId: answer }
  score: number;
  start_time: string;
  end_time?: string | null;
  status: TestAttemptStatus;
  createdAt: string;
  updatedAt: string;

  // optional relations
  test?: any; // hoặc Test
  student?: any; // hoặc Student
}
