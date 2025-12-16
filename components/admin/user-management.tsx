"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, UsersRound, UserCheck, BookUser, SquareUserRound } from "lucide-react"
import { useUsers } from "@/hooks/useUser"
import { UserRow } from "./user/UserRow"
import { User } from "@/types/interfaces/model";
import { DialogTrigger } from "@radix-ui/react-dialog"
import toast from "react-hot-toast"

export function UserManagement() {
  const { users, createUser, updateUser, softDeleteUser, forceDeleteUser, restoreUser } = useUsers()
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewUserDialogue, setIsNewUserDialogue] = useState(false);
  const [userInfo, setUserInfo] = useState({ ten: "", vai_tro: "", so_dien_thoai: "" });
  const [newUser, setNewUser] = useState({ email: '', ten: "", mat_khau: '', vai_tro: "", so_dien_thoai: "", anh_dai_dien: '' })

  const filtered = users.filter(u =>
    [u.ten, u.email].some(field => field?.toLowerCase().includes(search.toLowerCase())) &&

    (roleFilter === "all" || u.vai_tro === roleFilter) &&

    (statusFilter === "all" || u.trang_thai === statusFilter) &&

    u.vai_tro !== 'admin'
  )

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setUserInfo({
      ten: user.ten,
      vai_tro: user.vai_tro,
      so_dien_thoai: user.so_dien_thoai
    });
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!selectedUser) return
    await updateUser(selectedUser.ma_nguoi_dung, {
      ten: userInfo.ten,
      vai_tro: userInfo.vai_tro as "student" | "instructor" | "admin",
      so_dien_thoai: userInfo.so_dien_thoai,
    })
    setIsDialogOpen(false)
  }

  const handleCreateUser = async () => {
    try {
      await createUser(newUser);
      setIsNewUserDialogue(false);
    } catch (error: any) {
      toast.error(`Error when creating new user: ${error.message}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#232f3e] -mx-4 -mt-4 p-5">
        <h1 className="text-3xl font-bold text-white mb-2">Quản lý người dùng</h1>
        <p className="text-white">Quản lý người dùng, vai trò và trạng thái</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Tổng số người dùng</CardTitle>
            <UsersRound size={20} color="blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">+12% từ tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Đang hoạt động</CardTitle>
            <UserCheck className="" size={20} color="green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.trang_thai === "dang_hoat_dong").length}</div>
            <p className="text-xs text-muted-foreground">+8% từ tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Học viên</CardTitle>
            <BookUser size={20} className="font-bold text-teal-900" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.vai_tro === "student").length}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Giảng viên</CardTitle>
            <SquareUserRound size={20} className="text-amber-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.vai_tro === "instructor").length}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="gap-2">
        <CardHeader>
          <CardTitle className="text-xl">Quản lý người dùng</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-[3px] border-gray-300 shadow-none" />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px] rounded-[3px] border-gray-300 shadow-none cursor-pointer">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent className="rounded-[3px]">
              <SelectItem className="rounded-[3px] border-gray-300 shadow-none cursor-pointer" value="all">Tất cả</SelectItem>
              <SelectItem className="rounded-[3px] border-gray-300 shadow-none cursor-pointer" value="student">Học viên</SelectItem>
              <SelectItem className="rounded-[3px] border-gray-300 shadow-none cursor-pointer" value="instructor">Giảng viên</SelectItem>
              {/* <SelectItem className="rounded-[3px] border-gray-300 shadow-none cursor-pointer" value="admin">Admin</SelectItem> */}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] rounded-[3px] border-gray-300 shadow-none cursor-pointer">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="rounded-[3px]">
              <SelectItem className="rounded-[3px] border-gray-300 shadow-none cursor-pointer" value="all">Tất cả</SelectItem>
              <SelectItem className="rounded-[3px] border-gray-300 shadow-none cursor-pointer" value="dang_hoat_dong">Hoạt động</SelectItem>
              <SelectItem className="rounded-[3px] border-gray-300 shadow-none cursor-pointer" value="ngung_hoat_dong">Ngừng hoạt động</SelectItem>
            </SelectContent>
          </Select>
          <Button className="cursor-pointer rounded-[3px]" onClick={() => setIsNewUserDialogue(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        </CardContent>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Tài khoản</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Cập nhật lần cuối</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u, i) => (
                  <UserRow
                    key={u.ma_nguoi_dung}
                    user={u}
                    index={i}
                    onEdit={handleEdit}
                    onDelete={softDeleteUser}
                    onForceDelete={forceDeleteUser}
                    onRestore={restoreUser}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl rounded-[3px]">
          <DialogHeader>
            <DialogTitle>Cập nhật người dùng</DialogTitle>
            <DialogDescription>Thay đổi thông tin người dùng</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Tên</Label>
                <Input value={userInfo.ten} onChange={e => setUserInfo({ ...userInfo, ten: e.target.value })} className="col-span-3 rounded-[3px] border-gray-300 shadow-none" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Email</Label>
                <Input disabled value={selectedUser.email} className="col-span-3 rounded-[3px] border-gray-300 shadow-none" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Vai trò</Label>
                <Select value={userInfo.vai_tro} onValueChange={v => setUserInfo({ ...userInfo, vai_tro: v })}>
                  <SelectTrigger className="col-span-3 rounded-[3px] border-gray-300 shadow-none cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-[3px] border-gray-300 shadow-none cursor-pointer">
                    <SelectItem className="rounded-[3px] cursor-pointer" value="student">Student</SelectItem>
                    <SelectItem className="rounded-[3px] cursor-pointer" value="instructor">Instructor</SelectItem>
                    <SelectItem className="rounded-[3px] cursor-pointer" value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Số điện thoại</Label>
                <Input value={userInfo.so_dien_thoai ?? 'N/A'} onChange={e => setUserInfo({ ...userInfo, so_dien_thoai: e.target.value })} className="col-span-3 rounded-[3px] border-gray-300 shadow-none" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button className="rounded-[3px] cursor-pointer" onClick={handleSave}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Create new user */}
      <Dialog open={isNewUserDialogue} onOpenChange={setIsNewUserDialogue}>
        <DialogContent className="sm:max-w-2xl rounded-[3px]">
          <DialogHeader>
            <DialogTitle>Thêm người dùng mới</DialogTitle>
            <DialogDescription>Thêm người dùng mới với các thông tin liên quan</DialogDescription>
          </DialogHeader>

          <div>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Tên</Label>
                <Input value={newUser.ten} onChange={e => setNewUser({ ...newUser, ten: e.target.value })} className="col-span-3 rounded-[3px] border-gray-300 shadow-none" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Email</Label>
                <Input value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="col-span-3 rounded-[3px] border-gray-300 shadow-none" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Mật khẩu</Label>
                <Input value={newUser.mat_khau} onChange={(e) => setNewUser({ ...newUser, mat_khau: e.target.value })} className="col-span-3 rounded-[3px] border-gray-300 shadow-none" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Vai trò</Label>
                <Select value={newUser.vai_tro} onValueChange={v => setNewUser({ ...newUser, vai_tro: v })}>
                  <SelectTrigger className="col-span-3 rounded-[3px] border-gray-300 shadow-none cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-[3px] border-gray-300 shadow-none cursor-pointer">
                    <SelectItem className="rounded-[3px] cursor-pointer" value="student">Học viên</SelectItem>
                    <SelectItem className="rounded-[3px] cursor-pointer" value="instructor">Giảng viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Số điện thoại</Label>
                <Input value={newUser.so_dien_thoai} onChange={e => setNewUser({ ...newUser, so_dien_thoai: e.target.value })} className="col-span-3 rounded-[3px] border-gray-300 shadow-none" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button className="rounded-[3px] cursor-pointer" onClick={handleCreateUser}>
              Tạo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
