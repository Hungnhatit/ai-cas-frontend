import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  RotateCcw,
  ArrowRight,
  FileText,
  Download,
  Share2,
  BookOpen,
  Award,
  Calendar
} from 'lucide-react';

interface NextStepsProps {
  canRetake: boolean;
  retakesLeft: number;
  nextLessonTitle: string;
  hasExplanations: boolean;
  certificateEarned: boolean;
  studyRecommendations: string[];
}

export default function NextSteps({
  canRetake,
  retakesLeft,
  nextLessonTitle,
  hasExplanations,
  certificateEarned,
  studyRecommendations
}: NextStepsProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <ArrowRight className="h-5 w-5 text-blue-500 flex-shrink-0" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {canRetake && (
              <div className='h-auto p-3 sm:p-4 flex flex-col items-start gap-2 text-left border rounded-lg'>
                <div className='w-full flex items-center justify-between'>
                  <Button variant="outline" className="cursor-pointer">
                    <RotateCcw className="h-4 w-4 flex-shrink-0" />
                    Retake quiz
                  </Button>
                  <div className="flex items-center gap-2 w-full">
                    <Badge variant="secondary" className="ml-auto flex-shrink-0">
                      {retakesLeft} left
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-left w-full whitespace-normal break-words">
                  Improve your score with another attempt
                </p>
              </div>

            )}

            <Button className="h-auto p-3 sm:p-4 flex flex-col items-start gap-2 text-left">
              <div className="flex items-center gap-2 w-full">
                <BookOpen className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">Continue Learning</span>
              </div>
              <p className="text-sm text-blue-100 text-left break-words">
                Next: {nextLessonTitle}
              </p>
            </Button>

            {hasExplanations && (
              <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-start gap-2 text-left">
                <div className="flex items-center gap-2 w-full">
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">View Explanations</span>
                </div>
                <p className="text-sm text-muted-foreground text-left w-full whitespace-normal break-words">
                  Review detailed answer explanations
                </p>
              </Button>
            )}

            <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-start gap-2 text-left">
              <div className="flex items-center gap-2 w-full">
                <Download className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">Download Report</span>
              </div>
              <p className="text-sm text-muted-foreground text-left w-full whitespace-normal break-words">
                Save your results as PDF
              </p>
            </Button>
          </div>

          {certificateEarned && (
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                <span className="font-semibold text-yellow-800">Congratulations!</span>
              </div>
              <p className="text-sm text-yellow-700 mb-3">
                You've earned a certificate for completing this quiz successfully!
              </p>
              <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2 flex-shrink-0" />
                Download Certificate
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="h-5 w-5 text-purple-500 flex-shrink-0" />
            Study Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studyRecommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-purple-800 break-words">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-sm text-muted-foreground">Share your achievement</span>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Share2 className="h-4 w-4 mr-2 flex-shrink-0" />
              Share Results
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}