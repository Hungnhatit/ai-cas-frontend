'use client';

import { Test } from "@/types/interfaces/model";
import SkeletonCard from "./CustomSkeleton";
import ExamCard from "./ExamCard";

type ExamDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
type ExamCategory =
  | 'Mathematics'
  | 'History'
  | 'Science'
  | 'Literature'
  | 'Programming';

interface Exam {
  id: string;
  title: string;
  description: string;
  category: ExamCategory;
  difficulty: ExamDifficulty;
  numberOfQuestions: number;
  durationMinutes: number;
}

interface ExamListProps {
  exams: Test[];
  isLoading: boolean;
  itemsPerPage: number;
  onSelectExam: (id: number) => void;
}

const ExamList = ({ exams, isLoading, itemsPerPage, onSelectExam,
}: ExamListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }
  console.log(exams);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {exams.map((exam) => (
        <ExamCard key={exam.ma_kiem_tra}  exam={exam} onSelectExam={onSelectExam} />
      ))}
    </div>
  );
};


export default ExamList