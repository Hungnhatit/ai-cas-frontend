'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, CalendarDays, FileText, GraduationCap, User, Users, Upload, AlertCircle, Check, ChevronDown } from 'lucide-react'
import FormField from './assignment-form-field'

import { AssignmentFormData } from '@/types/interfaces/assignment';
import { useAuth } from '@/providers/auth-provider'
import { api, Student } from '@/services/api'
import { studentService } from '@/services/studentService'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast'
import { assignmentService } from '@/services/assignmentService'

const AssignmentForm = () => {
  const [formData, setFormData] = useState<AssignmentFormData>({
    title: '',
    course_id: 0,
    instructor_id: 0,
    student_ids: [],
    description: '',
    dueDate: '',
    status: 'pending',
    grade: undefined,
    submissionDate: '',
    attachments: [],
    feedback: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof AssignmentFormData, string>>>({})
  const [attachments, setAttachments] = useState<File[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [searchStudent, setSearchStudent] = useState('');
  const { user } = useAuth(); // get user from auth provider
  console.log(formData)
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AssignmentFormData, string>> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Assignment title is required'
    }

    if (formData.course_id <= 0) {
      newErrors.course_id = 'Course ID must be a positive number'
    }

    if (formData.instructor_id <= 0) {
      newErrors.instructor_id = 'Instructor ID must be a positive number'
    }

    // if (formData.student_id <= 0) {
    //   newErrors.student_id = 'Student ID must be a positive number'
    // }

    if (!formData.description.trim()) {
      newErrors.description = 'Assignment description is required'
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    }

    if (formData.status === 'graded' && (formData.grade === undefined || formData.grade < 0 || formData.grade > 100)) {
      newErrors.grade = 'Grade must be between 0 and 100 when status is graded'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof AssignmentFormData, value: string | number | number[] | File[] | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  // handle select one or more students
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const [getStudents] = await Promise.all([
          studentService.getStudentByInstructorId(user?.user_id)
        ]);
        setStudents(getStudents.data.instructor.students);
      } catch (error) {
        console.log(error);
      }
    }
    fetchStudent();

  }, [user?.user_id]);

  useEffect(() => {
    handleInputChange('student_id', selectedStudents);
  }, [selectedStudents]);

  const toggleStudent = (id: number) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]); // clear
    } else {
      setSelectedStudents(students.map((s) => s.student_id))
    }
  }

  const toggleStudents = (id: number) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(searchStudent.toLowerCase())
  )

  const placeholder =
    selectedStudents.length === 0
      ? "Select students..."
      : selectedStudents.length === students.length
        ? "All students selected"
        : `${selectedStudents.length} students selected`

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(files)
    handleInputChange('attachments', files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('handle submit');
    try {
      if (!validateForm()) {
        toast.error(`Please fix the errors in the form: ${errors}`);
        console.log(errors)
        return
      }

      const now = new Date().toISOString()
      const assignment = {
        ...formData,
        asignment_id: Date.now(), // Generate a temporary ID
        createdAt: now,
        updatedAt: now,
        attachments: attachments
      }

      console.log(assignment);

      const res = await assignmentService.createAssignment(assignment)
      console.log('Assignment created:', assignment)
      res.success && toast.success('Assignment created successfully!')

      // Reset form
      setFormData({
        title: '',
        course_id: 0,
        instructor_id: 0,
        student_ids: [],
        description: '',
        dueDate: '',
        status: 'pending',
        grade: undefined,
        submissionDate: '',
        attachments: [],
        feedback: ''
      })
      setAttachments([]);
      setSelectedStudents([]);
    } catch (error) {
      toast.error(`Error when creating assignment: ${error}`);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'graded': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Header Card */}
      <Card className="border-0 shadow-lg bg-[#232f3e] text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-3">
            <GraduationCap className="h-10 w-10" />
            Create New Assignment
          </CardTitle>
          <CardDescription className="text-blue-100 text-lg mt-2">
            Design and configure assignments with comprehensive details and requirements
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Form Card */}
      <Card className="border border-gray-300 py-1">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField label="Assignment Title" required error={errors.title}>
                  <Input
                    placeholder="Enter assignment title (e.g., 'Final Project Proposal')"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="rounded-sm h-12 text-base border-gray-400 shadow-none"
                  />
                </FormField>

                <FormField label="Assignment Status" required error={errors.status}>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value as 'pending' | 'submitted' | 'graded')}
                  >
                    <SelectTrigger className="!h-12 cursor-pointer border-gray-300 rounded-sm shadow-none" >
                      <SelectValue placeholder="Select assignment status" />
                    </SelectTrigger>
                    <SelectContent className=''>
                      <SelectItem value="pending" className='cursor-pointer'>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor('pending')}>Pending</Badge>
                          <span>Not yet submitted</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="submitted" className='cursor-pointer'>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor('submitted')}>Submitted</Badge>
                          <span>Awaiting review</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="graded" className='cursor-pointer'>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor('graded')}>Graded</Badge>
                          <span>Completed and graded</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </div>

            <Separator />

            {/* Participants Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Participants & Course Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField label="Course ID" required error={errors.course_id}>
                  <div className="relative">
                    <FileText className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="e.g., 101"
                      value={formData.course_id || ''}
                      onChange={(e) => handleInputChange('course_id', parseInt(e.target.value) || 0)}
                      className="rounded-sm pl-10 h-12 border-gray-400 shadow-none"
                      min="1"
                    />
                  </div>
                </FormField>

                <FormField label="Instructor ID" required error={errors.instructor_id}>
                  <div className="relative">
                    <User className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="e.g., 2001"
                      value={formData.instructor_id || ''}
                      onChange={(e) => handleInputChange('instructor_id', parseInt(e.target.value) || 0)}
                      className="rounded-sm pl-10 h-12 border-gray-400 shadow-none"
                      min="1"
                    />
                  </div>
                </FormField>

                <FormField label="Student ID">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="secondary" className="w-full
                       h-12 justify-between cursor-pointer">
                        {placeholder}
                        <ChevronDown />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align='start' className="w-3xs space-y-2 p-3">
                      <Input
                        placeholder='Type a name'
                        value={searchStudent}
                        onChange={(e) => setSearchStudent(e.target.value)}
                        className='rounded-sm border-gray-400 shadow-none'
                      />
                      <div
                        className='cursor-pointer flex items-center justify-between p-2 hover:bg-gray-100 rounded'
                        onClick={selectAll}
                      >
                        <span className='font-medium'>Selected all</span>
                        {selectedStudents.length === students.length && <Check size={16} />}
                      </div>

                      <div className='w-full max-h-[200px] overflow-y-auto space-y-1'>
                        {filtered.map((student) => (
                          <div
                            key={student.student_id}
                            className={cn(
                              "cursor-pointer flex items-center justify-between p-2 hover:bg-gray-100 rounded transition",
                              selectedStudents.includes(student.student_id) && 'bg-gray-200'
                            )}
                            onClick={() => toggleStudent(student.student_id)}
                          >
                            <span>{student.name} ({student.email})</span>
                            {selectedStudents.includes(student.student_id) && <Check size={16} className='ml-2' />}
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormField>



                {/* <FormField label="Student ID" required error={errors.student_id}>
                  <div className="relative">
                    <Users className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="e.g., 12345"
                      value={formData.student_id || ''}
                      onChange={(e) => handleInputChange('student_id', parseInt(e.target.value) || 0)}
                      className="pl-10 h-12"
                      min="1"
                    />
                  </div>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value as 'pending' | 'submitted' | 'graded')}
                  >
                    <SelectTrigger className="h-12 cursor-pointer" >
                      <SelectValue placeholder="Select assignment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Badge className={getStatusColor('pending')}>Pending</Badge>
                          <span>Not yet submitted</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="submitted">
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Badge className={getStatusColor('submitted')}>Submitted</Badge>
                          <span>Awaiting review</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="graded">
                        <div className="flex items-center gap-2 cursor-pointer">
                          <Badge className={getStatusColor('graded')}>Graded</Badge>
                          <span>Completed and graded</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormField> */}
              </div>
            </div>

            <Separator />

            {/* Assignment Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Assignment Details</h3>
              </div>

              <FormField label="Assignment Description" required error={errors.description}>
                <Textarea
                  placeholder="Provide comprehensive instructions, requirements, and expectations for this assignment..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="min-h-[150px] resize-none text-base border-gray-400 shadow-none"
                />
              </FormField>
            </div>

            <Separator />

            {/* Dates Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Important Dates</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Due Date & Time" required error={errors.dueDate}>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      type="datetime-local"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="rounded-sm pl-10 h-12 border-gray-400 shadow-none"
                    />
                  </div>
                </FormField>

                {formData.status === 'submitted' && (
                  <FormField label="Submission Date & Time">
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                      <Input
                        type="datetime-local"
                        value={formData.submissionDate || ''}
                        onChange={(e) => handleInputChange('submissionDate', e.target.value)}
                        className="rounded-sm pl-10 h-12 border-gray-400 shadow-none"
                      />
                    </div>
                  </FormField>
                )}
              </div>
            </div>

            {/* Grading Section - Only show when status is graded */}
            {formData.status === 'graded' && (
              <>
                <Separator />
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Grading Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Grade (0-100)" error={errors.grade}>
                      <Input
                        type="number"
                        placeholder="Enter grade (0-100)"
                        value={formData.grade || ''}
                        onChange={(e) => handleInputChange('grade', parseInt(e.target.value) || undefined)}
                        min="0"
                        max="100"
                        className="rounded-sm h-12 text-base border-gray-400 shadow-none"
                      />
                    </FormField>
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Additional Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
              </div>

              <FormField label="Feedback & Comments (Optional)">
                <Textarea
                  placeholder="Provide feedback, additional instructions, or comments for this assignment..."
                  value={formData.feedback || ''}
                  onChange={(e) => handleInputChange('feedback', e.target.value)}
                  className="min-h-[120px] resize-none text-base border-gray-400 shadow-none"
                />
              </FormField>

              <FormField label="File Attachments (Optional)">
                <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="rounded-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-gray-400 shadow-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Upload supporting documents, rubrics, or reference materials
                  </p>
                </div>

                {attachments.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-2">Selected files ({attachments.length}):</p>
                    <ul className="space-y-1">
                      {attachments.map((file, index) => (
                        <li key={index} className="text-sm text-blue-700 flex items-center gap-2">
                          <FileText className="h-3 w-3" />
                          <span className="truncate">{file.name}</span>
                          <span className="text-blue-500">({(file.size / 1024).toFixed(1)} KB)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </FormField>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-8">
              <Button
                type="submit"
                className="w-full md:w-auto cursor-pointer px-6 py-5 text-white rounded-lg transition-all duration-200 hover:shadow-xl text-base"
              >
                Create ssignment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AssignmentForm