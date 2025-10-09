export interface Assignment {
  assignment_id: number
  title: string
  course_id: number
  ma_giang_vien: number
  student_ids: number
  description: string
  dueDate: string
  status: "pending" | "submitted" | "graded"
  grade?: number
  submissionDate?: string,
  attachments?: [],
  total_points: number
  submissionsCount: number,
  courseCode: string
  feedback?: string
  createdAt: string
  updatedAt: string
}

export interface AssignmentFormData {
  title: string
  course_id: number
  ma_giang_vien: number
  student_ids: number[]
  description: string
  dueDate: string
  status: "pending" | "submitted" | "graded"
  grade?: number
  submissionDate?: string
  attachments?: File[]
  feedback?: string
}
