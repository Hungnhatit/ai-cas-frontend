import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, Lightbulb } from 'lucide-react';

interface Insight {
  type: 'strength' | 'improvement' | 'recommendation';
  title: string;
  description: string;
}

interface PerformanceInsightsProps {
  insights: Insight[];
  strengths: string[];
  improvements: string[];
}

export default function PerformanceInsights({ insights, strengths, improvements }: PerformanceInsightsProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Performance Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <h4 className="font-semibold text-green-700">Strengths</h4>
            </div>
            <div className="space-y-2">
              {strengths.map((strength, index) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                  {strength}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-orange-500" />
              <h4 className="font-semibold text-orange-700">Areas for Improvement</h4>
            </div>
            <div className="space-y-2">
              {improvements.map((improvement, index) => (
                <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                  {improvement}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-semibold text-gray-900">Detailed Analysis</h4>
          {insights.map((insight, index) => (
            <div key={index} className="p-4 rounded-lg bg-gray-50 border-l-4 border-blue-500">
              <div className="flex items-start gap-3">
                <div className={`p-1 rounded-full ${insight.type === 'strength' ? 'bg-green-100' :
                    insight.type === 'improvement' ? 'bg-orange-100' : 'bg-blue-100'
                  }`}>
                  {insight.type === 'strength' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : insight.type === 'improvement' ? (
                    <TrendingDown className="h-4 w-4 text-orange-600" />
                  ) : (
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">{insight.title}</h5>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}