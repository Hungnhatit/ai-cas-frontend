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

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Mobile Sidebar */}
      {isMobile && <Sidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />}

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto px-4 py-4">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
