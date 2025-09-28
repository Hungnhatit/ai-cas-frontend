"use client"

import type React from "react"
import { LandingHeader } from "./landing-header"
import { Footer } from "./footer"

interface LandingLayoutProps {
  children: React.ReactNode
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
