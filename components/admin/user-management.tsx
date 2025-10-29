"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Trash2, UserCheck, UserX, UsersRound, BookUser, SquareUserRound, RotateCcw } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { userService } from "@/services/admin/userService"
import { User } from "@/types/interfaces/model"
import { formatDate } from "@/utils/formatDate";
import BlankUserIcon from '@/assets/icons/blank-avatar.png'
import { capitalizeFirstLetter } from "@/utils/string"
import toast from "react-hot-toast"

// Mock data for users
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "student",
    status: "active",
    joinDate: "2024-01-15",
    lastLogin: "2024-03-20",
    phone: "+1 (555) 123-4567",
    coursesEnrolled: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "instructor",
    status: "active",
    joinDate: "2023-09-10",
    lastLogin: "2024-03-21",
    phone: "+1 (555) 987-6543",
    coursesEnrolled: 0,
    coursesCreated: 8,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "student",
    status: "inactive",
    joinDate: "2024-02-20",
    lastLogin: "2024-03-10",
    phone: "+1 (555) 456-7890",
    coursesEnrolled: 2,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "admin",
    status: "active",
    joinDate: "2023-05-01",
    lastLogin: "2024-03-21",
    phone: "+1 (555) 321-0987",
    coursesEnrolled: 0,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await userService.getUsers();
      if (res.success) {
        setUsers(res.data);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.vai_tro === roleFilter
    const matchesStatus = statusFilter === "all" || user.trang_thai === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-amber-400"
      case "instructor":
        return "bg-blue-700"
      case "student":
        return "bg-gray-500"
      default:
        return "bg-teal-400"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    return status === "active" ? "default" : "secondary"
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      console.log("[v0] Deleting user:", userId);
      await userService.softDeleteUser(userId);
      setUsers((prev) =>
        prev.map((u) =>
          u.ma_nguoi_dung === userId
            ? { ...u, trang_thai: 'ngung_hoat_dong' }
            : u
        ));
      toast.success('User has been archived successfully!');
    } catch (error: any) {
      toast.error(`Failed to archive user: ${error.message}`)
    }
    setUsers(users.filter((user) => user.ma_nguoi_dung !== userId));
  }

  const handleForceDelete = async (user_id: number) => {
    try {

    } catch (error) {

    }
  }

  const handleRestoreUser = async (user_id: number) => {

  }

  const handleToggleStatus = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.ma_nguoi_dung === userId ? { ...user, status: user.trang_thai === "dang_hoat_dong" ? "inactive" : "active" } : user,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#232f3e] -mx-4 -mt-4 p-5">
        <h1 className="text-3xl font-bold text-white mb-2">Quản lý người dùng</h1>
        <p className="text-white">Quản lý tất cả người dùng, vai trò, phân quyền,...</p>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Total Users</CardTitle>
            <UsersRound size={20} color="blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Active Users</CardTitle>
            <UserCheck className="" size={20} color="green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.trang_thai === "dang_hoat_dong").length}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Students</CardTitle>
            <BookUser size={20} className="font-bold text-teal-900" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.vai_tro === "student").length}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Instructors</CardTitle>
            <SquareUserRound size={20} className="text-amber-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.vai_tro === "instructor").length}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="gap-3">
        <CardHeader>
          <CardTitle className="text-xl">Quản lý người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm tài khoản ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xs shadow-none border-gray-300"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-xs shadow-none border-gray-300 cursor-pointer">
                <SelectValue className="" placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="rounded-xs shadow-none border-gray-300 cursor-pointer">
                <SelectItem className="rounded-xs shadow-none border-gray-300 cursor-pointer" value="all">All Roles</SelectItem>
                <SelectItem className="rounded-xs shadow-none border-gray-300 cursor-pointer" value="student">Students</SelectItem>
                <SelectItem className="rounded-xs shadow-none border-gray-300 cursor-pointer" value="instructor">Instructors</SelectItem>
                <SelectItem className="rounded-xs shadow-none border-gray-300 cursor-pointer" value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-xs shadow-none border-gray-300 cursor-pointer">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="rounded-xs shadow-none border-gray-300 cursor-pointer" value="all">All Status</SelectItem>
                <SelectItem className="rounded-xs shadow-none border-gray-300 cursor-pointer" value="dang_hoat_dong">Active</SelectItem>
                <SelectItem className="rounded-xs shadow-none border-gray-300 cursor-pointer" value="ngung_hoat_dong">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button className="rounded-xs shadow-none border-gray-300 cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table className="rounded-xs">
              <TableHeader className="rounded-xs">
                <TableRow className="rounded-xs">
                  <TableHead className="rounded-xs">#</TableHead>
                  <TableHead className="rounded-xs">ID</TableHead>
                  <TableHead className="rounded-xs">Tài khoản</TableHead>
                  <TableHead className="rounded-xs">Số điện thoại</TableHead>
                  <TableHead className="rounded-xs">Vai trò</TableHead>
                  <TableHead className="rounded-xs">Trạng thái</TableHead>
                  <TableHead className="rounded-xs">Ngày tạo</TableHead>
                  <TableHead className="rounded-xs">Cập nhật lần cuối</TableHead>
                  <TableHead className="rounded-xs">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow key={user.ma_nguoi_dung}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.ma_nguoi_dung}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.anh_dai_dien} />
                          <AvatarFallback>
                            {user.ten
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.ten}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.so_dien_thoai}</TableCell>
                    <TableCell>
                      <span className={`${getRoleBadgeColor(user.vai_tro)} text-xs
                       ${user.vai_tro === 'admin' ? 'text-black' : 'text-white'} px-2 py-1 rounded-sm`}>{capitalizeFirstLetter(user.vai_tro)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(user.trang_thai)}>{user.trang_thai}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.ngay_tao)}</TableCell>
                    <TableCell>{formatDate(user.ngay_cap_nhat)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="cursor-pointer"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Cập nhật thông tin</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => handleToggleStatus(user.ma_nguoi_dung)}>
                          {user.trang_thai === "dang_hoat_dong" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" className="cursor-pointer"
                          onClick={() => user.trang_thai === 'dang_hoat_dong'
                            ? handleDeleteUser(user.ma_nguoi_dung)
                            : handleForceDelete(user.ma_nguoi_dung)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {user.trang_thai === 'ngung_hoat_dong' && (
                          <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => handleRestoreUser(user.ma_nguoi_dung)}>
                            <RotateCcw size={16} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl rounded-sm">
          <DialogHeader>
            <DialogTitle>Cập nhật thông tin</DialogTitle>
            <DialogDescription>Thực hiện thay đổi thông tin và quyền của người dùng.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên người dùng
                </Label>
                <Input id="name" defaultValue={selectedUser.ten} className="col-span-3 rounded-xs shadow-none border-gray-300" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" defaultValue={selectedUser.email} className="col-span-3 rounded-xs shadow-none border-gray-300" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Vai trò
                </Label>
                <Select defaultValue={selectedUser.vai_tro}>
                  <SelectTrigger className="col-span-3 rounded-xs shadow-none border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Điện thoại
                </Label>
                <Input id="phone" defaultValue={selectedUser.so_dien_thoai} className="col-span-3 rounded-xs shadow-none border-gray-300" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" className="rounded-xs">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
