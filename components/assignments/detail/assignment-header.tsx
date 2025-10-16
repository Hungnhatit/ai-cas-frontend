import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Assignment } from '@/types/interfacess/assignment'
import { capitalizeFirstLetter } from '@/utils/string'
import { Calendar, Clock, BookOpen, User } from 'lucide-react'

interface AssignmentHeaderProps {
  assignment: Assignment
}

const AssignmentHeader = ({ assignment }: AssignmentHeaderProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'graded': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDaysUntilDue = () => {
    const dueDate = new Date(assignment?.dueDate)
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilDue = getDaysUntilDue()

  return (
    <Card className="mb-6">
      <CardContent className="">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-3 mb-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{assignment?.title}</h1>
              <Badge className={`w-fit ${getStatusColor(assignment?.status)}`}>
                {capitalizeFirstLetter(assignment?.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{assignment?.courseCode}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Instructor ID: {assignment?.ma_giang_vien}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Due: {formatDate(assignment?.dueDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className={daysUntilDue < 0 ? 'text-red-600 font-semibold' : daysUntilDue <= 3 ? 'text-orange-600 font-semibold' : ''}>
                  {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                    daysUntilDue === 0 ? 'Due today' :
                      `${daysUntilDue} days left`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 text-right">
            <div className="flex items-center justify-between gap-2 bg-gray-200 px-4 py-2 rounded-lg">
              <div className="text-md font-bold text-gray-600">Total points: </div>
              <div className="text-md font-bold text-gray-900">{assignment?.total_points}</div>
            </div>
            {assignment?.grade !== undefined && (
              <div className="flex items-center justify-between bg-green-50 px-4 py-2 rounded-lg">
                <div className="text-md text-green-600 font-bold">Your Grade:</div>
                <div className="ml-1 text-md font-bold text-green-800">{assignment?.grade}/{assignment?.total_points}</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AssignmentHeader