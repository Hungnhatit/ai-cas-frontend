'use client'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TestQuestion } from '@/types/interfaces/model'
import { CheckCircle, Maximize2, Minimize2 } from 'lucide-react';
import React, { useState } from 'react'
import HighlightedText from './HighlightText';

const QuestionCard = ({ question, index, searchTerm }: { question: TestQuestion, index: number, searchTerm: string }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getQuestionTypeLabel = (type: TestQuestion['loai_cau_hoi']) => {
    switch (type) {
      case 'trac_nghiem': return 'Trắc nghiệm';
      case 'tu_luan': return 'Tự luận';
      case 'nhieu_lua_chon': return 'Nhiều lựa chọn';
      case 'tra_loi_ngan': return 'Trả lời ngắn';
      default: return 'Không xác định';
    }
  };

  console.log('QUESTIONS: ', question);

  const renderAnswer = () => {
    switch (question.cau_hoi?.loai_cau_hoi) {
      case 'trac_nghiem':
        return (
          <ul className="space-y-3 mt-4">
            {question.cau_hoi?.cau_hoi_trac_nghiem && question.cau_hoi.cau_hoi_trac_nghiem.lua_chon_trac_nghiem?.map((option: any, index: number) => (
              <li key={index} className={
                `flex items-center p-3 rounded-[3px] border border-gray-300 text-sm cursor-pointer
                  ${(option.la_dap_an_dung !== 1) && 'hover:bg-gray-100'}                 
                 ${(option.la_dap_an_dung === 1) && '!bg-blue-100 !border-blue-500 hover:bg-blue-200'}`
              }>
                {String.fromCharCode(65 + index)}.
                <span className="flex-grow">
                  <HighlightedText text={`${option.noi_dung}`} highlight={searchTerm} />
                </span>
                {option.la_dap_an_dung === 1 && <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />}
              </li>
            ))}
          </ul >
        );
      case 'nhieu_lua_chon':
        return (
          <div className=''>
            <ul className="space-y-3 mt-4">
              {question.cau_hoi?.cau_hoi_nhieu_lua_chon && question.cau_hoi.cau_hoi_nhieu_lua_chon?.lua_chon?.map((option: any, index: number) => (
                <li key={option.ma_lua_chon} className={`flex items-center p-3 rounded-[3px] border border-gray-300 text-sm hover:bg-gray-100 cursor-pointer
                 ${option.la_dap_an_dung
                  && 'bg-blue-100 !border-blue-500 !hover:bg-blue-400'}`
                }>
                  <span className="flex-grow">
                    <HighlightedText text={`${option.noi_dung}`} highlight={searchTerm} />
                  </span>
                  {(option.la_dap_an_dung === true || option.la_dap_an_dung === 1) && <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />}
                </li>
              ))}
            </ul>
          </div >
        )
      case 'tu_luan':
        return (
          <div className="mt-4 p-4 rounded-md bg-green-50 border border-green-500 dark:bg-green-900/50 dark:border-green-700">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">Đáp án mẫu:</p>
            <p className="text-md text-gray-800 dark:text-gray-200"><HighlightedText text={String(question.cau_hoi.cau_hoi_tu_luan?.dap_an_mau)} highlight={searchTerm} /></p>
          </div>
        );
      default: return null;
    }
  }

  return (
    <Card className="mb-6 pt-0 py-0 overflow-hidden gap-0 rounded-[3px] shadow-none border-gray-300">
      <CardHeader className="flex items-center justify-between shadow-none bg-gray-100 dark:bg-gray-900/50 px-4 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h4 className="font-bold text-md text-gray-800 dark:text-gray-100">
            Câu hỏi {index + 1}
          </h4>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className='border-gray-400'>{getQuestionTypeLabel(question.cau_hoi.loai_cau_hoi)}</Badge>
            <Badge variant="default">{question.cau_hoi?.diem} điểm</Badge>
          </div>
        </div>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-2 py-2 hover:bg-gray-300
          bg-transparent dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-[3px] h-auto w-auto cursor-pointer">
          {isExpanded ? <Minimize2 size={20} color='black' /> : <Maximize2 size={20} color='black' />}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4 px-4 py-4">
          <p className="text-gray-700 font-semibold dark:text-gray-300">
            <HighlightedText text={question.cau_hoi?.tieu_de} highlight={searchTerm} />
          </p>
          {renderAnswer()}
          <div className="mt-4 p-4 rounded-[3px] bg-gray-100 dark:bg-gray-700/50 border border-dashed border-gray-300 dark:border-gray-600">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Giải thích:
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {question.cau_hoi?.cau_hoi_trac_nghiem || question.cau_hoi?.cau_hoi_tu_luan
                ? <HighlightedText text={question.cau_hoi.cau_hoi_trac_nghiem?.giai_thich_dap_an || question.cau_hoi.cau_hoi_tu_luan?.giai_thich} highlight={searchTerm} />
                : 'Không có giải thích chi tiết cho câu hỏi này'}
            </p>
          </div>

        </CardContent>
      )}
    </Card>
  )
}

export default QuestionCard
