"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Plus, Edit, Trash2, Eye, Users, CalendarIcon, FileText, CheckCircle, Clock, AlertCircle, Download, ArrowUpDown, } from "lucide-react"
import { api, type Course } from "@/services/api"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { Assignment } from "@/types/interface/assignment"
import { useAuth } from "@/providers/auth-provider"
import { assignmentService } from "@/services/assignmentService"
import AssignmentTable from "./management/assignment-table"

export function AssignmentManagementPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const { user } = useAuth();
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    course: "",
    description: "",
    dueDate: "",
    instructions: "",
    maxPoints: 100,
    submissionType: "file",
  });

  // fetch assignment
  useEffect(() => {
    const fetchAssignment = async () => {
      setLoading(true);
      try {
        const [resAssignment] = await Promise.all([
          assignmentService.fetchAssignmentsByInstructorId(user?.ma_nguoi_dung)
        ]);

        resAssignment.success && setAssignments(resAssignment.data);

      } catch (error) {
        console.log(error);
        toast.error(`Error when fetching assignment: ${error}`);
      } finally {
        setLoading(false);
      }
    }

    fetchAssignment();
  }, []);

  const handleCreateAssignment = async () => {
    try {
      const assignmentData = {
        ...newAssignment,
        dueDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
        status: "pending" as const,
      }

      console.log("[v0] Creating assignment:", assignmentData)
      // In a real app, you would call api.createAssignment(assignmentData)

      setIsCreateDialogOpen(false)
      setNewAssignment({
        title: "",
        course: "",
        description: "",
        dueDate: "",
        instructions: "",
        maxPoints: 100,
        submissionType: "file",
      })
      setSelectedDate(undefined)
    } catch (error) {
      console.error("Failed to create assignment:", error)
    }
  }

  const deleteAssignment = async (assignmentId: string) => {
    try {
      console.log("[v0] Deleting assignment:", assignmentId)
      // In a real app, you would call api.deleteAssignment(assignmentId)
      setAssignments(assignments.filter((a) => a.ma_bai_tap.toString() !== assignmentId))
    } catch (error) {
      console.error("Failed to delete assignment:", error)
    }
  }

  const getAssignmentStats = () => {
    const total = assignments.length
    const pending = assignments.filter((a) => a.trang_thai === "cho_xu_ly").length
    const submitted = assignments.filter((a) => a.trang_thai === "da_nop").length
    const graded = assignments.filter((a) => a.trang_thai === "da_cham").length

    return { total, pending, submitted, graded }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "cho_xu_ly":
        return "destructive"
      case "da_nop":
        return "secondary"
      case "da_cham":
        return "default"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "cho_xu_ly":
        return <AlertCircle className="h-4 w-4" />
      case "da_nop":
        return <Clock className="h-4 w-4" />
      case "da_cham":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const stats = getAssignmentStats();

  const sortedAssignments = useMemo(() => {
    return [...assignments].sort((a, b) => {
      const dateA = new Date(a.ngay_tao).getTime();
      const dateB = new Date(b.ngay_tao).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [assignments, sortOrder]);

  const handleSortToggle = () => {
    setSortOrder((prev: any) => prev === 'desc' ? 'asc' : 'desc');
  };

  const handleViewDetails = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: Assignment['trang_thai']) => {
    switch (status) {
      case 'cho_xu_ly':
        return 'bg-yellow-100 text-yellow-800 border-yellow-400';
      case 'da_nop':
        return 'bg-blue-100 text-blue-800 border-blue-400';
      case 'da_cham':
        return 'bg-green-100 text-green-800 border-green-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-400';
    }
  };

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
          <h1 className="text-3xl font-bold mb-1">Assignment Management</h1>
          <p className="text-muted-foreground">A centralized dashboard to create, track, and manage student assignments with real-time status updates and submission management</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>Set up a new assignment for your students</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assignment-title">Assignment Title</Label>
                  <Input
                    id="assignment-title"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    placeholder="Enter assignment title"
                  />
                </div>
                <div>
                  <Label htmlFor="assignment-course">Course</Label>
                  <Select
                    value={newAssignment.course}
                    onValueChange={(value) => setNewAssignment({ ...newAssignment, course: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.title}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="assignment-description">Description</Label>
                <Textarea
                  id="assignment-description"
                  value={newAssignment.mo_ta}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="Brief description of the assignment"
                />
              </div>

              <div>
                <Label htmlFor="assignment-instructions">Detailed Instructions</Label>
                <Textarea
                  id="assignment-instructions"
                  value={newAssignment.instructions}
                  onChange={(e) => setNewAssignment({ ...newAssignment, instructions: e.target.value })}
                  placeholder="Provide detailed instructions for students..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="max-points">Maximum Points</Label>
                  <Input
                    id="max-points"
                    type="number"
                    value={newAssignment.maxPoints}
                    onChange={(e) => setNewAssignment({ ...newAssignment, maxPoints: Number.parseInt(e.target.value) })}
                    min="1"
                    max="1000"
                  />
                </div>
              </div>

              <div>
                <Label>Submission Type</Label>
                <Select
                  value={newAssignment.submissionType}
                  onValueChange={(value) => setNewAssignment({ ...newAssignment, submissionType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="file">File Upload</SelectItem>
                    <SelectItem value="text">Text Submission</SelectItem>
                    <SelectItem value="both">File Upload + Text</SelectItem>
                    <SelectItem value="link">External Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Assignment Requirements</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Students will be able to submit their work before the due date</li>
                  <li>• Late submissions can be configured to receive point deductions</li>
                  <li>• You can provide feedback and grades after submission</li>
                  <li>• Students will receive notifications about new assignments</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAssignment}
                  disabled={!newAssignment.title || !newAssignment.course || !selectedDate}
                >
                  Create Assignment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submitted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graded</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.graded}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Assignments ({stats.total})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({stats.submitted})</TabsTrigger>
          <TabsTrigger value="graded">Graded ({stats.graded})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assignments.map((assignment) => (
              <Card key={assignment.ma_bai_tap} className="justify-between gap-2 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getStatusIcon(assignment.trang_thai)}
                        {assignment.tieu_de}
                      </CardTitle>
                      <CardDescription>{assignment.ma_khoa_hoc}</CardDescription>
                    </div>
                    <Badge variant={statusColor(assignment.trang_thai)} className="capitalize">
                      {assignment.trang_thai}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{assignment.mo_ta}</p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      Due {assignment.ngay_het_han}
                    </div>
                    {assignment.tong_diem && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        {assignment.tong_diem}%
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      <Users className="h-4 w-4 mr-1" />
                      Submissions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assignments
              .filter((assignment) => assignment.trang_thai === "cho_xu_ly")
              .map((assignment) => (
                <Card key={assignment.ma_bai_tap} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getStatusIcon(assignment.trang_thai)}
                          {assignment.tieu_de}
                        </CardTitle>
                        <CardDescription>{assignment.ma_khoa_hoc}</CardDescription>
                      </div>
                      <Badge variant={statusColor(assignment.trang_thai)} className="capitalize">
                        {assignment.trang_thai}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{assignment.mo_ta}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        Due {assignment.ngay_het_han}
                      </div>
                    </div>

                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">Waiting for student submissions</p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteAssignment(assignment.ma_bai_tap.toString())}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assignments
              .filter((assignment) => assignment.trang_thai === "da_nop")
              .map((assignment) => (
                <Card key={assignment.ma_bai_tap} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getStatusIcon(assignment.trang_thai)}
                          {assignment.tieu_de}
                        </CardTitle>
                        <CardDescription>{assignment.ma_khoa_hoc}</CardDescription>
                      </div>
                      <Badge variant={statusColor(assignment.trang_thai)} className="capitalize">
                        {assignment.trang_thai}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{assignment.mo_ta}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        Due {assignment.ngay_het_han}
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">Ready for grading</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Grade
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assignments
              .filter((assignment) => assignment.trang_thai === "da_cham")
              .map((assignment) => (
                <Card key={assignment.ma_bai_tap} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getStatusIcon(assignment.trang_thai)}
                          {assignment.tieu_de}
                        </CardTitle>
                        <CardDescription>{assignment.ma_khoa_hoc}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(assignment.trang_thai)} className="capitalize">
                          {assignment.trang_thai}
                        </Badge>
                        <Badge
                          variant={
                            (assignment.tong_diem || 0) >= 90
                              ? "default"
                              : (assignment.tong_diem || 0) >= 70
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {assignment.tong_diem}%
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{assignment.mo_ta}</p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        Due {assignment.ngay_het_han}
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Graded
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200">Graded and returned to student</p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Submission
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Update Grade
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* -------------------------------------------------------- */}
      <div className="flex justify-end">
        <Button
          onClick={handleSortToggle}
          variant="outline"
          className="w-full sm:w-auto cursor-pointer"
        >
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Sort by Date ({sortOrder === 'desc' ? 'Latest First' : 'Oldest First'})
        </Button>
      </div>
      {/* Assignment Table */}
      <AssignmentTable
        assignments={sortedAssignments}
        onViewDetails={handleViewDetails}
      />

      {/* Assignment Details Dialog */}
      <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedAssignment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl lg:text-2xl">
                  {selectedAssignment.tieu_de}
                </DialogTitle>
                <DialogDescription className="text-base">
                  selectedAssignment.courseCode - selectedAssignment.courseName
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge className={getStatusColor(selectedAssignment.trang_thai)}>
                    {selectedAssignment.trang_thai.charAt(0).toUpperCase() + selectedAssignment?.trang_thai?.slice(1)}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedAssignment.mo_ta}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Created Date</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedAssignment.ngay_tao)}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Due Date</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedAssignment.ngay_het_han)}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Total Points</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedAssignment.tong_diem} points
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Submissions</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedAssignment.so_lan_nop} submissions
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>






    </div>
  )
}
