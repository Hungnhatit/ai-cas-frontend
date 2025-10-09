// export interface QuizSetup {
//   title: string;
//   course: string;
//   description: string;
//   duration: number; // in minutes
//   attemptsAllowed: number;
// }

// export interface AnswerOption {
//   id: string;
//   text: string;
//   isCorrect: boolean;
// }

// export interface Question {
//   id: string;
//   text: string;
//   type: 'multiple-choice' | 'true-false' | 'short-answer';
//   points: number;
//   options: AnswerOption[];
// }

// export interface Quiz {
//   setup: QuizSetup;
//   questions: Question[];
//   quiz: Quiz[]
// }

// export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';

export interface CauHoiLuaChon {
  id: string;              // Mã lựa chọn tạm (client-side)
  noi_dung: string;        // Text của lựa chọn
  dung: boolean;           // Có phải đáp án đúng không
}

export type LoaiCauHoi = 'trac_nghiem' | 'dung_sai' | 'tra_loi_ngan';

export interface CauHoiTracNghiem {
  ma_cau_hoi_tn: number;   // question_id
  ma_bai_trac_nghiem: number; // quiz_id
  cau_hoi: string;         // text
  loai: LoaiCauHoi;        // type
  lua_chon: CauHoiLuaChon[]; // options (JSON)
  dap_an_dung: string;     // correct_answer
  diem: number;            // points
  ngay_tao: string;        // createdAt
  ngay_cap_nhat: string;   // updatedAt
}

export type TrangThaiBai = 'hoat_dong' | 'ban_nhap' | 'luu_tru';
export type CheDoXem = 'cong_khai' | 'rieng_tu' | 'da_giao';

export interface BaiTracNghiem {
  ma_bai_trac_nghiem: number;  // quiz_id
  ma_giang_vien: number;       // instructor_id
  tieu_de: string;             // title
  khoa_hoc: string;            // course
  mo_ta?: string;              // description
  thoi_luong: number;          // duration (minutes)
  tong_diem: number;           // totalPoints
  so_lan_lam: number;          // attemptsAllowed
  trang_thai: TrangThaiBai;    // status
  che_do_xem: CheDoXem;        // visibility
  han_nop?: string;            // dueDate
  ngay_tao: string;            // createdAt
  ngay_cap_nhat: string;       // updatedAt
  cau_hoi_trac_nghiem?: CauHoiTracNghiem[]; // liên kết (1-n)
}

