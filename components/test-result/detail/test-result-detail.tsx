'use client'
import { api, Course, Quiz, QuizAttempt } from '@/services/api';
import React, { useEffect, useState } from 'react';
import { Skeleton } from '../../ui/skeleton';
import { BarChart3, BookOpenCheck, Brain, ChartNetwork, Code, Cpu, Database, Eye, Lightbulb, Rocket, SquareChartGantt, Target } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import ScoreCard from './test-score-card';
import TimeAnalytics from './test-time-analytics';
import QuestionBreakdown from './test-question-breakdown';
import PerformanceInsights from './test-performance-insights';
import NextSteps from './test-next-step';
import AICompetencyBreakdown from './test-ai-competency-breakdown';
import DetailedQuestionReview from './test-detailed-question-review';
import AICareerPathway from './test-ai-career-pathway';
import { useAuth } from '@/providers/auth-provider';
import { Test } from '@/types/interfaces/model';
import { TestAttempt } from '@/types/interfaces/test';
import { testService } from '@/services/test/testService';
import { testAttemptService } from '@/services/test/testAttemptService';
import TestResultHeader from './test-result-header';
import { AiReviewService } from '@/services/ai-review/AIReviewService';
import QuestionResult from '../overview/QuestionResult';
import { ChiTietDanhGia, PhanTichDanhGia } from '@/types/interfaces/ai-review';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Improvement from './Improvement';

