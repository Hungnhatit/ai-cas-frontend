'use client';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowLeft, BookOpen, Calendar, FileText } from 'lucide-react';
import { Assignment } from '@/types/interfacess/assignment'
import AssignmentHeader from './assignment-header';
import AssignmentInfo from './assignment-info'
import SubmissionSection from './assignment-submission';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { assignmentService } from '@/services/assignmentService';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

interface AssignmentDetailProps {
  assignment_id: number
}

// Mock data for demonstration
const mockAssignment: Assignment = {
  assignment_id: 12345,
  title: "Advanced React Patterns and Performance Optimization",
  course_id: 101,
  ma_giang_vien: 456,
  student_ids: 789,
  description: `In this assignment, you will demonstrate your understanding of advanced React patterns and performance optimization techniques.

Requirements:
1. Implement a React application using the following patterns:
   - Higher-Order Components (HOCs)
   - Render Props
   - Custom Hooks
   - Context API with useReducer

2. Performance Optimization:
   - Implement React.memo for component memoization
   - Use useMemo and useCallback hooks appropriately
   - Implement code splitting with React.lazy and Suspense
   - Optimize bundle size and loading performance

3. Testing:
   - Write unit tests for all custom hooks
   - Implement integration tests for key user flows
   - Achieve minimum 80% code coverage

4. Documentation:
   - Provide comprehensive README with setup instructions
   - Document all custom hooks and components
   - Include performance benchmarks and optimization strategies

Submission Guidelines:
- Submit your complete project as a zip file
- Include a demo video (max 5 minutes) showcasing your application
- Provide a written report (2-3 pages) explaining your implementation choices

Evaluation Criteria:
- Code quality and organization (30%)
- Implementation of required patterns (25%)
- Performance optimizations (20%)
- Testing coverage and quality (15%)
- Documentation and presentation (10%)`,
  dueDate: "2024-12-15T23:59:00Z",
  status: "pending",
  total_points: 100,
  submissionsCount: 0,
  courseCode: "CS-4550",
  createdAt: "2024-11-01T10:00:00Z",
  updatedAt: "2024-11-05T14:30:00Z",
  attachments: [
    "assignment-starter-template.zip",
    "performance-testing-guide.pdf",
    "react-patterns-reference.md"
  ]
}

const AssignmentDetailPage = ({ assignment_id }: AssignmentDetailProps) => {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await assignmentService.fetchAssignmentById(assignment_id);
        if (res.success) {
          let data = res.data;

          if (typeof data.attachments === 'string') {
            try {
              data.attachments = JSON.parse(data.attachments)
            } catch {
              data.attachments = []
            }
          }
          setAssignment(data);
        }
      } catch (error) {
        toast.error(`Error when fetching assignment ${error}`);
      }
    }
    fetchAssignment();
  }, [assignment_id]);

  const handleGoBack = () => {
    // this would navigate back to assignments list
    window.history.back();
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        {/* Back Button */}
        <div className='flex items-center bg-[#232f3e] p-4 mb-3'>
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className=" hover:bg-gray-600 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" color='white' />
            <span className='text-white'>Back to Assignments</span>
          </Button>
        </div>

        <div className='mb-3'>
          <Alert variant="destructive" className='rounded-xs'>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className='text-[15px] font-semibold'>
              This assignment is overdue. Late submissions may receive reduced points.
            </AlertDescription>
          </Alert>
        </div>

        {/* Assignment Header */}
        <AssignmentHeader assignment={assignment} />

        {/* Assignment Info */}
        <AssignmentInfo assignment={assignment} />

        {/* Submission Section */}
        <SubmissionSection assignment={assignment} />
      </div>
    </div>
  )
}

export default AssignmentDetailPage
