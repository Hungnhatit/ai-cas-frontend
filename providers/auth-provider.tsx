"use client"

import { authService } from "@/services/authService"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  user_id: number
  email: string
  name: string
  role: "student" | "instructor" | "admin"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string, name: string, role: string) => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

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
    //   role: email.includes("admin") ? "admin" : email.includes("instructor") ? "instructor" : "student",
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

  const register = async (email: string, password: string, name: string, role: string) => {
    // setLoading(true)
    // // Mock registration - replace with real API
    // const mockUser: User = {
    //   user_id: Date.now().toString(),
    //   email,
    //   name,
    //   role: role as "student" | "instructor" | "admin",
    //   avatar: `/placeholder.svg?height=40&width=40&query=avatar`,
    // }
    // setUser(mockUser)
    // localStorage.setItem("lms-user", JSON.stringify(mockUser))
    // setLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("lms-user");
    localStorage.removeItem("token")
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
