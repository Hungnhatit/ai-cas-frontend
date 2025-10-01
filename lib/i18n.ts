export type Language = "en" | "vi"

export interface Translations {
  // Navigation
  features: string
  pricing: string
  about: string
  contact: string
  signIn: string
  getStarted: string

  // Dashboard
  search: string
  profile: string
  settings: string
  logout: string
  dashboard: string

  // Common
  language: string
  english: string
  vietnamese: string
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    features: "Features",
    pricing: "Pricing",
    about: "About",
    contact: "Contact",
    signIn: "Sign In",
    getStarted: "Get Started",

    // Dashboard
    search: "Search courses, students, or content...",
    profile: "Profile",
    settings: "Settings",
    logout: "Log out",
    dashboard: 'Dashboard',

    // Common
    language: "Language",
    english: "English",
    vietnamese: "Vietnamese",
  },
  vi: {
    // Navigation
    features: "Tính năng",
    pricing: "Bảng giá",
    about: "Giới thiệu",
    contact: "Liên hệ",
    signIn: "Đăng nhập",
    getStarted: "Bắt đầu",

    // Dashboard
    search: "Tìm kiếm khóa học, học viên hoặc nội dung...",
    profile: "Hồ sơ",
    settings: "Cài đặt",
    logout: "Đăng xuất",
    dashboard: 'Bảng điều khiển',

    // Common
    language: "Ngôn ngữ",
    english: "Tiếng Anh",
    vietnamese: "Tiếng Việt",
  },
}

export const defaultLanguage: Language = "en"
