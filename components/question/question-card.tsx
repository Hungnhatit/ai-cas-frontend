'use client'
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { Question, QuestionType, AnswerOption } from '@/types/interfacess/quiz';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  onQuestionChange: (question: Question) => void;
  onDeleteQuestion: (question_id: string) => void;
}

export default function QuestionCard({
  question,
  questionIndex,
  onQuestionChange,
  onDeleteQuestion
}: QuestionCardProps) {
  const handleQuestionChange = (field: keyof Question, value: string | number | QuestionType | AnswerOption[]) => {
    onQuestionChange({
      ...question,
      [field]: value
    });
  };

  const handleOptionChange = (optionId: string, field: keyof AnswerOption, value: string | boolean) => {
    const updatedOptions = question.options.map(option =>
      option.id === optionId ? { ...option, [field]: value } : option
    );
    handleQuestionChange('options', updatedOptions);
  };

  const addOption = () => {
    const newOption: AnswerOption = {
      id: `option-${Date.now()}`,
      text: '',
      isCorrect: false
    };
    handleQuestionChange('options', [...question.options, newOption]);
  };

  const removeOption = (optionId: string) => {
    const updatedOptions = question.options.filter(option => option.id !== optionId);
    handleQuestionChange('options', updatedOptions);
  };

  const handleTypeChange = (type: QuestionType) => {
    let options: AnswerOption[] = [];

    if (type === 'multiple-choice') {
      options = [
        { id: 'option-1', text: '', isCorrect: false },
        { id: 'option-2', text: '', isCorrect: false }
      ];
    } else if (type === 'true-false') {
      options = [
        { id: 'true', text: 'True', isCorrect: false },
        { id: 'false', text: 'False', isCorrect: false }
      ];
    }

    handleQuestionChange('type', type);
    handleQuestionChange('options', options);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <h3 className="text-lg font-semibold text-gray-800">Question {questionIndex + 1}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDeleteQuestion(question?.question_id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor={`question-text-${question?.question_id}`} className="text-sm font-medium">Question Text *</Label>
          <Textarea
            id={`question-text-${question?.question_id}`}
            placeholder="Enter your question"
            value={question?.question}
            onChange={(e) => handleQuestionChange('text', e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Question Type *</Label>
            <Select value={question?.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                <SelectItem value="true-false">True/False</SelectItem>
                <SelectItem value="short-answer">Short Answer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`points-${question?.id}`} className="text-sm font-medium">Points *</Label>
            <Input
              id={`points-${question?.id}`}
              type="number"
              min="1"
              placeholder="10"
              value={question?.points || ''}
              onChange={(e) => handleQuestionChange('points', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {(question?.type === 'multiple-choice' || question?.type === 'true-false') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Answer Options</Label>
              {question?.type === 'multiple-choice' && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {JSON.parse(question?.options).map((option, index) => (
                <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    checked={option.isCorrect}
                    onCheckedChange={(checked) =>
                      handleOptionChange(option.id, 'isCorrect', checked as boolean)
                    }
                  />
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(option.id, 'text', e.target.value)}
                    className="flex-1"
                    disabled={question.type === 'true-false'}
                  />
                  {question.type === 'multiple-choice' && question.options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(option.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}