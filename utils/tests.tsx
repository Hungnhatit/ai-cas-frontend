import { Earth, Lock, GraduationCap, LockKeyhole } from "lucide-react";

export const VISIBILITY_ICON: Record<string, JSX.Element> = {
  cong_khai: <Earth className="inline ml-2 mr-2 text-gray-500" size={15} />,
  rieng_tu: <LockKeyhole className="inline ml-2 mr-2 text-gray-500" size={15} />,
  lop_hoc: <GraduationCap className="inline ml-2 mr-2 text-gray-500" size={15} />,
};

export const getVisibilityIcon = (value: string): JSX.Element | null => {
  return VISIBILITY_ICON[value] ?? null;
};
