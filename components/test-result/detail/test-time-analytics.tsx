import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Timer, Zap } from 'lucide-react';

interface TimeAnalyticsProps {
  timeSpent: string;
  timeLimit: string;
  timePercentage: number;
  averageTimePerQuestion: string;
  efficiency: 'Fast' | 'Optimal' | 'Slow';
}

export default function TimeAnalytics({ 
  timeSpent, 
  timeLimit, 
  timePercentage, 
  averageTimePerQuestion, 
  efficiency 
}: TimeAnalyticsProps) {
  const efficiencyColor = efficiency === 'Fast' ? 'text-green-600' : efficiency === 'Optimal' ? 'text-blue-600' : 'text-orange-600';
  const efficiencyIcon = efficiency === 'Fast' ? 'text-green-500' : efficiency === 'Optimal' ? 'text-blue-500' : 'text-orange-500';

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Clock className="h-5 w-5 text-blue-500 flex-shrink-0" />
          Phân tích thời gian
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{timeSpent}</div>
            <div className="text-sm text-muted-foreground">Time Spent</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{timeLimit}</div>
            <div className="text-sm text-muted-foreground">Time Limit</div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Time Usage</span>
            <span>{timePercentage}% of limit</span>
          </div>
          <Progress value={timePercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center p-2 sm:p-0">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Timer className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm font-medium">Avg per Question</span>
            </div>
            <div className="text-base sm:text-lg font-semibold">{averageTimePerQuestion}</div>
          </div>
          <div className="text-center p-2 sm:p-0">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className={`h-4 w-4 ${efficiencyIcon} flex-shrink-0`} />
              <span className="text-sm font-medium">Efficiency</span>
            </div>
            <div className={`text-base sm:text-lg font-semibold ${efficiencyColor}`}>{efficiency}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}