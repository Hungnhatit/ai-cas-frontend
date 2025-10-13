import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Cpu, Database, Code, Zap, Target } from 'lucide-react';

interface CompetencyArea {
  name: string;
  icon: React.ReactNode;
  score: number;
  maxScore: number;
  percentage: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
  skills: string[];
}

interface AICompetencyBreakdownProps {
  competencyAreas: CompetencyArea[];
  overallCompetencyLevel: string;
  industryBenchmark: number;
}

export default function AICompetencyBreakdown({
  competencyAreas,
  overallCompetencyLevel,
  industryBenchmark
}: AICompetencyBreakdownProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-purple-100 text-purple-800';
      case 'Advanced': return 'bg-blue-100 text-blue-800';
      case 'Intermediate': return 'bg-green-100 text-green-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getIconColor = (percentage: number) => {
    if (percentage >= 90) return 'text-purple-500';
    if (percentage >= 80) return 'text-blue-500';
    if (percentage >= 70) return 'text-green-500';
    return 'text-yellow-500';
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Brain className="h-5 w-5 text-purple-500 flex-shrink-0" />
          AI Competency Assessment
        </CardTitle>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
          <Badge className={`px-3 py-1 ${getLevelColor(overallCompetencyLevel)}`}>
            Overall Level: {overallCompetencyLevel}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Industry Benchmark: {industryBenchmark}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {competencyAreas.map((area, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gray-50 ${getIconColor(area.percentage)}`}>
                  {area.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{area.name}</h4>
                  <p className="text-sm text-muted-foreground break-words">{area.description}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-lg font-bold">{area.score}/{area.maxScore}</div>
                <Badge variant="outline" className={getLevelColor(area.level)}>
                  {area.level}
                </Badge>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Proficiency</span>
                <span>{area.percentage}%</span>
              </div>
              <Progress value={area.percentage} className="h-2" />
            </div>

            <div className="flex flex-wrap gap-1">
              {area.skills.map((skill, skillIndex) => (
                <Badge key={skillIndex} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}