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
                 ${index.toString() === question.dap_an_dung?.toString()
                && 'bg-blue-100 border-blue-500 dark:bg-blue-900/50 dark:border-blue-700'}`} >
                {String.fromCharCode(65 + index)}.
                <span className="flex-grow">
                  <HighlightedText text={option} highlight={searchTerm} />
                </span>
                {index.toString() === question.dap_an_dung?.toString() && <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />}
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
    <Card className="mb-6 pt-0 py-0 overflow-hidden gap-0 rounded-[3px] shadow-none border-gray-300">
      <CardHeader className="flex items-center justify-between shadow-none bg-gray-100 dark:bg-gray-900/50 px-4 py-2">
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
          className="px-2 py-2 hover:bg-gray-300
          bg-transparent dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-[3px] h-auto w-auto cursor-pointer">
          {isExpanded ? <Minimize2 size={20} color='black' /> : <Maximize2 size={20} color='black' />}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4 px-4 py-4">
          <p className="text-gray-700 font-semibold dark:text-gray-300">
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

export default QuestionCard
