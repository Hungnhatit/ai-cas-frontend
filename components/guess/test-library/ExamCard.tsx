'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Test } from "@/types/interfaces/model";
import { getDifficultyLabel } from "@/utils/test";
import { BarChart, BookOpen, Clock } from "lucide-react";
type ExamDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
type ExamCategory =
  | 'Mathematics'
  | 'History'
  | 'Science'
  | 'Literature'
  | 'Programming';
// interface Exam {
//   id: string;
//   title: string;
//   description: string;
//   category: ExamCategory;
//   difficulty: ExamDifficulty;
//   numberOfQuestions: number;
//   durationMinutes: number;
// }

interface ExamCardProps {
  exam: Test;
  onSelectExam: (id: number) => void;
}
const ExamCard = ({ exam, onSelectExam }: ExamCardProps) => {

  console.log(exam);
  return (
    <Card className="flex h-full flex-col rounded-sm">
      <CardHeader>
        <CardTitle className="mb-1 leading-6">{exam.tieu_de}</CardTitle>
        <CardDescription className="flex flex-wrap gap-2">
          {(exam.danh_muc).slice(0, 2).map((item: any, index: number) => (
            <span key={item.ma_danh_muc} className=" px-2 py-[2px] rounded-sm bg-[#e6eff7] text-[#25418a]">{item.ten_danh_muc}</span>
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
          {exam.mo_ta}
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <BarChart className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Mức độ: {getDifficultyLabel(exam.do_kho)}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
            <div className="flex items-center">
              <span>{exam.tong_so_cau_hoi} câu hỏi</span>
              <span className='px-1'>|</span>
              <span>{exam.tong_so_phan} phần thi</span>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{exam.thoi_luong} Minutes</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full rounded-[3px] cursor-pointer bg-[#1c4580] hover:bg-[#446ea9]" onClick={() => onSelectExam(exam.ma_kiem_tra)}>
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExamCard;