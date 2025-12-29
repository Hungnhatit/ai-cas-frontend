"use client"

import { authService } from "@/services/authService"
import { useRouter } from "next/navigation"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export const STORAGE_KEYS = {
  TOKEN: 'access_token',
  USER: 'user_data'
}

interface User {
  ma_nguoi_dung: number
  email: string
  name: string
  vai_tro: "student" | "instructor" | "admin"
  avatar?: string
  anh_dai_dien?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string, name: string, vai_tro: string) => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // const savedUser = localStorage.getItem("lms-user")
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem(STORAGE_KEYS.USER)
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      const token = res.token || res.data?.token;
      const userData = res.user || res.data?.user;

      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const register = async (email: string, mat_khau: string, ten: string, vai_tro: string) => {
    setLoading(true);
    try {
      const res = await authService.register({
        email,
        mat_khau,
        ten,
        vai_tro: vai_tro as 'student' | 'instructor' | 'admin'
      });

      const token = res.token || res.data?.token;
      const userData = res.user || res.data?.user;

      if (token && userData) {
        setUser(userData);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    window.location.href = '/auth/login'
  }

  return <AuthContext.Provider value={{ user, login, logout, register, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
