export interface QuizSetup {
  title: string;
  course: string;
  description: string;
  duration: number; // in minutes
  attemptsAllowed: number;
}

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  points: number;
  options: AnswerOption[];
}

export interface Quiz {
  setup: QuizSetup;
  questions: Question[];
  quiz: Quiz[]
}

export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';