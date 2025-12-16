"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Clock, CheckCircle, HelpCircle, Star, FileText, Calendar, User, Tag, Maximize2, Minimize2 } from 'lucide-react';
import { testService } from '@/services/test/testService';
import { Button } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Test, TestQuestion } from '@/types/interfaces/model';
import { formatDate } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DetailQuestionList from './DetailQuestionList';

interface TestDetailProps {
  test_id: number
}

// --- INTERFACES (Based on your model) ---
export interface Instructor {
  ma_giang_vien: number;
  ten: string;
  email: string;
  so_dien_thoai?: string;
  anh_giang_vien: string;
  tieu_su?: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

// --- MOCK DATA ---
const mockInstructor: Instructor = {
  ma_giang_vien: 101,
  ten: "Nguyen Van An",
  email: "an.nv@university.edu.vn",
  anh_giang_vien: "https://placehold.co/100x100/EFEFEF/333?text=NVA",
  ngay_tao: "2023-01-10T10:00:00Z",
  ngay_cap_nhat: "2023-09-01T14:30:00Z",
};


const InfoCard = ({ icon: Icon, title, value, className = '' }: { icon: React.ElementType, title: string, value: number, className?: string }) => (
  <div className={`flex items-center gap-4 p-3 rounded-[3px] border border-gray-300 bg-gray-50 dark:bg-gray-700/50 ${className}`}>
    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-sm">
      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);


/**
 * --------------------------- MAIN PAGE COMPONENT --------------------------- 
 * */
const ExamDetailsPage = ({ test_id }: TestDetailProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [test, setTest] = useState<Test | null>(null);
  const exam = test;
  const router = useRouter();

  useEffect(() => {
    const fetchTest = async () => {
      const res = await testService.getTestById(test_id);
      if (res.success) {
        setTest(res.data);
      }
    }
    fetchTest();
  }, [test_id]);

  const danh_muc = test ? test.danh_muc : [];

  const filteredQuestions = useMemo(() => {
    if (!searchTerm) return test?.cau_hoi;
    const lowercasedFilter = searchTerm.toLowerCase();
    return test?.cau_hoi.filter(q => {
      const optionsText = q.lua_chon ? q.lua_chon.join(' ') : '';
      return (
        q.cau_hoi.toLowerCase().includes(lowercasedFilter) ||
        optionsText.toLowerCase().includes(lowercasedFilter) ||
        (q.giai_thich && q.giai_thich.toLowerCase().includes(lowercasedFilter)) ||
        String(q.dap_an_dung).toLowerCase().includes(lowercasedFilter)
      );
    });
  }, [test?.cau_hoi, searchTerm]);

  const parsedQuestions = (test?.cau_hoi || []).map((q: any) => ({
    ...q,
    lua_chon: typeof q.lua_chon === 'string' ? JSON.parse(q.lua_chon) : q.lua_chon,
    dap_an_dung: q.dap_an_dung !== undefined ? Number(q.dap_an_dung) : undefined,
  }));

  const mergedSections = (test?.phan_kiem_tra || []).map((section: any) => ({
    ...section,
    cau_hoi: parsedQuestions.filter((q: any) => q.ma_phan === section.ma_phan),
  }));



  const getDifficultyBadge = (difficulty: Test['do_kho'] | null) => {
    switch (difficulty) {
      case 'de': return <Badge variant='default' className="capitalize">Dễ</Badge>;
      case 'trung_binh': return <Badge variant='outline' className="capitalize">Trung bình</Badge>;
      case 'kho': return <Badge variant='destructive' className="capitalize">Khó</Badge>;
    }
  }

  const getStatusBadge = (status: Test['trang_thai']) => {
    switch (status) {
      case 'hoat_dong': return <Badge variant='default' className="capitalize">Hoạt động</Badge>;
      case 'ban_nhap': return <Badge variant='outline' className="capitalize">Ban Nhap</Badge>;
      case 'luu_tru': return <Badge variant='destructive' className="capitalize">Lưu trữ</Badge>;
    }
  }

  // console.log('test: ', test);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100">
      <div className="">
        {/* Header */}
        <header className="bg-[#232f3e] -mx-8 -mt-8 p-8 flex items-start justify-between mb-4 text-white">
          <div>
            <CardTitle className="text-2xl font-bold mt-1 mb-2">
              Chi tiết bài kiểm tra: "{test?.tieu_de}"
            </CardTitle>
            <CardDescription className='text-md text-white'>
              {test?.mo_ta}
            </CardDescription>
            <div className='flex flex-wrap gap-2 items-center mt-2'>
              <Tag size={17} className='' />
              {danh_muc && danh_muc.map((item: any, index: number) =>
                <Badge key={index} className=''>{item.ten_danh_muc}</Badge>
              )}
            </div>
          </div>
          <div>
            <Button onClick={() => router.push(`/tests/${test_id}/edit`)} className='cursor-pointer rounded-[3px]'>Chỉnh sửa</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Questions */}
          <main className="lg:col-span-2 space-y-4">
            <div className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm trong câu hỏi, đáp án, giải thích,..."
                  className="pl-12 py-2 text-[15px] rounded-[3px] shadow-none border border-gray-300 italic"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {searchTerm && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Tìm thấy {filteredQuestions?.length} kết quả cho '{searchTerm}'
                </p>
              )}
            </div>
            <div className="">
              {test && test?.phan_kiem_tra?.length > 0 && (
                <Tabs defaultValue={test.phan_kiem_tra[0].ma_phan.toString()} className="space-y-2">
                  <TabsList className="rounded-[3px] bg-gray-200">
                    {test.phan_kiem_tra.map((section, index) => (
                      <TabsTrigger key={index} value={section.ma_phan.toString()} className="rounded-[3px] cursor-pointer">
                        Phần {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {test.phan_kiem_tra.map((section, index) => (
                    <TabsContent key={index} value={section.ma_phan.toString()}>
                      <div className="space-y-3">
                        <div className="space-y-1 px-4 py-4 bg-gray-200">
                          <div><span className="font-bold">Tên phần: </span>{section.ten_phan}</div>
                          <div><span className="font-bold">Mô tả: </span>{section.mo_ta}</div>
                        </div>

                        <DetailQuestionList
                          searchTerm={searchTerm}
                          questions={section.phan_kiem_tra_cau_hoi}
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}

              {/* <Tabs defaultValue={mergedSections[0]?.ma_phan?.toString()}>
                <TabsList>
                  {mergedSections.map((section, index) => (
                    <TabsTrigger key={index} value={section?.ma_phan?.toString()}>
                      {section.ten_phan}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {mergedSections.map((section, index) => (
                  <TabsContent key={index} value={section?.ma_phan?.toString()}>
                    <DetailQuestionList
                      questions={section.cau_hoi}
                    />
                  </TabsContent>
                ))}
              </Tabs> */}

              {/* {filteredQuestions?.map((q, i) => (
                <QuestionCard
                  key={q.ma_cau_hoi}
                  question={q}
                  index={test?.cau_hoi.findIndex(originalQ => originalQ.ma_cau_hoi === q.ma_cau_hoi)}
                  searchTerm={searchTerm}
                />
              ))} */}
            </div>
          </main>

          {/* Sidebar: Exam Info */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className='rounded-[3px] shadow-none gap-2'>
                <CardHeader>
                  <CardTitle className='text-lg'>Thông tin tổng quan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {getStatusBadge(test?.trang_thai)}
                    {getDifficultyBadge(test?.do_kho)}
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 gap-4">
                    <InfoCard icon={Clock} title="Thời gian làm bài" value={`${test?.thoi_luong} phút`} />
                    <InfoCard icon={CheckCircle} title="Tổng điểm" value={test?.tong_diem} />
                    <InfoCard icon={HelpCircle} title="Tổng số câu hỏi" value={test?.tong_so_cau_hoi} />
                    {/* <InfoCard icon={Star} title="Số lần làm tối đa" value={test?.so_lan_lam_toi_da} /> */}
                  </div>                                 
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3">Giảng viên</h4>
                    <div className="flex items-center gap-3">
                      <img src={test?.giang_vien?.anh_giang_vien} alt={test?.giang_vien} className="w-12 h-12 rounded-full" />
                      <div>
                        <p className="font-semibold">{test?.giang_vien?.ten}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{test?.giang_vien?.email}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ExamDetailsPage;