"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen, Calendar, ChevronLeft, GraduationCap, Home, MessageSquare, Settings, Users, BarChart3, FileText, Award, Video, HelpCircle, BookType,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useAuth } from "@/providers/auth-provider"
import { useIsMobile } from "@/components/ui/use-mobile"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"

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
    title: 'Manage tests',
    href: '/tests',
    icon: BookType,
    roles: ['instructor']
  },
  {
    title: 'Your tests',
    href: '/student/tests-management',
    icon: BookType,
    roles: ['student']
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
  // initialize state directly from localStorage (lazy initializer)
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-collapsed");
      return saved === "true";
    }
    return false;
  });
  const pathname = usePathname()
  const { user } = useAuth()
  const isMobile = useIsMobile()

  const filteredNavItems = navItems.filter((item) => !item.roles || item.roles.includes(user?.vai_tro || "student"));

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed))
  }, [collapsed])

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  }

  const NavigationContent = () => (
    <nav className="flex-1 px-2 py-4">
      <ul className="space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      href={item.href}
                      onClick={isMobile ? onClose : undefined}
                      className={cn(
                        "group relative flex gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors text-nowrap",
                        "hover:bg-[#374151] hover:text-white",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-blue-400"
                          : "text-white",
                        collapsed && !isMobile && "justify-center",
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {(!collapsed || isMobile) && <span className="overflow-hidden">{item.title}</span>}
                    </Link>
                    <TooltipContent side="right" className="ml-4 bg-[#374151] text-sm 
                     text-white px-2 py-1 rounded-[4px] z-50">{item.title}</TooltipContent>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
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
                <SheetTitle className="font-bold text-lg text-sidebar-foreground text-nowrap">AI-CAS</SheetTitle>
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
        "relative flex flex-col h-full bg-[#1F2937] border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-56",
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-lg text-white text-nowrap">AI-CAS</span>
          </div>

        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 text-white hover:bg-sidebar-accent cursor-pointer"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <NavigationContent />
    </div>
  )
}
