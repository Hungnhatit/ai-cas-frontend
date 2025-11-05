'use client'
import { api, Course, Quiz, QuizAttempt } from '@/services/api';
import React, { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { BarChart3, Brain, Code, Cpu, Database, Eye, Rocket, Target } from 'lucide-react';
import QuizResultHeader from './quiz-result-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ScoreCard from './score-card';
import TimeAnalytics from './time-analytics';
import QuestionBreakdown from './question-breakdown';
import PerformanceInsights from './performance-insights';
import NextSteps from './next-step';
import AICompetencyBreakdown from './ai-competency-breakdown';
import DetailedQuestionReview from './detailed-question-review';
import AICareerPathway from './ai-career-pathway';
import { quizService } from '@/services/quizService';
import { useAuth } from '@/providers/auth-provider';
import { attemptService } from '@/services/attemptService';

interface QuizResultDetailProps {
  quiz_id: number,
  quizAttempt_id?: number
}

interface CategoryPerformance {
  name: string;
  correct: number;
  total: number;
  percentage: number;
}

interface Insight {
  type: 'strength' | 'improvement' | 'recommendation';
  title: string;
  description: string;
}

// this component is used for the quiz result detail page (main component)
const QuizResultDetail = ({ quiz_id, quizAttempt_id }: QuizResultDetailProps) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // not complete
  useEffect(() => {
    const loadQuizResult = async () => {
      try {
        const quizData = await quizService.getQuizById(quiz_id);
        const attemptData = await attemptService.getAttemptById(quizAttempt_id);

        if (quizData && attemptData) {
          setQuiz(quizData);
          setAttempt(attemptData);

          const courseData = await api.getCourse("1");
          setCourse(courseData);
        }
      } catch (error) {
        console.error("Failed to load quiz result:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuizResult();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
          <div className="space-y-6 sm:space-y-8">
            <Skeleton className="h-32 w-full" />
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
              <div className="space-y-4 sm:space-y-6">
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
              <div>
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz || !attempt || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Result Not Found</h1>
          <p className="text-white">The quiz result you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Calculate metrics from API data
  const totalQuestions = quiz.quiz_questions.length;
  const correctAnswers = quiz.quiz_questions.filter(q =>
    attempt.answers[q.quizQuestion_id.toString()] === q.correctAnswer
  ).length;
  const incorrectAnswers = quiz.quiz_questions.filter(q =>
    attempt.answers[q.quizQuestion_id.toString()] !== undefined &&
    attempt.answers[q.quizQuestion_id.toString()] !== q.correctAnswer
  ).length;
  const skippedQuestions = totalQuestions - correctAnswers - incorrectAnswers;

  const score = attempt.score || 0;
  const percentage = Math.round((score / quiz.total_points) * 100);
  const passingPercentage = 70;
  const isPassed = percentage >= passingPercentage;

  // Calculate time metrics
  const startTime = new Date(attempt.startTime);
  const endTime = new Date(attempt.endTime || new Date());
  const timeDiff = endTime.getTime() - startTime.getTime();
  const timeSpentMinutes = Math.floor(timeDiff / 60000);
  const timeSpentSeconds = Math.floor((timeDiff % 60000) / 1000);
  const timeSpent = `${timeSpentMinutes}m ${timeSpentSeconds}s`;
  const timeLimit = `${quiz.duration}m 00s`;
  const timePercentage = Math.round((timeDiff / (quiz.duration * 60000)) * 100);
  const averageTimePerQuestion = `${Math.floor(timeDiff / totalQuestions / 60000)}m ${Math.floor((timeDiff / totalQuestions % 60000) / 1000)}s`;
  const efficiency = timePercentage < 50 ? 'Fast' : timePercentage < 80 ? 'Optimal' : 'Slow';

  // Category performance
  const categoryPerformance: CategoryPerformance[] = [
    {
      name: "Multiple Choice",
      correct: quiz.quiz_questions.filter(q =>
        q.type === 'multiple-choice' &&
        attempt.answers[q.quizQuestion_id.toString()] === q.correctAnswer
      ).length,
      total: quiz.quiz_questions.filter(q => q.type === 'multiple-choice').length,
      percentage: 0
    },
    {
      name: "True/False",
      correct: quiz.quiz_questions.filter(q =>
        q.type === 'true-false' &&
        attempt.answers[q.quizQuestion_id.toString()] === q.correctAnswer
      ).length,
      total: quiz.quiz_questions.filter(q => q.type === 'true-false').length,
      percentage: 0
    },
    {
      name: "Short Answer",
      correct: quiz.quiz_questions.filter(q =>
        q.type === 'short-answer' &&
        attempt.answers[q.quizQuestion_id.toString()] === q.correctAnswer
      ).length,
      total: quiz.quiz_questions.filter(q => q.type === 'short-answer').length,
      percentage: 0
    }
  ].map(cat => ({
    ...cat,
    percentage: cat.total > 0 ? Math.round((cat.correct / cat.total) * 100) : 0
  })).filter(cat => cat.total > 0);

  // AI Competency Areas
  const competencyAreas = [
    {
      name: "Machine Learning Fundamentals",
      icon: <Brain className="h-5 w-5" />,
      score: 8,
      maxScore: 10,
      percentage: 80,
      level: 'Advanced' as const,
      description: "Understanding of ML algorithms, training, and evaluation",
      skills: ["Supervised Learning", "Model Evaluation", "Feature Engineering"]
    },
    {
      name: "Neural Networks & Deep Learning",
      icon: <Cpu className="h-5 w-5" />,
      score: 6,
      maxScore: 10,
      percentage: 60,
      level: 'Intermediate' as const,
      description: "Knowledge of neural architectures and deep learning concepts",
      skills: ["CNN", "RNN", "Backpropagation", "Optimization"]
    },
    {
      name: "Data Processing & Analysis",
      icon: <Database className="h-5 w-5" />,
      score: 9,
      maxScore: 10,
      percentage: 90,
      level: 'Expert' as const,
      description: "Data manipulation, cleaning, and statistical analysis",
      skills: ["Data Cleaning", "Statistical Analysis", "Data Visualization"]
    },
    {
      name: "AI Programming & Tools",
      icon: <Code className="h-5 w-5" />,
      score: 7,
      maxScore: 10,
      percentage: 70,
      level: 'Intermediate' as const,
      description: "Programming skills in AI frameworks and libraries",
      skills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn"]
    },
    {
      name: "AI Ethics & Governance",
      icon: <Target className="h-5 w-5" />,
      score: 5,
      maxScore: 10,
      percentage: 50,
      level: 'Beginner' as const,
      description: "Understanding of AI ethics, bias, and responsible AI practices",
      skills: ["Bias Detection", "Fairness", "Transparency", "Privacy"]
    }
  ];

  // Detailed question review data
  const questionDetails = quiz.quiz_questions.map((q, index) => ({
    id: q.quizQuestion_id,
    question: q.question,
    type: q.type,
    category: index === 0 ? "Machine Learning" : index === 1 ? "Neural Networks" : "Data Processing",
    difficulty: index === 0 ? 'Medium' as const : index === 1 ? 'Easy' as const : 'Hard' as const,
    userAnswer: attempt.answers[q.quizQuestion_id.toString()],
    correctAnswer: q.correctAnswer,
    isCorrect: attempt.answers[q.quizQuestion_id.toString()] === q.correctAnswer,
    timeSpent: `${Math.floor(Math.random() * 3) + 1}m ${Math.floor(Math.random() * 60)}s`,
    points: attempt.answers[q.quizQuestion_id.toString()] === q.correctAnswer ? q.points : 0,
    maxPoints: q.points,
    explanation: `This question tests your understanding of ${q.type === 'multiple-choice' ? 'fundamental concepts' : q.type === 'true-false' ? 'key principles' : 'practical applications'} in AI and machine learning.`,
    options: q.options,
    aiConcept: index === 0 ? "Supervised Learning" : index === 1 ? "React Components" : "State Management"
  }));

  // Career pathway data
  const recommendedRoles = [
    {
      title: "AI/ML Engineer",
      match: 85,
      requirements: ["Python proficiency", "ML algorithms", "Deep learning frameworks"],
      nextSteps: ["Build portfolio projects", "Get cloud certifications", "Practice system design"],
      salaryRange: "$120k - $180k",
      demandLevel: 'High' as const
    },
    {
      title: "Data Scientist",
      match: 78,
      requirements: ["Statistical analysis", "Data visualization", "Business acumen"],
      nextSteps: ["Learn advanced statistics", "Master SQL", "Develop domain expertise"],
      salaryRange: "$110k - $160k",
      demandLevel: 'High' as const
    },
    {
      title: "AI Research Scientist",
      match: 65,
      requirements: ["PhD/Masters", "Research experience", "Publications"],
      nextSteps: ["Pursue advanced degree", "Publish research papers", "Join research labs"],
      salaryRange: "$150k - $250k",
      demandLevel: 'Medium' as const
    }
  ];

  const suggestedLearningPaths = [
    {
      title: "Advanced Deep Learning Specialization",
      description: "Master neural networks, CNNs, RNNs, and transformer architectures",
      estimatedTime: "3-4 months",
      difficulty: 'Advanced' as const,
      modules: ["Advanced CNNs", "RNNs & LSTMs", "Transformers", "GANs", "Reinforcement Learning"]
    },
    {
      title: "AI Ethics and Responsible AI",
      description: "Learn about bias, fairness, transparency, and ethical AI development",
      estimatedTime: "1-2 months",
      difficulty: 'Intermediate' as const,
      modules: ["AI Bias Detection", "Fairness Metrics", "Explainable AI", "Privacy-Preserving ML"]
    }
  ];

  const skillGaps = [
    "Advanced neural network architectures (Transformers, GANs)",
    "AI ethics and bias mitigation techniques",
    "Production ML system deployment and monitoring",
    "Advanced statistical inference and hypothesis testing"
  ];

  const industryTrends = [
    "Large Language Models (LLMs) and Generative AI",
    "MLOps and automated machine learning pipelines",
    "Edge AI and model optimization for mobile devices",
    "Responsible AI and ethical machine learning practices",
    "Multimodal AI combining vision, text, and audio"
  ];

  // Generate insights
  const insights: Insight[] = [];
  const strengths: string[] = [];
  const improvements: string[] = [];

  competencyAreas.forEach(area => {
    if (area.percentage >= 80) {
      strengths.push(area.name);
      insights.push({
        type: 'strength',
        title: `Strong ${area.name} Performance`,
        description: `You demonstrated ${area.level.toLowerCase()} proficiency with ${area.percentage}% accuracy in ${area.name}.`
      });
    } else if (area.percentage < 60) {
      improvements.push(area.name);
      insights.push({
        type: 'improvement',
        title: `${area.name} Needs Development`,
        description: `Focus on improving your ${area.name} skills to reach the next competency level.`
      });
    }
  });

  const studyRecommendations = [
    `Focus on ${improvements.length > 0 ? improvements[0] : 'advanced AI concepts'} through hands-on projects`,
    "Practice coding challenges on platforms like LeetCode and HackerRank",
    "Join AI/ML communities and participate in Kaggle competitions",
    "Read recent research papers and implement key algorithms from scratch",
    "Build end-to-end ML projects and deploy them to production"
  ];

  // component return
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="px-4 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <QuizResultHeader
            courseName="AI Competency Assessment System"
            quizTitle={quiz.title}
            completedAt={new Date(attempt.endTime || attempt.startTime).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
            isPassed={isPassed}
          />

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="overview" className="flex items-center gap-2 p-3 cursor-pointer">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="competency" className="flex items-center gap-2 p-3 cursor-pointer">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">AI Skills</span>
              </TabsTrigger>
              <TabsTrigger value="detailed" className="flex items-center gap-2 p-3 cursor-pointer">
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Questions</span>
              </TabsTrigger>
              <TabsTrigger value="career" className="flex items-center gap-2 p-3 cursor-pointer">
                <Rocket className="h-4 w-4" />
                <span className="hidden sm:inline">Career</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Left Column - Score and Time */}
                <div className="space-y-6">
                  <ScoreCard
                    score={score}
                    total_points={quiz.total_points}
                    percentage={percentage}
                    passingPercentage={passingPercentage}
                    classAverage={76}
                  />
                  <TimeAnalytics
                    timeSpent={timeSpent}
                    timeLimit={timeLimit}
                    timePercentage={timePercentage}
                    averageTimePerQuestion={averageTimePerQuestion}
                    efficiency={efficiency}
                  />
                </div>

                {/* Middle Column - Question Analysis */}
                <div className="space-y-6">
                  <QuestionBreakdown
                    totalQuestions={totalQuestions}
                    correctAnswers={correctAnswers}
                    incorrectAnswers={incorrectAnswers}
                    skippedQuestions={skippedQuestions}
                    categoryPerformance={categoryPerformance}
                  />
                  <PerformanceInsights
                    insights={insights}
                    strengths={strengths}
                    improvements={improvements}
                  />
                </div>

                {/* Right Column - Next Steps */}
                <div>
                  <NextSteps
                    canRetake={quiz.attempts > 1}
                    retakesLeft={quiz.attempts - 1}
                    nextLessonTitle="Advanced AI Ethics Module"
                    hasExplanations={true}
                    certificateEarned={isPassed && percentage >= 85}
                    studyRecommendations={studyRecommendations}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="competency" className="space-y-6">
              <AICompetencyBreakdown
                competencyAreas={competencyAreas}
                overallCompetencyLevel="Intermediate"
                industryBenchmark={72}
              />
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              <DetailedQuestionReview
                questions={questionDetails}
                showExplanations={true}
              />
            </TabsContent>

            <TabsContent value="career" className="space-y-6">
              <AICareerPathway
                currentLevel="Intermediate AI Practitioner"
                recommendedRoles={recommendedRoles}
                suggestedLearningPaths={suggestedLearningPaths}
                skillGaps={skillGaps}
                industryTrends={industryTrends}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default QuizResultDetail