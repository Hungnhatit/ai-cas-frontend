'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Question, UserAnswer } from '@/types/test';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  initialAnswer?: string | number;
  onAnswerChange: (answer: string | number) => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  initialAnswer,
  onAnswerChange
}: QuestionCardProps) {
  const [answer, setAnswer] = useState<string | number>(initialAnswer || '');

  const handleAnswerChange = (newAnswer: string | number) => {
    setAnswer(newAnswer);
    onAnswerChange(newAnswer);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            Question {questionNumber} of {totalQuestions}
          </CardTitle>
          <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {question.points} points
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-gray-900 leading-relaxed">
          {question.question}
        </div>

        {question.type === 'multiple-choice' && question.options && (
          <RadioGroup
            value={answer.toString()}
            onValueChange={(value) => handleAnswerChange(parseInt(value))}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer text-sm leading-relaxed"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === 'essay' && (
          <div className="space-y-2">
            <Label htmlFor="essay-answer" className="text-sm font-medium">
              Your Answer:
            </Label>
            <Textarea
              id="essay-answer"
              placeholder="Type your answer here..."
              value={answer.toString()}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <div className="text-xs text-gray-500">
              {answer.toString().length} characters
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}