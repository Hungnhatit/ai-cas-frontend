export interface Assignment {
  asignment_id: number
  title: string
  course_id: number
  instructor_id: number
  student_ids: number
  description: string
  dueDate: string
  status: "pending" | "submitted" | "graded"
  grade?: number
  submissionDate?: string,
  attachments?: []
  feedback?: string
  createdAt: string
  updatedAt: string
}

export interface AssignmentFormData {
  title: string
  course_id: number
  instructor_id: number
  student_ids: number[]
  description: string
  dueDate: string
  status: "pending" | "submitted" | "graded"
  grade?: number
  submissionDate?: string
  attachments?: File[]
  feedback?: string
}