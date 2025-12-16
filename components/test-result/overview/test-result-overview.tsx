"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle, XCircle, Clock, Trophy, Target, BookOpen, ArrowLeft, Download, Share2, RotateCcw,
  StepBack,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { testAttemptService } from "@/services/test/testAttemptService"
import { testService } from "@/services/test/testService"
import { Test, TestAttempt, TestQuestion } from "@/types/interfaces/model"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TestResultOverviewPageProps {
  test_id: number
  testAttempt_id?: number
}

// this component is used for the result page after submitting the quiz
export function TestResultOverview({ test_id, testAttempt_id }: TestResultOverviewPageProps) {
  const [test, setTest] = useState<Test | null>(null)
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [scoreInfo, setScoreInfo] = useState(null);
  const [loading, setLoading] = useState(true)
  const router = useRouter();
  const { user } = useAuth();

  console.log('INFO: ', scoreInfo);
  console.log("ATTEMPT: ", attempt);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsRes, attemptListRes] = await Promise.all([
          testService.getTestById(test_id),
          testAttemptService.getTestAttemptById(Number(testAttempt_id))
        ]);

        if (!testsRes) {
          router.push("/tests")
          return
        }

        const testData = testsRes.data;
        const attemptData = attemptListRes.data;

        if (attemptData?.cau_tra_loi && typeof attemptData.cau_tra_loi === "string") {
          attemptData.cau_tra_loi = JSON.parse(attemptData.cau_tra_loi);
        }

        setTest(testData);
        setAttempt(attemptData.attempt);
        setScoreInfo(attemptData.info);
      } catch (error) {
        console.error("Failed to fetch quiz results:", error)
        // router.push("/tests")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [test_id, testAttempt_id, router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getTimeTaken = () => {
    if (!attempt?.thoi_gian_bat_dau || !attempt?.thoi_gian_ket_thuc) return "N/A"
    const start = new Date(attempt.thoi_gian_bat_dau).getTime()
    const end = new Date(attempt.thoi_gian_ket_thuc).getTime()
    const seconds = Math.floor((end - start) / 1000)
    return formatTime(seconds)
  }

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 70) return "text-blue-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getGradeLetter = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 90) return "A"
    if (percentage >= 80) return "B"
    if (percentage >= 70) return "C"
    if (percentage >= 60) return "D"
    return "F"
  }

  console.log('TEST.PHANKIEMTRA: ', test?.phan_kiem_tra);

  const getCorrectAnswers = () => {
    if (!test || !attempt) return 0;
    let correct = 0;

    test.phan_kiem_tra.forEach((section: any) => {
      section.phan_kiem_tra_cau_hoi.forEach((question: any) => {
        const userAnswerObj = attempt.cau_tra_loi_hoc_vien?.find(
          (a: any) => a.ma_cau_hoi === question.ma_cau_hoi
        );
        const userAnswer = userAnswerObj?.tra_loi;

        if (question.cau_hoi.loai_cau_hoi === "trac_nghiem") {
          const correctOption = question.cau_hoi.cau_hoi_trac_nghiem?.lua_chon_trac_nghiem?.find(
            (opt: any) => opt.la_dap_an_dung === 1
          ).ma_lua_chon.toString();

          if (userAnswer === correctOption) {
            correct++;
          }
        }
        else if (question.cau_hoi.loai_cau_hoi === "tu_luan") {
          if (userAnswer === question.cau_hoi_tu_luan?.dap_an_dung) {
            correct++;
          }
        }
        else if (question.cau_hoi.loai_cau_hoi === "nhieu_lua_chon") {
          let userSelectedIds: number[] = [];
          try {
            if (userAnswer) {
              userSelectedIds = JSON.parse(userAnswer).map((id: any) => Number(id));
            }
          } catch (error) {
            userSelectedIds = [];
          }
          const options = question.cau_hoi.cau_hoi_nhieu_lua_chon.lua_chon || [];
          const correctOptionIds = options
            .filter((option: any) => option.la_dap_an_dung === true || option.la_dap_an_dung === 1)
            .map((opt: any) => Number(opt.ma_lua_chon));


        }
      });
    });

    return correct;
  };

  const parseMCQAnswer = (answer: string | any): number[] => {
    if (Array.isArray(answer)) return answer;

    if (!answer) return [];
    try {
      const parsed = JSON.parse(answer);
      return Array.isArray(parsed) ? parsed.map(Number) : [];
    } catch (e) {
      return [];
    }
  }

  // render detail question
  const renderQuestionResult = (question: TestQuestion, index: number) => {
    const userAnswerData = attempt?.cau_tra_loi_hoc_vien.find((a: any) => a.ma_cau_hoi === question.ma_cau_hoi);
    const userAnswerRaw = userAnswerData?.tra_loi;
    const achievedScore = userAnswerData?.diem || 0;
    const maxScore = question.cau_hoi?.diem || 0;

    const isPerpect = achievedScore === maxScore;
    const hasScore = achievedScore > 0;

    return (
      <Card key={question.ma_cau_hoi} className={`border-l-4 ${hasScore ? "border-l-sky-600" : "border-l-red-500"} gap-0.5 py-4`}>
        <CardHeader className="">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-base flex items-center gap-2">
                {hasScore ? (
                  <CheckCircle className="h-5 w-5 text-sky-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Câu hỏi {index + 1}
              </CardTitle>
              <CardDescription className="text-md leading-relaxed">{question.cau_hoi?.tieu_de}</CardDescription>
            </div>
            <div className="text-right">
              <Badge variant={hasScore ? "default" : "destructive"}>
                {achievedScore}/{maxScore} điểm
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.cau_hoi?.loai_cau_hoi === "trac_nghiem" && question.cau_hoi.cau_hoi_trac_nghiem?.lua_chon_trac_nghiem && (
            <div className="space-y-2">
              {question.cau_hoi.cau_hoi_trac_nghiem.lua_chon_trac_nghiem.map((option: any, optionIndex: number) => {
                const isUserAnswer = userAnswerRaw === option.ma_lua_chon.toString();
                const isCorrectOption = option.la_dap_an_dung === 1;
                return (
                  <div
                    key={option.ma_lua_chon}
                    className={`p-2 rounded-[3px] border ${isCorrectOption
                      ? "bg-sky-200 border-sky-200 text-blue-900"
                      : isUserAnswer
                        ? "bg-red-200/90 border-red-200 text-red-800"
                        : "bg-gray-50 border-gray-200"
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isCorrectOption && <CheckCircle className="h-4 w-4 text-sky-600" />}
                        {isUserAnswer && !isCorrectOption && <XCircle className="h-4 w-4 text-red-600" />}
                        {String.fromCharCode(65 + optionIndex)}
                        <span className="text-[15px]">{option.noi_dung}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isUserAnswer && (
                          <Badge variant="outline" className="ml-auto text-xs border border-blue-600">
                            Câu trả lời của bạn
                          </Badge>
                        )}
                        {isCorrectOption && (
                          <Badge variant="outline" className="ml-auto text-xs border border-blue-600">
                            Đúng
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {question.cau_hoi?.loai_cau_hoi === "tu_luan" && (
            <div className="space-y-2">
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-md font-medium mb-1">Câu trả lời của bạn:</p>
                <p className="text-md">{userAnswerRaw || "No answer provided"}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-md font-medium mb-1">Correct Answer:</p>
                <p className="text-md">{question.dap_an_dung}</p>
              </div>
            </div>
          )}

          {question.cau_hoi?.loai_cau_hoi === 'nhieu_lua_chon' && (
            <div className=''>
              <ul className="space-y-3 mt-4">
                {question.cau_hoi?.cau_hoi_nhieu_lua_chon && question.cau_hoi.cau_hoi_nhieu_lua_chon?.lua_chon?.map((option: any, index: number) => (
                  <li key={option.ma_lua_chon} className={`flex items-center p-3 rounded-[3px] border border-gray-300 text-sm hover:bg-gray-100 cursor-pointer
                 ${option.la_dap_an_dung
                    && 'bg-blue-100 !border-blue-500 !hover:bg-blue-400'}`
                  }>
                    <span className="flex-grow">
                      {option.noi_dung}
                    </span>
                    {(option.la_dap_an_dung === true || option.la_dap_an_dung === 1) && <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />}
                  </li>
                ))}
              </ul>
            </div >
          )}
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!test || !attempt) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Test result not found</h2>
        <p className="text-muted-foreground mb-4">The test result you're looking for don't exist.</p>
        <Button onClick={() => router.push("/tests-management")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to tests
        </Button>
      </div>
    )
  }

  const score = attempt?.diem || 0
  const total_points = test.tong_diem
  const percentage = Math.round((score / total_points) * 100)
  const correctAnswers = scoreInfo?.so_cau_dung;
  const totalSection = test.phan_kiem_tra.length;
  const totalQuestions = test.tong_so_cau_hoi;
  const timeTaken = getTimeTaken()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={() => router.push("/test-library")} className="rounded-[3px] cursor-pointer">
          <StepBack className="h-4 w-4 mr-2" />
          Quay về trang Bài thi
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Tải xuống kết quả
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Results Header */}
      <Card className="border-2">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className={`p-4 rounded-full ${percentage >= 70 ? "bg-green-100" : "bg-red-100"}`}>
              <Trophy className={`h-8 w-8 ${percentage >= 70 ? "text-green-600" : "text-red-600"}`} />
            </div>
          </div>
          <CardTitle className="text-2xl mb-2">{test.tieu_de}</CardTitle>
          <CardDescription className="text-base">{test.mo_ta}</CardDescription>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant={percentage >= 70 ? "default" : "destructive"} className="rounded-[3px] text-lg px-4 py-2">
              {percentage}% ({getGradeLetter(score, total_points)})
            </Badge>
            {/* <Badge variant="outline" className="text-base px-3 py-1">
              {score}/{total_points} điểm
            </Badge> */}
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Tổng điểm</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(score, total_points)}`}>
              {score}/{total_points}
            </div>
            <p className="text-xs text-muted-foreground">
              {percentage}% ({getGradeLetter(score, total_points)} Grade)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Số đáp án đúng</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {correctAnswers}/{totalQuestions}
            </div>
            <p className="text-xs text-muted-foreground">
              Độ chính xác {Math.round((correctAnswers / totalQuestions) * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Thời gian làm bài</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeTaken}</div>
            <p className="text-xs text-muted-foreground">trong tổng {test.thoi_luong} phút</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Attempt</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">of {test.so_lan_lam_toi_da} allowed</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tổng quan về hiệu suất của lần thi</CardTitle>
          <CardDescription className="text-md">Hiển thị tổng quan kết quả bài thi, bao gồm số câu đúng, điểm đạt được, thời gian làm bài và ngày hoàn thành, giúp người dùng đánh giá nhanh hiệu suất của mình.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-md">
              <span>Tổng điểm</span>
              <span className="font-medium">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-md">
            <div>
              <p className="font-medium mb-2">Thông tin bài thi</p>
              <div className="space-y-1 text-muted-foreground">
                <p>• Tên bài thi: {test.tieu_de}</p>
                <p>• Tổng số phần thi: {totalSection}</p>
                <p>• Tổng số câu hỏi: {totalQuestions}</p>
                <p>• Tổng điểm bài thi: {total_points}</p>
                <p>• Thời gian làm bài: {test.thoi_luong} minutes</p>
              </div>
            </div>
            <div>
              <p className="font-medium mb-2">Hiệu suất của bạn</p>
              <div className="space-y-1 text-muted-foreground">
                <p>
                  • Số câu trả lời đúng: {correctAnswers}/{totalQuestions}
                </p>
                <p>
                  • Điểm đạt được: {score}/{total_points}
                </p>
                <p>• Thời gian sử dụng làm bài: {timeTaken}</p>
                <p>• Ngày hoàn thành bài thi: {new Date(attempt?.thoi_gian_ket_thuc || "").toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question-by-Question Review */}
      <Card className="gap-3">
        <CardHeader>
          <CardTitle className="text-lg">Đánh giá câu hỏi</CardTitle>
          <CardDescription className="text-md">Xem lại câu trả lời của bạn và xem các giải thích cho câu trả lời</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue={test.phan_kiem_tra[0].ma_phan.toString()} className='space-y-4'>
            <TabsList className='rounded-[3px] bg-gray-200'>
              {test.phan_kiem_tra?.map((section, index) => (
                <TabsTrigger key={index} value={section.ma_phan.toString()} className='rounded-[3px] bg-gray-200 cursor-pointer'>
                  Phần {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>

            {test.phan_kiem_tra?.map((section, index) => (
              <TabsContent key={index} value={section.ma_phan.toString()} className='space-y-4'>
                {section.phan_kiem_tra_cau_hoi.map((question, index) => (
                  <div key={index}>
                    {/* {question.loai_cau_hoi === 'trac_nghiem' && question.cau_hoi_trac_nghiem.map((question: any, index: number) => renderQuestionResult(question, index))}
                     */}
                    {/* {question.cau_hoi.loai_cau_hoi === 'trac_nghiem' && renderQuestionResult(question, index)} */}
                    {renderQuestionResult(question, index)}
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Actions */}
      {/* <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
          
            {test.so_lan_lam_toi_da > 1 && (
              <Button variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
