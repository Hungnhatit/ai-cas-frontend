'use client'
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, CalendarDays, FileText, GraduationCap, User, Users, Upload, AlertCircle, Check, ChevronDown } from 'lucide-react'
import { AssignmentFormData } from '@/types/interfaces/assignment';
import { useAuth } from '@/providers/auth-provider'
import { Student } from '@/types/interfaces/model';
import { studentService } from '@/services/studentService'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { assignmentService } from '@/services/assignmentService'
import FormField from './assignment-form-field'
import toast from 'react-hot-toast'
import { fileService } from '@/services/fileService';
import { useRouter } from 'next/navigation';

const AssignmentForm = () => {
  const [formData, setFormData] = useState<AssignmentFormData>({
    tieu_de: '',
    ma_khoa_hoc: 0,
    ma_giang_vien: 0,
    danh_sach_ma_hoc_vien: [],
    mo_ta: '',
    han_nop: '',
    trang_thai: 'pending',
    tong_diem: 0,
    ngay_nop: '',
    dinh_kem: [],
    phan_hoi: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof AssignmentFormData, string>>>({})
  const [attachments, setAttachments] = useState<File[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [searchStudent, setSearchStudent] = useState('');
  const { user } = useAuth(); // get user from auth provider

  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AssignmentFormData, string>> = {}

    if (!formData.tieu_de.trim()) {
      newErrors.tieu_de = 'Assignment title is required'
    }

    if (formData.ma_khoa_hoc <= 0) {
      newErrors.ma_khoa_hoc = 'Course ID must be a positive number'
    }

    if (formData.ma_giang_vien <= 0) {
      newErrors.ma_giang_vien = 'Instructor ID must be a positive number'
    }

    // if (formData.student_id <= 0) {
    //   newErrors.student_id = 'Student ID must be a positive number'
    // }

    if (!formData.mo_ta.trim()) {
      newErrors.mo_ta = 'Assignment description is required'
    }

    if (!formData.han_nop) {
      newErrors.han_nop = 'Due date is required'
    }

    if (formData.trang_thai === 'graded' && (formData.tong_diem === undefined || formData.tong_diem < 0 || formData.tong_diem > 100)) {
      newErrors.tong_diem = 'Grade must be between 0 and 100 when status is graded'
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
          studentService.getStudentByInstructorId(user?.ma_nguoi_dung)
        ]);
        console.log(getStudents);
        setStudents(getStudents.data.instructor.hoc_vien);
      } catch (error) {
        console.log(error);
      }
    }
    fetchStudent();

  }, [user?.user_id]);

  console.log(students);

  useEffect(() => {
    handleInputChange('danh_sach_ma_hoc_vien', selectedStudents);
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
      setSelectedStudents(students.map((s) => s.ma_hoc_vien))
    }
  }

  const toggleStudents = (id: number) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const filtered = students?.filter((s) =>
    s.ten.toLowerCase().includes(searchStudent.toLowerCase())
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
    handleInputChange('dinh_kem', files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!validateForm()) {
        toast.error("Please fix the errors in the form.");
        return;
      }

      // 1. Upload files trước nếu có
      let uploadedFiles: {
        url: string;
        name: string
      }[] = []
      if (attachments.length > 0) {
        uploadedFiles = await Promise.all(
          attachments.map(async (file) => {
            try {
              const res = await fileService.fileUploadService(file);
              console.log(res.data)
              return {
                url: res.data.url,
                name: res.data.name || file.name
              };
            } catch (err) {
              console.error("File upload failed:", err);
              toast.error(`Failed to upload file: ${file.name}`);
              return null;
            }
          })
        );
        // filter error upload files
        uploadedFiles = uploadedFiles.filter((f): f is { url: string; name: string } => f !== null);
      }

      const now = new Date().toISOString();
      const assignment = {
        ...formData,
        ma_bai_tap: Date.now(), // Generate a temporary ID
        ngay_tao: now,
        ngay_cap_nhat: now,
        ma_sinh_vien: selectedStudents, // đảm bảo gửi đúng student_ids array
        dinh_kem: uploadedFiles, // đã convert sang url
      };

      const res = await assignmentService.createAssignment(assignment);
      if (res.success) {
        toast.success("Assignment created successfully!");
        // reset form data
        setFormData({
          tieu_de: "",
          ma_khoa_hoc: 0,
          ma_giang_vien: 0,
          danh_sach_ma_hoc_vien: [],
          mo_ta: "",
          han_nop: "",
          trang_thai: "pending",
          tong_diem: 0,
          ngay_nop: "",
          dinh_kem: [],
          phan_hoi: "",
        });
        setAttachments([]);
        setSelectedStudents([]);
        router.push('/manage-assignments');
      } else {
        toast.error(res.message || "Failed to create assignment.");
      }
    } catch (error) {
      console.error("Create assignment error:", error);
      toast.error(
        `Error: ${error instanceof Error ? error.message : JSON.stringify(error)}`
      );
    }
  };

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
                <FormField label="Assignment Title" required error={errors.tieu_de}>
                  <Input
                    placeholder="Enter assignment title (e.g., 'Final Project Proposal')"
                    value={formData.tieu_de}
                    onChange={(e) => handleInputChange('tieu_de', e.target.value)}
                    className="rounded-sm h-12 text-base border-gray-400 shadow-none"
                  />
                </FormField>

                <FormField label="Assignment Status" required error={errors.trang_thai}>
                  <Select
                    value={formData.trang_thai}
                    onValueChange={(value) => handleInputChange('trang_thai', value as 'pending' | 'submitted' | 'graded')}
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
                <FormField label="Course ID" required error={errors.ma_khoa_hoc}>
                  <div className="relative">
                    <FileText className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="e.g., 101"
                      value={formData.ma_khoa_hoc || ''}
                      onChange={(e) => handleInputChange('ma_khoa_hoc', parseInt(e.target.value) || 0)}
                      className="rounded-sm pl-10 h-12 border-gray-400 shadow-none"
                      min="1"
                    />
                  </div>
                </FormField>

                <FormField label="Instructor ID" required error={errors.ma_giang_vien}>
                  <div className="relative">
                    <User className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="e.g., 2001"
                      value={formData.ma_giang_vien || ''}
                      onChange={(e) => handleInputChange('ma_giang_vien', parseInt(e.target.value) || 0)}
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
                        {selectedStudents.length === students?.length && <Check size={16} />}
                      </div>

                      <div className='w-full max-h-[200px] overflow-y-auto space-y-1'>
                        {filtered?.map((student) => (
                          <div
                            key={student.ma_hoc_vien}
                            className={cn(
                              "cursor-pointer flex items-center justify-between p-2 hover:bg-gray-100 rounded transition",
                              selectedStudents.includes(student.ma_hoc_vien) && 'bg-gray-200'
                            )}
                            onClick={() => toggleStudent(student.ma_hoc_vien)}
                          >
                            <span>{student.ten} ({student.email})</span>
                            {selectedStudents.includes(student.ma_hoc_vien) && <Check size={16} className='ml-2' />}
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
                      onChange={(e) => handleInputChange('student_ids', parseInt(e.target.value) || 0)}
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

              <FormField label="Assignment Description" required error={errors.mo_ta}>
                <Textarea
                  placeholder="Provide comprehensive instructions, requirements, and expectations for this assignment..."
                  value={formData.mo_ta}
                  onChange={(e) => handleInputChange('mo_ta', e.target.value)}
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
                <FormField label="Due Date & Time" required error={errors.han_nop}>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      type="datetime-local"
                      value={formData.han_nop}
                      onChange={(e) => handleInputChange('han_nop', e.target.value)}
                      className="rounded-sm pl-10 h-12 border-gray-400 shadow-none"
                    />
                  </div>
                </FormField>

                {formData.trang_thai === 'submitted' && (
                  <FormField label="Submission Date & Time">
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                      <Input
                        type="datetime-local"
                        value={formData.ngay_nop || ''}
                        onChange={(e) => handleInputChange('ngay_nop', e.target.value)}
                        className="rounded-sm pl-10 h-12 border-gray-400 shadow-none"
                      />
                    </div>
                  </FormField>
                )}
              </div>
            </div>

            {/* Grading Section - Only show when status is graded */}
            {formData.trang_thai === 'graded' && (
              <>
                <Separator />
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Grading Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Grade (0-100)" error={errors.tong_diem}>
                      <Input
                        type="number"
                        placeholder="Enter grade (0-100)"
                        value={formData.tong_diem || ''}
                        onChange={(e) => handleInputChange('tong_diem', parseInt(e.target.value) || undefined)}
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
                  value={formData.phan_hoi || ''}
                  onChange={(e) => handleInputChange('phan_hoi', e.target.value)}
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
                Create assignment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AssignmentForm