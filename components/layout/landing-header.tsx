"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/components/ui/use-mobile"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/providers/auth-provider"

export function LandingHeader() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const navigationItems = [
    // { name: 'Features', href: "#features", role: [] },
    { name: 'Đề thi online', href: "/test-library", role: [] },
    { name: 'Blog', href: "/post", role: [] },
    { name: 'Liên hệ', href: "#contact", role: [] },
    { name: 'Dashboard', href: "/dashboard", role: ['admin', 'instructor'] },
    { name: 'Tài khoản', href: `/student/${user?.ma_nguoi_dung}/setting`, role: ['student'] },
    { name: 'Về chúng tôi', href: '/about-us', role: [] }
  ]

  const handleLogout = () => {
    console.log("[v0] Logout clicked")
    logout()
  }

  const visibleNav = navigationItems.filter((item) => {
    if (item.role.length === 0) return true;

    if (!user) return false;

    return item.role.includes(user.vai_tro);
  })

  return (
    <header className="top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="bg-slate-200 px-8 flex items-center justify-between">
        <div className="font-medium">Trường Đại học Sư phạm Kỹ thuật - Đại học Đà Nẵng</div>
        <div className="flex">
          <LanguageToggle />
          <ThemeToggle />
          {user && (
            <Button
              variant="ghost"
              className="cursor-pointer rounded-[3px]"
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          )
          }
          {!user && (
            <div>
              <Button
                variant="ghost"
                className="cursor-pointer rounded-[3px]"
                onClick={() => {
                  router.push("/auth/login")
                  setMobileMenuOpen(false)
                }}
              >
                Đăng nhập
              </Button>
              <Button
                variant="ghost"
                className="cursor-pointer rounded-[3px]"
                onClick={() => {
                  router.push("/auth/register")
                  setMobileMenuOpen(false)
                }}
              >
                Đăng ký
              </Button>
            </div>
          )
          }
        </div>

      </div>

      <div className=" bg-[#232f3e] flex h-16 items-center justify-between px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">E</span>
          </div>
          <span className="font-bold text-white text-lg md:text-xl">AI-CAS</span>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center gap-6">
            {visibleNav.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-white hover:text-gray-400 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>
        )}

        {/* Right Side Actions */}
        {isMobile && (
          <div className="flex items-center gap-2">
            {/* <LanguageToggle />
          <ThemeToggle /> */}

            {/* {!isMobile && (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" onClick={() => router.push("/auth/login")}>
                {t.signIn}
              </Button>
              <Button onClick={() => router.push("/auth/register")}>{t.getStarted}</Button>
            </div>
          )} */}

            {/* Mobile Menu */}
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
                        className="justify-start cursor-pointer"
                        onClick={() => {
                          router.push("/auth/login")
                          setMobileMenuOpen(false)
                        }}
                      >
                        Sign in
                      </Button>
                      <Button
                        className="justify-start cursor-pointer"
                        onClick={() => {
                          router.push("/auth/register")
                          setMobileMenuOpen(false)
                        }}
                      >
                        Get started
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </header>
  )
}
