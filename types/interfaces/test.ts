export interface TestSection {
  ma_phan_kiem_tra: number;          // section_id
  ma_kiem_tra: number;           // test_id
  tieu_de: string;                   // title
  mo_ta?: string | null;             // description
  thu_tu: number;                    // order_index
  tong_diem: number;                 // points
  ngay_tao: string;                  // createdAt
  ngay_cap_nhat: string;             // updatedAt
}

export type TestAssignmentStatus = "assigned" | "in_progress" | "completed" | "expired";

export interface TestAssignment {
  ma_giao_bai_kiem_tra: number;      // testAssignment_id
  ma_kiem_tra: number;           // test_id
  ma_hoc_vien: number;               // student_id
  ma_giang_vien: number;             // assigned_by
  ngay_giao: string;                 // assigned_at
  trang_thai: TestAssignmentStatus;  // status
  ngay_tao: string;                  // createdAt
  ngay_cap_nhat: string;             // updatedAt
  bai_kiem_tra?: Test;               // test
  hoc_vien?: any;                    // student
  giang_vien?: any;                  // instructor
}


export type TestAttemptStatus = "in-progress" | "submitted" | "graded";

export interface TestAttempt {
  ma_lan_lam: number;       // testAttempt_id
  ma_kiem_tra: number;           // test_id
  ma_hoc_vien: number;               // student_id
  cau_tra_loi: Record<string, any> | null; // answers
  diem: number;                      // score
  thoi_gian_bat_dau: string;         // start_time
  thoi_gian_ket_thuc?: string | null; // end_time
  trang_thai: TestAttemptStatus;     // status
  ngay_tao: string;                  // createdAt
  ngay_cap_nhat: string;             // updatedAt

  bai_kiem_tra?: Test;               // test
  hoc_vien?: any;                    // student
}

export interface QuestionResult {
  ma_cau_hoi_kt: number;             // question_id
  cau_hoi: string;                   // question
  cau_tra_loi_nguoi_dung: string | number; // userAnswer
  dap_an_dung?: string | number;     // correctAnswer
  dung: boolean;                     // isCorrect
  diem: number;                      // points
  diem_dat_duoc: number;             // earnedPoints
  giai_thich?: string;               // explanation
}

export interface TestResult {
  ma_kiem_tra: number;           // test_id
  ten_bai_kiem_tra: string;          // testName
  tong_so_cau: number;               // totalQuestions
  so_cau_dung: number;               // correctAnswers
  tong_diem: number;                 // total_points
  diem_dat_duoc: number;             // earnedPoints
  ti_le: number;                     // percentage
  thoi_gian_lam_bai: number;         // timeSpent
  chi_tiet_cau_hoi: QuestionResult[]; // questionResults
  thoi_gian_hoan_thanh: string;      // completedAt
}


export interface UserAnswer {
  ma_cau_hoi_kt: number;             // question_id
  cau_tra_loi: string | number;      // answer
  thoi_gian_tra_loi: number;         // timeSpent
}

export interface TestSession {
  ma_kiem_tra: number;           // test_id
  thoi_gian_bat_dau: Date;           // startTime
  cau_tra_loi: UserAnswer[];         // answers
  chi_so_cau_hien_tai: number;       // currentQuestionIndex
  hoan_thanh: boolean;               // isCompleted
}
