import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Rocket, TrendingUp, BookOpen, Award, Target, ArrowRight, Star, Briefcase
} from 'lucide-react';

interface CareerRole {
  title: string;
  match: number;
  requirements: string[];
  nextSteps: string[];
  salaryRange: string;
  demandLevel: 'High' | 'Medium' | 'Low';
}

interface LearningPath {
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: string[];
}

interface AICareerPathwayProps {
  currentLevel: string;
  recommendedRoles: CareerRole[];
  suggestedLearningPaths: LearningPath[];
  skillGaps: string[];
  industryTrends: string[];
}

export default function AICareerPathway({
  currentLevel,
  recommendedRoles,
  suggestedLearningPaths,
  skillGaps,
  industryTrends
}: AICareerPathwayProps) {
  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-blue-100 text-blue-800';
      case 'Intermediate': return 'bg-purple-100 text-purple-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Career Recommendations */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Briefcase className="h-5 w-5 text-blue-500 flex-shrink-0" />
            AI Career Recommendations
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Based on your current level: <Badge variant="outline">{currentLevel}</Badge>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendedRoles.map((role, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 break-words">{role.title}</h4>
                  <p className="text-sm text-muted-foreground">{role.salaryRange}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge className={getDemandColor(role.demandLevel)}>
                    {role.demandLevel} Demand
                  </Badge>
                  <div className="text-right">
                    <div className="text-sm font-medium">{role.match}% Match</div>
                    <Progress value={role.match} className="h-2 w-20" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2 text-sm">Key Requirements:</h5>
                  <div className="space-y-1">
                    {role.requirements.map((req, reqIndex) => (
                      <div key={reqIndex} className="text-xs text-muted-foreground flex items-center gap-2">
                        <Target className="h-3 w-3 flex-shrink-0" />
                        <span className="break-words">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2 text-sm">Next Steps:</h5>
                  <div className="space-y-1">
                    {role.nextSteps.map((step, stepIndex) => (
                      <div key={stepIndex} className="text-xs text-muted-foreground flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 flex-shrink-0" />
                        <span className="break-words">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Learning Pathways */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Rocket className="h-5 w-5 text-purple-500 flex-shrink-0" />
            Personalized Learning Pathways
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedLearningPaths.map((path, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 break-words">{path.title}</h4>
                  <p className="text-sm text-muted-foreground break-words">{path.description}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Badge className={getDifficultyColor(path.difficulty)}>
                    {path.difficulty}
                  </Badge>
                  <div className="text-xs text-muted-foreground text-right">
                    {path.estimatedTime}
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-2 text-sm">Learning Modules:</h5>
                <div className="flex flex-wrap gap-1">
                  {path.modules.map((module, moduleIndex) => (
                    <Badge key={moduleIndex} variant="secondary" className="text-xs">
                      {module}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button size="sm" className="w-full sm:w-auto">
                <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                Start Learning Path
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skill Gaps & Industry Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Target className="h-5 w-5 text-orange-500 flex-shrink-0" />
              Skill Gaps to Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {skillGaps.map((gap, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                  <span className="text-sm text-orange-800 break-words">{gap}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="h-5 w-5 text-green-500 flex-shrink-0" />
              Industry Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {industryTrends.map((trend, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <Star className="h-3 w-3 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-green-800 break-words">{trend}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}