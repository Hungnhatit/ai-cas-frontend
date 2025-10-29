"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { TableCell, TableRow } from "@/components/ui/table"
import { User } from "@/types/interfaces/model"
import { formatDate } from "@/utils/formatDate"
import { capitalizeFirstLetter } from "@/utils/string"
import { UserActions } from "../user-action/UserAction"

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-amber-400 text-black",
  instructor: "bg-blue-700 text-white",
  student: "bg-gray-500 text-white",
}

const STATUS_VARIANTS: Record<string, "default" | "destructive" | "outline" | "secondary" | null | undefined> = {
  dang_hoat_dong: "default",
  ngung_hoat_dong: "secondary",
}

interface Props {
  user: User
  index: number
  onEdit: (u: User) => void
  onDelete: (id: number) => void
  onForceDelete: (id: number) => void
  onRestore: (id: number) => void
}

export function UserRow({ user, index, onEdit, onDelete, onForceDelete, onRestore }: Props) {
  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{user.ma_nguoi_dung}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={user.anh_dai_dien} />
            <AvatarFallback>{user.ten.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.ten}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>{user.so_dien_thoai ?? 'N/A'}</TableCell>
      <TableCell>
        <span
          className={`${ROLE_COLORS[user.vai_tro] || "bg-teal-400 text-white"} text-xs px-2 py-1 rounded-sm`}
        >
          {capitalizeFirstLetter(user.vai_tro)}
        </span>
      </TableCell>
      <TableCell>
        <Badge variant={STATUS_VARIANTS[user.trang_thai]}>{user.trang_thai}</Badge>
      </TableCell>
      <TableCell>{formatDate(user.ngay_tao)}</TableCell>
      <TableCell>{formatDate(user.ngay_cap_nhat)}</TableCell>
      <TableCell>
        <UserActions
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
          onForceDelete={onForceDelete}
          onRestore={onRestore}
        />
      </TableCell>
    </TableRow>
  )
}
