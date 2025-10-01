"use client"

import { Bell, Search, Settings, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/providers/auth-provider"
import { useIsMobile } from "@/components/ui/use-mobile"
import { useState } from "react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { useI18n } from "@/providers/i18n-provider"
import { useRouter } from "next/navigation"

interface HeaderProps {
  onMobileMenuToggle?: () => void
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth()
  const isMobile = useIsMobile()
  const [showSearch, setShowSearch] = useState(false)
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { t } = useI18n()

  const handleProfileClick = () => {
    console.log("[v0] Profile clicked")
    router.push("/settings")
    setDropdownOpen(false)
  }

  const handleSettingsClick = () => {
    console.log("[v0] Settings clicked")
    router.push("/settings")
    setDropdownOpen(false)
  }

  const handleLogoutClick = () => {
    console.log("[v0] Logout clicked")
    logout()
    setDropdownOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-4">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onMobileMenuToggle} className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-lg md:text-xl">AI-CAS</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-center max-w-md mx-4">
          {!isMobile && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder={t.search} className="pl-10 bg-muted/50" />
            </div>
          )}
          {isMobile && !showSearch && (
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)} className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
          )}
          {isMobile && showSearch && (
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search..." className="pl-10 bg-muted/50" autoFocus />
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          {!showSearch && (
            <>
              <LanguageToggle />
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4 md:h-5 md:w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>

              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 md:h-10 md:w-10 rounded-full"
                    onClick={() => {
                      console.log("[v0] Dropdown trigger clicked")
                      setDropdownOpen(!dropdownOpen)
                    }}
                  >
                    <Avatar className="h-8 w-8 md:h-10 md:w-10">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" sideOffset={5}>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      <Badge variant="secondary" className="w-fit mt-1 capitalize">
                        {user?.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="mr-2 h-4 w-4" />
                    <span>{t.profile}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSettingsClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t.settings}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogoutClick}>
                    <span>{t.logout}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
