'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, PlusCircle, Trash2 } from 'lucide-react';
import { TestQuestion } from '@/types/interfaces/model';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectItem, SelectTrigger } from '@/components/ui/select';
import { SelectContent, SelectValue } from '@radix-ui/react-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


interface QuestionListProps {
  questions: Partial<TestQuestion>[]
  setQuestions: (value: Partial<TestQuestion>[]) => void;
  onAddQuestion: () => void
}

const QuestionList = ({ questions, setQuestions, onAddQuestion }: QuestionListProps) => {
  const addQuestion = () => {
    console.log('first')
    setQuestions([
      ...questions,
      {
        ma_cau_hoi: questions.length + 1,
        cau_hoi: "",
        loai: "trac_nghiem",
        lua_chon: ["", "", "", ""],
        dap_an_dung: 0,
        diem: 10,
      },
    ])
  }

  const updateQuestion = (index: number, updates: Partial<TestQuestion>) => {
    setQuestions(questions.map((q, i) => (
      i === index
        ? { ...q, ...updates }
        : q)))
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  return (
    <div className='space-y-4 bg-card p-4 rounded-[3px] shadow-xs mb-4 border border-gray-300'>
      <div className="flex items-center justify-between">
        {/* <Label className='text-xl font-bold'>Danh sách câu hỏi</Label> */}
        <Button type="button" variant="outline" onClick={onAddQuestion} className='cursor-pointer rounded-[3px]'>
          <Plus className="h-4 w-4 mr-2" />
          Thêm câu hỏi
        </Button>
      </div>

      {questions.length === 0 && (
        <div>
          <Card className='shadow-none'>
            <CardHeader className='justify-centerF'>
              <CardTitle className='text-center text-xl font-bold'>Chưa có câu hỏi nào được thêm vào</CardTitle>
              <CardDescription className='text-center text-md'>Click 'Thêm câu hỏi' để tạo câu hỏi của bạn</CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* <div className="space-y-4 mt-3"> */}
      <div className='grid lg:grid-cols-2 gap-4'>
        {questions.map((question, index) => (
          <Card key={question.ma_cau_hoi} className='gap-2 py-3 shadow-none border-gray-300'>
            <CardHeader className='gap-0'>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Câu hỏi {index + 1}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => removeQuestion(index)} className='cursor-pointer'>
                  <Trash2 className="h-10 w-10" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className='mb-3'>Nội dung câu hỏi</Label>
                <Textarea
                  value={question.cau_hoi}
                  onChange={(e) => updateQuestion(index, { cau_hoi: e.target.value })}
                  placeholder="Enter your question"
                  className='rounded-[3px] shadow-none border-gray-300'
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className='mb-3'>Loại câu hỏi</Label>
                  <Select
                    value={question.loai}
                    onValueChange={(value) =>
                      updateQuestion(index, {
                        loai: value as TestQuestion["loai"],
                        lua_chon: value === "trac_nghiem" ? ["", "", "", ""] : undefined,
                      })
                    }
                  >
                    <SelectTrigger className='rounded-[3px] border-gray-300 cursor-pointer'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='rounded-[3px] cursor-pointer'>
                      <SelectItem value="trac_nghiem" className='rounded-[3px] cursor-pointer'>Trắc nghiệm</SelectItem>
                      <SelectItem value="dung_sai" className='rounded-[3px] cursor-pointer'>Đúng/Sai</SelectItem>
                      <SelectItem value="tra_loi_ngan" className='rounded-[3px] cursor-pointer'>Trả lời ngắn</SelectItem>
                      <SelectItem value="thuc_hanh_prompt" className='rounded-[3px] cursor-pointer'>Thực hành prompt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className='mb-3'>Điểm</Label>
                  <Input type="number" value={question.diem} min="1" max="50"
                    onChange={(e) => updateQuestion(index, { diem: Number.parseInt(e.target.value) })} className='rounded-[3px] border-gray-300'
                  />
                </div>
              </div>

              {question.loai === "trac_nghiem" && (
                <div>
                  <Label className="mb-3">
                    Tuỳ chọn trả lời (click vào để chỉnh sửa)
                  </Label>
                  <div className="space-y-2">
                    <RadioGroup
                      value={question.dap_an_dung?.toString()}
                      onValueChange={(value) =>
                        updateQuestion(index, { dap_an_dung: Number.parseInt(value) })
                      }
                    >
                      {question?.lua_chon?.map((option, optionIndex) => {
                        const optionLabel = String.fromCharCode(65 + optionIndex); // A, B, C, D
                        const isCorrect = question.dap_an_dung === optionIndex;

                        return (
                          <div
                            key={optionIndex}
                            className={`flex items-center space-x-2 py-1 px-2 rounded-[3px] border transition-colors ${isCorrect ? "border-sky-400 bg-sky-50" : "border-gray-300"}`}
                          >
                            <RadioGroupItem
                              value={optionIndex.toString()}
                              className="cursor-pointer"
                            />
                            <span className="font-medium">{optionLabel}.</span>
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(question.lua_chon || [])];
                                newOptions[optionIndex] = e.target.value;
                                updateQuestion(index, { lua_chon: newOptions });
                              }}
                              placeholder={`Option ${optionLabel}`}
                              className="flex-1 rounded-[3px] border-none shadow-none"
                            />
                            {isCorrect && (
                              <span className="ml-2 text-sm font-semibold text-sky-600">
                                ✓ Đáp án đúng
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                </div>
              )}

              {question.loai === "dung_sai" && (
                <div>
                  <Label>Correct Answer</Label>
                  <RadioGroup
                    value={question.dap_an_dung?.toString()}
                    onValueChange={(value) =>
                      updateQuestion(index, { dap_an_dung: Number.parseInt(value) })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" />
                      <Label>True</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" />
                      <Label>False</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {question.loai === "tra_loi_ngan" && (
                <div>
                  <Label>Correct Answer</Label>
                  <Input
                    value={question.dap_an_dung?.toString()}
                    onChange={(e) => updateQuestion(index, { dap_an_dung: e.target.value })}
                    placeholder="Nhập đáp án đúng"
                  />
                </div>
              )}

              <div>
                <Label className="mb-3">
                  Giải thích (tuỳ chọn)
                </Label>
                <Textarea
                  id="question-description"
                  value={question.giai_thich || ''}
                  onChange={(e) => updateQuestion(index, { giai_thich: e.target.value })}
                  placeholder="Describe what this test covers"
                  className="rounded-[3px] h-12 text-base border-gray-300/70 shadow-none"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
