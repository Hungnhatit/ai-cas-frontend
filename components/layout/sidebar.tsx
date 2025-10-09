"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  GraduationCap,
  Home,
  MessageSquare,
  Settings,
  Users,
  BarChart3,
  FileText,
  Award,
  Video,
  HelpCircle,
  BookType,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useAuth } from "@/providers/auth-provider"
import { useIsMobile } from "@/components/ui/use-mobile"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: ("student" | "instructor" | "admin")[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "My Courses",
    href: "/courses",
    icon: BookOpen,
    roles: ["student", "instructor"],
  },
  {
    title: "Course Management",
    href: "/manage-courses",
    icon: GraduationCap,
    roles: ["instructor", "admin"],
  },
  {
    title: "Students",
    href: "/students",
    icon: Users,
    roles: ["instructor", "admin"],
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    title: 'Test',
    href: '/tests',
    icon: BookType
  },
  {
    title: "Assignments",
    href: "/assignments",
    icon: FileText,
  },
  {
    title: "Manage Assignments",
    href: "/manage-assignments",
    icon: FileText,
    roles: ["instructor", "admin"],
  },
  {
    title: "Quizzes",
    href: "/quizzes",
    icon: HelpCircle,
    roles: ['student', 'admin'] //temporary hide quizzes for instructor
  },
  {
    title: "Manage Quizzes",
    href: "/manage-quizzes",
    icon: HelpCircle,
    roles: ["instructor", "admin"],
  },
  {
    title: "Grades",
    href: "/grades",
    icon: Award,
  },
  {
    title: "Live Sessions",
    href: "/sessions",
    icon: Video,
    roles: ["instructor", "admin"],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ["instructor", "admin"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()
  const isMobile = useIsMobile()

  const filteredNavItems = navItems.filter((item) => !item.roles || item.roles.includes(user?.vai_tro || "student"))

  const NavigationContent = () => (
    <nav className="flex-1 px-2 py-4">
      <ul className="space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={isMobile ? onClose : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground",
                  collapsed && !isMobile && "justify-center",
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {(!collapsed || isMobile) && <span>{item.title}</span>}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
          <SheetHeader className="p-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                  <span className="text-sidebar-primary-foreground font-bold text-sm">E</span>
                </div>
                <SheetTitle className="font-bold text-lg text-sidebar-foreground">AI-CAS</SheetTitle>
              </div>
            </div>
          </SheetHeader>
          <NavigationContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">AI-CAS</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <NavigationContent />
    </div>
  )
}
