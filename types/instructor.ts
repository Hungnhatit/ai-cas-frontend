// export interface Instructor {
//   ma_giang_vien: number;
//   name: string,
//   email: string,
//   phone?: string,
//   bio: string,
//   createdAt: string,
//   updatedAt: string
// }

export interface Instructor {
  ma_giang_vien: number;     // instructor_id
  ten: string;               // name
  email: string;             // email
  so_dien_thoai?: string;    // phone (optional)
  tieu_su?: string;          // bio (optional)
  ngay_tao: string;          // createdAt
  ngay_cap_nhat: string;     // updatedAt
}
