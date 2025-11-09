import { Earth, Lock, GraduationCap } from "lucide-react";

export const TEST_DIFFICULTY_LABEL: Record<string, string> = {
  de: 'Dễ',
  trung_binh: 'Trung bình',
  kho: 'Khó'
};

export const STATUS_LABEL: Record<string, string> = {
  hoat_dong: 'Hoạt động',
  ban_nhap: 'Bản nháp',
  luu_tru: 'Lưu trữ'
};

export const VISIBILITY_LABEL: Record<string, string> = {
  cong_khai: 'Công khai',
  rieng_tu: 'Riêng tư',
  lop_hoc: 'Lớp học'
}

export const getDifficultyLabel = (value: string): string => {
  return TEST_DIFFICULTY_LABEL[value] || value;
}

export const getStatusLabel = (value: string): string => {
  return STATUS_LABEL[value] || value;
}

export const getVisibilityLabel = (value: string): string => {
  return VISIBILITY_LABEL[value] ||value;
}