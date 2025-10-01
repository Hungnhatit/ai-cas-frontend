"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/providers/auth-provider"
import { useIsMobile } from "@/components/ui/use-mobile"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { Footer } from "./footer"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will be handled by auth redirect
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Mobile Sidebar */}
      {isMobile && <Sidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />}

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className=" mx-auto px-4 py-4 md:py-6">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
