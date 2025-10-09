import { Assignment } from '@/types/interface/assignment';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AssignmentRow from './assignment-row';

interface AssignmentTableProps {
  assignments: Assignment[];
  onViewDetails: (assignment: Assignment) => void;
}

export default function AssignmentTable({ assignments, onViewDetails }: AssignmentTableProps) {
  console.log(assignments)
  return (
    <Card className="w-full gap-1">
      <CardHeader className='px-4 py-0'>
        <CardTitle className="text-xl lg:text-2xl">Assignments</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className='border-t'>
              <TableRow className=''>
                <TableHead className="font-bold px-4">Assignment Details</TableHead>
                <TableHead className="font-bold hidden md:table-cell">Status</TableHead>
                <TableHead className="font-bold hidden lg:table-cell">Created</TableHead>
                <TableHead className="font-bold hidden lg:table-cell">Due Date</TableHead>
                <TableHead className="font-bold hidden sm:table-cell">Points</TableHead>
                <TableHead className="font-bold hidden sm:table-cell">Submissions</TableHead>
                <TableHead className="font-bold ">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <AssignmentRow
                  key={assignment.ma_bai_tap}
                  assignment={assignment}
                  onViewDetails={onViewDetails}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}