// "use client"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//   Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
// } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Search, Plus, Edit, Trash2, UserCheck, UserX, UsersRound, BookUser, SquareUserRound, RotateCcw, Trash } from "lucide-react"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
// import { userService } from "@/services/admin/userService"
// import { User } from "@/types/interfaces/model"
// import { formatDate } from "@/utils/formatDate";
// import BlankUserIcon from '@/assets/icons/blank-avatar.png'
// import { capitalizeFirstLetter } from "@/utils/string"
// import toast from "react-hot-toast"
// import ConfirmModal from "../modals/confirm-modal"

// export function UserManagement() {
//   const [users, setUsers] = useState<User[]>([])
//   const [searchTerm, setSearchTerm] = useState("");
//   const [roleFilter, setRoleFilter] = useState("all")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [selectedUser, setSelectedUser] = useState<User | null>(null)
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [userInfo, setUserInfo] = useState({
//     ten: '',
//     vai_tro: '',
//     so_dien_thoai: ''
//   })

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const res = await userService.getUsers();
//       if (res.success) {
//         setUsers(res.data);
//       }
//     }
//     fetchUsers();
//   }, []);

//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesRole = roleFilter === "all" || user.vai_tro === roleFilter
//     const matchesStatus = statusFilter === "all" || user.trang_thai === statusFilter
//     return matchesSearch && matchesRole && matchesStatus
//   })

//   const getRoleBadgeColor = (role: string) => {
//     switch (role) {
//       case "admin":
//         return "bg-amber-400"
//       case "instructor":
//         return "bg-blue-700"
//       case "student":
//         return "bg-gray-500"
//       default:
//         return "bg-teal-400"
//     }
//   }

//   const getStatusBadgeVariant = (status: string) => {
//     return status === "active" ? "default" : "secondary"
//   }

//   const handleEditUser = (user: User) => {
//     setSelectedUser(user)
//     setIsEditDialogOpen(true);
//     setUserInfo({
//       ten: user.ten,
//       vai_tro: user.vai_tro,
//       so_dien_thoai: user.so_dien_thoai
//     })
//   }

//   const handleUpdateUser = async (user_id: number | undefined) => {
//     if (!user_id) return;
//     try {
//       const res = await userService.updateUser(user_id, userInfo);
//       if (res.success) {
//         setUsers((prev) =>
//           prev.map((u) =>
//             u.ma_nguoi_dung === user_id
//               ? {
//                 ...u,
//                 ten: userInfo.ten,
//                 so_dien_thoai: userInfo.so_dien_thoai,
//                 vai_tro: userInfo.vai_tro as "student" | "instructor" | "admin",
//               }
//               : u
//           )
//         );

//         toast.success("User updated successfully!");
//         setIsEditDialogOpen(false);
//       }
//     } catch (error) {
//       toast.error("Error updating user");
//     }
//   };


//   console.log(selectedUser);

//   const handleDeleteUser = async (userId: number) => {
//     try {
//       console.log("[v0] Deleting user:", userId);
//       await userService.softDeleteUser(userId);
//       setUsers((prev) =>
//         prev.map((u) =>
//           u.ma_nguoi_dung === userId
//             ? { ...u, trang_thai: 'ngung_hoat_dong' }
//             : u
//         ));
//       toast.success('User has been archived successfully!');
//     } catch (error: any) {
//       toast.error(`Failed to archive user: ${error.message}`)
//     }
//   }

//   const handleForceDelete = async (user_id: number) => {
//     try {
//       await userService.forceDeleteUser(user_id);
//       setUsers((prev) =>
//         prev.filter((u) => u.ma_nguoi_dung !== user_id));
//       toast.success('User has been deleted permanently');
//     } catch (error) {
//       toast.error(`Failed to force delete user: ${error}`);
//     }
//   }

//   const handleRestoreUser = async (user_id: number) => {
//     try {
//       await userService.restoreUser(user_id);
//       setUsers((prev) =>
//         prev.map((u) =>
//           u.ma_nguoi_dung === user_id
//             ? { ...u, trang_thai: 'dang_hoat_dong' }
//             : u
//         ));
//       toast.success('User has been restore successfully!');
//     } catch (error: any) {
//       toast.error(`Failed to restore user: ${error.message}`);
//     }
//   }

//   const handleToggleStatus = (userId: number) => {
//     setUsers(
//       users.map((user) =>
//         user.ma_nguoi_dung === userId ? { ...user, status: user.trang_thai === "dang_hoat_dong" ? "inactive" : "active" } : user,
//       ),
//     )
//   }

//   console.log(userInfo);

//   return (
//     <div className="space-y-6">
//       <div className="bg-[#232f3e] -mx-4 -mt-4 p-5">
//         <h1 className="text-3xl font-bold text-white mb-2">Quản lý người dùng</h1>
//         <p className="text-white">Quản lý tất cả người dùng, vai trò, phân quyền,...</p>
//       </div>
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-md font-medium">Total Users</CardTitle>
//             <UsersRound size={20} color="blue" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{users.length}</div>
//             <p className="text-xs text-muted-foreground">+12% from last month</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-md font-medium">Active Users</CardTitle>
//             <UserCheck className="" size={20} color="green" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{users.filter((u) => u.trang_thai === "dang_hoat_dong").length}</div>
//             <p className="text-xs text-muted-foreground">+8% from last month</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-md font-medium">Students</CardTitle>
//             <BookUser size={20} className="font-bold text-teal-900" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{users.filter((u) => u.vai_tro === "student").length}</div>
//             <p className="text-xs text-muted-foreground">+15% from last month</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-md font-medium">Instructors</CardTitle>
//             <SquareUserRound size={20} className="text-amber-800" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{users.filter((u) => u.vai_tro === "instructor").length}</div>
//             <p className="text-xs text-muted-foreground">+5% from last month</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filters and Search */}
//       <Card className="gap-3">
//         <CardHeader>
//           <CardTitle className="text-xl">Quản lý người dùng</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col sm:flex-row gap-4 mb-6">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Tìm kiếm tài khoản ..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 rounded-[3px] shadow-none border-gray-300"
//               />
//             </div>
//             <Select value={roleFilter} onValueChange={setRoleFilter}>
//               <SelectTrigger className="w-full sm:w-[180px] rounded-[3px] shadow-none border-gray-300 cursor-pointer">
//                 <SelectValue className="" placeholder="Filter by role" />
//               </SelectTrigger>
//               <SelectContent className="rounded-[3px] shadow-none border-gray-300 cursor-pointer">
//                 <SelectItem className="rounded-[3px] shadow-none border-gray-300 cursor-pointer" value="all">All Roles</SelectItem>
//                 <SelectItem className="rounded-[3px] shadow-none border-gray-300 cursor-pointer" value="student">Students</SelectItem>
//                 <SelectItem className="rounded-[3px] shadow-none border-gray-300 cursor-pointer" value="instructor">Instructors</SelectItem>
//                 <SelectItem className="rounded-[3px] shadow-none border-gray-300 cursor-pointer" value="admin">Admins</SelectItem>
//               </SelectContent>
//             </Select>
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-full sm:w-[180px] rounded-[3px] shadow-none border-gray-300 cursor-pointer">
//                 <SelectValue placeholder="Filter by status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem className="rounded-[3px] shadow-none border-gray-300 cursor-pointer" value="all">All Status</SelectItem>
//                 <SelectItem className="rounded-[3px] shadow-none border-gray-300 cursor-pointer" value="dang_hoat_dong">Active</SelectItem>
//                 <SelectItem className="rounded-[3px] shadow-none border-gray-300 cursor-pointer" value="ngung_hoat_dong">Inactive</SelectItem>
//               </SelectContent>
//             </Select>
//             <Button className="rounded-[3px] shadow-none border-gray-300 cursor-pointer">
//               <Plus className="h-4 w-4 mr-2" />
//               Add User
//             </Button>
//           </div>

//           {/* Users Table */}
//           <div className="rounded-md border">
//             <Table className="rounded-[3px]">
//               <TableHeader className="rounded-[3px]">
//                 <TableRow className="rounded-[3px]">
//                   <TableHead className="rounded-[3px]">#</TableHead>
//                   <TableHead className="rounded-[3px]">ID</TableHead>
//                   <TableHead className="rounded-[3px]">Tài khoản</TableHead>
//                   <TableHead className="rounded-[3px]">Số điện thoại</TableHead>
//                   <TableHead className="rounded-[3px]">Vai trò</TableHead>
//                   <TableHead className="rounded-[3px]">Trạng thái</TableHead>
//                   <TableHead className="rounded-[3px]">Ngày tạo</TableHead>
//                   <TableHead className="rounded-[3px]">Cập nhật lần cuối</TableHead>
//                   <TableHead className="rounded-[3px]">Hành động</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredUsers.map((user, index) => (
//                   <TableRow key={user.ma_nguoi_dung}>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{user.ma_nguoi_dung}</TableCell>
//                     <TableCell>
//                       <div className="flex items-center space-x-3">
//                         <Avatar>
//                           <AvatarImage src={user.anh_dai_dien} />
//                           <AvatarFallback>
//                             {user.ten
//                               .split(" ")
//                               .map((n) => n[0])
//                               .join("")}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <div className="font-medium">{user.ten}</div>
//                           <div className="text-sm text-muted-foreground">{user.email}</div>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>{user.so_dien_thoai}</TableCell>
//                     <TableCell>
//                       <span className={`${getRoleBadgeColor(user.vai_tro)} text-xs
//                        ${user.vai_tro === 'admin' ? 'text-black' : 'text-white'} px-2 py-1 rounded-sm`}>{capitalizeFirstLetter(user.vai_tro)}</span>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant={getStatusBadgeVariant(user.trang_thai)}>{user.trang_thai}</Badge>
//                     </TableCell>
//                     <TableCell>{formatDate(user.ngay_tao)}</TableCell>
//                     <TableCell>{formatDate(user.ngay_cap_nhat)}</TableCell>
//                     <TableCell>
//                       <div className="flex items-center space-x-2">
//                         <TooltipProvider>
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 className="cursor-pointer"
//                                 onClick={() => handleEditUser(user)}
//                               >
//                                 <Edit className="h-4 w-4" />
//                               </Button>
//                             </TooltipTrigger>
//                             <TooltipContent>Cập nhật thông tin</TooltipContent>
//                           </Tooltip>
//                         </TooltipProvider>
//                         <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => handleToggleStatus(user.ma_nguoi_dung)}>
//                           {user.trang_thai === "dang_hoat_dong" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
//                         </Button>

//                         {
//                           user.trang_thai === 'dang_hoat_dong' && <Button variant="ghost" size="sm" className="cursor-pointer"
//                             onClick={() => handleDeleteUser(user.ma_nguoi_dung)}
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         }

//                         {user.trang_thai === 'ngung_hoat_dong' &&
//                           (
//                             <ConfirmModal
//                               onConfirm={() => handleForceDelete(user.ma_nguoi_dung)}
//                               title="Bạn có chắc chắn muốn xoá người dùng này vĩnh viễn không? Hành động này không thể hoàn tác"
//                               description='Xoá vĩnh viễn người dùng'
//                             >
//                               <Button variant="ghost" size="sm" className="cursor-pointer"
//                               >
//                                 <Trash className="text-red-600" />
//                               </Button>
//                             </ConfirmModal>
//                           )}

//                         {user.trang_thai === 'ngung_hoat_dong' && (
//                           <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => handleRestoreUser(user.ma_nguoi_dung)}>
//                             <RotateCcw size={16} />
//                           </Button>
//                         )}
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Edit User Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="sm:max-w-2xl rounded-[3px] gap-2">
//           <DialogHeader>
//             <DialogTitle>Cập nhật thông tin</DialogTitle>
//             <DialogDescription>Thực hiện thay đổi thông tin và quyền của người dùng.</DialogDescription>
//           </DialogHeader>
//           {selectedUser && (
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="name" className="text-right">
//                   Tên người dùng
//                 </Label>
//                 <Input id="name" onChange={(e) => setUserInfo({ ...userInfo, ten: e.target.value })} defaultValue={selectedUser.ten} className="col-span-3 rounded-[3px] shadow-none border-gray-300" />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="email" className="text-right">
//                   Email
//                 </Label>
//                 <Input id="email" disabled defaultValue={selectedUser.email} className="col-span-3 rounded-[3px] shadow-none border-gray-300" />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="role" className="text-right">
//                   Vai trò
//                 </Label>
//                 <Select defaultValue={selectedUser.vai_tro} onValueChange={(value) => setUserInfo({ ...userInfo, vai_tro: value as "student" | "instructor" | "admin", })}>
//                   <SelectTrigger className="col-span-3 rounded-[3px] shadow-none border-gray-300 cursor-pointer">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent className="rounded-[3px]">
//                     <SelectItem className="cursor-pointer rounded-[3px]" value="student">Student</SelectItem>
//                     <SelectItem className="cursor-pointer rounded-[3px]" value="instructor">Instructor</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="phone" className="text-right">
//                   Điện thoại
//                 </Label>
//                 <Input id="phone" onChange={(e) => setUserInfo({ ...userInfo, so_dien_thoai: e.target.value })} defaultValue={selectedUser.so_dien_thoai} className="col-span-3 rounded-[3px] shadow-none border-gray-300" />
//               </div>
//             </div>
//           )}
//           <DialogFooter>
//             <Button type="submit" className="rounded-[3px] cursor-pointer" onClick={() => handleUpdateUser(selectedUser?.ma_nguoi_dung)}>Lưu thay đổi</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }









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
import { User } from "@/types/interfaces/model"
import toast from "react-hot-toast"

export function UserManagement() {
  const { users, updateUser, softDeleteUser, forceDeleteUser, restoreUser } = useUsers()
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [userInfo, setUserInfo] = useState({ ten: "", vai_tro: "", so_dien_thoai: "" })

  const filtered = users.filter(u =>
    [u.ten, u.email].some(field => field.toLowerCase().includes(search.toLowerCase())) &&
    (roleFilter === "all" || u.vai_tro === roleFilter) &&
    (statusFilter === "all" || u.trang_thai === statusFilter)
  )

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setUserInfo({ ten: user.ten, vai_tro: user.vai_tro, so_dien_thoai: user.so_dien_thoai })
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

      <Card>
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
              <SelectItem className="rounded-[3px] border-gray-300 shadow-none cursor-pointer" value="student">Student</SelectItem>
              <SelectItem className="rounded-[3px] border-gray-300 shadow-none cursor-pointer" value="instructor">Instructor</SelectItem>
              <SelectItem className="rounded-[3px] border-gray-300 shadow-none cursor-pointer" value="admin">Admin</SelectItem>
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
          <Button className="cursor-pointer rounded-[3px]">
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
                <Label>SĐT</Label>
                <Input value={userInfo.so_dien_thoai ?? 'N/A'} onChange={e => setUserInfo({ ...userInfo, so_dien_thoai: e.target.value })} className="col-span-3 rounded-[3px] border-gray-300 shadow-none" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button className="rounded-[3px] cursor-pointer" onClick={handleSave}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
