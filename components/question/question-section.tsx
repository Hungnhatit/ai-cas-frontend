'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Question } from '@/types/interfacess/quiz';
import QuestionCard from './question-card';

interface QuestionSectionProps {
  questions: Question[];
  onQuestionsChange: (questions: Question[]) => void;
}

export default function QuestionSection({ questions, onQuestionsChange }: QuestionSectionProps) {
  console.log(questions)
  const addQuestion = () => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      text: '',
      type: 'multiple-choice',
      points: 10,
      options: [
        { id: 'option-1', text: '', isCorrect: false },
        { id: 'option-2', text: '', isCorrect: false }
      ]
    };
    onQuestionsChange([...questions, newQuestion]);
  };

  const updateQuestion = (updatedQuestion: Question) => {
    const updatedQuestions = questions.map(q =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    onQuestionsChange(updatedQuestions);
  };

  const deleteQuestion = (question_id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== question_id);
    onQuestionsChange(updatedQuestions);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-xl font-semibold text-gray-800">Questions</CardTitle>
          <Button
            onClick={addQuestion}
            className="bg-blue-600 hover:bg-blue-700 text-white self-start sm:self-auto cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {questions?.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="mb-4">
              <Plus className="h-12 w-12 mx-auto text-gray-300" />
            </div>
            <p className="text-lg font-medium mb-2">No questions added yet</p>
            <p className="text-sm">Click "Add Question" to get started</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions?.map((question, index) => (
              <QuestionCard
                key={question.quizQuestion_id}
                question={question}
                questionIndex={index}
                onQuestionChange={updateQuestion}
                onDeleteQuestion={deleteQuestion}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}