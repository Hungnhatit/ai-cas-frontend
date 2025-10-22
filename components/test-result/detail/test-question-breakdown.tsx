import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, HelpCircle, BarChart3 } from 'lucide-react';

interface CategoryPerformance {
  name: string;
  correct: number;
  total: number;
  percentage: number;
}

interface QuestionBreakdownProps {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  categoryPerformance: CategoryPerformance[];
}

export default function QuestionBreakdown({
  totalQuestions,
  correctAnswers,
  incorrectAnswers,
  skippedQuestions,
  categoryPerformance
}: QuestionBreakdownProps) {
  return (
    <Card className="shadow-lg gap-1">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-green-500" />
          Question Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-xs">
            <div className="text-2xl font-bold text-blue-600">{totalQuestions}</div>
            <div className="text-sm text-muted-foreground">Total Questions</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-xs">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-600">{correctAnswers}</span>
            </div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-xs">
            <div className="flex items-center justify-center gap-1 mb-1">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-2xl font-bold text-red-600">{incorrectAnswers}</span>
            </div>
            <div className="text-sm text-muted-foreground">Incorrect</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xs">
            <div className="flex items-center justify-center gap-1 mb-1">
              <HelpCircle className="h-4 w-4 text-gray-500" />
              <span className="text-2xl font-bold text-gray-600">{skippedQuestions}</span>
            </div>
            <div className="text-sm text-muted-foreground">Skipped</div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Performance by Category</h4>
          {categoryPerformance.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{category.name}</span>
                <span>{category.correct}/{category.total} ({category.percentage}%)</span>
              </div>
              <Progress value={category.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}