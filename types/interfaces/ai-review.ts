export interface PhanTichDanhGia {
  ma_phan_tich: number;
  ma_danh_gia?: number | null;
  tong_quan: string;
  de_xuat_cai_thien?: string | null;
  huong_phat_trien?: string | null;
  ke_hoach_ngan_han?: string | null;
  ke_hoach_dai_han?: string | null;
  tai_nguyen_de_xuat?: string | null;
  ngay_tao?: string | Date | null;
  ngay_cap_nhat?: string | Date | null;
}

export interface ChiTietDanhGia {
  ma_chi_tiet: number;

  ma_cau_hoi?: number | null;
  ma_lan_lam?: number | null;
  ma_tieu_chi?: number | null;

  ma_khung_nang_luc?: number | null;
  ma_danh_gia?: number | null;

  diem?: number | null;

  danh_gia_chi_tiet?: string | null;
  nhan_xet?: string | null;

  diem_manh?: string | null;
  diem_yeu?: string | null;

  ngay_tao?: string | Date;
  ngay_cap_nhat?: string | Date;
}
