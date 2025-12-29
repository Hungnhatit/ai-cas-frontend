"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Bell, Lock, Palette, Settings, Camera, Loader2, Trash2, Globe, MapPin,
  Link as LinkIcon,
  User2,
  Info
} from "lucide-react";
import { User } from "@/types/interfaces/model"
import { userService } from "@/services/admin/userService"
import toast from "react-hot-toast";
import { useAuth } from "@/providers/auth-provider"
import { MdOutlineManageAccounts } from "react-icons/md"

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [student, setStudent] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    ten: "",
    email: "",
    so_dien_thoai: "",
    tieu_su: "Học viên đam mê công nghệ và thiết kế.",
    mat_khau: '',
    anh_dai_dien: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    courseUpdates: true,
    assignmentReminders: true,
    marketing: false,
  });

  useEffect(() => {
    const fetchStudent = async () => {
      if (!user?.ma_nguoi_dung) return;

      try {
        const res = await userService.getUserById(user.ma_nguoi_dung);
        if (res.success && res.data) {
          const u = res.data;
          setProfileData(prev => ({
            ...prev,
            ten: u.ten || "",
            email: u.email || "",
            so_dien_thoai: u.so_dien_thoai || "",
          }));
          setAvatarUrl(u.anh_dai_dien || "");
        }
      } catch (error) {
        console.error("Lỗi tải thông tin:", error);
        toast.error('Cannot load user info');
      }
    }

    fetchStudent();
  }, [user, toast]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (!user?.ma_nguoi_dung) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('ten', profileData.ten);
      formData.append('so_dien_thoai', profileData.so_dien_thoai);
      formData.append('tieu_su', profileData.tieu_su);

      if (avatarFile) {
        formData.append('anh_dai_dien', avatarFile);
      }

      const res = await userService.updateUser(user.ma_nguoi_dung, formData);

      if (res.success) {
        toast.success('Cập nhật thành công');
        setAvatarFile(null);

        if (res.data && res.data.anh_dai_dien) {
          setAvatarUrl(res.data.anh_dai_dien);
        }
      } else {
        toast.error('Có lỗi xảy ra');
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Lỗi hệ thống khi cập nhật thông tin tài khoản');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container max-w-6xl mx-auto pb-10 px-4 md:px-6">
      <div className="space-y-2 mb-8">
        <div className="flex items-center gap-2">
          <MdOutlineManageAccounts size={32} className="text-blue-800" />
          <h2 className="text-4xl font-bold tracking-tight">Cài đặt tài khoản</h2>
        </div>
        <p className="text-lg">
          Quản lý thông tin cá nhân, tùy chọn hiển thị và bảo mật.
        </p>
      </div>

      <Tabs defaultValue="profile" className=" flex flex-col lg:flex-row justify-between gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-1/4">
          <TabsList className="bg-white shadow-lg p-4 flex flex-row lg:flex-col justify-start h-auto w-full gap-2">
            <TabsTrigger
              value="profile"
              className="w-full justify-start rounded-sm shadow-none cursor-pointer px-3 py-2 h-10 data-[state=active]:bg-[#3012b5]/5 transition-all data-[state=active]:text-black data-[state=active]:shadow-none font-medium"
            >
              <User2 className="mr-2 h-4 w-4" />
              Hồ sơ
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="w-full justify-start rounded-sm shadow-none cursor-pointer px-3 py-2 h-10 data-[state=active]:bg-[#3012b5]/5 transition-all data-[state=active]:text-black data-[state=active]:shadow-none font-medium"
            >
              <Settings className="mr-2 h-4 w-4" />
              Tài khoản
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="w-full justify-start rounded-sm shadow-none cursor-pointer px-3 py-2 h-10 data-[state=active]:bg-[#3012b5]/5 transition-all data-[state=active]:text-black data-[state=active]:shadow-none font-medium"
            >
              <Bell className="mr-2 h-4 w-4" />
              Thông báo
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="w-full justify-start rounded-sm shadow-none cursor-pointer px-3 py-2 h-10 data-[state=active]:bg-[#3012b5]/5 transition-all data-[state=active]:text-black data-[state=active]:shadow-none font-medium"
            >
              <Palette className="mr-2 h-4 w-4" />
              Giao diện
            </TabsTrigger>
          </TabsList>
        </aside>

        <div className="flex-1">
          <TabsContent value="profile" className="space-y-6 mt-0">
            <Card className="rounded-xl shadow-xl border-none">
              <CardHeader>
                <CardTitle className="text-xl">Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Đây là thông tin hiển thị công khai trên hồ sơ học viên của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">

                {/* Avatar Section */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      className="hidden"
                      accept="image/*"
                    />

                    <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                      <Avatar className="h-28 w-28 border-2 border-border">
                        <AvatarImage src={avatarUrl} alt={profileData.ten} className="object-cover" />
                        <AvatarFallback className="text-2xl bg-muted">{profileData.ten.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs rounded-sm shadow-none cursor-pointer"
                      onClick={triggerFileInput}
                    >
                      Đổi ảnh
                    </Button>

                    {/* {avatarFile && (
                      <div className="flex items-start gap-1 text-amber-900 animate-pulse bg-amber-50 px-2 py-1 rounded text-xs font-medium border border-amber-200">
                        <Info className="h-3 w-3" />
                        <p className="text-wrap">Nhấn "Lưu thay đổi" <br /> để cập nhật</p>
                      </div>
                    )} */}

                  </div>

                  <div className="flex-1 space-y-4 w-full">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Họ và tên</Label>
                      <Input
                        id="name"
                        value={profileData.ten}
                        onChange={(e) => setProfileData({ ...profileData, ten: e.target.value })}
                        className="h-10 rounded-md shadow-none border-gray-300"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Số điện thoại</Label>
                      <Input
                        id="phone"
                        value={profileData.so_dien_thoai}
                        onChange={(e) => setProfileData({ ...profileData, so_dien_thoai: e.target.value })}
                        className="h-10 rounded-md shadow-none border-gray-300"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Giới thiệu bản thân</Label>
                      <Textarea
                        id="bio"
                        placeholder="Ví dụ: Tôi là học viên khóa lập trình..."
                        className="resize-none min-h-[100px] rounded-md shadow-none border-gray-300"
                        value={profileData.tieu_su}
                        onChange={(e) => setProfileData({ ...profileData, tieu_su: e.target.value })}
                      />
                      <p className="text-[0.8rem] text-muted-foreground">
                        Viết ngắn gọn về mục tiêu học tập hoặc sở thích của bạn.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contact Info */}
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      Địa điểm
                    </Label>
                    {/* <Input
                      placeholder="VD: TP. Hồ Chí Minh"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="h-10 rounded-[3px] shadow-none border-gray-300"
                    /> */}
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      Website / Portfolio
                    </Label>
                    {/* <Input
                      placeholder="https://..."
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      className="h-10 rounded-[3px] shadow-none border-gray-300"
                    /> */}
                  </div>
                </div>

              </CardContent>
              <CardFooter className="flex justify-end border-t pt-6">
                <Button onClick={handleSave} disabled={isLoading} className="rounded-sm cursor-pointer">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Lưu thay đổi
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* TAB: TÀI KHOẢN */}
          <TabsContent value="account" className="space-y-6 mt-0">
            <Card className="rounded-xl border-none shadow-xl">
              <CardHeader>
                <CardTitle>Thông tin đăng nhập</CardTitle>
                <CardDescription>
                  Quản lý email, mật khẩu và bảo mật tài khoản.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email đăng nhập</Label>
                  <div className="flex gap-2">
                    <Input id="email" value={profileData.email} disabled className="bg-gray-200" />
                    <Button variant="outline" size="icon" title="Email không thể thay đổi">
                      <Lock className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Liên hệ quản trị viên nếu bạn cần thay đổi email.
                  </p>
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-3">Vai trò hiện tại</h3>
                  <Badge variant="secondary" className="px-3 py-1 text-sm font-normal uppercase tracking-wide">
                    {user?.vai_tro || "Học viên (Student)"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-none shadow-xl">
              <CardHeader>
                <CardTitle className="text-destructive">Vùng nguy hiểm</CardTitle>
                <CardDescription>
                  Các hành động này không thể hoàn tác. Hãy cẩn thận.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="space-y-1">
                    <p className="font-medium text-destructive">Xóa tài khoản</p>
                    <p className="text-sm text-muted-foreground">Xóa vĩnh viễn tài khoản và dữ liệu học tập.</p>
                  </div>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa tài khoản
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: THÔNG BÁO */}
          <TabsContent value="notifications" className="space-y-6 mt-0">
            <Card className="rounded-xl border-none shadow-xl">
              <CardHeader>
                <CardTitle>Tùy chọn thông báo</CardTitle>
                <CardDescription>
                  Chọn cách bạn muốn nhận thông tin từ hệ thống.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Kênh thông báo</h4>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="email-notif" className="flex flex-col items-start space-y-1 cursor-pointer">
                      <span>Email</span>
                      <span className="font-normal text-sm text-muted-foreground">Nhận thông báo qua địa chỉ email đăng ký.</span>
                    </Label>
                    <Switch
                      id="email-notif"
                      checked={notifications.emailNotifications}
                      onCheckedChange={(v) => setNotifications({ ...notifications, emailNotifications: v })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="push-notif" className="flex flex-col items-start space-y-1 cursor-pointer">
                      <span>Thông báo trình duyệt</span>
                      <span className="font-normal text-sm text-muted-foreground">Nhận thông báo pop-up trên trình duyệt web.</span>
                    </Label>
                    <Switch
                      id="push-notif"
                      checked={notifications.pushNotifications}
                      onCheckedChange={(v) => setNotifications({ ...notifications, pushNotifications: v })}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h4 className="text-lg font-medium">Loại nội dung</h4>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="course-update" className="flex flex-col items-start space-y-1">
                      <span>Cập nhật khóa học</span>
                      <span className="font-normal text-sm text-muted-foreground">Khi có bài học mới hoặc tài liệu mới.</span>
                    </Label>
                    <Switch checked={notifications.courseUpdates} onCheckedChange={(v) => setNotifications({ ...notifications, courseUpdates: v })} />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="reminder" className="flex flex-col items-start space-y-1">
                      <span>Nhắc nhở bài tập</span>
                      <span className="font-normal text-sm text-muted-foreground">Sắp đến hạn nộp bài hoặc lịch thi.</span>
                    </Label>
                    <Switch checked={notifications.assignmentReminders} onCheckedChange={(v) => setNotifications({ ...notifications, assignmentReminders: v })} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-6">
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Lưu cài đặt
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* TAB: GIAO DIỆN */}
          <TabsContent value="appearance" className="space-y-6 mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Giao diện & Ngôn ngữ</CardTitle>
                <CardDescription>
                  Tùy chỉnh trải nghiệm nhìn và đọc của bạn trên hệ thống.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                  <Label>Chế độ màu (Theme)</Label>
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    {/* Light Theme Preview */}
                    <div className="cursor-pointer space-y-2">
                      <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                        <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                          <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                            <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                          </div>
                        </div>
                      </div>
                      <span className="block w-full p-2 text-center font-normal text-sm">Sáng (Light)</span>
                    </div>
                    {/* Dark Theme Preview */}
                    <div className="cursor-pointer space-y-2">
                      <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                        <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                          <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                            <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                          </div>
                        </div>
                      </div>
                      <span className="block w-full p-2 text-center font-normal text-sm">Tối (Dark)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Ngôn ngữ
                    </Label>
                    <Select defaultValue="vi">
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Chọn ngôn ngữ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vi">Tiếng Việt</SelectItem>
                        <SelectItem value="en">English (United States)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default SettingsPage;