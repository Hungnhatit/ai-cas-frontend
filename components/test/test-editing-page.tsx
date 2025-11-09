'use client'
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { testService } from '@/services/test/testService';
import { studentService } from '@/services/studentService';
import { Course, Test, TestQuestion, TestSection } from '@/types/interfaces/model';
import { TestSetup } from '@/types/interfacess/quiz';
import { Student } from '@/types/interfaces/model';

import HeaderBar from './form/HeaderBar';
import TestInfoForm from './form/TestInfoForm';
import AssignStudents from './form/AssignStudents';
import QuestionList from './form/TestQuestionList';
import TestSectionList from './form/TestSectionList';
import { Label } from '../ui/label';

interface TestEditProp {
  test_id: number;
  setup?: TestSetup;
}

const TestEditor = ({ test_id }: TestEditProp) => {
  const [test, setTest] = useState<Test | null>(null)
  const [search, setSearch] = useState("")
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [testStatus, setTestStatus] = useState('');
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [sections, setSections] = useState<Partial<TestSection>[]>([]);
  const [questions, setQuestions] = useState<Partial<TestQuestion>[]>([]);

  const { user } = useAuth();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const router = useRouter();

  const [newTest, setNewTest] = useState({
    tieu_de: "",
    mo_ta: "",
    giai_thich: '',
    thoi_luong: 30,
    so_lan_lam_toi_da: 3,
  });

  const [newStudent, setNewStudent] = useState({
    ma_hoc_vien: '',
    ten: ''
  })

  // fetch data
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const data = await testService.getTestById(test_id);

        const parsedData = (data.data.cau_hoi || []).map((question: any) => ({
          ...question,
          lua_chon: typeof question.lua_chon === 'string' ? JSON.parse(question.lua_chon) : question.lua_chon,
          dap_an_dung: question.dap_an_dung !== undefined ? Number(question.dap_an_dung) : undefined
        }));

        const parsedQuestions = (data.data.cau_hoi || []).map((q: any) => ({
          ...q,
          lua_chon: typeof q.lua_chon === 'string' ? JSON.parse(q.lua_chon) : q.lua_chon,
          dap_an_dung: q.dap_an_dung !== undefined ? Number(q.dap_an_dung) : undefined,
        }));

        const mergedSections = (data.data.phan_kiem_tra || []).map((section: any) => ({
          ...section,
          cau_hoi: parsedQuestions.filter((q: any) => q.ma_phan === section.ma_phan),
        }));

        const res = await studentService.getStudentByInstructorId(user?.ma_nguoi_dung);

        setStudents(res.data.hoc_vien);
        setTest(data.data);
        setNewTest({
          tieu_de: data.data.tieu_de || "",
          giai_thich: data.data.giai_thich || '',
          mo_ta: data.data.mo_ta || "",
          thoi_luong: data.data.thoi_luong || 30,
          so_lan_lam_toi_da: data.data.so_lan_lam_toi_da || 3,
        });
        setSections(mergedSections);
        setQuestions(parsedData);
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, test_id]);

  const addQuestion = (sectionIndex: number) => {
    const updatedSections = [...sections];
    if (!updatedSections[sectionIndex].cau_hoi) {
      updatedSections[sectionIndex].cau_hoi = [];
    }
    updatedSections[sectionIndex].cau_hoi!.push({
      ma_cau_hoi: (updatedSections[sectionIndex].cau_hoi!.length || 0) + 1,
      cau_hoi: "",
      loai: updatedSections[sectionIndex].loai_phan || "trac_nghiem",
      lua_chon: ["", "", "", ""],
      dap_an_dung: 0,
      diem: 10,
    });
    setSections(updatedSections);
  };

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
        trang_thai: "draft" as const,
        ngay_ket_thuc: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
      }

      console.log("[v0] Creating test:", testData)
      const res = await testService.createTest(testData);

      setIsCreateDialogOpen(false)
      setNewTest({ ...newTest, tieu_de: "", mo_ta: "", thoi_luong: 30, so_lan_lam_toi_da: 3 })
      setQuestions([]);
      toast.success('Test has been created successfully!');
      router.push('/tests');
    } catch (error) {
      console.error("Failed to create test:", error)
    }
  }

  console.log('test:', test);

  const handleUpdateTest = async () => {
    try {
      const allQuestions = sections.flatMap((s) => s.cau_hoi || [])
      // const total_points = test?.cau_hoi?.reduce((sum, q) => sum + (q.diem || 0), 0) ?? 0;
      const total_points = allQuestions.reduce((sum, q) => sum + (q.diem || 0), 0);
      const updatedData = {
        ...newTest,
        ma_giang_vien: user?.ma_nguoi_dung,
        tong_diem: total_points,
        // cau_hoi: questions as TestQuestion[],
        cau_hoi: allQuestions,
        phan: sections as TestSection[],
        trang_thai: 'hoat_dong',
        ngay_het_han: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]
      }

      console.log(updatedData)

      const assignData = {
        // test_id: test_id,
        instructor_id: user?.ma_nguoi_dung,
        student_ids: selectedStudents,
      }

      console.log("[v0] Updating test:", updatedData);

      const res = await testService.updateTest(test_id, updatedData);
      await testService.assignTestToStudent(test_id, assignData);

      setIsCreateDialogOpen(false)
      setNewTest({
        tieu_de: "",
        mo_ta: "",
        giai_thich: '',
        thoi_luong: 30,
        so_lan_lam_toi_da: 3,
      });
      setQuestions([]);
      toast.success("Test has been updated successfully!");
      router.push("/tests");
    } catch (error) {
      console.log(error)
    }
  }

  // TODO: implement duplication API when backend ready
  const duplicateTest = async (test: Test) => {
    try {
      console.log("[v0] Duplicating test:", test.ma_kiem_tra)
      // In a real app, you would call api.duplicateTest(test.id)
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

  // const getQuizStats = () => {
  //   const total = test?.length
  //   const active = test?.filter((q) => q.trang_thai === "active")?.length
  //   const draft = test?.filter((q) => q.trang_thai === "draft")?.length
  //   const archived = test?.filter((q) => q.trang_thai === "archived")?.length

  //   return { total, active, draft, archived }
  // }

  // const stats = getQuizStats()

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

      <TestInfoForm newTest={newTest} setNewTest={setNewTest} courses={courses} />

      <AssignStudents
        students={students}
        search={search}
        placeholder={placeholder}
        setSearch={setSearch}
        selectedStudents={selectedStudents}
        setSelectedStudents={setSelectedStudents}
      />

      <Label className='text-lg mb-4' >Nội dung bài kiểm tra</Label>
      {/* Render section */}
      <TestSectionList
        sections={sections}
        setSections={setSections}
        updateSection={updateSection}
      />
    </div>
  );
};

export default TestEditor;
