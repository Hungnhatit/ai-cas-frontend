'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CalendarDays, ChevronLeft, Save } from 'lucide-react';
import React, { useEffect } from 'react'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { api, Course, Quiz, QuizQuestion } from '@/services/api'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import toast from 'react-hot-toast';
import { Criteria, Test, TestCategory, TestQuestion, TestSection } from '@/types/interfaces/model';
import { testService } from '@/services/test/testService';
import FormField from '../assignments/assignment-form-field';
import { Separator } from '../ui/separator';
import { categoryService } from '@/services/categoryService';
import { MultipleSelect } from './creation/MultipleSelect';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { competencyService } from '@/services/competency/competencyService';

const CreateTestPage = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true);
  const [criterias, setCriterias] = useState<Criteria[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [questions, setQuestions] = useState<Partial<TestQuestion>[]>([])
  const [sections, setSections] = useState<Partial<TestSection>[]>([]);
  const [categories, setCategories] = useState<TestCategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

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
    thoi_luong: 0,
    tong_diem: 0,
    do_kho: '',
    trang_thai: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, cates, criterias] = await Promise.all([
          api.getCourses(),
          categoryService.getCategories(),
          competencyService.getCriterias()
        ])
        setCourses(coursesData);
        setCategories(cates.data);
        setCriterias(criterias.data);
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, []);

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

  const createQuestion = (section: Partial<TestSection>, index: number) => {
    const baseQuestion = {
      ma_cau_hoi: index + 1,
      cau_hoi: '',
      diem: 10,
      ma_tieu_chi: undefined,
    };
    switch (section.loai_phan) {
      case 'trac_nghiem':
        return {
          ...baseQuestion,
          ma_cau_hoi: index + 1,
          cau_hoi: '',
          loai_cau_hoi: 'trac_nghiem',
          lua_chon: ["", "", "", ""],
          diem: 10,
        };
      case 'nhieu_lua_chon':
        return {
          ...baseQuestion,
          ma_cau_hoi: index + 1,
          cau_hoi: '',
          loai_cau_hoi: 'nhieu_lua_chon',
          lua_chon: ["", "", ""],
          dap_an_dung: [],
          diem: 10,
        };
      case 'tu_luan':
        return {
          ...baseQuestion,
          ma_cau_hoi: index + 1,
          cau_hoi: '',
          loai_cau_hoi: 'tu_luan',
          dap_an_mau: '',
          giai_thich: '',
          diem: 10,
        };
      default:
        return {
          ...baseQuestion,
          ma_cau_hoi: index + 1,
          cau_hoi: '',
          loai_cau_hoi: 'trac_nghiem',
          lua_chon: ["", "", "", ""],
          dap_an_dung: 0,
          diem: 10,
        };
    }
  }


  const addQuestion = (sectionIndex: number) => {
    const updatedSections = [...sections];
    const section = updatedSections[sectionIndex];

    if (!section.cau_hoi) {
      section.cau_hoi = [];
    }

    section.cau_hoi.push(createQuestion(section, section.cau_hoi.length));
    setSections(updatedSections);
  };

  const updateQuestion = (
    sectionIndex: number,
    questionIndex: number,
    updates: Partial<TestQuestion>
  ) => {
    const updatedSections = [...sections];
    const section = updatedSections[sectionIndex];
    if (section.cau_hoi && section.cau_hoi[questionIndex]) {
      section.cau_hoi[questionIndex] = { ...section.cau_hoi[questionIndex], ...updates };
    }
    setSections(updatedSections);
  };

  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    const updatedSections = [...sections];
    const section = updatedSections[sectionIndex];
    if (section.cau_hoi) {
      section.cau_hoi.splice(questionIndex, 1);
    }
    setSections(updatedSections);
  };

  // handle create test when submit
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
        danh_muc: selectedCategoryIds,
        sections: sections,
        trang_thai: 'ban_nhap' as const
      }

      console.log("[v0] Creating test:", testData);

      const res = await testService.createTest(testData);

      // if (res.status) {
      //   setIsCreateDialogOpen(false)
      //   setNewTest({ ...newTest, tieu_de: "", mo_ta: "", thoi_luong: 0});
      //   setQuestions([]);
      //   toast.success('Test has been created successfully!');
      //   window.history.back();
      // }
    } catch (error) {
      console.error("Failed to create test:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  console.log();

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
          <div className="grid md:grid-cols-4 gap-4 sm:grid-cols-2">
            <div>
              <Label className='mb-2 text-black' htmlFor="test-title">Tên bài thi</Label>
              <Input
                id="test-title"
                value={newTest.tieu_de}
                onChange={(e) => setNewTest({ ...newTest, tieu_de: e.target.value })}
                placeholder="Nhập tiêu đề bài thi"
                className="rounded-[3px] h-10 text-base border-gray-300 shadow-none"
              />
            </div>

            <div>
              <Label className='mb-2 text-black' htmlFor="test-title">Danh mục</Label>
              <Select>
                <SelectTrigger className='w-full !h-10 rounded-[3px] shadow-none border-gray-300 cursor-pointer'>
                  <SelectValue placeholder={selectedCategoryIds.length > 0 ? `${selectedCategoryIds.length} danh mục đã chọn` : "Chọn danh mục"} />
                </SelectTrigger>
                <SelectContent className='rounded-[3px] shadow-none border-gray-300'>
                  <SelectGroup>
                    <SelectLabel>Danh mục</SelectLabel>
                    {categories.map((cate) => (
                      <div key={cate.ma_danh_muc} className="flex items-center px-3 py-1 cursor-pointer hover:bg-gray-100 rounded">
                        <input
                          type="checkbox"
                          checked={selectedCategoryIds.includes(cate.ma_danh_muc)}
                          onChange={() => {
                            if (selectedCategoryIds.includes(cate.ma_danh_muc)) {
                              setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== cate.ma_danh_muc));
                            } else {
                              setSelectedCategoryIds([...selectedCategoryIds, cate.ma_danh_muc]);
                            }
                          }}
                          className="mr-2"
                        />
                        <span>{cate.ten_danh_muc}</span>
                      </div>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className='mb-2 text-black' htmlFor="test-title">Mức độ</Label>
              <Select value={newTest.do_kho} onValueChange={(value) => setNewTest({ ...newTest, do_kho: value })}>
                <SelectTrigger className="!h-10 w-full rounded-[3px] shadow-none border-gray-300 cursor-pointer">
                  <SelectValue placeholder="Chọn mức độ" />
                </SelectTrigger>
                <SelectContent className='rounded-[3px] shadonone border-gray-300 cursor-pointer'>
                  <SelectGroup>
                    <SelectLabel>Mức độ phân hoá bài thi</SelectLabel>
                    <SelectItem className='rounded-[3px] shadonone border-gray-300 cursor-pointer' value="de">Dễ</SelectItem>
                    <SelectItem className='rounded-[3px] shadonone border-gray-300 cursor-pointer' value="trung_binh">Trung bình</SelectItem>
                    <SelectItem className='rounded-[3px] shadonone border-gray-300 cursor-pointer' value="kho">Khó</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className='mb-2 text-black' htmlFor="test-duration">Thời lượng</Label>
              <Input
                id="test-duration"
                type="number"
                value={newTest.thoi_luong}
                onChange={(e) => setNewTest({ ...newTest, thoi_luong: Number.parseInt(e.target.value) })}
                min="5"
                max="180"
                className="rounded-[3px] h-10 text-base border-gray-300 shadow-none"
              />
            </div>
          </div>

          <div>
            <Label className='mb-2 text-black' htmlFor="test-description">Mô tả</Label>
            <Textarea
              id="test-description"
              value={newTest.mo_ta}
              onChange={(e) => setNewTest({ ...newTest, mo_ta: e.target.value })}
              placeholder="Mô tả nội dung của bài kiểm tra"
              className="rounded-[3px] h-28 text-base border-gray-300 shadow-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

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
      <Tabs defaultValue={sections[0]?.ma_phan?.toString()} className='space-y-2'>
        {sections.length > 0 && (
          <div className='flex items-center space-x-2'>
            <TabsList className='rounded-[3px] bg-gray-300'>
              {sections.map((section, index) => (
                <TabsTrigger key={index} value={section?.ma_phan?.toString()} className='rounded-[3px] cursor-pointer'>
                  Phần {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button className='cursor-pointer rounded-[3px]' onClick={addSection} >
              <Plus size={40} className="" />
              <span className=''>Thêm phần</span>
            </Button>
          </div>
        )}

        {sections.map((section, sectionIndex) => (
          <TabsContent key={sectionIndex} value={section?.ma_phan?.toString()}>
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
                    <SelectTrigger className='!h-10 w-full rounded-[3px] shadow-none cursor-pointer border-gray-300'>
                      <SelectValue placeholder="Chọn loại phần" className='h-10' />
                    </SelectTrigger>
                    <SelectContent className='rounded-[3px] shadow-none cursor-pointer border-gray-300'>
                      <SelectItem value="trac_nghiem" className='rounded-[3px] shadow-none cursor-pointer border-gray-300'>Trắc nghiệm</SelectItem>
                      <SelectItem value="tu_luan" className='rounded-[3px] shadow-none cursor-pointer border-gray-300'>Tự luận</SelectItem>
                      <SelectItem value="nhieu_lua_chon" className='rounded-[3px] shadow-none cursor-pointer border-gray-300'>Nhiều lựa chọn</SelectItem>
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

                <FormField label="Mô tả phần" className='text-black col-span-3'>
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

                      <div className="grid grid-cols-2 md:grid-cols-12 gap-4">
                        <div className='md:col-span-12'>
                          <Label className='mb-3'>Mô tả</Label>
                          <Input
                            type="text"
                            value={question.mo_ta}
                            onChange={(e) => updateQuestion(sectionIndex, index, { mo_ta: e.target.value })}
                            className="rounded-[3px] h-10 text-base border-gray-300 shadow-none"
                          />
                        </div>
                        <div className='md:col-span-6'>
                          <Label className='mb-3'>Điểm</Label>
                          <Input
                            type="number"
                            value={question.diem}
                            onChange={(e) => updateQuestion(sectionIndex, index, { diem: Number.parseInt(e.target.value) })}
                            className="rounded-[3px] h-10 text-base border-gray-300 shadow-none"
                          />
                        </div>
                        <div className='md:col-span-6'>
                          <Label className='mb-3'>Tiêu chí đánh giá</Label>
                          <Select
                            value={question.ma_tieu_chi?.toString()} 
                            onValueChange={(value) => updateQuestion(sectionIndex, index, {
                              ma_tieu_chi: Number(value)
                            })}                            
                          >
                            <SelectTrigger className="w-full !h-10 rounded-[3px] shadow-none border-gray-300 cursor-pointer">
                              <SelectValue className='cursor-pointer' placeholder="Chọn tiêu chí đánh giá" />
                            </SelectTrigger>
                            <SelectContent className='rounded-[3px] border-gray-300'>
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

                      {section.loai_phan === 'trac_nghiem' && (
                        <div>
                          <Label className='mb-3'>Tuỳ chọn trả lời</Label>
                          <div className="space-y-2">
                            <RadioGroup
                              value={question.dap_an_dung?.toString()}
                              onValueChange={(value) =>
                                updateQuestion(sectionIndex, index, { dap_an_dung: Number.parseInt(value) })
                              }
                            >
                              {question.lua_chon?.map((option, optionIndex) => {
                                const isSelected = question.dap_an_dung === optionIndex;
                                console.log('isSelected: ', isSelected);
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
                                      className={`flex-1 rounded-[3px] h-10 text-black border-gray-300 shadow-none cursor-pointer ${isSelected ? "bg-blue-50 border border-blue-500" : "border border-gray-300"}`}
                                    />
                                    {isSelected && (
                                      <span className="ml-2 text-sm font-semibold text-sky-600">
                                        ✓ Câu trả lời đúng
                                      </span>
                                    )}
                                  </div>
                                )
                              })}
                            </RadioGroup>
                          </div>
                        </div>
                      )}

                      {section.loai_phan === "tu_luan" && (
                        <div>
                          <Label className='mb-3'>Đáp án mẫu</Label>
                          <Textarea
                            value={question.dap_an_dung?.toString()}
                            onChange={(e) => updateQuestion(sectionIndex, index, { dap_an_mau: e.target.value })}
                            placeholder="Nhập đáp án mẫu"
                            className='shadow-none rounded-[3px] border-gray-300'
                          />
                        </div>
                      )}

                      {section.loai_phan === 'nhieu_lua_chon' && (
                        <div>
                          <Label className='mb-3'>Tuỳ chọn trả lời</Label>
                          <MultipleSelect
                            value={{
                              lua_chon: question.lua_chon as string[],
                              la_dap_an_dung: question.la_dap_an_dung as number[],
                            }}
                            onChange={(v) =>
                              updateQuestion(sectionIndex, index, {
                                lua_chon: v.lua_chon,
                                la_dap_an_dung: v.la_dap_an_dung,
                              })
                            } />
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
          </TabsContent>
        ))}
      </Tabs>

      {/* render add section */}
      {sections.length === 0 && (
        <div className='flex items-center justify-center'>
          <Button className='cursor-pointer rounded-[3px]' onClick={addSection} >
            <Plus size={40} className="" />
            <span className=''>Thêm phần</span>
          </Button>
        </div>
      )}



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
                    className="rounded-[3px] h-10 text-base border-gray-300 shadow-none"
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
                              className={`flex-1 rounded-[3px] h-10 text-black border-gray-300 shadow-none cursor-pointer ${isSelected ? "bg-blue-50 border border-blue-500" : "border border-gray-300"}`}
                            />
                            {isSelected && (
                              <span className="ml-2 text-sm font-semibold text-sky-600">
                                ✓ Câu trả lời đúng
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