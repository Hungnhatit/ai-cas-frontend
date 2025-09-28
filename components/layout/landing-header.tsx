"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/components/ui/use-mobile"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { useI18n } from "@/providers/i18n-provider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function LandingHeader() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useI18n()

  const navigationItems = [
    { name: t.features, href: "#features" },
    { name: t.pricing, href: "#pricing" },
    { name: t.about, href: "#about" },
    { name: t.contact, href: "#contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">E</span>
          </div>
          <span className="font-bold text-lg md:text-xl">AI-CAS</span>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />

          {!isMobile && (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" onClick={() => router.push("/auth/login")}>
                {t.signIn}
              </Button>
              <Button onClick={() => router.push("/auth/register")}>{t.getStarted}</Button>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-xs">E</span>
                    </div>
                    AI-CAS
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {navigationItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => {
                          router.push("/auth/login")
                          setMobileMenuOpen(false)
                        }}
                      >
                        {t.signIn}
                      </Button>
                      <Button
                        className="justify-start"
                        onClick={() => {
                          router.push("/auth/register")
                          setMobileMenuOpen(false)
                        }}
                      >
                        {t.getStarted}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}
