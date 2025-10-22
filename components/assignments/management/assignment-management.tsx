'use client'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Assignment } from '@/types/interfacess/assignment';
import { ArrowUpDown, Award, BookOpen, Calendar, Users } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import AssignmentTable from './assignment-table';
import toast from 'react-hot-toast';
import { assignmentService } from '@/services/assignmentService';
import { useAuth } from '@/providers/auth-provider';

const mockAssignments: Assignment[] = [
  {
    assignment_id: 1,
    title: 'Introduction to React Hooks',
    description: 'Complete a comprehensive project demonstrating the use of useState, useEffect, and custom hooks in a real-world application.',
    dueDate: '2024-11-15',
    createdAt: '2024-10-01',
    status: 'pending',
    total_points: 100,
    submissionsCount: 24,
    courseCode: 'CS 3040',
    courseName: 'Advanced Web Development'
  },
  {
    assignment_id: 2,
    title: 'Database Design Project',
    description: 'Design and implement a normalized database schema for an e-commerce platform with proper relationships and constraints.',
    dueDate: '2024-11-20',
    createdAt: '2024-10-05',
    status: 'submitted',
    total_points: 150,
    submissionsCount: 18,
    courseCode: 'CS 3200',
    courseName: 'Database Management Systems'
  },
  {
    assignment_id: 3,
    title: 'Algorithm Analysis Report',
    description: 'Analyze the time and space complexity of various sorting algorithms and provassignment_ide mirical testing results.',
    dueDate: '2024-11-10',
    createdAt: '2024-09-28',
    status: 'graded',
    total_points: 75,
    submissionsCount: 31,
    courseCode: 'CS 2500',
    courseName: 'Data Structures & Algorithms'
  },
  {
    assignment_id: 4,
    title: 'Machine Learning Model Implementation',
    description: 'Implement and train a neural network model for image classification using TensorFlow or PyTorch.',
    dueDate: '2024-12-01',
    createdAt: '2024-10-10',
    status: 'pending',
    total_points: 200,
    submissionsCount: 0,
    courseCode: 'CS 4100',
    courseName: 'Introduction to Machine Learning'
  },
  {
    assignment_id: 5,
    title: 'Software Engineering Team Project',
    description: 'Collaborate in teams to develop a full-stack web application following agile development methodologies.',
    dueDate: '2024-11-25',
    createdAt: '2024-10-08',
    status: 'graded',
    total_points: 250,
    submissionsCount: 12,
    courseCode: 'CS 3500',
    courseName: 'Software Engineering'
  },
  {
    assignment_id: 6,
    title: 'Cybersecurity Vulnerability Assessment',
    description: 'Conduct a comprehensive security audit of a web application and provide recommendations for improvements.',
    dueDate: '2024-11-30',
    createdAt: '2024-10-12',
    status: 'submitted',
    total_points: 120,
    submissionsCount: 8,
    courseCode: 'CS 4200',
    courseName: 'Cybersecurity Fundamentals'
  }
];

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { user } = useAuth();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const [resAssignment] = await Promise.all([
          assignmentService.fetchAssignmentsByInstructorId(user?.ma_nguoi_dung)
        ]);

        resAssignment.success && setAssignments(resAssignment.data);        

      } catch (error) {
        console.log(error);
        toast.error(`Error when fetching assignment: ${error}`);
      }
    }

    fetchAssignment();
  }, []);

  // sort assignments by creation date
  const sortedAssignments = useMemo(() => {
    return [...assignments].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [assignments,sortOrder]);

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

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-400';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-400';
      case 'graded':
        return 'bg-green-100 text-green-800 border-green-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-400';
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Assignment Management
            </h1>
            <p className="text-sm lg:text-base text-gray-600 mt-1">
              Manage and track all your course assignments
            </p>
          </div>

          <Button
            onClick={handleSortToggle}
            variant="outline"
            className="w-full sm:w-auto cursor-pointer"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort by Date ({sortOrder === 'desc' ? 'Latest First' : 'Oldest First'})
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAssignments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Calendar className='h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockAssignments.filter(a => a.status === 'submitted').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockAssignments.reduce((sum, a) => sum + a.submissionsCount, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockAssignments.reduce((sum, a) => sum + a.total_points, 0)}
              </div>
            </CardContent>
          </Card>
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
                    {selectedAssignment.title}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    {selectedAssignment.courseCode} - {selectedAssignment.courseName}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusColor(selectedAssignment.status)}>
                      {selectedAssignment.status.charAt(0).toUpperCase() + selectedAssignment?.status?.slice(1)}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedAssignment.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-1">Created Date</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(selectedAssignment.createdAt)}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-1">Due Date</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(selectedAssignment.dueDate)}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-1">Total Points</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedAssignment.total_points} points
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-1">Submissions</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedAssignment.submissionsCount} submissions
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default AssignmentManagement
