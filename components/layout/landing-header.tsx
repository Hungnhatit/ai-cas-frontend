"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, GraduationCap, Menu, Search, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/components/ui/use-mobile"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageToggle } from "@/components/ui/language-toggle"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/providers/auth-provider"
import { Input } from "../ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { api } from "@/lib/axios"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import Link from "next/link"
import { Card, CardContent } from "../ui/card"
import { formatDate } from "@/utils/formatDate"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"

export function LandingHeader() {
  const [results, setResults] = useState<{ posts: any[]; exams: any[] }>({ posts: [], exams: [] });
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter()
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();

  const debouncedQuery = useDebounce(search, 500);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!debouncedQuery) {
        setResults({ posts: [], exams: [] });
        return;
      }

      setLoading(true);
      try {
        const res = await api.get(`/search?q=${debouncedQuery}`);
        if (res.data.success) {
          setResults(res.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [debouncedQuery]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const navigationItems = [
    { name: 'Đề thi online', href: "/test-library", role: [] },
    { name: 'Blog', href: "/post", role: [] },
    { name: 'Liên hệ', href: "#contact", role: [] },
    { name: 'Dashboard', href: "/dashboard", role: ['admin', 'instructor'] },
    // { name: 'Tài khoản', href: `/student/${user?.ma_nguoi_dung}/setting`, role: ['student'] },
    { name: 'Về chúng tôi', href: '/about-us', role: [] }
  ]

  const handleLogout = () => {
    console.log("[v0] Logout clicked")
    logout()
  }

  const handleProfileClick = () => {
    console.log("[v0] Profile clicked")
    router.push(`/student/${user?.ma_nguoi_dung}/setting`)
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

  const visibleNav = navigationItems.filter((item) => {
    if (item.role.length === 0) return true;

    if (!user) return false;

    return item.role.includes(user.vai_tro);
  });

  console.log("USER: ", user);

  return (
    <header className="flex flex-col gap-3 top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div>
        <div className="bg-slate-200 px-8 flex items-center justify-between">
          <div className="font-medium">Trường Đại học Sư phạm Kỹ thuật - Đại học Đà Nẵng</div>
          <div className="flex">
            <LanguageToggle />
            <ThemeToggle />
            {/* {user && (
              <Button
                variant="ghost"
                className="cursor-pointer rounded-[3px]"
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            )
            } */}
            {/* {!user && (
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
            } */}
          </div>

        </div>

        <div className=" bg-[#232f3e] flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center ">
              <span className="text-primary-foreground font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-white bg-transparent text-lg md:text-xl  text-shadow-indigo-50 hover:text-shadow-xs hover:text-shadow-indigo-200 transition-all">AI-CAS</span>
          </div>

          <div className="flex items-center justify-between gap-6">
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

            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 md:h-10 md:w-10 rounded-full cursor-pointer"
                  onClick={() => {
                    console.log("[v0] Dropdown trigger clicked")
                    setDropdownOpen(!dropdownOpen)
                  }}
                >
                  <Avatar className="h-8 w-8 md:h-10 md:w-10 border-4 border-sky-400">
                    <AvatarImage src={user?.anh_dai_dien || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" sideOffset={5}>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-sm leading-none text-muted-foreground">{user?.email}</p>
                    <Badge variant="secondary" className="w-fit mt-1 capitalize">
                      {user?.vai_tro}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Hồ sơ</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Trang cá nhân</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogoutClick} className="cursor-pointer">
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>


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
      </div>

      <div className="flex justify-end mr-2 mb-2">
        <div className="w-[300px] relative bg-white rounded-sm cursor-pointer" onClick={() => setIsSearchOpen(true)}>
          <Search className=" absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm thông tin..." className="pl-10 h-8 rounded-sm  border-slate-300 hover:bg-gray-100 transition-all shadow-none cursor-pointer" />
        </div>
      </div>

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-xl rounded-md border-8">
          <DialogHeader>
            <DialogTitle>
              Tìm kiếm bài viết, bài thi
            </DialogTitle>
            <DialogDescription>

            </DialogDescription>
          </DialogHeader>

          <div>
            <div className="space-y-3">
              <div className="">
                <div className="relative bg-white rounded-sm">
                  <Search className=" absolute left-3 top-2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Tìm kiếm thông tin..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-8 rounded-sm  border-slate-300 hover:bg-gray-100 transition-all shadow-none" />
                </div>
              </div>

              <div className="h-96 overflow-y-auto">
                {!loading && search && (
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="all">Tất cả ({results.posts.length + results.exams.length})</TabsTrigger>
                      <TabsTrigger value="posts">Bài viết ({results.posts.length})</TabsTrigger>
                      <TabsTrigger value="exams">Bài thi ({results.exams.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-6 mt-6">
                      {/* Hiển thị tóm tắt Bài thi */}
                      {results.exams.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <GraduationCap className="text-blue-600" /> Bài thi liên quan
                          </h3>
                          <div className="grid gap-3">
                            {results.exams.map((exam: any) => (
                              <SearchResultItem key={exam.ma_bai_thi} type="exam" data={exam} />
                            ))}
                          </div>
                        </div>
                      )}

                      {results.posts.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <FileText className="text-green-600" /> Bài viết liên quan
                          </h3>
                          <div className="grid gap-3">
                            {results.posts.map((post: any) => (
                              <SearchResultItem key={post.ma_bai_viet} type="post" data={post} />
                            ))}
                          </div>
                        </div>
                      )}

                      {results.posts.length === 0 && results.exams.length === 0 && (
                        <div className="text-center text-gray-500 py-10">Không tìm thấy kết quả nào.</div>
                      )}
                    </TabsContent>

                    <TabsContent value="posts" className="mt-4 space-y-3">
                      {results.posts.map((post: any) => (
                        <SearchResultItem key={post.ma_bai_viet} type="post" data={post} />
                      ))}
                    </TabsContent>

                    <TabsContent value="exams" className="mt-4 space-y-3">
                      {results.exams.map((exam: any) => (
                        <SearchResultItem key={exam.ma_kiem_tra} type="exam" data={exam} />
                      ))}
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            {/* <Button className="rounded-[3px] cursor-pointer" onClick={() => { }}>
              Tạo
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}

const SearchResultItem = ({ type, data }: { type: 'post' | 'exam', data: any }) => {
  const href = type === 'post' ? `/post/${data.ma_bai_viet}` : `/test-library/test/${data.ma_kiem_tra}`;
  const Icon = type === 'post' ? FileText : GraduationCap;
  const key = type === 'post' ? data.ma_bai_viet : data.ma_kiem_tra;
  return (
    <Link href={href} key={key}>
      <Card className="hover:bg-slate-50 p-1 transition-colors cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500" key={key}>
        <CardContent className="p-4 flex items-start gap-4">
          <div className={`p-2 rounded-full ${type === 'post' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
            <Icon size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{data.tieu_de}</h4>
            <p className="text-sm text-gray-500 line-clamp-1">
              {type === 'post' ? data.tom_tat : data.mo_ta || "Không có mô tả"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(data.ngay_tao)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
