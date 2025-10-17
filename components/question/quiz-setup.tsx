'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Quiz, QuizSetup as QuizSetupType } from '@/types/interfacess/quiz';
import { useEffect, useState } from 'react';

interface QuizSetupProps {
  setup: QuizSetupType,
  quiz: Quiz,
  onSetupChange: (setup: QuizSetupType) => void;
}

const courses = [
  'Mathematics',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Literature',
  'Economics'
];

export default function QuizSetup({ setup, quiz, onSetupChange }: QuizSetupProps) {
  useEffect(() => {
    if (onSetupChange) onSetupChange(setup);
  }, [setup]);

  const handleChange = (field: keyof QuizSetupType, value: string | number) => {
    onSetupChange({
      ...setup,
      [field]: value
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">Quiz Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="quiz-title" className="text-sm font-medium">Quiz Title *</Label>
            <Input
              id="quiz-title"
              placeholder="Enter quiz title"
              value={quiz?.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course" className="text-sm font-medium">Course *</Label>
            <Select value={setup?.course} onValueChange={(value) => handleChange('course', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter quiz description"
            value={quiz?.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium">Duration (minutes) *</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              placeholder="60"
              value={setup?.duration || ''}
              onChange={(e) => handleChange('duration', parseInt(e.target.value) || 0)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attempts" className="text-sm font-medium">Attempts Allowed *</Label>
            <Input
              id="attempts"
              type="number"
              min="1"
              placeholder="3"
              value={setup?.attemptsAllowed || ''}
              onChange={(e) => handleChange('attemptsAllowed', parseInt(e.target.value) || 0)}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}