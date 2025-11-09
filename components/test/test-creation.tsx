'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CalendarDays, ChevronLeft, Save } from 'lucide-react';
import React, { useEffect } from 'react'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { api, Course, Quiz, QuizQuestion } from '@/services/api'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import toast from 'react-hot-toast';
import { Test, TestQuestion, TestSection } from '@/types/interfaces/model';
import { testService } from '@/services/test/testService';
import FormField from '../assignments/assignment-form-field';
import { Separator } from '../ui/separator';

const CreateTestPage = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [questions, setQuestions] = useState<Partial<TestQuestion>[]>([])
  const [sections, setSections] = useState<Partial<TestSection>[]>([])

  const [newSection, setNewSection] = useState<Partial<TestSection>>({
    ten_phan: '',
    loai_phan: 'trac_nghiem',
    mo_ta: '',
    diem: 0,
  });
  const { user } = useAuth();
  const router = useRouter();

  const [newTest, setNewTest] = useState({
    tieu_de: '',
    mo_ta: '',
    thoi_luong: 30,
    tong_diem: 0,
    so_lan_lam_toi_da: 1,
    ngay_bat_dau: '',
    ngay_ket_thuc: '',
    do_kho: '',
    trang_thai: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData] = await Promise.all([api.getCourses()])
        setCourses(coursesData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // const addQuestion = () => {
  //   setQuestions([
  //     ...questions,
  //     {
  //       ma_cau_hoi: questions.length + 1,
  //       cau_hoi: "",
  //       loai: "trac_nghiem",
  //       lua_chon: ["", "", "", ""],
  //       dap_an_dung: 0,
  //       diem: 10,
  //     },
  //   ])
  // }

  const addSection = () => {
    setSections([
      ...sections,
      {
        ma_phan: sections.length + 1,
        ten_phan: newSection.ten_phan,
        loai_phan: newSection.loai_phan,
        mo_ta: newSection.mo_ta,
        diem: 0,
        cau_hoi: []
      }
    ]);
    setNewSection({ ten_phan: '', loai_phan: 'trac_nghiem', mo_ta: '' });
    toast.success('Đã thêm phần mới');
  }

  const addQuestion = (sectionIndex: number) => {
    const updatedSections = [...sections];
    if (!updatedSections[sectionIndex].cau_hoi) {
      updatedSections[sectionIndex].cau_hoi = [];
    }
    updatedSections[sectionIndex].cau_hoi!.push({
      ma_cau_hoi: (updatedSections[sectionIndex].cau_hoi!.length || 0) + 1,
      cau_hoi: "",
      loai: updatedSections[sectionIndex].loai_phan || "trac_nghiem",
      lua_chon: ["", "", "", ""],
      dap_an_dung: 0,
      diem: 10,
    });
    setSections(updatedSections);
  };

  console.log(sections)

  const updateQuestion = (sectionIndex: number, questionIndex: number, updates: Partial<TestQuestion>) => {
    const updatedSections = [...sections];
    const section = updatedSections[sectionIndex];
    if (section.cau_hoi && section.cau_hoi[questionIndex]) {
      section.cau_hoi[questionIndex] = { ...section.cau_hoi[questionIndex], ...updates };
    }
    setSections(updatedSections);
  };


  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  // handle create quiz when submit
  const handleCreateTest = async () => {
    try {
      const allQuestions = sections.flatMap((s) => s.cau_hoi || []);
      const total_points = questions.reduce((sum, q) => sum + (q.diem || 0), 0)

      const testData = {
        ...newTest,
        ma_giang_vien: user?.ma_nguoi_dung,
        cau_hoi: allQuestions,
        tong_diem: total_points,
        so_phan: sections.length,
        sections: sections as TestSection[],
        trang_thai: 'ban_nhap' as const,
        ngay_bat_dau: new Date(newTest.ngay_bat_dau).toISOString(),
        ngay_ket_thuc: new Date(newTest.ngay_ket_thuc).toISOString(),
      }

      console.log("[v0] Creating test:", testData)
      const res = await testService.createTest(testData);

      if (res.status) {
        setIsCreateDialogOpen(false)
        setNewTest({ ...newTest, tieu_de: "", mo_ta: "", thoi_luong: 30, so_lan_lam_toi_da: 3 });
        setQuestions([]);
        toast.success('Test has been created successfully!');
        window.history.back();
      }
    } catch (error) {
      console.error("Failed to create test:", error)
    }
  }
  
  const duplicateQuiz = async (test: Test) => {
    try {
      console.log("[v0] Duplicating test:", test.ma_kiem_tra)
      // In a real app, you would call api.duplicateQuiz(test.id)
    } catch (error) {
      console.error("Failed to duplicate quiz:", error)
    }
  }

  // const deleteQuiz = async (quizId: string) => {
  //   try {
  //     console.log("[v0] Deleting quiz:", quizId)
  //     // In a real app, you would call api.deleteQuiz(quizId)
  //     setQuizzes(quizzes.filter((q) => q.id !== quizId))
  //   } catch (error) {
  //     console.error("Failed to delete quiz:", error)
  //   }
  // }

  // const getQuizStats = () => {
  //   const total = quizzes.length
  //   const active = quizzes.filter((q) => q.status === "active").length
  //   const draft = quizzes.filter((q) => q.status === "draft").length
  //   const archived = quizzes.filter((q) => q.status === "archived").length

  //   return { total, active, draft, archived }
  // }

  // const stats = getQuizStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  console.log(newSection)

  return (
    <div className="">
      {/* header */}
      <div className='flex items-center bg-[#232f3e] -mx-4 -mt-4 p-5 mb-4'>
        <Button className='mr-2 cursor-pointer bg-transparent hover:opacity-75'>
          <ChevronLeft onClick={() => window.history.back()} className='h-10 w-10 rounded-sm text-white font-bold hover:bg-[#42546b] transition-all cursor-pointer' />
        </Button>
        <header className=''>
          <h1 className='text-2xl font-bold mb-2 text-white'>Tạo bài thi mới</h1>
          <div className='text-white'>Thiết lập một bài kiểm tra mới dành cho học viên của bạn</div>
        </header>
      </div>

      <div className='bg-card p-4 rounded-[3px] mb-4 border border-gray-300'>
        <div className="space-y-6">
          <h3 className='text-black font-bold text-lg'>Thông tin chung của bài thi</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className='mb-2 text-black' htmlFor="test-title">Tên bài thi</Label>
              <Input
                id="test-title"
                value={newTest.tieu_de}
                onChange={(e) => setNewTest({ ...newTest, tieu_de: e.target.value })}
                placeholder="Nhập tiêu đề bài thi"
                className="rounded-[3px] h-12 text-base border-gray-300 shadow-none"
              />
            </div>
            {/* <div>
              <Label className='mb-2 text-black' htmlFor="test-course">Course</Label>
              <Select value={newTest.course} onValueChange={(value) => setNewTest({ ...newTest, course: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.title}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
          </div>

          <div>
            <Label className='mb-2 text-black' htmlFor="test-description">Mô tả</Label>
            <Textarea
              id="test-description"
              value={newTest.mo_ta}
              onChange={(e) => setNewTest({ ...newTest, mo_ta: e.target.value })}
              placeholder="Mô tả nội dung của bài kiểm tra"
              className="rounded-[3px] text-base border-gray-300 shadow-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className='mb-2 text-black' htmlFor="test-duration">Thời lượng</Label>
              <Input
                id="test-duration"
                type="number"
                value={newTest.thoi_luong}
                onChange={(e) => setNewTest({ ...newTest, thoi_luong: Number.parseInt(e.target.value) })}
                min="5"
                max="180"
                className="rounded-[3px] h-12 text-base border-gray-300 shadow-none"
              />
            </div>
            <div>
              <Label className='mb-2 text-black' htmlFor="test-attempts">Số lần làm tối đa</Label>
              <Input
                id="test-attempts"
                type="number"
                value={newTest.so_lan_lam_toi_da}
                onChange={(e) => setNewTest({ ...newTest, so_lan_lam_toi_da: Number.parseInt(e.target.value) })}
                min="1"
                max="10"
                className="rounded-[3px] h-12 text-base border-gray-300 shadow-none"
              />
            </div>
          </div>

          {/* Dates Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-blue-600" size={20} />
              <h3 className="text-md font-semibold">Hạn nộp</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Ngày bắt đầu" required className='!text-black'>
                <div className="relative">
                  <Calendar className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                  <Input
                    type="datetime-local"
                    value={newTest.ngay_bat_dau}
                    onChange={(e) => setNewTest({ ...newTest, ngay_bat_dau: e.target.value })}
                    className="rounded-[3px] pl-10 h-12 border-gray-300 shadow-none"
                  />
                </div>
              </FormField>

              <FormField label="Ngày kết thúc" required className='text-black'>
                <div className="relative">
                  <Calendar className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                  <Input
                    type="datetime-local"
                    value={newTest.ngay_ket_thuc}
                    onChange={(e) => setNewTest({ ...newTest, ngay_ket_thuc: e.target.value })}
                    className="rounded-[3px] pl-10 h-12 border-gray-300 shadow-none"
                  />
                </div>
              </FormField>

              {/* {formData.trang_thai === 'submitted' && (
                <FormField label="Submission Date & Time" className='text-black'>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      type="datetime-local"
                      value={formData.ngay_nop || ''}
                      onChange={(e) => setNewTest({ ...newTest, han_nop: e.target.value })}
                      className="rounded-[3px] pl-10 h-12 border-gray-300 shadow-none"
                    />
                  </div>
                </FormField>
              )} */}
            </div>
          </div>


        </div>
      </div>

      {/* question sections */}
      <div className="flex items-center justify-between mb-4">
        <Label className='text-2xl font-bold'>Nội dung bài thi</Label>
        {/* <Button type="button" variant="outline" onClick={addQuestion} className='cursor-pointer rounded-[3px]'>
          <Plus className="h-4 w-4 mr-2" />
          Thêm câu hỏi
        </Button> */}

        <Button type="button" variant="outline" onClick={addSection} className='cursor-pointer rounded-[3px]'>
          <Plus className="h-4 w-4 mr-2" />
          Thêm phần
        </Button>
      </div>

      {/* {
        questions.length === 0 && (
          <div>
            <Card className='shadow-none'>
              <CardHeader className='justify-centerF'>
                <CardTitle className='text-center text-xl font-bold'>Chưa có câu hỏi nào được thêm vào</CardTitle>
                <CardDescription className='text-center text-md'>Click 'Thêm câu hỏi' để tạo câu hỏi của bạn</CardDescription>
              </CardHeader>
            </Card>
          </div>
        )
      } */}

      {
        sections.length === 0 && (
          <div className='mb-4'>
            <Card className='shadow-none'>
              <CardHeader className='justify-centerF'>
                <CardTitle className='text-center text-xl font-bold'>Chưa có phần nào được thêm vào</CardTitle>
                <CardDescription className='text-center text-md'>Click 'Thêm phần' để tạo phần bài thi của bạn</CardDescription>
              </CardHeader>
            </Card>
          </div>
        )
      }

      {/* add new section */}
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="bg-card border p-4 rounded-[3px] mb-4 border-gray-400">
          <h3 className="font-semibold text-lg mb-3 pb-3 border-b border-gray-300">Phần {sectionIndex + 1}</h3>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <FormField label="Tên phần">
              <Input
                value={section.ten_phan || ''}
                onChange={(e) => {
                  const updated = [...sections]
                  updated[sectionIndex] = { ...updated[sectionIndex], ten_phan: e.target.value };
                  setSections(updated);
                }}
                placeholder="Ví dụ: Phần 1 - Trắc nghiệm"
                className='h-10 rounded-[3px] text-black shadow-none border-gray-300'
              />
            </FormField>

            <FormField label="Loại phần" className='text-black'>
              <Select
                value={section.loai_phan}
                onValueChange={(val) => {
                  const updated = [...sections];
                  updated[sectionIndex] = { ...updated[sectionIndex], loai_phan: val as any };
                  setSections(updated);
                }}
              >
                <SelectTrigger className='w-full rounded-[3px] shadow-none cursor-pointer border-gray-300'>
                  <SelectValue placeholder="Chọn loại phần" />
                </SelectTrigger>
                <SelectContent className='rounded-[3px] shadow-none cursor-pointer border-gray-300'>
                  <SelectItem value="trac_nghiem" className='rounded-[3px] shadow-none cursor-pointer border-gray-300'>Trắc nghiệm</SelectItem>
                  <SelectItem value="tu_luan" className='rounded-[3px] shadow-none cursor-pointer border-gray-300'>Tự luận</SelectItem>
                  <SelectItem value="viet_prompt" className='rounded-[3px] shadow-none cursor-pointer border-gray-300'>Viết prompt</SelectItem>
                  <SelectItem value="xu_ly_tinh_huong" className='rounded-[3px] shadow-none cursor-pointer border-gray-300'>Xử lý tình huống</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Điểm" className='text-black'>
              <Input
                value={section.diem || 0}
                onChange={(e) => {
                  const updated = [...sections];
                  updated[sectionIndex] = { ...updated[sectionIndex], diem: Number(e.target.value) };
                  setSections(updated);
                }}
                placeholder="Nhập số điểm cho phần này"
                className='h-10 rounded-[3px] shadow-none border-gray-300'
              />
            </FormField>

            <FormField label="Mô tả phần" className='text-black'>
              <Textarea
                value={section.mo_ta}
                onChange={(e) => {
                  const updated = [...sections];
                  updated[sectionIndex] = { ...updated[sectionIndex], mo_ta: e.target.value };
                  setSections(updated);
                }}
                placeholder="Mô tả chi tiết nội dung cho phần này..."
                className='rounded-[3px] shadow-none border-gray-300'
              />
            </FormField>
          </div>

          <Button type="button" variant="outline" onClick={() => addQuestion(sectionIndex)} className='cursor-pointer rounded-[3px] mb-4'>
            <Plus className="h-4 w-4 mr-2" />
            Thêm câu hỏi
          </Button>

          {/* <Separator /> */}

          <div className="grid grid-cols-2 gap-3 space-y-4 mt-4 items-center">
            {section.cau_hoi?.map((question, index) => (
              <Card key={index} className='shadow-none border-gray-300 my-0 gap-3'>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">Câu hỏi {index + 1}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => removeQuestion(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-3">Nội dung câu hỏi</Label>
                    <Textarea
                      value={question.cau_hoi}
                      onChange={(e) => updateQuestion(sectionIndex, index, { cau_hoi: e.target.value })}
                      placeholder="Nhập vào nội dung câu hỏi"
                      className="rounded-[3px] text-base border-gray-300 shadow-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className='mb-3'>Mô tả</Label>
                      <Input
                        type="text"
                        value={question.mo_ta}
                        onChange={(e) => updateQuestion(sectionIndex, index, { mo_ta: e.target.value })}
                        className="rounded-[3px] h-12 text-base border-gray-300 shadow-none"
                      />
                    </div>
                    <div>
                      <Label className='mb-3'>Điểm</Label>
                      <Input
                        type="number"
                        value={question.diem}
                        onChange={(e) => updateQuestion(sectionIndex, index, { diem: Number.parseInt(e.target.value) })}
                        className="rounded-[3px] h-12 text-base border-gray-300 shadow-none"
                      />
                    </div>
                  </div>

                  {section.loai_phan === 'trac_nghiem' && (
                    <div>
                      <Label className='mb-3'>Answer Options</Label>
                      <div className="space-y-2">
                        <RadioGroup
                          value={question.dap_an_dung?.toString()}
                          onValueChange={(value) =>
                            updateQuestion(sectionIndex, index, { dap_an_dung: Number.parseInt(value) })
                          }
                        >
                          {question.lua_chon?.map((option, optionIndex) => {
                            const isSelected = question.dap_an_dung === optionIndex;
                            return (
                              <div key={optionIndex} className={`flex items-center space-x-2 rounded-md cursor-pointer`}
                                onClick={() => updateQuestion(sectionIndex, index, { dap_an_dung: optionIndex })}
                              >
                                <RadioGroupItem
                                  value={optionIndex.toString()}
                                  className='border-gray-300' />
                                <Input
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...(question.lua_chon || [])]
                                    newOptions[optionIndex] = e.target.value
                                    updateQuestion(sectionIndex, index, { lua_chon: newOptions })
                                  }}
                                  placeholder={`Lựa chọn ${optionIndex + 1}`}
                                  className={`flex-1 rounded-[3px] h-12 text-black border-gray-300 shadow-none cursor-pointer ${isSelected ? "bg-blue-50 border border-blue-500" : "border border-gray-300"}`}
                                />
                                {isSelected && (
                                  <span className="ml-2 text-sm font-semibold text-sky-600">
                                    ✓ Câu trả lời đúng sẽ là câu này
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </RadioGroup>
                      </div>
                    </div>
                  )}


                  {section.loai_phan === "dung_sai" && (
                    <div>
                      <Label className='mb-3'>Correct Answer</Label>
                      <RadioGroup
                        value={question.dap_an_dung?.toString()}
                        onValueChange={(value) =>
                          updateQuestion(sectionIndex, index, { dap_an_dung: Number.parseInt(value) })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" />
                          <Label className='mb-3'>True</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" />
                          <Label className='mb-3'>False</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {section.loai_phan === "viet_prompt" && (
                    <div>
                      <Label className='mb-3'>Đáp án đúng</Label>
                      <Textarea
                        value={question.dap_an_dung?.toString()}
                        onChange={(e) => updateQuestion(sectionIndex, index, { dap_an_dung: e.target.value })}
                        placeholder="Nhập đáp án đúng"
                        className='shadow-none rounded-[3px] border-gray-300'
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {section.cau_hoi && section?.cau_hoi.length > 0 && (
              <Button type="button" variant="outline" onClick={() => addQuestion(sectionIndex)} className='cursor-pointer rounded-[3px] place-self-center'>
                <Plus className="h-4 w-4 mr-2" />
                Thêm câu hỏi
              </Button>)
            }
          </div>
        </div>
      ))}

      <div className='flex items-center justify-center'>
        <Button className='cursor-pointer rounded-[3px]' onClick={addSection} >
          <Plus size={40} className="" />
          <span className=''>Thêm phần</span>
        </Button>
      </div>



      {/* <div className="grid grid-cols-2 gap-3 space-y-4 mb-4">
        {questions.map((question, index) => (
          <Card key={index} className='shadow-none border-gray-300 gap-1'>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Câu hỏi {index + 1}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => removeQuestion(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-3">Nội dung câu hỏi</Label>
                <Textarea
                  value={question.cau_hoi}
                  onChange={(e) => updateQuestion(sectionIndex,index, { cau_hoi: e.target.value })}
                  placeholder="Nhập vào nội dung câu hỏi"
                  className="rounded-[3px] text-base border-gray-300 shadow-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className='mb-3'>Loại câu hỏi</Label>
                  <Select
                    value={question.loai}
                    onValueChange={(value) =>
                      updateQuestion(sectionIndex,index, {
                        loai: value as TestQuestion["loai"],
                        lua_chon: value === "trac_nghiem" ? ["", "", "", ""] : undefined,
                      })
                    }
                  >
                    <SelectTrigger className='rounded-[3px] shadow-none border-gray-300 cursor-pointer'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='rounded-[3px]'>
                      <SelectItem className='cursor-pointer rounded-[3px]' value="trac_nghiem">Multiple Choice</SelectItem>
                      <SelectItem className='cursor-pointer rounded-[3px]' value="dung_sai">True/False</SelectItem>
                      <SelectItem className='cursor-pointer rounded-[3px]' value="tra_loi_ngan">Short Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className='mb-3'>Points</Label>
                  <Input
                    type="number"
                    value={question.diem}
                    onChange={(e) => updateQuestion(sectionIndex,index, { diem: Number.parseInt(e.target.value) })}
                    min="1"
                    max="50"
                    className="rounded-[3px] h-12 text-base border-gray-300 shadow-none"
                  />
                </div>
              </div>

              {question.loai === "trac_nghiem" && (
                <div>
                  <Label className='mb-3'>Answer Options</Label>
                  <div className="space-y-2">
                    <RadioGroup
                      value={question.dap_an_dung?.toString()}
                      onValueChange={(value) =>
                        updateQuestion(sectionIndex,index, { dap_an_dung: Number.parseInt(value) })
                      }
                    >
                      {question.lua_chon?.map((option, optionIndex) => {
                        const isSelected = question.dap_an_dung === optionIndex;
                        return (
                          <div key={optionIndex} className={`flex items-center space-x-2 rounded-md cursor-pointer`}
                            onClick={() => updateQuestion(sectionIndex,index, { dap_an_dung: optionIndex })}
                          >
                            <RadioGroupItem
                              value={optionIndex.toString()}
                              className='border-gray-300' />
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(question.lua_chon || [])]
                                newOptions[optionIndex] = e.target.value
                                updateQuestion(sectionIndex,index, { lua_chon: newOptions })
                              }}
                              placeholder={`Option ${optionIndex + 1}`}
                              className={`flex-1 rounded-[3px] h-12 text-black border-gray-300 shadow-none cursor-pointer ${isSelected ? "bg-blue-50 border border-blue-500" : "border border-gray-300"}`}
                            />
                            {isSelected && (
                              <span className="ml-2 text-sm font-semibold text-sky-600">
                                ✓ Câu trả lời đúng sẽ là câu này
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </RadioGroup>
                  </div>
                </div>
              )}

              {question.loai === "dung_sai" && (
                <div>
                  <Label className='mb-3'>Correct Answer</Label>
                  <RadioGroup
                    value={question.dap_an_dung?.toString()}
                    onValueChange={(value) =>
                      updateQuestion(sectionIndex,index, { dap_an_dung: Number.parseInt(value) })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" />
                      <Label className='mb-3'>True</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" />
                      <Label className='mb-3'>False</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {question.loai === "tra_loi_ngan" && (
                <div>
                  <Label className='mb-3'>Correct Answer</Label>
                  <Input
                    value={question.dap_an_dung?.toString()}
                    onChange={(e) => updateQuestion(sectionIndex,index, { dap_an_dung: e.target.value })}
                    placeholder="Enter the correct answer"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div> */}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className='cursor-pointer rounded-[3px]'>
          Huỷ
        </Button>
        <Button
          onClick={handleCreateTest}
          disabled={!newTest.tieu_de}
          className='cursor-pointer rounded-[3px]'
        >
          Tạo bài thi
        </Button>
      </div>
    </div>
  )
}

export default CreateTestPage