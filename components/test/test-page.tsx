'use client'
import React, { useEffect, useRef, useState } from 'react'
import { testService } from '@/services/test/testService';
import ProgressBar from '../ui/ProgressBar';
import { TestSession, UserAnswer } from '@/types/interfacess/test';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, Ban, Clock, Send, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import ConfirmModal from '../ui/ConfirmModal';
import { useParams, useRouter } from 'next/navigation';
import { Test } from '@/types/interfaces/model';
import { testAttemptService } from '@/services/test/testAttemptService';
import { useAuth } from '@/providers/auth-provider';
import { TestAttempt } from '@/types/interfaces/test';
import { Separator } from '../ui/separator';

interface TestPageProps {
  test_id: number,
  attempt_id?: number
}

const TestPage = ({ test_id, attempt_id }: TestPageProps) => {
  const [test, setTest] = useState<Test | null>(null);
  const [session, setSession] = useState<TestSession | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const questionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  /**
   * handle load test
   */
  useEffect(() => {
    if (!user) return;
    const loadTest = async () => {
      try {
        // Check for custom tests first
        const testData = await testService.getTestById(test_id);

        if (!testData) {
          throw new Error('Test not found');
        }
        setTest(testData.data);

        if (attempt_id) {
          const res = await testAttemptService.getTestAttempts(test_id, user?.ma_nguoi_dung);
          const attempts = res.data;
          const currentAttempt = attempts.find((attempt: any) => attempt.ma_lan_lam === Number(attempt_id));

          if (currentAttempt) {
            setAttempt(currentAttempt);
            setAnswers(currentAttempt.cau_tra_loi || {});

            const startTime = new Date(currentAttempt.thoi_gian_bat_dau).getTime();
            const now = new Date().getTime();
            const elapsed = Math.floor((now - startTime) / 1000);
            const remaining = Math.max(0, testData.data.thoi_luong * 60 - elapsed);
            setTimeRemaining(remaining);
          }
        }

        const newSession: TestSession = {
          ma_kiem_tra: testData.id,
          startTime: new Date(),
          answers: [],
          currentQuestionIndex: 0,
          isCompleted: false
        };
        setSession(newSession);
      } catch (error) {
        console.error('Failed to load test:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTest();
  }, [test_id, attempt_id, router]);

  useEffect(() => {
    if (timeRemaining <= 0 || !session || session.isCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, session]);

  const handleAnswerChange = async (question_id: number, answer: string | number) => {
    const newAnswers = { ...answers, [question_id]: answer } // object
    // setAnswers(prev => ({
    //   ...prev,
    //   [question_id]: answer
    // }));
    setAnswers(newAnswers);
    if (attempt_id) {
      try {
        await testAttemptService.submitTestAnswers(attempt_id, newAnswers)
      } catch (error) {
        console.log('Failed to save answer: ', error)
      }
    }
  };

  const handleSubmitTest = async () => {
    if (!test || !session) return;

    try {
      const userAnswers: UserAnswer[] = Object.entries(answers).map(([question_id, answer]) => ({
        question_id,
        answer,
        timeSpent: 0
      }));

      const timeSpent = (test.thoi_luong * 60) - timeRemaining;
      const result = await testAttemptService.submitTestAttempt(Number(attempt_id));
      router.push(`/tests/${id}/result-overview?attempt=${attempt_id}`)
      // localStorage.setItem('testResult', JSON.stringify(result));

    } catch (error) {
      console.error('Failed to submit test:', error);
    }
  };

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [exiting, setExiting] = useState(false);

  const handleCancelTest = async () => {
    if (!attempt || !attempt.ma_lan_lam) {
      setShowExitConfirm(false);
      return;
    }

    setExiting(true);

    try {
      await testAttemptService.abortAttempt(attempt.ma_lan_lam);
      router.push('/student/tests-management');
    } catch (error) {
      console.error(error);
    } finally {
      setExiting(false);
      setShowExitConfirm(false);
    }
  }

  const scrollToQuestion = (question_id: number) => {
    const element = questionRefs.current[question_id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };



  // if (loading) {
  //   return (
  //     <div className="text-center py-12">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Loading test...</p>
  //       </div>
  //     </div>
  //     // <Layout currentPage="test" title="Loading Test...">
  //     // </Layout>
  //   );
  // }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // if (!test || !session) {
  if (!test) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Test result not found</h2>
        <p className="text-muted-foreground mb-4">The test result you're looking for don't exist.</p>
        <Button onClick={() => router.push("/tests-management")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to tests
        </Button>
      </div>
      // <Layout currentPage="test" title="Test Not Found">
      // </Layout>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-8xl mx-auto px-4 py-4">
      <div className="flex gap-6 space-y-4 py-4">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Test Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-c">
                <div>
                  <CardTitle className="text-2xl">Bài thi: {test.tieu_de}</CardTitle>
                  <p className="text-gray-600 mt-2">{test.mo_ta}</p>
                </div>
                <div className="">
                  <Badge variant="secondary" className='px-3 py-1 text-sm'>
                    {test.tong_diem} điểm
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ProgressBar
                current={getAnsweredCount()}
                total={test?.cau_hoi?.length}
                label="Câu hỏi đã trả lời"
              />
            </CardContent>
          </Card>

          {/* All Questions */}
          <div className="space-y-6 ">
            {test?.cau_hoi?.map((question, index) => (
              <Card
                key={question.ma_cau_hoi}
                className="relative gap-10"
                ref={(el) => { questionRefs.current[question.ma_cau_hoi] = el; }}
              >
                <CardHeader className='bg-gray-200 -my-6 gap-0 py-3'>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Câu hỏi {index + 1}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className='bg-blue-500 text-white'>{question.diem} points</Badge>
                      {answers[question.ma_cau_hoi] !== undefined && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Answered
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-gray-900 leading-relaxed font-medium">
                    {question.cau_hoi}
                  </div>

                  {question.loai === 'trac_nghiem' && question.lua_chon && (
                    <RadioGroup
                      value={answers[question.ma_cau_hoi]?.toString() || ''}
                      onValueChange={(value) => handleAnswerChange(question.ma_cau_hoi, parseInt(value))}
                      className=""
                    >
                      {question.lua_chon.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-3 p-3 text-md rounded-[3px] border border-gray-300 hover:bg-gray-100">
                          <RadioGroupItem
                            value={optionIndex.toString()}
                            id={`${question.ma_cau_hoi}-option-${optionIndex}`}
                            className='border-gray-300'
                          />
                          <Label
                            htmlFor={`${question.ma_cau_hoi}-option-${optionIndex}`}
                            className="flex-1 cursor-pointer text-sm leading-relaxed"
                          >
                            {String.fromCharCode(65 + Number(optionIndex))}. {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.loai === 'tu_luan' && (
                    <div className="space-y-2">
                      <Label htmlFor={`essay-${question.ma_cau_hoi}`} className="text-sm font-medium">
                        Your Answer:
                      </Label>
                      <Textarea
                        id={`essay-${question.ma_cau_hoi}`}
                        placeholder="Type your answer here..."
                        value={answers[question.ma_cau_hoi]?.toString() || ''}
                        onChange={(e) => handleAnswerChange(question.ma_cau_hoi, e.target.value)}
                        className="min-h-[120px] resize-none"
                      />
                      <div className="text-xs text-gray-500">
                        {(answers[question.ma_cau_hoi]?.toString() || '').length} characters
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Submit Section */}
          {/* <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="text-sm text-gray-600">
                  You have answered {getAnsweredCount()} out of {test?.cau_hoi?.length} questions
                </div>
                <Button
                  onClick={() => setShowSubmitModal(true)}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Test
                </Button>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Question Navigation Grid - Right Sidebar */}
        <div className="sticky h-fit top-20 self-start">
          <Card className=''>
            <CardHeader>
              <CardTitle className='text-lg text-center'>Thời gian làm bài</CardTitle>
              <p className='text-2xl text-center font-bold'>
                {formatTime(timeRemaining)}
              </p>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4">
              <div>
                <CardTitle className="text-lg">Điều hướng câu hỏi</CardTitle>
                <p className="text-md text-gray-600">
                  {getAnsweredCount()}/{test?.cau_hoi?.length} đã trả lời
                </p>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {test?.cau_hoi?.map((question, index) => {
                  const isAnswered = answers[question.ma_cau_hoi] !== undefined;
                  return (
                    <Button
                      key={question.ma_cau_hoi}
                      variant={isAnswered ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "h-10 w-10 text-md font-medium rounded-[3px] shadow-none border-gray-400",
                        isAnswered
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "hover:bg-gray-100"
                      )}
                      onClick={() => scrollToQuestion(question.ma_cau_hoi)}
                    >
                      {index + 1}
                    </Button>
                  );
                })}
              </div>

              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-600 rounded"></div>
                    <span className='text-sm'>Đã trả lời</span>
                  </div>
                  <span>{getAnsweredCount()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border border-gray-300 rounded"></div>
                    <span className='text-sm'>Chưa trả lời</span>
                  </div>
                  <span>{test?.cau_hoi?.length - getAnsweredCount()}</span>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t">
                <Button
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full rounded-sm flex items-center bg-blue-500 hover:bg-blue-700 cursor-pointer"
                >
                  <Send className="" />
                  Nộp bài thi
                </Button>
                <div>
                  <Button
                    variant='destructive'
                    onClick={() => setShowExitConfirm(true)}
                    className='w-full rounded-sm cursor-pointer'
                  >
                    <Ban />
                    Thoát bài thi
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <ConfirmModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleSubmitTest}
        title="Submit Test"
        description={`Are you sure you want to submit your test? You have answered ${getAnsweredCount()} out of ${test?.cau_hoi?.length} questions. This action cannot be undone.`}
        confirmText="Submit Test"
        cancelText="Continue Test"
      />

      <ConfirmModal
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onConfirm={handleCancelTest}
        title="Thoát bài thi"
        description='Bạn chắc chắn muốn thoát? Hành động này sẽ kết thúc bài làm và không thể tiếp tục làm bài. Nếu bạn muốn bảo lưu và tiếp tục sau, hãy chọn "Tiếp tục làm bài".'
        confirmText={exiting ? 'Đang thoát' : 'Thoát bài thi'}
        cancelText="Tiếp tục làm bài"
      />
    </div>
  );
}

export default TestPage
