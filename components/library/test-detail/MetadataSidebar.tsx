import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Test } from "@/types/interfaces/model";

interface MetadataSidebarProps {
  test: Test
}

const MetadataSidebar = ({ test }: MetadataSidebarProps) => {
  const difficultyMap = {
    beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    intermediate:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <Card className="gap-3 rounded-2xl shadow-lg border-none">
      <CardHeader>
        <CardTitle className="text-xl">Cấu trúc bài thi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Tổng điểm</span>
          <span>{test?.tong_diem}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Mức độ</span>
          <Badge className="capitalize">{test?.do_kho}</Badge>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Độ khó
          </span>
          <Badge className=''>
            {test?.do_kho}
          </Badge>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Thời gian làm bài
          </span>
          <span className="font-medium">
            {test?.thoi_luong} phút
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetadataSidebar;