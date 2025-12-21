"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "student" | "instructor" | "admin"
  redirectTo?: string
}

export function AuthGuard({ children, requiredRole, redirectTo = "/auth/login" }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
        return
      }

      if (requiredRole && user.vai_tro !== requiredRole) {
        switch (user.vai_tro) {
          case "admin":
            router.push("/admin")
            break
          case "instructor":
            router.push("/instructor")
            break
          case "student":
            router.push("/dashboard")
            break
          default:
            router.push("/")
        }
        return
      }
    }
  }, [user, loading, router, requiredRole, redirectTo])

  if (!user) {
    return null
  }

  if (requiredRole && user.vai_tro !== requiredRole) {
    return null
  }

  return <>{children}</>
}
