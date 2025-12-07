// hooks/useUsers.ts
"use client"

import { useEffect, useState } from "react"
import { userService } from "@/services/admin/userService"
import { User } from "@/types/interfaces/model"
import toast from "react-hot-toast"

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    const res = await userService.getUsers()
    if (res.success) setUsers(res.data)
    setLoading(false)
  }

  const createUser = async (payload: any) => {
    try {
      setLoading(true);
      const user = await userService.createUser(payload);

      setUsers((prevUser) => [user, ...prevUser]);
      toast.success("Tài khoản đã được tạo thành công!");
    } catch (error) {
      toast.error("Lỗi khi tạo người dùng");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const updateUser = async (id: number, data: Partial<User>) => {
    const res = await userService.updateUser(id, data)
    if (res.success) {
      setUsers(prev => prev.map(u => (u.ma_nguoi_dung === id ? { ...u, ...data } : u)))
      toast.success("User updated successfully!")
    }
  }

  const softDeleteUser = async (id: number) => {
    await userService.softDeleteUser(id)
    setUsers(prev =>
      prev.map(u => (u.ma_nguoi_dung === id ? { ...u, trang_thai: "ngung_hoat_dong" } : u)),
    )
    toast.success("User archived!")
  }

  const forceDeleteUser = async (id: number) => {
    await userService.forceDeleteUser(id)
    setUsers(prev => prev.filter(u => u.ma_nguoi_dung !== id))
    toast.success("User deleted permanently!")
  }

  const restoreUser = async (id: number) => {
    await userService.restoreUser(id)
    setUsers(prev =>
      prev.map(u => (u.ma_nguoi_dung === id ? { ...u, trang_thai: "dang_hoat_dong" } : u)),
    )
    toast.success("User restored!")
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return { users, loading, createUser, fetchUsers, updateUser, softDeleteUser, forceDeleteUser, restoreUser }
}
