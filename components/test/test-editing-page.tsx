'use client'
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { testService } from '@/services/test/testService';
import { Course, Criteria, Test, TestCategory, TestQuestion, TestSection } from '@/types/interfaces/model';
import { TestSetup } from '@/types/interfacess/quiz';
import { Student } from '@/types/interfaces/model';

import HeaderBar from './form/HeaderBar';
import TestInfoForm from './form/TestInfoForm';
import AssignStudents from './form/AssignStudents';
import QuestionList from './form/TestQuestionList';
import TestSectionList from './form/TestSectionList';
import { Label } from '../ui/label';
import { categoryService } from '@/services/categoryService';
import { competencyService } from '@/services/competency/competencyService';

interface TestEditProp {
  test_id: number;
  setup?: TestSetup;
}

const TestEditor = ({ test_id }: TestEditProp) => {
  const [test, setTest] = useState<Test | null>(null)
  const [search, setSearch] = useState("")
  const [courses, setCourses] = useState<Course[]>([]);
  const [criterias, setCriterias] = useState<Criteria[]>([]);
  const [categories, setCategories] = useState<TestCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [testStatus, setTestStatus] = useState('');
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [sections, setSections] = useState<TestSection[]>([]);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);

  const { user } = useAuth();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const router = useRouter();

  const [newTest, setNewTest] = useState({
    tieu_de: "",
    mo_ta: "",
    giai_thich: '',
    thoi_luong: 0,
    danh_muc: []
  });

  const [newStudent, setNewStudent] = useState({
    ma_hoc_vien: '',
    ten: ''
  });

  const buildQuestionPayload = (q: any, section: any) => {
    const base = {
      ma_cau_hoi: q.ma_cau_hoi,
      ma_tieu_chi: q.ma_tieu_chi,
      tieu_de: q.cau_hoi.tieu_de,
      mo_ta: q.cau_hoi.mo_ta,
      diem: q.cau_hoi.diem,
      loai_cau_hoi: section.loai_phan,
    };

    switch (section.loai_phan) {
      case "trac_nghiem":
        return {
          ...base,
          cau_hoi_trac_nghiem: {
            lua_chon_trac_nghiem: q.cau_hoi.cau_hoi_trac_nghiem?.lua_chon_trac_nghiem.map((c: any) => ({
              ma_lua_chon: c.ma_lua_chon,
              noi_dung: c.noi_dung,
              la_dap_an_dung: c.la_dap_an_dung,
            }))
          }
        };

      case "nhieu_lua_chon":
        return {
          ...base,
          cau_hoi_nhieu_lua_chon: {
            lua_chon: q.cau_hoi.cau_hoi_nhieu_lua_chon?.lua_chon || []
          }
        };

      case "tu_luan":
        return {
          ...base,
          cau_hoi_tu_luan: {
            dap_an_mau: q.cau_hoi.cau_hoi_tu_luan.dap_an_mau || "",
            giai_thich: q.cau_hoi.cau_hoi_tu_luan.giai_thich || ""
          }
        };

      default:
        return base;
    }
  };

  // Fetch data
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const data = await testService.getTestById(test_id);
        const cates = await categoryService.getCategories();
        const criterias = await competencyService.getCriterias();

        const mergedSections: Partial<TestSection>[] = (data.phan_kiem_tra || []).map((section: any) => {
          const rawQuestions = section.phan_kiem_tra_cau_hoi || section.cau_hoi || [];

          const parsedQuestions: Partial<TestQuestion>[] = rawQuestions.map((q: any) => ({
            ma_cau_hoi: q.ma_cau_hoi,
            ma_phan: q.ma_phan,
            tieu_de: q.tieu_de,
            mo_ta: q.mo_ta,
            diem: q.diem || 10,
            loai: q.loai || section.loai_phan || "trac_nghiem",
            cau_hoi_trac_nghiem: q.cau_hoi_trac_nghiem || {
              lua_chon_trac_nghiem: []
            },
            dap_an_dung: q.dap_an_dung,
          }));

          return {
            ...section,
            phan_kiem_tra_cau_hoi: parsedQuestions,
          };
        });

        setTest(data.data);
        setSections(data.data.phan_kiem_tra);
        setCategories(cates.data);
        setCriterias(criterias.data);

        const cateIds = (data.data.danh_muc || []).map((item: any) => item.ma_danh_muc);
        console.log('CATEIDS: ', cateIds)

        setNewTest({
          tieu_de: data.data.tieu_de || "",
          mo_ta: data.data.mo_ta || "",
          giai_thich: data.data.giai_thich || "",
          thoi_luong: data.data.thoi_luong || 0,
          danh_muc: data.data.danh_muc
        });
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, test_id]);

  // const addQuestion = (sectionIndex: number) => {
  //   const updatedSections = [...sections];
  //   if (!updatedSections[sectionIndex].cau_hoi) {
  //     updatedSections[sectionIndex].cau_hoi = [];
  //   }
  //   updatedSections[sectionIndex].cau_hoi!.push({
  //     ma_cau_hoi: (updatedSections[sectionIndex].cau_hoi!.length || 0) + 1,
  //     cau_hoi: "",
  //     loai_cau_hoi: updatedSections[sectionIndex].loai_phan || "trac_nghiem",
  //     lua_chon: ["", "", "", ""],
  //     diem: 10,
  //   });
  //   setSections(updatedSections);
  // };

  const updateSection = (index: number, updates: Partial<TestSection>) => {
    const updateSections = [...sections];
    updateSections[index] = {
      ...updateSections[index],
      ...updates
    };

    setSections(updateSections);
  }

  const updateQuestion = (index: number, updates: Partial<TestQuestion>) => {
    setQuestions(questions.map((q, i) => (
      i === index
        ? { ...q, ...updates }
        : q)))
  }

  const removeSection = (index: number) => {
    const updated = sections.filter((_, i) => i !== index);
    setSections(updated);
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  // handle select student
  const handleSelectStudent = (student_id: number) => {
    const student = students.find((s) => s.ma_hoc_vien === student_id)
    if (student) {
      setNewStudent({
        ma_hoc_vien: student.ma_hoc_vien.toString(),
        ten: student.ten,
      })
    }
  }

  const toggleStudent = (id: number) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]) // clear
    } else {
      setSelectedStudents(students.map((s) => s.ma_hoc_vien)) // select all
    }
  }

  const filtered = students.filter((s) =>
    s.ten.toLowerCase().includes(search.toLowerCase())
  )

  const placeholder =
    selectedStudents.length === 0
      ? "Chọn học viên..."
      : selectedStudents.length === students.length
        ? "All students selected"
        : `${selectedStudents.length} students selected`

  // handle create test when submit
  const handleCreateTest = async () => {
    try {
      const total_points = questions.reduce((sum, q) => sum + (q.diem || 0), 0)
      const testData = {
        ...newTest,
        ma_giang_vien: user?.ma_nguoi_dung,
        cau_hoi: questions as TestQuestion[],
        tong_diem: total_points,
        trang_thai: "ban_nhap" as const,
      }

      console.log("[v0] Creating test:", testData)
      const res = await testService.createTest(testData);

      setIsCreateDialogOpen(false)
      setNewTest({ ...newTest, tieu_de: "", mo_ta: "", thoi_luong: 0 })
      setQuestions([]);
      toast.success('Test has been created successfully!');
      router.push('/tests');
    } catch (error) {
      console.error("Failed to create test:", error)
    }
  }

  const handleUpdateTest = async () => {
    try {
      const parsedSections = sections.map((section) => {

        const questions = (section.phan_kiem_tra_cau_hoi || []).map((q) =>
          buildQuestionPayload(q, section)
        );

        return {
          ma_phan: section.ma_phan,
          mo_ta: section.mo_ta,
          ten_phan: section.ten_phan,
          loai_phan: section.loai_phan,
          phan_kiem_tra_cau_hoi: questions
        };
      });

      const total_points = parsedSections
        .flatMap((s) => s.phan_kiem_tra_cau_hoi)
        .reduce((sum, q) => sum + (q.diem || 0), 0);

      const updatedData = {
        ...newTest,
        log: '[TAO LÀ UPDATE DATA]',
        ma_giang_vien: user?.ma_nguoi_dung,
        tong_diem: total_points,
        trang_thai: "hoat_dong",
        phan_kiem_tra: parsedSections,
      };

      console.log("Updating test with payload:", updatedData);

      await testService.updateTest(test_id, updatedData);

      toast.success("Test updated!");

    } catch (err) {
      console.error(err);
      toast.error("Failed to update test");
    }
  };


  const duplicateTest = async (test: Test) => {
    try {
      console.log("[v0] Duplicating test:", test.ma_kiem_tra)
    } catch (error) {
      console.error("Failed to duplicate test:", error)
    }
  }

  const deleteTest = async (test_id: number) => {
    try {
      console.log("[v0] Deleting test:", test_id)
      await testService.deleteTest(test_id)
      setTest(null);
      toast.success("Test deleted successfully!");
      router.push("/tests");
    } catch (error) {
      console.error("Failed to delete test:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleSetupChange = (setup: TestSetup) => {
    if (!test) return;
    setTest({ ...test, setup } as Test);
  };

  const handleQuestionsChange = (questions: TestQuestion[]) => {
    if (!test) return;
    setTest({ ...test, questions } as Test);
  };

  const total_points = test?.cau_hoi?.reduce((sum, q) => sum + (q.diem || 0), 0) ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar
        test={test}
        loading={loading}
        total_points={total_points}
        router={router}
        onSave={handleUpdateTest}
        onCancel={() => console.log('cancel')}
      />

      <TestInfoForm categories={categories} newTest={newTest} setNewTest={setNewTest} />

      <Label className='text-lg mb-2' >Nội dung bài kiểm tra</Label>
      {/* Render section */}
      <TestSectionList
        sections={sections}
        setSections={setSections}
        updateSection={updateSection}
        removeSection={removeSection}
        criterias={criterias}
      />
    </div>
  );
};

export default TestEditor;
