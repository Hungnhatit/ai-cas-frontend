
export interface Assignment {
  ma_bai_tap: number;               // assignment_id
  tieu_de: string;                  // title
  ma_khoa_hoc: number;              // course_id
  ma_giang_vien: number;            // instructor_id
  mo_ta?: string;                   // description
  ngay_het_han: string;             // due_date
  trang_thai: "cho_xu_ly" | "da_nop" | "da_cham"; // status
  diem?: number;                    // grade
  ngay_nop?: string;                // submission_date
  tong_diem: number;                // total_points
  ma_sinh_vien?: number[];          // student_ids
  ma_khoa_hoc_code?: string;        // course_code
  phan_hoi?: string;                // feedback
  so_lan_nop: number;               // submissions_count
  ngay_tao: string;                 // createdAt
  ngay_cap_nhat: string;            // updatedAt
  dinh_kem?: Attachment[];          // attachments
}

export interface Attachment {
  ma_dinh_kem: number;              // attachment_id
  ma_bai_tap: number;               // assignment_id
  duong_dan: string;                // file_path
  ten_file: string;                 // file_name
  ngay_tao: string;                 // createdAt
}

export interface AssignmentFormData {
  tieu_de: string;                  // title
  ma_khoa_hoc: number;              // course_id
  ma_giang_vien: number;            // instructor_id
  mo_ta?: string;                   // description
  han_nop: string;             // due_date
  tong_diem: number;                // total_points
  danh_sach_ma_hoc_vien?: number[];          // student_ids
  trang_thai?: "pending" | "submitted" | "graded"; // status
  ngay_nop: string
  phan_hoi?: string;                // feedback
  dinh_kem?: File[];                // attachments (upload)
}

