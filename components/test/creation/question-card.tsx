"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, RotateCw, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"

export interface Question {
  id: string
  question: string
  choices: string[]
  correct: number
}

interface QuestionCardProps {
  question: Question
  index: number
  onRegenerate: (index: number) => void
  isRegenerating: boolean
}

export function QuestionCard({ question, index, onRegenerate, isRegenerating }: QuestionCardProps) {
  const [showAnswer, setShowAnswer] = useState(false)
  const choiceLabels = ["A", "B", "C", "D"]  

  return (
    <Card className="rounded-[3px] shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">
            <span className="text-primary mr-2">Q{index + 1}.</span>
            {question.question}
          </CardTitle>
          <Badge variant="outline" className="ml-2 flex-shrink-0">
            Multiple Choice
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Answer Choices */}
        <div className="space-y-2">
          {question.choices.map((choice, choiceIndex) => (
            <div
              key={choiceIndex}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                showAnswer && choiceIndex === question.correct
                  ? "bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-700"
                  : "border-muted-foreground/20 hover:border-muted-foreground/40"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm flex-shrink-0 ${
                  showAnswer && choiceIndex === question.correct
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {choiceLabels[choiceIndex]}
              </div>
              <span className="flex-1 text-sm">{choice}</span>
              {showAnswer && choiceIndex === question.correct && (
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Show Answer Section */}
        {showAnswer && (
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-700">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                Correct Answer: {choiceLabels[question.correct]}
              </p>
              <p className="text-blue-800 dark:text-blue-200 mt-1">{question.choices[question.correct]}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant={showAnswer ? "default" : "outline"}
            onClick={() => setShowAnswer(!showAnswer)}
            className="flex-1 rounded-lg"
          >
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </Button>
          <Button
            variant="outline"
            onClick={() => onRegenerate(index)}
            disabled={isRegenerating}
            size="sm"
            className="rounded-lg"
          >
            {isRegenerating ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                <RotateCw className="h-4 w-4 mr-2" />
                Regenerate
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}