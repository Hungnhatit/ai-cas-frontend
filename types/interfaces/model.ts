export type QuestionType = 'trac_nghiem' | 'tu_luan' | 'viet_prompt' | "dung_sai" | "tra_loi_ngan" | 'xu_ly_tinh_huong' | 'khac' | 'nhieu_lua_chon';

export type Difficulty = 'de' | 'trung_binh' | 'kho';

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

/**
 * Competency and related model
 * Description: 
 */
export interface Competency {
  ma_khung_nang_luc: number;
  ten_nang_luc: string;
  mo_ta: string | null;
  ngay_tao: string;
  ngay_cap_nhat: string;
  tong_so_tieu_chi: number
}

export interface Criteria {
  ma_tieu_chi: number;
  ma_khung_nang_luc: number;
  ten_tieu_chi: string | null;
  mo_ta: string | null;
  trong_so: number | null;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export type NguoiCham = "AI" | "GIANG_VIEN" | "QUAN_TRI";

export type TrangThaiCham = "DANG_CHAM" | "HOAN_THANH" | "CHO_DUYET";

export interface AssessmentResult {
  ma_danh_gia: number;
  ma_lan_lam: number;
  tong_diem: number | null;
  xep_loai: string | null;
  nhan_xet: string | null;
  nguoi_cham: NguoiCham;
  trang_thai: TrangThaiCham;
  ngay_danh_gia: string | null;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface ReviewDetail {
  ma_chi_tiet: number;
  ma_khung_nang_luc: number;
  ma_danh_gia: number;
  diem: number | null;
  nhan_xet: string | null;
  diem_manh: string | null;
  diem_yeu: string | null;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface AnalysisEvaluation {
  ma_phan_tich: number;
  ma_danh_gia: number;
  de_xuat_cai_thien: string | null;
  huong_phat_trien: string | null;
  ke_hoach_ngan_han: string | null;
  ke_hoach_dai_han: string | null;
  tai_nguyen_de_xuat: string | null;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface AttachmentDocument {
  ma_dinh_kem: number;
  ma_tai_lieu: number | null;
  ten_tep: string | null;
  duong_dan: string | null;
  dung_luong: number | null;
  dinh_dang: string | null;
  ngay_tao: string;
  ngay_cap_nhat: string;
}


export interface Test {
  ma_kiem_tra: number;
  ma_giang_vien: number;
  tieu_de: string;
  mo_ta: string;
  ten_bai_kiem_tra: string;
  thoi_luong: number;
  tong_diem: number;
  so_lan_lam_toi_da: number;
  do_kho: "de" | "trung_binh" | "kho";
  trang_thai: "hoat_dong" | "ban_nhap" | "luu_tru";
  pham_vi_hien_thi: 'cong_khai' | 'rieng_tu' | 'lop_hoc'
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
  cau_hoi: TestQuestion[];
  cau_hoi_trac_nghiem: TestQuestion[];
  giang_vien: Instructor | null
  danh_muc: TestCategory[]
  tong_so_phan: number
  phan_kiem_tra: TestSection[]
  tong_so_cau_hoi: number
  so_luong_hoc_vien: number
  tong_so_luot_lam: number

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
  loai_phan: 'trac_nghiem' | 'tu_luan' | 'viet_prompt' | 'xu_ly_tinh_huong' | 'dung_sai' | 'tra_loi_ngan' | 'khac' | 'nhieu_lua_chon';
  diem: number
  thu_tu: number;
  diem_toi_da: number;
  tieu_chi_danh_gia?: string | null;
  ngay_tao: string;
  ngay_cap_nhat: string;
  cau_hoi: Partial<TestQuestion>[]
  phan: Partial<SectionQuestion>[]
  phan_kiem_tra_cau_hoi: SectionQuestion[]
}

export interface SectionQuestion {
  ma_phan: number;
  ma_cau_hoi: number;
  cau_hoi: TestQuestion
}

export interface TestComment {
  ma_binh_luan: number;                    // ma_binh_luan
  ma_kiem_tra: number;             // ma_kiem_tra
  ma_nguoi_dung: number;              // thông tin người dùng
  nguoi_dung: User
  ma_binh_luan_goc?: number | null;      // ma_binh_luan_goc
  noi_dung: string;               // nội dung comment
  ngay_tao: string;               // ISO date
  ngay_cap_nhat: string;           // ISO date
  reply?: TestComment[]
  binh_luan_phan_hoi?: TestComment[]
  reply_to_user_name: string
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
  cau_tra_loi_hoc_vien: StudentAnswer[]
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
  ma_cau_hoi: number;
  ma_kiem_tra: number;
  ma_phan: number;
  ma_tieu_chi: number
  loai: "trac_nghiem" | "tu_luan" | 'viet_prompt' | "dung_sai" | "tra_loi_ngan" | 'nhieu_lua_chon'
  loai_cau_hoi: QuestionType
  tieu_de: string
  mo_ta: string;
  lua_chon: string[];
  dap_an_dung?: string | number;
  la_dap_an_dung?: string | number;
  diem: number;
  giai_thich_dap_an: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
  cau_hoi?: QuestionDetails
  cau_hoi_trac_nghiem: MultipleChoiceQuestion | null
  cau_hoi_tu_luan: EssayQuestion | null
  cau_hoi_nhieu_lua_chon: MultipleSelectQuestion | null
  tieu_chi_danh_gia: Criteria | null
}

export interface QuestionDetails {
  tieu_de?: string;
  diem?: number;
  mo_ta?: string;
  ma_tieu_chi: number
  loai_cau_hoi?: QuestionType;
  cau_hoi_trac_nghiem?: MultipleChoiceQuestion | null;
  cau_hoi_tu_luan?: EssayQuestion | null;
  cau_hoi_nhieu_lua_chon?: MultipleSelectQuestion | null
}

export interface MultipleChoiceQuestion {
  ma_cau_hoi_trac_nghiem?: number;
  la_dap_an_dung?: string;
  giai_thich_dap_an?: string;
  lua_chon_trac_nghiem?: MultipleChoiceOption[];
  ngay_tao?: string;
  ngay_cap_nhat?: string;

}

export interface MultipleChoiceOption {
  ma_lua_chon: number;
  ma_cau_hoi_trac_nghiem: number;
  noi_dung: string;
  la_dap_an_dung: boolean;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface EssayQuestion {
  ma_cau_hoi_tu_luan?: number;
  dap_an_mau?: string;
  giai_thich?: string;
  ngay_tao?: string;
  ngay_cap_nhat?: string;
}

export interface MultipleSelectQuestion {
  ma_cau_hoi?: number;
  giai_thich?: string;
  ngay_tao?: string;
  ngay_cap_nhat?: string;
  lua_chon?: MultipleSelectOption[]
}

export interface MultipleSelectOption {
  ma_lua_chon: number;
  ma_cau_hoi: number;
  noi_dung: string;
  la_dap_an_dung: boolean;
  ngay_tao: string;
  ngay_cap_nhat: string;
}



export interface StudentAnswer {
  ma_tra_loi: number;
  ma_lan_lam: number;
  ma_cau_hoi: number;
  tra_loi: string;
  diem: number;
  ngay_tao: string;
  ngay_cap_nhat: string;
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

export interface Attachment {
  ma_dinh_kem: number;
  ma_tai_lieu: number;
  ten_tep: string;
  duong_dan: string;
  dung_luong?: number | null;
  dinh_dang?: string | null;
  ngay_tao: string;
  ngay_cap_nhat: string;
}


export interface Post {
  ma_bai_viet: number;
  ma_tac_gia: number;
  tieu_de: string;
  tom_tat?: string | null;
  noi_dung?: string | null;
  trang_thai?: "nhap" | "cho_duyet" | "da_dang";
  ngay_tao: string;
  ngay_cap_nhat: string;
  anh_bia: string;
  tac_gia: User
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
