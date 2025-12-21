"use client"

import type React from "react"
import { LandingHeader } from "./landing-header"
import { Footer } from "./footer"
import LandingFooter from "./LandingFooter"

interface LandingLayoutProps {
  children: React.ReactNode
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="flex flex-col bg-slate-50">
      <LandingHeader />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </div>
  )
}
