import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Assignment } from '@/types/interfacess/assignment'
import { FileText, Download, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface AssignmentInfoProps {
  assignment: Assignment
}

export default function AssignmentInfo({ assignment }: AssignmentInfoProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Assignment Description */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assignment Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {assignment?.description}
            </p>
          </div>

          {assignment?.attachments && Array.isArray(assignment?.attachments) && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Assignment Files</h4>
              <div className="space-y-2">
                {assignment?.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-200/90 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{attachment.name}</span>
                    </div>
                    <Button
                      onClick={() => handleDownload(attachment.url, attachment.name)}
                      className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 text-blue-600 hover:text-blue-800 text-sm cursor-pointer">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assignment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Assignment ID</label>
            <p className="text-gray-900">{assignment?.assignment_id}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Course ID</label>
            <p className="text-gray-900">{assignment?.course_id}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Created</label>
            <p className="text-gray-900 text-sm">{formatDate(assignment?.createdAt)}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Last Updated</label>
            <p className="text-gray-900 text-sm">{formatDate(assignment?.updatedAt)}</p>
          </div>

          {assignment?.submissionDate && (
            <div>
              <label className="text-sm font-medium text-gray-600">Submitted On</label>
              <p className="text-gray-900 text-sm">{formatDate(assignment?.submissionDate)}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-600">Total Submissions</label>
            <p className="text-gray-900">{assignment?.submissionsCount}</p>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      {assignment?.feedback && (
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Instructor Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">{assignment?.feedback}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}