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
