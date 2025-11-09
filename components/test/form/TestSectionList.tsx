'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TestQuestion, TestSection } from '@/types/interfaces/model';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import QuestionList from './TestQuestionList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TestSectionProps {
  sections: TestSection[];
  setSections: (value: Partial<TestSection>[]) => void;
}

const TestSectionList = ({ sections, setSections }: TestSectionProps) => {
  const [questions, setQuestions] = useState<Partial<TestQuestion>[]>([]);
  console.log(sections);

  // handle add question
  const addQuestion = (sectionIndex: number) => {
    const updatedSections = [...sections];
    const section = updatedSections[sectionIndex];
    section.cau_hoi = [
      ...(section.cau_hoi || []),
      {        
        cau_hoi: "",
        loai: "trac_nghiem",
        lua_chon: ["", "", "", ""],
        dap_an_dung: 0,
        diem: 10,
      },
    ];
    setSections(updatedSections);
  };

  const updateQuestions = (sectionIndex: number, newQuestions: Partial<TestQuestion>[]) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].cau_hoi = newQuestions;
    setSections(updatedSections);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        {/* <Label className='text-xl font-bold'>Danh sách câu hỏi</Label> */}
        {/* <Button type="button" variant="outline" onClick={() => { }} className='cursor-pointer rounded-[3px]'>
          <Plus className="h-4 w-4 mr-2" />
          Thêm phần
        </Button> */}
      </div>

      <div>
        <Tabs defaultValue={sections[0]?.ma_phan?.toString()}>
          <TabsList className='rounded-[3px] bg-gray-300'>
            {sections.map((section, index) => (
              <TabsTrigger key={index} value={section?.ma_phan?.toString()} className='rounded-[3px] cursor-pointer'>{section.ten_phan}</TabsTrigger>
            ))}
          </TabsList>
          {sections.map((section, index) => (
            <TabsContent key={index} value={section.ma_phan.toString()}>
              <QuestionList
                questions={section.cau_hoi || []}
                setQuestions={(newQuestions) => updateQuestions(index, newQuestions)}
                onAddQuestion={() => addQuestion(index)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

export default TestSectionList