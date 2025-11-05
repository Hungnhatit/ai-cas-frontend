'use client'
import { Student } from '@/types/interfaces/model';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface StudentSelectorProps {
  students: Student[];
  selectedStudents: number[];
  setSelectedStudents: (value: number[]) => void;
  placeholder: string
  search: string
  setSearch: (value: string) => void
}

const StudentSelector = ({ students, selectedStudents, setSelectedStudents, placeholder, search, setSearch }: StudentSelectorProps) => {
  const toggleStudent = (id: number) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter((s) => s !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const selectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s) => s.ma_hoc_vien));
    }
  }

  return (
    <div className='bg-card p-4 rounded-[3px] shadow-xs mb-4 border border-gray-300'>
      <div className="flex items-center justify-between mb-2">
        <Label className='text-lg font-bold'>Giao cho</Label>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-3xs justify-between cursor-pointer rounded-[3px] border-gray-300">
            {placeholder}
            <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-3xs p-2 space-y-2 rounded-[3px] border-gray-300">
          {/* Search box */}
          <Input
            placeholder="Type a name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='rounded-[3px] border-gray-300'
          />

          {/* Select All */}
          <div
            className="cursor-pointer flex items-center justify-between px-2 hover:bg-gray-100 rounded"
            onClick={selectAll}
          >
            <span className="font-medium">Chọn tất cả</span>
            {selectedStudents.length === students.length && <Check size={16} />}
          </div>

          {/* Students list */}
          <div className="max-h-[200px] overflow-y-auto space-y-1">
            {students.map((student) => (
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
    </div>
  );
};

export default StudentSelector;
