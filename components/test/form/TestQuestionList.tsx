'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, PlusCircle, Trash2 } from 'lucide-react';
import { Criteria, TestQuestion } from '@/types/interfaces/model';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MultipleSelect } from '../creation/MultipleSelect';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuestionListProps {
  sectionType: string,
  questions: Partial<TestQuestion>[]
  setQuestions: (value: Partial<TestQuestion>[]) => void;
  onAddQuestion: () => void;
  criterias: Criteria[];
}

const QuestionList = ({ sectionType, questions, setQuestions, onAddQuestion, criterias }: QuestionListProps) => {
  const updateQuestion = (index: number, updates: Partial<TestQuestion>) => {
    setQuestions(questions.map((q, i) => (
      i === index
        ? { ...q, ...updates }
        : q)));
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  // console.log('CRITERIAS: ', criterias);
  console.log('QUESTIONS: ', questions);

  return (
    <div className='space-y-4 bg-card p-4 rounded-[3px] shadow-xs mb-4 border border-gray-300'>
      {questions.length === 0 && (
        <div>
          <Card className='shadow-none'>
            <CardHeader className='justify-center'>
              <CardTitle className='text-center text-xl font-bold'>Chưa có câu hỏi nào được thêm vào</CardTitle>
              <CardDescription className='text-center text-md'>Click 'Thêm câu hỏi' để tạo câu hỏi của bạn</CardDescription>
            </CardHeader>
            <CardContent className='flex items-center justify-center'>
              <Button type="button" variant="outline" onClick={onAddQuestion} className='cursor-pointer rounded-[3px]'>
                <Plus className="h-4 w-4 mr-2" />
                Thêm câu hỏi
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* <div className="space-y-4 mt-3"> */}
      {questions.length > 0 && (
        <div className='grid xl:grid-cols-2 md:grid-cols-1 gap-4'>
          {questions.map((question, index) => (
            <Card key={index} className='gap-2 py-3 shadow-none border-gray-300'>
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
                    value={question?.cau_hoi?.tieu_de?.toString()}
                    onChange={(e) => updateQuestion(index, {
                      cau_hoi: {
                        ...question.cau_hoi,
                        tieu_de: e.target.value,
                      }
                    })}
                    placeholder="Nhập nội dung câu hỏi"
                    className='rounded-[3px] shadow-none border-gray-300'
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className='mb-3'>Điểm</Label>
                    <Input
                      type="number" value={question.cau_hoi?.diem || ''} min="1" max="50"
                      onChange={(e) => updateQuestion(index, {
                        cau_hoi: {
                          ...question.cau_hoi,
                          diem: Number.parseInt(e.target.value)
                        }
                      })}
                      className='rounded-[3px] h-10 border-gray-300 shadow-none'
                    />
                  </div>
                  <div>
                    <Label className='mb-3'>Tiêu chí</Label>
                    <Select
                      value={question?.ma_tieu_chi?.toString() || question.cau_hoi?.ma_tieu_chi?.toString()}
                      onValueChange={(value) => updateQuestion(index, {
                        ma_tieu_chi: Number(value)
                      })}
                    >
                      <SelectTrigger className="w-full !h-10 rounded-[3px] shadow-none border-gray-300 cursor-pointer">
                        <SelectValue placeholder="Chọn tiêu chí đánh giá" />
                      </SelectTrigger>
                      <SelectContent className='rounded-[3px] border-gray-300 z-[9999]'>
                        <SelectGroup>
                          <SelectLabel>Danh sách tiêu chí</SelectLabel>
                          {criterias?.map((item) => (
                            <SelectItem
                              key={item.ma_tieu_chi}
                              value={item.ma_tieu_chi.toString()}
                              className="cursor-pointer"
                            >
                              <span className="">{item.ten_tieu_chi}</span>
                              {/* Có thể hiển thị thêm tooltip mô tả nếu cần */}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/*
                 * Question type: single-choice
                 */}
                {sectionType === "trac_nghiem" && (
                  <div>
                    <Label className="mb-3">Tuỳ chọn trả lời</Label>
                    {(() => {
                      const correctIndex =
                        question?.cau_hoi?.cau_hoi_trac_nghiem?.lua_chon_trac_nghiem?.findIndex(
                          (opt: any) => opt.la_dap_an_dung === 1
                        );

                      // console.log('correctIndex: ', correctIndex)

                      return (
                        <RadioGroup
                          value={correctIndex?.toString()}
                          onValueChange={(value) => {
                            const newIndex = Number(value);
                            const newOptions =
                              question?.cau_hoi?.cau_hoi_trac_nghiem?.lua_chon_trac_nghiem?.map(
                                (opt: any, idx: number) => ({
                                  ...opt,
                                  la_dap_an_dung: idx === newIndex ? 1 : 0,
                                })
                              );

                            updateQuestion(index, {
                              cau_hoi_trac_nghiem: {
                                ...question?.cau_hoi?.cau_hoi_trac_nghiem,
                                lua_chon_trac_nghiem: newOptions,
                              },
                            });
                          }}
                        >
                          {question?.cau_hoi?.cau_hoi_trac_nghiem?.lua_chon_trac_nghiem?.map(
                            (option: any, optionIndex: number) => {
                              const isSelected = correctIndex === optionIndex;

                              return (
                                <div
                                  key={optionIndex}
                                  className="flex items-center space-x-2 rounded-md cursor-pointer"
                                  onClick={() =>
                                    updateQuestion(index, {
                                      cau_hoi: {
                                        ...question.cau_hoi,
                                        cau_hoi_trac_nghiem: {
                                          ...question.cau_hoi?.cau_hoi_trac_nghiem,
                                          lua_chon_trac_nghiem:
                                            question.cau_hoi!.cau_hoi_trac_nghiem!.lua_chon_trac_nghiem?.map(
                                              (opt: any, idx: number) => ({
                                                ...opt,
                                                la_dap_an_dung: idx === optionIndex ? 1 : 0,
                                              })
                                            ),
                                        }
                                      }
                                    })
                                  }
                                >
                                  <RadioGroupItem value={optionIndex.toString()} />

                                  <Input
                                    value={option.noi_dung}
                                    placeholder={`Lựa chọn ${optionIndex + 1}`}
                                    onChange={(e) => {
                                      const newOptions = [
                                        ...question?.cau_hoi?.cau_hoi_trac_nghiem?.lua_chon_trac_nghiem,
                                      ];
                                      newOptions[optionIndex] = {
                                        ...newOptions[optionIndex],
                                        noi_dung: e.target.value,
                                      };

                                      updateQuestion(index, {
                                        cau_hoi: {
                                          ...question.cau_hoi,
                                          cau_hoi_trac_nghiem: {
                                            ...question?.cau_hoi?.cau_hoi_trac_nghiem,
                                            lua_chon_trac_nghiem: newOptions,
                                          },
                                        }
                                      });
                                    }}
                                    className={`flex-1 h-12 rounded-[3px] cursor-pointer ${isSelected
                                      ? "bg-blue-50 border border-blue-500"
                                      : "border-gray-300"
                                      }`}
                                  />

                                  {isSelected && (
                                    <span className="ml-2 text-sm font-semibold text-sky-600">
                                      ✓ Câu trả lời đúng
                                    </span>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </RadioGroup>
                      );
                    })()}
                  </div>
                )}

                {sectionType === "tu_luan" && (
                  <div>
                    <Label className='mb-3'>Đáp án mẫu</Label>
                    <Textarea
                      value={question.cau_hoi?.cau_hoi_tu_luan?.dap_an_mau}
                      onChange={(e) => updateQuestion(index, {
                        cau_hoi: {
                          ...question.cau_hoi,
                          cau_hoi_tu_luan: {
                            ...(question.cau_hoi?.cau_hoi_tu_luan),
                            dap_an_mau: e.target.value
                          }
                        }
                      })}
                      placeholder="Nhập đáp án mẫu"
                      className='shadow-none rounded-[3px] border-gray-300'
                    />
                  </div>
                )}

                {sectionType === 'nhieu_lua_chon' && (
                  <div>
                    <Label>Tuỳ chọn</Label>
                    <MultipleSelect
                      value={{
                        lua_chon:
                          question?.cau_hoi?.cau_hoi_nhieu_lua_chon?.lua_chon?.map(
                            (opt: any) => opt.noi_dung
                          ) || [],
                        la_dap_an_dung:
                          (question?.cau_hoi?.cau_hoi_nhieu_lua_chon?.lua_chon || [])
                            .map((opt: any, idx: number) => {
                              const isCorrect = opt.la_dap_an_dung === 1 || opt.la_dap_an_dung === true;
                              return isCorrect ? idx : -1;
                            })
                            .filter((idx: number) => idx !== -1) || []
                      }}
                      onChange={(v) => {
                        const newOptions = v.lua_chon.map((content, index) => ({
                          noi_dung: content,
                          la_dap_an_dung: v.la_dap_an_dung.includes(index) ? 1 : 0,
                        }));

                        updateQuestion(index, {
                          cau_hoi: {
                            ...question.cau_hoi,
                            cau_hoi_nhieu_lua_chon: {
                              lua_chon: newOptions, // Cấu trúc [{noi_dung: string, la_dap_an_dung: number}]
                            },
                          },
                        });
                      }}
                    />

                  </div>
                )}

                <div>
                  <Label className="mb-3">
                    Giải thích (tuỳ chọn)
                  </Label>
                  <Textarea
                    id="question-description"
                    value={question.giai_thich_dap_an || ''}
                    onChange={(e) => updateQuestion(index, { giai_thich_dap_an: e.target.value })}
                    placeholder="Mô tả những gì bài kiểm tra này bao gồm"
                    className="rounded-[3px] h-12 text-base border-gray-300/70 shadow-none"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button type="button" variant="outline" onClick={onAddQuestion} className='cursor-pointer rounded-[3px]'>
            <Plus className="h-4 w-4 mr-2" />
            Thêm câu hỏi
          </Button>
        </div>
      )}

    </div>
  );
};

export default QuestionList;
