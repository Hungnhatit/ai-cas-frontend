import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle, XCircle, AlertCircle, ChevronDown, Eye, Clock } from 'lucide-react';
import { useState } from 'react';

interface QuestionDetail {
  id: number;
  question: string;
  type: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  userAnswer: string | number;
  correctAnswer: string | number;
  isCorrect: boolean;
  timeSpent: string;
  points: number;
  maxPoints: number;
  explanation: string;
  options?: string[];
  aiConcept: string;
}

interface DetailedQuestionReviewProps {
  questions: QuestionDetail[];
  showExplanations: boolean;
}

export default function DetailedQuestionReview({ questions, showExplanations }: DetailedQuestionReviewProps) {
  const [openQuestions, setOpenQuestions] = useState<Set<number>>(new Set());

  const toggleQuestion = (question_id: number) => {
    const newOpenQuestions = new Set(openQuestions);
    if (newOpenQuestions.has(question_id)) {
      newOpenQuestions.delete(question_id);
    } else {
      newOpenQuestions.add(question_id);
    }
    setOpenQuestions(newOpenQuestions);
  };

  const getStatusIcon = (isCorrect: boolean, userAnswer: string | number) => {
    if (userAnswer === undefined || userAnswer === '') {
      return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
    return isCorrect ?
      <CheckCircle className="h-5 w-5 text-green-500" /> :
      <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Eye className="h-5 w-5 text-indigo-500 flex-shrink-0" />
          Detailed Question Review
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Review each question with detailed explanations and AI concept mapping
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.map((question, index) => (
          <Collapsible key={question.id} open={openQuestions.has(question.id)}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full p-4 h-auto justify-between text-left"
                onClick={() => toggleQuestion(question.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getStatusIcon(question.isCorrect, question.userAnswer)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Question {index + 1}</span>
                      <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {question.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {question.question}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {question.points}/{question.maxPoints} pts
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {question.timeSpent}
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-2">
              <div className="p-4 bg-gray-50 border border-gray-400 rounded-lg space-y-4">
                <div>
                  <h5 className="font-medium mb-2">Question:</h5>
                  <p className="text-sm break-words">{question.question}</p>
                </div>

                {question.options && (
                  <div>
                    <h5 className="font-medium mb-2">Options:</h5>
                    <div className="space-y-1">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className={`flex items-center justify-between text-sm p-2 rounded border ${optionIndex === question.correctAnswer ? 'bg-green-100 text-green-800' :
                          optionIndex === question.userAnswer ? 'bg-red-100 text-red-800' :
                            'bg-white'
                          }`}>
                          <span>
                            {String.fromCharCode(65 + optionIndex)}. {option}
                          </span>
                          <span className='font-semibold'>
                            {
                              question.userAnswer === optionIndex.toString()
                              && <span className='text-blue-600 '>Đúng</span>
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-1">Your Answer:</h5>
                    <p className="text-sm">
                      {question.userAnswer !== undefined && question.userAnswer !== '' ?
                        (question.options ?
                          `${String.fromCharCode(65 + Number(question.userAnswer))}. ${question.options[Number(question.userAnswer)]}` :
                          String(question.userAnswer)
                        ) :
                        'Not answered'
                      }
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Correct Answer:</h5>
                    <p className="text-sm text-green-700">
                      {question.options ?
                        `${String.fromCharCode(65 + Number(question.correctAnswer))}. ${question.options[Number(question.correctAnswer)]}` :
                        String(question.correctAnswer)
                      }
                    </p>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-1">AI Concept:</h5>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    {question.aiConcept}
                  </Badge>
                </div>

                {showExplanations && (
                  <div>
                    <h5 className="font-medium mb-2">Explanation:</h5>
                    <p className="text-sm text-muted-foreground break-words">{question.explanation}</p>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
}