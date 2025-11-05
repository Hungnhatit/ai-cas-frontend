"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Sparkles } from "lucide-react"

interface AiExamFormProps {
  onGenerate: (data: GenerateExamParams) => void
  isLoading: boolean
}

export interface GenerateExamParams {
  numberOfQuestions: number
  topic: string
  category: string
  difficulty: string
  questionTypes: string[]
  timeLimit: number
  passingScore: number
  instructions: string
  examName: string
  course: string
  estimatedDuration: number
}

export function AiExamForm({ onGenerate, isLoading }: AiExamFormProps) {
  const [formData, setFormData] = useState({
    numberOfQuestions: 5,
    topic: "",
    category: "general",
    difficulty: "medium",
    questionTypes: ["multiple-choice"],
    timeLimit: 60,
    passingScore: 70,
    instructions: "",
    examName: "",
    course: "",
    estimatedDuration: 60,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim() || !formData.examName.trim()) {
      alert("Please fill in required fields")
      return
    }
    onGenerate(formData)
  }

  const toggleQuestionType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(type)
        ? prev.questionTypes.filter((t) => t !== type)
        : [...prev.questionTypes, type],
    }))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">Cấu hình bài thi</h2>
        <p className="text-muted-foreground">Cấu hình tất cả các thông số cho bài kiểm tra do AI tạo ra</p>
      </div>

      {/* Basic Information Section */}
      <div className="space-y-4 p-4 rounded-[3px] border border-gray-300">
        <h3 className="font-semibold text-md">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="examName" className="text-sm font-semibold">
              Exam Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="examName"
              placeholder="e.g., 'Midterm Exam - React Fundamentals'"
              value={formData.examName}
              onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
              disabled={isLoading}
              className="rounded-[3px] shadow-none border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="course" className="text-sm font-semibold">
              Course/Class
            </Label>
            <Input
              id="course"
              placeholder="e.g., 'CS101', 'Advanced Biology'"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              disabled={isLoading}
              className="rounded-[3px] shadow-none border-gray-300"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="topic" className="text-sm font-semibold">
            Topic <span className="text-destructive">*</span>
          </Label>
          <Input
            id="topic"
            placeholder="Enter the exam topic (e.g., 'React Hooks', 'World War II', 'Calculus Derivatives')"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            disabled={isLoading}
            className="rounded-[3px] shadow-none border-gray-300"
          />
          <p className="text-sm text-muted-foreground">Describe what the exam should be about</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions" className="text-sm font-semibold">
            Special Instructions
          </Label>
          <textarea
            id="instructions"
            placeholder="Add any specific instructions or requirements for the exam..."
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            disabled={isLoading}
            className="w-full px-3 py-2 rounded-[3px] border bg-background text-sm border-gray-300"
            rows={3}
          />
        </div>
      </div>

      {/* Exam Structure Section */}
      <div className="space-y-4 p-4 rounded-[3px] border border-gray-300">
        <h3 className="font-semibold text-sm">Exam Structure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="questions" className="text-sm font-semibold">
              Number of Questions <span className="text-destructive">*</span>
            </Label>
            <Input
              id="questions"
              type="number"
              min="1"
              max="100"
              value={formData.numberOfQuestions}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  numberOfQuestions: Math.min(100, Math.max(1, Number.parseInt(e.target.value) || 1)),
                })
              }
              disabled={isLoading}
              className="rounded-[3px] shadow-none border-gray-300"
            />
            <p className="text-sm text-muted-foreground">Between 1 and 100 questions</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-semibold">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              disabled={isLoading}
            >
              <SelectTrigger id="category" className="rounded-[3px] shadow-none border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Knowledge</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="history">History</SelectItem>
                <SelectItem value="literature">Literature</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="language">Language</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="arts">Arts & Culture</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty" className="text-sm font-semibold">
              Difficulty Level <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
              disabled={isLoading}
            >
              <SelectTrigger id="difficulty" className="rounded-[3px] shadow-none border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeLimit" className="text-sm font-semibold">
              Time Limit (minutes) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="timeLimit"
              type="number"
              min="5"
              max="300"
              step="5"
              value={formData.timeLimit}
              onChange={(e) => setFormData({ ...formData, timeLimit: Number.parseInt(e.target.value) || 60 })}
              disabled={isLoading}
              className="rounded-[3px] shadow-none border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passingScore" className="text-sm font-semibold">
              Passing Score (%) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="passingScore"
              type="number"
              min="0"
              max="100"
              value={formData.passingScore}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  passingScore: Math.min(100, Math.max(0, Number.parseInt(e.target.value) || 70)),
                })
              }
              disabled={isLoading}
              className="rounded-[3px] shadow-none border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedDuration" className="text-sm font-semibold">
              Estimated Duration (minutes)
            </Label>
            <Input
              id="estimatedDuration"
              type="number"
              min="5"
              max="300"
              value={formData.estimatedDuration}
              onChange={(e) => setFormData({ ...formData, estimatedDuration: Number.parseInt(e.target.value) || 60 })}
              disabled={isLoading}
              className="rounded-[3px] shadow-none border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Question Types Section */}
      <div className="space-y-4 p-4 rounded-[3px] border border-gray-300">
        <h3 className="font-semibold text-sm">Question Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: "multiple-choice", label: "Multiple Choice" },
            { id: "true-false", label: "True/False" },
            { id: "short-answer", label: "Short Answer" },
            { id: "essay", label: "Essay" },
          ].map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={type.id}
                checked={formData.questionTypes.includes(type.id)}
                onCheckedChange={() => toggleQuestionType(type.id)}
                disabled={isLoading}
              />
              <Label htmlFor={type.id} className="text-sm font-medium cursor-pointer">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isLoading} size="lg" className="w-full rounded-[3px] h-11 text-base font-semibold">
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Generating Exam...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Tạo bài thi với AI
          </>
        )}
      </Button>
    </div>
  )
}
