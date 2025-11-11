'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TestQuestion, TestSection } from '@/types/interfaces/model';
import { Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import QuestionList from './TestQuestionList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TestSectionProps {
  sections: TestSection[];
  setSections: (value: Partial<TestSection>[]) => void;
  updateSection: (index: number, updates: Partial<TestSection>) => void;
  removeSection: (index: number) => void
}

const TestSectionList = ({ sections, setSections, updateSection }: TestSectionProps) => {
  // handle add section
  const addSection = () => {
    const newSection: Partial<TestSection> = {
      ma_phan: Date.now(),
      ten_phan: `Phần ${sections.length + 1}`,
      cau_hoi: [],
    };

    setSections([...sections, newSection]);
  };

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
        <Tabs defaultValue={sections[0]?.ma_phan?.toString()} className='space-y-2'>
          <div className='flex items-center space-x-2'>
            <TabsList className='rounded-[3px] bg-gray-300'>
              {sections.map((section, index) => (
                <TabsTrigger key={index} value={section?.ma_phan?.toString()} className='rounded-[3px] cursor-pointer'>
                  Phần {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button className='rounded-[3px] cursor-pointer' onClick={addSection}>
              <Plus />
              Thêm phần mới
            </Button>
          </div>
          {sections.map((section, index) => (
            <TabsContent key={index} value={section.ma_phan.toString()} className='space-y-2'>
              <div className='bg-card border rounded-[3px] p-4 space-y-4'>
                <div>
                  <div>
                    <Label className='mb-2'>Tên phần: </Label>
                    <Input
                      value={section.ten_phan}
                      onChange={(e) => updateSection(index, { ten_phan: e.target.value })}
                      className='rounded-[3px] shadow-none border-gray-300' />
                  </div>
                  <div>
                    <Label className='mb-2'>Mô tả</Label>
                    <Textarea
                      id='section_description'
                      value={section.mo_ta || ''}
                      onChange={(e) => updateSection(index, { mo_ta: e.target.value })}
                      className='h-10 rounded-[3px] shadow-none border-gray-300'
                    />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeSection(index)} className='cursor-pointer'>
                    <Trash2 className="h-10 w-10" />
                  </Button>
                </div>

              </div>

              {/* Render question list */}
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