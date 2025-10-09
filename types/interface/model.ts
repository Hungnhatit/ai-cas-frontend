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
