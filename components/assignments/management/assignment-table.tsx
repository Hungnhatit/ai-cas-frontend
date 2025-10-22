import { Assignment } from '@/types/interfaces/assignment';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AssignmentRow from './assignment-row';
import { useRouter } from 'next/navigation';

interface AssignmentTableProps {
  assignments: Assignment[];
  // onViewDetails: (assignment: Assignment) => void;
}

export default function AssignmentTable({ assignments }: AssignmentTableProps) {
  const router = useRouter();
  const onViewDetails = async (assignment_id: number) => {
    router.push(`/assignments/${assignment_id}/detail`);
  }

  return (
    <Card className="w-full gap-1">
      <CardHeader className='px-4 py-0'>
        <CardTitle className="text-xl lg:text-lg">Assignments</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className='border-t'>
              <TableRow className=''>
                <TableHead className="font-bold px-4">Tên bài tập</TableHead>
                <TableHead className="font-bold hidden md:table-cell">Trạng thái</TableHead>
                <TableHead className="font-bold hidden lg:table-cell">Ngày tạo</TableHead>
                <TableHead className="font-bold hidden lg:table-cell">Ngày hết hạn</TableHead>
                <TableHead className="font-bold hidden lg:table-cell">Sửa đổi lần cuối</TableHead>
                <TableHead className="font-bold hidden sm:table-cell">Điểm</TableHead>
                <TableHead className="font-bold hidden sm:table-cell">Đã nộp</TableHead>
                <TableHead className="font-bold ">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <AssignmentRow
                  key={assignment.ma_bai_tap}
                  assignment={assignment}
                  onViewDetails={() => onViewDetails(assignment.ma_bai_tap)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}