import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, TrendingUp } from 'lucide-react';

interface ScoreCardProps {
  score: number;
  total_points: number;
  percentage: number;
  passingPercentage: number;
  classAverage: number;
}

export default function ScoreCard({ score, total_points, percentage, passingPercentage, classAverage }: ScoreCardProps) {
  const isPassed = percentage >= passingPercentage;
  const performanceLevel = percentage >= 90 ? 'Excellent' : percentage >= 80 ? 'Good' : percentage >= 70 ? 'Average' : 'Needs Improvement';

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0" />
          Điểm của bạn         
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {score}<span className="text-xl sm:text-2xl text-muted-foreground">/{total_points}</span>
          </div>
          <div className={`text-xl sm:text-2xl font-semibold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
            {percentage}%
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Performance: <span className="font-medium">{performanceLevel}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Điểm của bạn</span>
              <span>{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-2 sm:h-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center p-2 sm:p-0">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm font-medium">Passing Score</span>
              </div>
              <div className="text-lg font-semibold text-blue-600">{passingPercentage}%</div>
            </div>
            <div className="text-center p-2 sm:p-0">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-4 w-4 text-purple-500 flex-shrink-0" />
                <span className="text-sm font-medium">Class Average</span>
              </div>
              <div className="text-lg font-semibold text-purple-600">{classAverage}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}