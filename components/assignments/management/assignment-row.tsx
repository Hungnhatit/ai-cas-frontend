'use client'
import { Assignment } from '@/types/interface/assignment';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Eye, Calendar, Users, Award } from 'lucide-react';

interface AssignmentRowProps {
  assignment: Assignment;
  onViewDetails: (assignment: Assignment) => void;
}

const AssignmentRow = ({ assignment, onViewDetails }: AssignmentRowProps) => {
  const getStatusColor = (status: Assignment['trang_thai']) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium px-4 py-4">
        <div className="space-y-1">
          <h3 className="font-semibold text-sm lg:text-base">{assignment.tieu_de}</h3>
          <p className="text-xs lg:text-sm text-muted-foreground line-clamp-1 text-wrap">
            {assignment.mo_ta}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">assignment.courseCode</span>
            <span>•</span>
            <span>assignment.coursename</span>
          </div>
        </div>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <Badge className={getStatusColor(assignment.trang_thai)}>
          {assignment?.trang_thai?.charAt(0).toUpperCase() + assignment?.trang_thai?.slice(1)}
        </Badge>
      </TableCell>

      <TableCell className="hidden lg:table-cell">
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-4 w-4" />
          {formatDate(assignment.ngay_tao)}
        </div>
      </TableCell>

      <TableCell className="hidden lg:table-cell">
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-4 w-4" />
          {formatDate(assignment.ngay_het_han)}
        </div>
      </TableCell>

      <TableCell className="hidden sm:table-cell">
        <div className="flex items-center gap-1 text-sm">
          <Award className="h-4 w-4" />
          points
        </div>
      </TableCell>

      <TableCell className="hidden sm:table-cell">
        <div className="flex items-center gap-1 text-sm">
          <Users className="h-4 w-4" />
          count submission
        </div>
      </TableCell>

      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(assignment)}
          className="w-full sm:w-auto cursor-pointer shadow-none"
        >
          <Eye className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">View Details</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default AssignmentRow