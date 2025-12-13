export const capitalizeFirstLetter = (str: string) => {
  if (!str) return;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const capitalizeWords = (str: string) => {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const ACCOUNT_STATUS_LABEL: Record<string, string> = {
  dang_hoat_dong: 'Đang hoạt động',
  ngung_hoat_dong: 'Ngừng hoạt động',
}

export const getAccountStatusLabel = (value: string): string => {
  return ACCOUNT_STATUS_LABEL[value] || value;
}

export const ROLE_LABEL: Record<string, string> = {
  student: 'Học viên',
  instructor: 'Giảng viên',
}

export const getRoleLabel = (value: string): string => {
  return ROLE_LABEL[value] || value;
}

export const ATTEMPT_STATUS: Record<string, string> = {
  da_nop: 'Đã nộp',
  dang_lam: 'Đang làm',
  da_cham: 'Đã chấm',
  da_huy: 'Đã huỷ'
}

export const ATTEMPT_STATUS_BADGE: Record<string, string> = {
  da_nop: 'bg-green-300',
  dang_lam: 'bg-yellow-400',
  da_cham: 'bg-blue-500 text-white',
  da_huy: 'bg-red-600 text-white'
}

export const getAttemptStatusLabel = (value: string): string => {
  return ATTEMPT_STATUS[value] || value;
}

export const getAttemptStatusBadge = (value: string): string => {
  return ATTEMPT_STATUS_BADGE[value] || value;
}

