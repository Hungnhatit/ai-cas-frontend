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


// --- UI COMPONENTS ---
const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-300 dark:bg-yellow-500 text-black px-0.5 rounded">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};


const QuestionCard = ({ question, index, searchTerm }: { question: TestQuestion, index: number, searchTerm: string }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getQuestionTypeLabel = (type: TestQuestion['loai']) => {
    switch (type) {
      case 'trac_nghiem': return 'Trắc nghiệm';
      case 'tu_luan': return 'Tự luận';
      case 'dung_sai': return 'Đúng/Sai';
      case 'tra_loi_ngan': return 'Trả lời ngắn';
      default: return 'Không xác định';
    }
  };

  const renderAnswer = () => {
    switch (question.loai) {
      case 'trac_nghiem':
        return (
          <ul className="space-y-3 mt-4">
            {question.lua_chon && question.lua_chon.map((option, index) => (
              <li key={index} className={
                `flex items-center p-3 rounded-[3px] border border-gray-300 text-sm hover:bg-blue-50 cursor-pointer
                 ${index.toString() === question.dap_an_dung
                && 'bg-blue-100 border-blue-500 dark:bg-blue-900/50 dark:border-blue-700'}`} >
                {String.fromCharCode(65 + index)}.
                <span className="flex-grow">
                  <HighlightedText text={option} highlight={searchTerm} />
                </span>
                {index.toString() === question.dap_an_dung && <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />}
              </li>
            ))
            }
          </ul >
        );
      case 'dung_sai':
        return (
          <div className="mt-4 space-y-3">
            <div className={`flex items-center p-3 rounded-lg border text-sm ${question.dap_an_dung === true ? 'bg-green-50 border-green-500 dark:bg-green-900/50 dark:border-green-700' : 'bg-gray-50 border-gray-200 dark:bg-gray-700/50 dark:border-gray-600'}`}>
              {question.dap_an_dung === true && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />}
              <span>Dung</span>
            </div>
            <div className={`flex items-center p-3 rounded-lg border text-sm ${question.dap_an_dung === false ? 'bg-green-50 border-green-500 dark:bg-green-900/50 dark:border-green-700' : 'bg-gray-50 border-gray-200 dark:bg-gray-700/50 dark:border-gray-600'}`}>
              {question.dap_an_dung === false && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />}
              <span>Sai</span>
            </div>
          </div>
        );
      case 'tra_loi_ngan':
      case 'tu_luan':
        return (
          <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-500 dark:bg-green-900/50 dark:border-green-700">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">Dap an dung:</p>
            <p className="text-sm text-gray-800 dark:text-gray-200"><HighlightedText text={String(question.dap_an_dung)} highlight={searchTerm} /></p>
          </div>
        );
      default: return null;
    }
  }

  return (
    <Card className="mb-6 pt-0 overflow-hidden gap-0 rounded-[3px] shadow-none border-gray-300">
      <CardHeader className="flex items-center justify-between shadow-none bg-gray-100 dark:bg-gray-900/50 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h4 className="font-bold text-md text-gray-800 dark:text-gray-100">
            Câu hỏi {index + 1}
          </h4>
          <div className="flex items-center gap-4">
            <Badge variant="outline">{getQuestionTypeLabel(question.loai)}</Badge>
            <Badge variant="default">{question.diem} điểm</Badge>
          </div>
        </div>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-2 py-2 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full h-auto w-auto cursor-pointer">
          {isExpanded ? <Minimize2 size={20} color='black' /> : <Maximize2 size={20} color='black' />}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300 mt-4">
            <HighlightedText text={question.cau_hoi} highlight={searchTerm} />
          </p>
          {renderAnswer()}
          <div className="mt-4 p-4 rounded-[3px] bg-gray-100 dark:bg-gray-700/50 border border-dashed border-gray-300 dark:border-gray-600">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Giải thích:
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {question.giai_thich
                ? <HighlightedText text={question.giai_thich} highlight={searchTerm} />
                : 'Không có giải thích chi tiết cho câu hỏi này'}
            </p>
          </div>

        </CardContent>
      )}
    </Card>
  )
}

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
      console.log(res.data);
    }
    fetchTest();
  }, [test_id]);

  console.log(test);

  const danh_muc = test ? JSON.parse(test?.danh_muc) : [];
  console.log(danh_muc);

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

  console.log(filteredQuestions);

  const getDifficultyBadge = (difficulty: Test['do_kho'] | null) => {
    switch (difficulty) {
      case 'de': return <Badge variant='default' className="capitalize">De</Badge>;
      case 'trung_binh': return <Badge variant='outline' className="capitalize">Trung bình</Badge>;
      case 'kho': return <Badge variant='destructive' className="capitalize">Kho</Badge>;
    }
  }

  const getStatusBadge = (status: Test['trang_thai']) => {
    switch (status) {
      case 'hoat_dong': return <Badge variant='default' className="capitalize">Hoạt động</Badge>;
      case 'ban_nhap': return <Badge variant='outline' className="capitalize">Ban Nhap</Badge>;
      case 'luu_tru': return <Badge variant='destructive' className="capitalize">Lưu trữ</Badge>;
    }
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100">
      <div className=" mx-auto p-4">
        {/* Header */}
        <header className="flex items-start justify-between mb-4">
          <div>
            <CardDescription className='text-lg'>Chi tiết bài kiểm tra</CardDescription>
            <CardTitle className="text-3xl font-bold mt-1 mb-2">{test?.tieu_de}</CardTitle>
            <div className='flex flex-wrap gap-2 items-center'>
              <Tag size={17} className='' />
              {danh_muc && danh_muc.map((item: any, index: number) =>
                <Badge key={index} className=''>{item}</Badge>
              )}
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl">{test?.mo_ta}</p>
          </div>
          <div>
            <Button onClick={() => router.push(`/tests/${test_id}/edit`)} className='cursor-pointer rounded-[3px]'>Chỉnh sửa</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Questions */}
          <main className="lg:col-span-2">
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

            <div className="mt-6">
              {filteredQuestions?.map((q, i) => (
                <QuestionCard
                  key={q.ma_cau_hoi}
                  question={q}
                  index={test?.cau_hoi.findIndex(originalQ => originalQ.ma_cau_hoi === q.ma_cau_hoi)}
                  searchTerm={searchTerm}
                />
              ))}
            </div>
          </main>

          {/* Sidebar: Exam Info */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className='rounded-[3px] shadow-none'>
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
                    <InfoCard icon={HelpCircle} title="Số câu hỏi" value={test?.cau_hoi_kiem_tra.length} />
                    <InfoCard icon={Star} title="Số lần làm tối đa" value={test?.so_lan_lam_toi_da} />
                  </div>
                  <Separator />
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Calendar className="w-4 h-4" /> Ngày bắt đầu</span>
                      <span className="font-medium">
                        {formatDate(test?.ngay_bat_dau)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Calendar className="w-4 h-4" /> Ngày kết thúc</span>
                      <span className="font-medium">{formatDate(test?.ngay_ket_thuc)}</span>
                    </div>
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