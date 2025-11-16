export interface User {
  ma_nguoi_dung: number
  ten: string
  email: string
  mat_khau: string
  so_dien_thoai: string
  anh_dai_dien: string
  vai_tro: "student" | 'instructor' | 'admin'
  trang_thai: 'dang_hoat_dong' | 'ngung_hoat_dong'
  ngay_tao: string
  ngay_cap_nhat: string
}

export interface Test {
  ma_kiem_tra: number;           // test_id
  ma_giang_vien: number;             // instructor_id
  tieu_de: string;                   // title
  mo_ta: string;                     // description
  ten_bai_kiem_tra: string;          // name
  thoi_luong: number;                // duration (minutes)
  tong_diem: number;                 // total_points
  so_lan_lam_toi_da: number;         // max_attempts
  do_kho: "de" | "trung_binh" | "kho";
  trang_thai: "hoat_dong" | "ban_nhap" | "luu_tru"; // status  
  pham_vi_hien_thi: 'cong_khai' | 'rieng_tu' | 'lop_hoc'
  ngay_bat_dau: string;              // start_date
  ngay_ket_thuc: string;             // end_date
  ngay_tao: string;                  // createdAt
  ngay_cap_nhat: string;             // updatedAt
  cau_hoi: TestQuestion[];              // questions
  cau_hoi_kiem_tra: TestQuestion[];
  giang_vien: Instructor | null
  danh_muc: string
  so_phan: number
  phan_kiem_tra: TestSection[]
}

export interface TestCategory {
  ma_danh_muc: number;
  ten_danh_muc: string;
  mo_ta?: string | null; 
  trang_thai: "cho_duyet" | "da_duyet" | "tu_choi";
  nguoi_tao_danh_muc: number | null;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface TestSection {
  ma_phan: number;
  ma_kiem_tra: number;
  ten_phan: string;
  mo_ta: string
  loai_phan: 'trac_nghiem' | 'tu_luan' | 'viet_prompt' | 'xu_ly_tinh_huong' | 'dung_sai' | 'tra_loi_ngan' | 'khac';
  diem: number
  thu_tu: number;
  diem_toi_da: number;
  thoi_gian_gioi_han?: number | null;
  tieu_chi_danh_gia?: string | null;
  ngay_tao: string;
  ngay_cap_nhat: string;
  cau_hoi: Partial<TestQuestion>[]
}

export interface TestComment {
  ma_binh_luan: number;                    // ma_binh_luan
  ma_kiem_tra: number;             // ma_kiem_tra
  ma_nguoi_dung: number;              // thông tin người dùng
  ma_binh_luan_goc?: number | null;      // ma_binh_luan_goc
  noi_dung: string;               // nội dung comment
  ngay_tao: string;               // ISO date
  ngay_cap_nhat: string;           // ISO date
  reply?: TestComment[]
}


export type TestAttemptStatus = "in-progress" | "submitted" | "graded";
export interface TestAttempt {
  ma_lan_lam: number;       // testAttempt_id
  ma_kiem_tra: number;           // test_id
  ma_hoc_vien: number;               // student_id
  cau_tra_loi: Record<string, any> | null; // answers
  diem: number;                      // score
  thoi_gian_bat_dau: string;         // start_time
  thoi_gian_ket_thuc: string; // end_time
  trang_thai: TestAttemptStatus;     // status
  ngay_tao: string;                  // createdAt
  ngay_cap_nhat: string;             // updatedAt

