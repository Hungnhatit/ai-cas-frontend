'use client'
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
interface Test {
  id: string;
  name: string;
  description: string;
  duration: number;
  questionCount: number;
  difficulty: string;
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'multiple-select' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  userAnswer?: string | string[];
}

interface TestResult {
  test_id: string;
  testName: string;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  questions: Question[];
}

// Mock Data
const mockTests: Test[] = [
  {
    id: '1',
    name: 'JavaScript Fundamentals',
    description: 'Test your knowledge of core JavaScript concepts including variables, functions, and data structures.',
    duration: 3600,
    questionCount: 20,
    difficulty: 'Intermediate'
  },
  {
    id: '2',
    name: 'React Advanced Patterns',
    description: 'Advanced React concepts including hooks, context, performance optimization, and state management.',
    duration: 5400,
    questionCount: 30,
    difficulty: 'Advanced'
  },
  {
    id: '3',
    name: 'TypeScript Basics',
    description: 'Learn TypeScript fundamentals including types, interfaces, generics, and type inference.',
    duration: 2700,
    questionCount: 15,
    difficulty: 'Beginner'
  }
];

const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'multiple-choice',
    question: 'What is the output of: console.log(typeof null)?',
    options: ['null', 'undefined', 'object', 'number'],
    correctAnswer: 'object'
  },
  {
    id: '2',
    type: 'multiple-select',
    question: 'Which of the following are valid JavaScript data types?',
    options: ['String', 'Boolean', 'Integer', 'Symbol', 'BigInt'],
    correctAnswer: ['String', 'Boolean', 'Symbol', 'BigInt']
  },
  {
    id: '3',
    type: 'essay',
    question: 'Explain the concept of closure in JavaScript with an example.',
    correctAnswer: ''
  }
];

const TestManagement = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const mockExamData = [
    {
      ...mockTests[0],
      status: 'active',
      attempts: 156,
      avgScore: 78.5,
      passRate: 85,
      createdDate: '2024-09-15',
      lastModified: '2024-10-01'
    },
    {
      ...mockTests[1],
      status: 'active',
      attempts: 89,
      avgScore: 72.3,
      passRate: 78,
      createdDate: '2024-08-20',
      lastModified: '2024-09-28'
    },
    {
      ...mockTests[2],
      status: 'draft',
      attempts: 0,
      avgScore: 0,
      passRate: 0,
      createdDate: '2024-10-02',
      lastModified: '2024-10-02'
    }
  ];

  return (
    <div className="">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-[#232f3e] flex flex-col lg:flex-row p-5 lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Tests Management</h2>
            <p className="text-white mt-2">Create, edit, and monitor your assessments</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
              + Create new test
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className='gap-1'>
            <CardHeader>
              <CardTitle>Total tests</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Total Exams</div>
            </CardContent>
          </Card>
          <Card className='gap-1'>
            <CardHeader>
              <CardTitle>Total tests</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-600">Active</div>
            </CardContent>
          </Card>
          <Card className='gap-1'>
            <CardHeader>
              <CardTitle>Total tests</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-gray-600">Drafts</div>
            </CardContent>
          </Card>
          <Card className='gap-1'>
            <CardHeader>
              <CardTitle>Total tests</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-600">1,245</div>
              <div className="text-sm text-gray-600">Total Attempts</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <div className='flex items-center justify-between'>
          <TabsList>
            <TabsTrigger value="all">All Exams</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <Button variant="outline" className='cursor-pointer' onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}>
            {viewMode === 'grid' ? 'Table View' : 'Grid View'}
          </Button>
        </div>

        <TabsContent value="all" className="mt-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockExamData.map(exam => (
                <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg">{exam.name}</CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${exam.status === 'active' ? 'bg-green-100 text-green-700' :
                        exam.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                        {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                      </span>
                    </div>
                    <CardDescription className="line-clamp-2">{exam.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-gray-600">Duration</div>
                          <div className="font-medium">{exam.duration / 60} min</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Questions</div>
                          <div className="font-medium">{exam.questionCount}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Attempts</div>
                          <div className="font-medium">{exam.attempts}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Avg Score</div>
                          <div className="font-medium">{exam.avgScore}%</div>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="text-xs text-gray-500">
                          Last modified: {exam.lastModified}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" size="sm" className="flex-1 cursor-pointer">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 cursor-pointer">
                        Preview
                      </Button>
                    </div>
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" size="sm" className="flex-1 cursor-pointer">
                        Results
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 cursor-pointer">
                        Duplicate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 cursor-pointer"
                        onClick={() => {
                          setSelectedExam(exam.id);
                          setShowDeleteDialog(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attempts</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pass Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modified</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mockExamData.map(exam => (
                    <tr key={exam.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{exam.name}</div>
                        <div className="text-sm text-gray-500">{exam.difficulty}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${exam.status === 'active' ? 'bg-green-100 text-green-700' :
                          exam.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                          {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{exam.questionCount}</td>
                      <td className="px-6 py-4 text-sm">{exam.attempts}</td>
                      <td className="px-6 py-4 text-sm font-medium">{exam.avgScore}%</td>
                      <td className="px-6 py-4 text-sm">{exam.passRate}%</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{exam.lastModified}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className='cursor-pointer'>Edit</Button>
                          <Button variant="ghost" size="sm" className='cursor-pointer'>Results</Button>
                          <Button variant="ghost" size="sm" className='cursor-pointer text-red-600'>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockExamData.filter(e => e.status === 'active').map(exam => (
              <Card key={exam.id}>
                <CardHeader>
                  <CardTitle>{exam.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attempts:</span>
                      <span className="font-medium">{exam.attempts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Score:</span>
                      <span className="font-medium">{exam.avgScore}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockExamData.filter(e => e.status === 'draft').map(exam => (
              <Card key={exam.id}>
                <CardHeader>
                  <CardTitle>{exam.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Created: {exam.createdDate}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="archived" className="mt-6">
          <p className="text-gray-600 text-center py-8">No archived exams</p>
        </TabsContent>
      </Tabs>

      {/* Create Exam Dialog */}
      <AlertDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Exam</AlertDialogTitle>
            <AlertDialogDescription>
              Fill in the details to create a new assessment
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Exam Name</label>
              <input type="text" className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="e.g., Advanced JavaScript" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea className="w-full mt-1 px-3 py-2 border rounded-lg" rows={3} placeholder="Describe the exam content..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Duration (minutes)</label>
                <input type="number" className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="60" />
              </div>
              <div>
                <label className="text-sm font-medium">Difficulty</label>
                <select className="w-full mt-1 px-3 py-2 border rounded-lg">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Create Exam</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Exam?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the exam and all associated data including student attempts and results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default TestManagement
