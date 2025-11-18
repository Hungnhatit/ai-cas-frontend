"use client"

import { authService } from "@/services/authService"
import { useRouter } from "next/navigation"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  ma_nguoi_dung: number
  email: string
  name: string
  vai_tro: "student" | "instructor" | "admin"
  avatar?: string
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
    // Check for existing session
    const savedUser = localStorage.getItem("lms-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // setLoading(true)
    // // Mock authentication - replace with real API
    // const mockUser: User = {
    //   user_id: "1",
    //   email,
    //   name: email.split("@")[0],
    //   vai_tro: email.includes("admin") ? "admin" : email.includes("instructor") ? "instructor" : "student",
    //   avatar: `/placeholder.svg?height=40&width=40&query=avatar`,
    // }
    // setUser(mockUser)
    // localStorage.setItem("lms-user", JSON.stringify(mockUser))
    // setLoading(false)
    setLoading(true);
    try {
      const { token, user } = await authService.login(email, password);

      localStorage.setItem("token", token);
      localStorage.setItem("lms-user", JSON.stringify(user));

      setUser(user); // cập nhật context
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

      const { user, token } = res;
      setUser(user);
      localStorage.setItem("lms-user", JSON.stringify(user))
      localStorage.setItem("lms-token", token);
      return user;
    } catch (error) {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("lms-user");
    localStorage.removeItem("token");
    router.push('/auth/login')
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
