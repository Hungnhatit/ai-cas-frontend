import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, BookOpen, Ban } from 'lucide-react';

interface TestResultHeaderProps {
  courseName: string;
  attempt: number;
  testTitle: string;
  completedAt: string;
  isPassed: boolean;
}

export default function TestResultHeader({ courseName, attempt, testTitle, completedAt, isPassed }: TestResultHeaderProps) {
  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-r bg-[#232f3e] border-none">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center text-white gap-2 text-sm ">
            <BookOpen className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{courseName}</span>
          </div>
          <h1 className="text-xl text-white sm:text-2xl lg:text-3xl font-bold break-words">{testTitle}</h1>
          <div className="flex text-white items-center gap-2 text-sm">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span className='font-bold'>Attempt #{attempt},</span>
            <span className="break-words">hoàn thành vào {completedAt}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Badge
            variant={isPassed ? "default" : "destructive"}
            className={`px-3 sm:px-4 py-2 text-sm font-medium ${isPassed
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
          >
            {isPassed ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                Passed
              </>
            ) : (
              <span className='flex items-center'>
                <Ban size={16}/>
                Not Passed
              </span>
            )}
          </Badge>
        </div>
      </div>
    </Card>
  );
}