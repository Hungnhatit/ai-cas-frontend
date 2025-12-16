import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChiTietDanhGia } from "@/types/interfaces/ai-review";
import { Test, TestAttempt, TestQuestion } from "@/types/interfaces/model";
import { CheckCircle, MessageCircleCode, XCircle } from "lucide-react";

const renderQuestionResult = (attempt: TestAttempt, question: TestQuestion, index: number, questionReview?: ChiTietDanhGia) => {
  const userAnswerData = attempt?.cau_tra_loi_hoc_vien.find((a: any) => a.ma_cau_hoi === question.ma_cau_hoi);
  const userAnswerRaw = userAnswerData?.tra_loi;
  const achievedScore = userAnswerData?.diem || 0;
  const maxScore = question.cau_hoi?.diem || 0;
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

            {questionReview && (
              <div>
                <span className="font-bold">
                  Nhận xét: {' '}
                </span>
                {questionReview.nhan_xet}
              </div>
            )}
          </div>
        )}

        {question.cau_hoi?.loai_cau_hoi === "tu_luan" && (
          <div className="space-y-2">
            <div className="space-y-2">
              <div className="p-3 bg-gray-200 rounded-sm">
                <p className="text-md font-medium mb-1">Câu trả lời của bạn:</p>
                <p className="text-md">{userAnswerRaw || "Không có câu trả lời"}</p>
              </div>
              <div className="p-3 bg-green-200 rounded-sm">
                <p className="text-md font-medium mb-1">Câu trả lời đúng:</p>
                <p className="text-md">{question.dap_an_dung}</p>
              </div>
            </div>
            {questionReview && (
              <div>
                <span className="font-bold">
                  Nhận xét: {' '}
                </span>
                {questionReview.nhan_xet}
              </div>
            )}
          </div>
        )}

        {question.cau_hoi?.loai_cau_hoi === 'nhieu_lua_chon' && (
          <div className='space-y-3'>
            <ul className="space-y-3">
              {question.cau_hoi?.cau_hoi_nhieu_lua_chon && question.cau_hoi.cau_hoi_nhieu_lua_chon?.lua_chon?.map((option: any, index: number) => (
                <li key={option.ma_lua_chon} className={`flex items-center p-3 rounded-[3px] border border-gray-300 text-[15px] hover:bg-gray-100 cursor-pointer
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
            {questionReview && (
              <div>
                <span className="font-bold">
                  Nhận xét: {' '}
                </span>
                {questionReview.nhan_xet}
              </div>
            )}
          </div >
        )}
      </CardContent>
    </Card>
  )
}

interface QuestionResultProps {
  test: Test
  attempt: TestAttempt
  review: ChiTietDanhGia[]
}


const QuestionResult = ({ test, attempt, review }: QuestionResultProps) => {
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          Đánh giá câu hỏi
        </CardTitle>
        <CardDescription className="text-md">Xem lại bài làm và câu trả lời của bạn kèm theo các giải thích cho câu hỏi</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue={test?.phan_kiem_tra[0].ma_phan.toString()} className='space-y-2'>
          <TabsList className='rounded-[3px] bg-gray-200'>
            {test?.phan_kiem_tra?.map((section, index) => (
              <TabsTrigger key={index} value={section.ma_phan.toString()} className='rounded-[3px] bg-gray-200 cursor-pointer'>
                Phần {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>

          {test?.phan_kiem_tra?.map((section, index) => (
            <TabsContent key={index} value={section.ma_phan.toString()} className='space-y-4'>
              <div className="space-y-1">
                <p>
                  <span className="font-bold">Tên phần: {' '}</span>
                  {section.ten_phan}
                </p>
                <p>
                  <span className="font-bold">Nội dung: {' '}</span>
                  {section.mo_ta}
                </p>
              </div>
              {section.phan_kiem_tra_cau_hoi.map((question, index) => {
                const questionReview = review.find((r: any) => r.ma_cau_hoi === question.ma_cau_hoi)
                return (
                  <div key={index}>
                    {renderQuestionResult(attempt, question, index, questionReview)}
                  </div>
                )
              })}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default QuestionResult