interface TestResultDetailProps {
  test_id: number,
  attempt_id: number
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

// this component is used for the test result detail page (main component)
const TestResultDetail = ({ test_id, attempt_id }: TestResultDetailProps) => {
  const [test, setTest] = useState<Test | null>(null);
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [review, setReview] = useState<ChiTietDanhGia | null>(null);
  const [performance, setPerformance] = useState<PhanTichDanhGia | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadTestResult = async () => {
      try {
        const testData = await testService.getTestById(test_id);
        const attemptData = await testAttemptService.getTestAttemptById(attempt_id);
        const reviewRes = await AiReviewService.getReviewByAttemptID(attempt_id);

        if (testData && attemptData && reviewRes) {
          setTest(testData.data);
          setAttempt(attemptData.data.attempt);
          setReview(reviewRes.data.chi_tiet_danh_gia);
          setPerformance(reviewRes.data.phan_tich);
        }
      } catch (error) {
        console.error("Failed to load test result:", error);
      } finally {
        setLoading(false);
      }
    };


    console.log('PERFORMANCE: ', performance);

    const fetchResult = async () => {
      const res = await AiReviewService.getAiReviewById(24);
      console.log(JSON.parse(res.data.phan_tich))
      return res.data;
    }

    loadTestResult();
    fetchResult();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
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

  if (!test || !attempt) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Result Not Found</h1>
          <p className="text-white">The test results you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Calculate metrics from API data
  const answers = attempt?.cau_tra_loi ? JSON.parse(attempt.cau_tra_loi) : {};

  const totalQuestions = test.tong_so_cau_hoi || 0;

  const correctAnswers = test?.cau_hoi?.filter(q =>
    answers[q.ma_cau_hoi]?.toString() === q.dap_an_dung
  ).length ?? 0;

  const incorrectAnswers = test?.cau_hoi?.filter(q =>
    attempt?.cau_tra_loi?.[q.ma_cau_hoi.toString()] !== undefined &&
    attempt?.cau_tra_loi?.[q.ma_cau_hoi.toString()] !== q.dap_an_dung
  ).length;
  const skippedQuestions = totalQuestions - correctAnswers - incorrectAnswers;

  const score = attempt.diem || 0;
  const percentage = Math.round((score / test.tong_diem) * 100);
  const passingPercentage = 70;
  const isPassed = percentage >= passingPercentage;

  const startTime = new Date(attempt.thoi_gian_bat_dau);
  const endTime = new Date(attempt.thoi_gian_ket_thuc || new Date());
  const timeDiff = endTime.getTime() - startTime.getTime();
  const timeSpentMinutes = Math.floor(timeDiff / 60000);
  const timeSpentSeconds = Math.floor((timeDiff % 60000) / 1000);
  const timeSpent = `${timeSpentMinutes}m ${timeSpentSeconds}s`;
  const timeLimit = `${test.thoi_luong}m 00s`;
  const timePercentage = Math.round((timeDiff / (test.thoi_luong * 60000)) * 100);
  const averageTimePerQuestion = `${Math.floor(timeDiff / totalQuestions / 60000)}m ${Math.floor((timeDiff / totalQuestions % 60000) / 1000)}s`;
  const efficiency = timePercentage < 50 ? 'Fast' : timePercentage < 80 ? 'Optimal' : 'Slow';

  // Category performance
  const categoryPerformance: CategoryPerformance[] = [
    {
      name: "Multiple Choice",
      correct: test?.cau_hoi?.filter(q =>
        q.loai === 'trac_nghiem' &&
        attempt?.cau_tra_loi?.[q.ma_cau_hoi.toString()] === q.dap_an_dung
      ).length,
      total: test?.cau_hoi?.filter(q => q.loai === 'trac_nghiem').length,
      percentage: 0
    },
    {
      name: "True/False",
      correct: test?.cau_hoi?.filter(q =>
        q.loai === 'dung_sai' &&
        attempt?.cau_tra_loi?.[q.ma_cau_hoi.toString()] === q.dap_an_dung
      ).length,
      total: test?.cau_hoi?.filter(q => q.loai === 'dung_sai').length,
      percentage: 0
    },
    {
      name: "Short Answer",
      correct: test?.cau_hoi?.filter(q =>
        q.loai === 'tra_loi_ngan' &&
        attempt?.cau_tra_loi?.[q.ma_cau_hoi.toString()] === q.dap_an_dung
      ).length,
      total: test?.cau_hoi?.filter(q => q.loai === 'tra_loi_ngan').length,
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

  return (
    <div className="min-h-screen">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <TestResultHeader
          courseName="AI Competency Assessment System"
          testTitle={test.tieu_de}
          attempt={attempt.ma_lan_lam}
          completedAt={new Date(attempt.thoi_gian_ket_thuc || attempt.thoi_gian_bat_dau).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Ho_Chi_Minh'
          })}
          isPassed={isPassed}
        />

        <Card className='gap-2'>
          <CardHeader>
            <CardTitle>Mô tả bài thi:</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>{test.mo_ta}</CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6 h-auto border border-gray-300 rounded-[3px]">
            <TabsTrigger value="overview" className="flex items-center gap-2 p-3 cursor-pointer rounded-[3px]">
              <SquareChartGantt className="!h-5 !w-5 text-blue-700" />
              <span className="hidden sm:inline">Tổng quan</span>
            </TabsTrigger>
            <TabsTrigger value="question" className="flex items-center gap-2 p-3 cursor-pointer rounded-[3px]">
              <BookOpenCheck className="!h-5 !w-5 text-green-700" />
              <span className="hidden sm:inline">Đánh giá chi tiết câu hỏi</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 p-3 cursor-pointer rounded-[3px]">
              <ChartNetwork className="!h-5 !w-5" />
              <span className="hidden sm:inline">Phân tích chi tiết</span>
            </TabsTrigger>

            <TabsTrigger value="improvement" className="flex items-center gap-2 p-3 cursor-pointer rounded-[3px]">
              <Lightbulb className="!h-5 !w-5" />
              <span className="hidden sm:inline">Đề xuất cải thiện</span>
            </TabsTrigger>

            <TabsTrigger value="competency" className="flex items-center gap-2 p-3 cursor-pointer rounded-[3px]">
              <Brain className="!h-5 !w-5" />
              <span className="hidden sm:inline">Kỹ năng AI</span>
            </TabsTrigger>

            <TabsTrigger value="career" className="flex items-center gap-2 p-3 cursor-pointer rounded-[3px]">
              <Rocket className="!h-5 !w-5" />
              <span className="hidden sm:inline">Việc làm</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column - Score and Time */}
              <div className="space-y-6">
                <ScoreCard
                  score={score}
                  total_points={test.tong_diem}
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
              </div>

              {/* Right Column - Next Steps */}
              <div>
                <NextSteps
                  canRetake={test.so_lan_lam_toi_da > 1}
                  retakesLeft={test.so_lan_lam_toi_da - 1}
                  nextLessonTitle="Advanced AI Ethics Module"
                  hasExplanations={true}
                  certificateEarned={isPassed && percentage >= 85}
                  studyRecommendations={studyRecommendations}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value='analytics'>
            <PerformanceInsights
              performance={performance}
            />
          </TabsContent>

          <TabsContent value="competency" className="space-y-6">
            <AICompetencyBreakdown
              competencyAreas={competencyAreas}
              overallCompetencyLevel="Intermediate"
              industryBenchmark={72}
            />
          </TabsContent>

          <TabsContent value="question" className="space-y-6">
            {/* <DetailedQuestionReview
              questions={questionDetails}
              showExplanations={true}
            /> */}

            <QuestionResult
              test={test}
              attempt={attempt}
              review={review}
            />
          </TabsContent>

          <TabsContent value='improvement'>
            <Improvement
              de_xuat_cai_thien={performance?.de_xuat_cai_thien}
              huong_phat_trien={performance?.huong_phat_trien}
              ke_hoach_ngan_han={performance?.ke_hoach_ngan_han}
              ke_hoach_dai_han={performance?.ke_hoach_dai_han}
              tai_nguyen_de_xuat={performance?.tai_nguyen_de_xuat}
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
  );
}

export default TestResultDetail