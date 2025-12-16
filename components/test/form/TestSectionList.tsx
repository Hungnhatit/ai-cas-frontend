'use client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Criteria, TestQuestion, TestSection } from '@/types/interfaces/model';
import { Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import QuestionList from './TestQuestionList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import FormField from '@/components/assignments/assignment-form-field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ConfirmModal from '@/components/modals/confirm-modal';

interface TestSectionProps {
  sections: TestSection[];
  setSections: (value: TestSection[]) => void;
  updateSection: (index: number, updates: Partial<TestSection>) => void;
  removeSection: (index: number) => void
  criterias: Criteria[]
}

/**
 * Render section list
 */
const TestSectionList = ({ sections, setSections, updateSection, removeSection, criterias }: TestSectionProps) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.ma_phan?.toString() || '');

  // handle add section
  const addSection = () => {
    const newSectionId = Math.random();
    const newSection: Partial<TestSection> = {
      ma_phan: newSectionId,
      ten_phan: `Phần ${sections.length + 1}`,
      loai_phan: 'trac_nghiem',
      phan: [],
    };

    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    setActiveSection(newSectionId.toString());
  };

  const addQuestion = (sectionIndex: number) => {
    const updatedSections = [...sections];
    const section = updatedSections[sectionIndex];

    const isSingleChoice = section.loai_phan === 'trac_nghiem';
    const isEssay = section.loai_phan === 'tu_luan';
    const isMultipleSelect = section.loai_phan === 'nhieu_lua_chon';

    const newQuestion: any = {
      ma_cau_hoi: Date.now(),
      ma_tieu_chi: undefined,
      cau_hoi: {
        tieu_de: "",
        mo_ta: "",
        loai_cau_hoi: section.loai_phan,
        diem: 10
      }
    };

    if (isSingleChoice) {
      newQuestion.cau_hoi.cau_hoi_trac_nghiem = {
        lua_chon_trac_nghiem: [
          { noi_dung: '', la_dap_an_dung: 0 },
          { noi_dung: '', la_dap_an_dung: 0 },
          { noi_dung: '', la_dap_an_dung: 0 },
          { noi_dung: '', la_dap_an_dung: 0 }
        ]
      }
    }

    if (isMultipleSelect) {
      newQuestion.cau_hoi.cau_hoi_nhieu_lua_chon = {
        lua_chon: [
          { noi_dung: '', la_dap_an_dung: 0 },
        ]
      }
    }

    if (isEssay) {
      newQuestion.cau_hoi.cau_hoi_tu_luan = {
        giai_thich: '',
        dap_an_mau: ''
      }
    }

    section.phan_kiem_tra_cau_hoi = [
      ...(section.phan_kiem_tra_cau_hoi || []),
      newQuestion,
    ];
    setSections(updatedSections);
  };

  const updateQuestions = (sectionIndex: number, newQuestions: Partial<TestQuestion>[]) => {
    const updated = [...sections];
    updated[sectionIndex].phan_kiem_tra_cau_hoi = newQuestions ?? [];
    setSections(updated);
  };

  const handleDeleteSection = () => {
    const sectionIndexToDelete = sections.findIndex(s => s.ma_phan?.toString() === activeSection.toString());

    if (sectionIndexToDelete !== -1) {
      removeSection(sectionIndexToDelete);

      const newSections = sections.filter((_, i) => i !== sectionIndexToDelete);
      if (newSections.length > 0) {
        const nextActiveIndex = Math.min(sectionIndexToDelete, newSections.length - 1);
        setActiveSection(newSections[nextActiveIndex].ma_phan);
      } else {
        setActiveSection(0);
      }
    }
  };

  // console.log('CRITERIAS: ', criterias);

  return (
    <div>
      <Tabs defaultValue={activeSection.toString()} onValueChange={setActiveSection} className='space-y-2'>
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
          {sections.length > 0 && (

            <ConfirmModal
              onConfirm={handleDeleteSection}
              title="Xác nhận xóa phần?"
              description={`Bạn có chắc chắn muốn xoá phần này vĩnh viễn không? Hành động này không thể hoàn tác sau khi lưu thay đổi`}
            >
              <Button className='rounded-[3px] cursor-pointer' variant={'destructive'} >
                <Trash2 />
                Xoá phần này
              </Button>
            </ConfirmModal>

          )}
        </div>
        {sections.map((section, sectionIndex) => (
          <TabsContent key={sectionIndex} value={section.ma_phan.toString()} className='space-y-2'>
            <div className='flex justify-between bg-card border rounded-[3px] p-4 space-y-4'>
              <div className='w-full space-y-2'>
                <div className='grid grid-cols-2 gap-2'>
                  <div className='space-y-2'>
                    <Label className=''>Tên phần</Label>
                    <Input
                      value={section.ten_phan}
                      onChange={(e) => updateSection(sectionIndex, { ten_phan: e.target.value })}
                      className='h-10 rounded-[3px] shadow-none border-gray-300' />
                  </div>

                  <div className='space-y-2'>
                    <Label>Loại phần</Label>
                    <Select
                      value={section.loai_phan}
                      onValueChange={(val) => {
                        const updated = [...sections];
                        updated[sectionIndex] = { ...updated[sectionIndex], loai_phan: val as any };
                        setSections(updated);
                      }}
                    >
                      <SelectTrigger className='!h-10 w-full rounded-[3px] shadow-none cursor-pointer border-gray-300'>
                        <SelectValue placeholder="Chọn loại phần" className='h-12' />
                      </SelectTrigger>
                      <SelectContent className='rounded-[3px] shadow-none cursor-pointer border-gray-300'>
                        <SelectItem value="trac_nghiem" className='rounded-[3px] shadow-none cursor-pointer border-gray-300'>Trắc nghiệm</SelectItem>
                        <SelectItem value="tu_luan" className='rounded-[3px] shadow-none cursor-pointer border-gray-300'>Tự luận</SelectItem>
                        <SelectItem value="nhieu_lua_chon" className='rounded-[3px] shadow-none cursor-pointer border-gray-300'>Nhiều lựa chọn</SelectItem>
                      </SelectContent>
                    </Select>

                  </div>

                  {/* <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => removeSection(sectionIndex)} className='cursor-pointer'>
                            <Trash2 className="h-10 w-10" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Xoá phần này
                        </TooltipContent>
                      </Tooltip> */}
                </div>
                <div>
                  <Label className='mb-2'>Mô tả</Label>
                  <Textarea
                    id='section_description'
                    value={section.mo_ta || ''}
                    onChange={(e) => updateSection(sectionIndex, { mo_ta: e.target.value })}
                    className='h-24 rounded-[3px] shadow-none border-gray-300'
                  />
                </div>
              </div>
            </div>

            {/* Render question list */}
            <QuestionList
              sectionType={section.loai_phan}
              questions={section.phan_kiem_tra_cau_hoi || []}
              setQuestions={(newQuestions) => updateQuestions(sectionIndex, newQuestions)}
              onAddQuestion={() => addQuestion(sectionIndex)}
              criterias={criterias}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default TestSectionList