  bai_kiem_tra?: Test;               // test
  hoc_vien?: any;                    // student
}

export interface TestSetup {
  title: string;
  course: string;
  description: string;
  duration: number; // in minutes
  attemptsAllowed: number;
}

export interface TestQuestion {
  ma_cau_hoi: number;             // question_id
  ma_kiem_tra: number;           // test_id
  ma_phan: number;          // section_id
  loai: "trac_nghiem" | "tu_luan" | 'viet_prompt' | "dung_sai" | "tra_loi_ngan" | 'xu_ly_tinh_huong' | 'khac';
  cau_hoi: string;                   // question
  mo_ta: string;
  lua_chon: string[];               // options
  dap_an_dung?: string | number;     // correctAnswer
  diem: number;                      // points
  giai_thich: string;               // explanation
  ngay_tao: string;                  // createdAt
  ngay_cap_nhat: string;             // updatedAt
}

export interface Instructor {
  ma_giang_vien: number;     // instructor_id
  ten: string;               // name
  email: string;             // email
  so_dien_thoai?: string;    // phone (optƒional)
  anh_giang_vien: string
  tieu_su?: string;          // bio (optional)
  ngay_tao: string;          // createdAt
  ngay_cap_nhat: string;     // updatedAt
}

export interface Course {
  ma_khoa_hoc: number;            // id: string
  tieu_de: string;                // title: string
  mo_ta: string;                  // description: string
  ma_giang_vien: number;          // instructor: string
  so_hoc_vien: number;            // students: number
  thoi_luong: string;             // duration: string
  muc_do: "Beginner" | "Intermediate" | "Advanced"; // level
  ma_danh_muc: number;            // category: string
  anh_dai_dien: string;           // thumbnail: string
  tien_do?: number;               // progress?: number
  danh_gia: number;               // rating: number
  gia: number;                    // price: number
  trang_thai: "active" | "draft" | "archived"; // status
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface Student {
  ma_hoc_vien: number;            // student_id: number
  ten: string;                 // name: string
  email: string;                  // email: string
  anh_dai_dien: string;           // avatar: string
  so_khoa_hoc_dang_hoc: number;   // enrolledCourses: number
  so_khoa_hoc_hoan_thanh: number; // completedCourses: number
  tien_do: number;                // progress: number
  ngay_tham_gia: string;          // joinDate: string
  ma_giang_vien?: number;         // ma_giang_vien?: string
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface Assignment {
  ma_bai_tap: number;             // id: string
  tieu_de: string;                // title: string
  ma_khoa_hoc: number;            // course: string
  han_nop: string;                // dueDate: string
  trang_thai: "pending" | "submitted" | "graded"; // status
  diem?: number;                  // grade?: number
  mo_ta: string;                  // description: string
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface QuizQuestion {
  ma_cau_hoi_tn: number;          // quizQuestion_id: number
  ma_bai_trac_nghiem: number;     // quiz_id: string
  cau_hoi: string;                // question: string
  loai: "trac_nghiem" | "dung_sai" | "tra_loi_ngan"; // type
  lua_chon?: string[];            // options?: string[]
  dap_an_dung: string | number;   // correctAnswer: string | number
  diem: number;                   // points: number
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface BaiTracNghiem {
  ma_bai_trac_nghiem: number;     // id: string
  tieu_de: string;                // title: string
  ma_khoa_hoc: number;            // course: string
  mo_ta: string;                  // description: string
  thoi_luong: number;             // duration: number
  tong_diem: number;              // total_points: number
  so_lan_lam: number;             // attempts: number
  trang_thai: "hoat_dong" | "ban_nhap" | "luu_tru"; // status
  che_do_hien_thi: string;        // visibility: string
  han_nop: string;                // dueDate: string
  ngay_tao: string;
  ngay_cap_nhat: string;
  cau_hoi_trac_nghiem?: QuizQuestion[]; // quiz_questions
}

export interface QuizAttempt {
  ma_lan_lam_tn: number;          // id: string
  ma_bai_trac_nghiem: number;     // quizId: string
  ma_hoc_vien: number;            // studentId: string
  cau_tra_loi: Record<string, string | number>; // answers
  diem?: number;                  // score?: number
  bat_dau_luc: string;            // start_time
  ket_thuc_luc?: string;          // end_time
  trang_thai: "in-progress" | "completed" | "submitted"; // status
  ngay_tao: string;
  ngay_cap_nhat: string;
}
