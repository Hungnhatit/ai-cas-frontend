'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TestQuestion } from "@/types/interfaces/model";
import { CheckCircle, Maximize2, Minimize2 } from "lucide-react";
import { useMemo, useState } from "react";
import QuestionCard from "./QuestionCard";

interface QuestionListProps {
  questions: Partial<TestQuestion>[],
  searchTerm: string
}
const DetailQuestionList = ({ questions, searchTerm }: QuestionListProps) => {
  console.log('questions: ', questions);

  const filteredQuestions = useMemo(() => {
    if (!searchTerm) return questions;
    const lowercasedFilter = searchTerm.toLowerCase();
    return questions.filter(q => {
      const optionsText = q.lua_chon ? q.lua_chon.join(' ') : '';
      return (
        q.cau_hoi?.toLowerCase().includes(lowercasedFilter) ||
        optionsText.toLowerCase().includes(lowercasedFilter) ||
        (q.giai_thich_dap_an && q.giai_thich_dap_an.toLowerCase().includes(lowercasedFilter)) ||
        String(q.dap_an_dung).toLowerCase().includes(lowercasedFilter)
      );
    });
  }, [questions, searchTerm]);


  return (
    <div>
      {filteredQuestions?.map((question, index) => (
        <QuestionCard
          key={question.ma_cau_hoi}
          question={question}
          index={index}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  )
}

export default DetailQuestionList;