"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { User2, Bell, Shield, Palette, Save, Upload } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { User } from "@/types/interfaces/model"
import { userService } from "@/services/admin/userService"
import toast from "react-hot-toast"

export function SettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({
    ten: "",
    email: "",
    so_dien_thoai: "",
    bio: "",
    mat_khau: '',
    anh_dai_dien: '',
    dia_chi: ''
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    assignmentReminders: true,
    messageNotifications: true,
    weeklyDigest: false,
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showProgress: true,
    allowMessages: true,
  })

  const handleNotificationUpdate = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const handlePrivacyUpdate = (key: string, value: boolean | string) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }))
  }

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
    console.log('Hello world')
  };

  const handleProfileUpdate = async () => {
    if (!user?.ma_nguoi_dung) {
      console.log(false);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('ten', profileData.ten);
      formData.append('so_dien_thoai', profileData.so_dien_thoai);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-[#232f3e] -mx-4 -mt-4 shadow-lg p-5">
        <div>
          <h1 className="text-3xl mb-2 font-bold text-white">Cài đặt</h1>
          <p className="text-white">Quản lý tùy chọn và cài đặt tài khoản của bạn</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="h-10 grid w-full grid-cols-4 rounded-[3px] shadow-none border border-slate-300">
          <TabsTrigger className="cursor-pointer rounded-[3px] shadow-none" value="profile">Tài khoản</TabsTrigger>
          {/* <TabsTrigger className="cursor-pointer rounded-[3px] shadow-none" value="notifications">Thông báo</TabsTrigger> */}
          <TabsTrigger className="cursor-pointer rounded-[3px] shadow-none" value="privacy">Privacy</TabsTrigger>
          <TabsTrigger className="cursor-pointer rounded-[3px] shadow-none" value="appearance">Appearance</TabsTrigger>
          <TabsTrigger className="cursor-pointer rounded-[3px] shadow-none" value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User2 className="h-5 w-5" />
                Thông tin cá nhân
              </CardTitle>
              <CardDescription>
                Cập nhật thông tin cá nhân và chi tiết hồ sơ của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*"
              />
              <div className="flex items-center gap-6" >
                <Avatar className="h-20 w-20 cursor-pointer" onClick={triggerFileInput}>
                  <AvatarImage src={avatarUrl} alt={user?.name} className="border-2 border-blue-500  rounded-full " />
                  <AvatarFallback className="text-lg">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" onClick={triggerFileInput} className="cursor-pointer rounded-[3px]">
                    <Upload className="mr-2 h-4 w-4" />
                    Đổi ảnh đại diện
                  </Button>
                  <p className="text-sm text-muted-foreground">JPG hoặc PNG. Kích thước tối đa: 5MB</p>
                </div>
              </div>

              <Separator />

              {/* Detail infomation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ tên</Label>
                  <Input
                    id="name"
                    value={profileData.ten}
                    className="h-10 shadow-none border-gray-300 rounded-[3px]"
                    onChange={(e) => setProfileData((prev) => ({ ...prev, ten: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    disabled
                    id="email"
                    type="email"
                    className="h-10 shadow-none border-gray-300 rounded-[3px]"
                    value={profileData.email}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Số điện thoại</Label>
                  <Input
                    id="phone"
                    type="number"
                    className="h-10 shadow-none border-gray-300 rounded-[3px]"
                    value={profileData.so_dien_thoai}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, so_dien_thoai: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Tiểu sử</Label>
                <Textarea
                  id="bio"
                  placeholder="Hãy kể cho chúng tôi về bản thân bạn..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="rounded-[3px] shadow-none border-gray-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Địa chỉ</Label>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    className="h-10 shadow-none border-gray-300 rounded-[3px]"
                    value={profileData.dia_chi}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleProfileUpdate} className="cursor-pointer rounded-[3px]">
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin vai trò</CardTitle>
              <CardDescription>Vai trò và quyền hạn của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Vai trò hiện tại</p>
                  <p className="text-sm text-muted-foreground">
                    Cấp độ truy cập và quyền hạn của bạn
                  </p>
                </div>
                <Badge variant="default" className="capitalize">
                  {user?.vai_tro}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified about updates and activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationUpdate("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationUpdate("pushNotifications", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Course Updates</p>
                    <p className="text-sm text-muted-foreground">New lessons, announcements, and course changes</p>
                  </div>
                  <Switch
                    checked={notifications.courseUpdates}
                    onCheckedChange={(checked) => handleNotificationUpdate("courseUpdates", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Assignment Reminders</p>
                    <p className="text-sm text-muted-foreground">Reminders for upcoming assignment deadlines</p>
                  </div>
                  <Switch
                    checked={notifications.assignmentReminders}
                    onCheckedChange={(checked) => handleNotificationUpdate("assignmentReminders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Message Notifications</p>
                    <p className="text-sm text-muted-foreground">New messages from instructors and classmates</p>
                  </div>
                  <Switch
                    checked={notifications.messageNotifications}
                    onCheckedChange={(checked) => handleNotificationUpdate("messageNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Digest</p>
                    <p className="text-sm text-muted-foreground">Weekly summary of your learning progress</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) => handleNotificationUpdate("weeklyDigest", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>Control who can see your information and activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select
                    value={privacy.profileVisibility}
                    onValueChange={(value) => handlePrivacyUpdate("profileVisibility", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                      <SelectItem value="students">Students Only - Only enrolled students can see</SelectItem>
                      <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Email Address</p>
                    <p className="text-sm text-muted-foreground">Allow others to see your email address</p>
                  </div>
                  <Switch
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) => handlePrivacyUpdate("showEmail", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Learning Progress</p>
                    <p className="text-sm text-muted-foreground">Display your course progress and achievements</p>
                  </div>
                  <Switch
                    checked={privacy.showProgress}
                    onCheckedChange={(checked) => handlePrivacyUpdate("showProgress", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allow Messages</p>
                    <p className="text-sm text-muted-foreground">Let other users send you messages</p>
                  </div>
                  <Switch
                    checked={privacy.allowMessages}
                    onCheckedChange={(checked) => handlePrivacyUpdate("allowMessages", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize how the application looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select defaultValue="dark">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage your account settings and data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Change Password</h4>
                  <p className="text-sm text-muted-foreground mb-4">Update your password to keep your account secure</p>
                  <Button variant="outline">Change Password</Button>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Export Data</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download a copy of your data including courses, progress, and messages
                  </p>
                  <Button variant="outline">Export Data</Button>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2 text-destructive">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground mb-4">These actions are permanent and cannot be undone</p>
                  <div className="space-y-2">
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
