"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, FileText, CheckCircle, AlertCircle, Upload, Eye, Download, MessageSquare } from "lucide-react"

import { useAuth } from "@/providers/auth-provider"
import { assignmentService } from "@/services/assignmentService"
import { Assignment } from "@/types/interfacess/assignment"
import { useRouter } from "next/navigation"
import { api } from "@/services/api"

export function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [submissionText, setSubmissionText] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const fetchAssignments = async () => {
      try {
        const res = await assignmentService.fetchAssignmentsForStudent(user?.ma_nguoi_dung);
        setAssignments(res.data);
      } catch (error) {
        console.error("Failed to fetch assignments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, []);  

  const pendingAssignments = assignments?.filter((a) => a.status === "pending")
  const submittedAssignments = assignments?.filter((a) => a.status === "submitted")
  const gradedAssignments = assignments?.filter((a) => a.status === "graded")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmitAssignment = async (assignmentId: string) => {
    try {
      // In a real app, you would upload files to a server here
      console.log("[v0] Submitting assignment:", { assignmentId, submissionText, files: uploadedFiles })

      await api.submitAssignment(assignmentId)
      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === assignmentId ? { ...assignment, status: "submitted" } : assignment,
        ),
      )

      // Reset form
      setSubmissionText("")
      setUploadedFiles([])
      setSelectedAssignment(null)
    } catch (error) {
      console.error("Failed to submit assignment:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "destructive"
      case "submitted":
        return "secondary"
      case "graded":
        return "default"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "submitted":
        return <Clock className="h-4 w-4" />
      case "graded":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-[#232f3e] -mx-4 -mt-4 p-5">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Assignments</h1>
          <p className="text-white">Track your assignments and submissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments?.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssignments?.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submittedAssignments?.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Grade</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gradedAssignments?.length > 0
                ? Math.round(
                  gradedAssignments.reduce((sum, assignment) => sum + (assignment.grade || 0), 0) /
                  gradedAssignments?.length,
                )
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Tabs */}
      <Tabs defaultValue="all-assignments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all-assignments">All ({assignments?.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingAssignments?.length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({submittedAssignments?.length})</TabsTrigger>
          <TabsTrigger value="graded">Graded ({gradedAssignments?.length})</TabsTrigger>
        </TabsList>

        <TabsContent value='all-assignments'>
          {
            assignments?.length > 0 && assignments.map((assignment, index) => (
              <Card key={index} className="flex-row items-center justify-between mb-3">
                <CardHeader className="w-full">
                  <div className="space-y-1">
                    <CardTitle className="mb-2">
                      {assignment.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{assignment.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Button className="cursor-pointer" onClick={() => router.push(`/assignments/${assignment.assignment_id}/detail`)}>
                      <Eye />
                      View detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          }
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingAssignments?.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground">You have no pending assignments.</p>
              </CardContent>
            </Card>
          ) : (
            pendingAssignments?.map((assignment) => {
              const daysUntilDue = getDaysUntilDue(assignment.dueDate)
              return (
                <Card key={assignment.assignment_id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(assignment.status)}
                          {assignment.title}
                        </CardTitle>
                        <CardDescription>{assignment.course}</CardDescription>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge variant={getStatusColor(assignment.status)} className="capitalize">
                          {assignment.status}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          Due {assignment.dueDate}
                        </div>
                        {daysUntilDue <= 3 && daysUntilDue > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            Due in {daysUntilDue} day{daysUntilDue !== 1 ? "s" : ""}
                          </Badge>
                        )}
                        {daysUntilDue <= 0 && <Badge variant="destructive">Overdue</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{assignment.description}</p>
                    <div className="flex items-center justify-between">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{assignment.title}</DialogTitle>
                            <DialogDescription>{assignment.course}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Description</h4>
                              <p className="text-muted-foreground">{assignment.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-1">Due Date</h4>
                                <p className="text-sm text-muted-foreground">{assignment.dueDate}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">Status</h4>
                                <Badge variant={getStatusColor(assignment.status)} className="capitalize">
                                  {assignment.status}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Requirements</h4>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Submit your solution as a PDF or Word document</li>
                                <li>• Include code comments and explanations</li>
                                <li>• Maximum file size: 10MB</li>
                                <li>• Late submissions will be penalized</li>
                              </ul>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedAssignment(assignment)}>
                            <Upload className="mr-2 h-4 w-4" />
                            Submit Assignment
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Submit Assignment</DialogTitle>
                            <DialogDescription>Submit your work for "{assignment.title}"</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="submission-text">Written Response (Optional)</Label>
                              <Textarea
                                id="submission-text"
                                placeholder="Add any comments or explanations about your submission..."
                                value={submissionText}
                                onChange={(e) => setSubmissionText(e.target.value)}
                                className="min-h-[100px]"
                              />
                            </div>

                            <div>
                              <Label htmlFor="file-upload">Upload Files</Label>
                              <Input
                                id="file-upload"
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                className="cursor-pointer"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Supported formats: PDF, DOC, DOCX, TXT, ZIP (Max: 10MB each)
                              </p>
                            </div>

                            {uploadedFiles.length > 0 && (
                              <div>
                                <Label>Uploaded Files</Label>
                                <div className="space-y-2 mt-2">
                                  {uploadedFiles.map((file, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-2 bg-muted rounded-lg"
                                    >
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-sm">{file.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                          ({formatFileSize(file.size)})
                                        </span>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFile(index)}
                                        className="h-6 w-6 p-0"
                                      >
                                        ×
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setSelectedAssignment(null)}>
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleSubmitAssignment(assignment.id)}
                                disabled={uploadedFiles.length === 0 && !submissionText.trim()}
                              >
                                Submit Assignment
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {submittedAssignments?.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No submitted assignments</h3>
                <p className="text-muted-foreground">Your submitted assignments will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            submittedAssignments?.map((assignment) => (
              <Card key={assignment.assignment_id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(assignment.status)}
                        {assignment.title}
                      </CardTitle>
                      <CardDescription>{assignment.course}</CardDescription>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge variant={getStatusColor(assignment.status)} className="capitalize">
                        {assignment.status}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        Submitted
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{assignment.description}</p>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">Submission Status</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your assignment has been submitted successfully. Waiting for instructor review and feedback.
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View Submission
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          {gradedAssignments?.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No graded assignments</h3>
                <p className="text-muted-foreground">Your graded assignments will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            gradedAssignments?.map((assignment) => (
              <Card key={assignment.assignment_id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(assignment.status)}
                        {assignment.title}
                      </CardTitle>
                      <CardDescription>{assignment.course}</CardDescription>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(assignment.status)} className="capitalize">
                          {assignment.status}
                        </Badge>
                        <Badge
                          variant={
                            (assignment.grade || 0) >= 90
                              ? "default"
                              : (assignment.grade || 0) >= 70
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {assignment.grade}%
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        Graded
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{assignment.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Grade</span>
                      <span className="font-medium">{assignment.grade}%</span>
                    </div>
                    <Progress value={assignment.grade} className="h-2" />
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">Instructor Feedback</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Great work! Your solution demonstrates a solid understanding of the concepts. Consider optimizing
                      the algorithm for better performance in future assignments.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download Graded
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Submission
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
