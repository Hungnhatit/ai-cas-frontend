"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Edit, RotateCcw, Trash, Trash2, UserCheck, UserX } from "lucide-react"
import ConfirmModal from "@/components/modals/confirm-modal"
import { User } from "@/types/interfaces/model"

interface Props {
  user: User
  onEdit: (user: User) => void
  onDelete: (id: number) => void
  onForceDelete: (id: number) => void
  onRestore: (id: number) => void
}

export function UserActions({ user, onEdit, onDelete, onForceDelete, onRestore }: Props) {
  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={() => onEdit(user)} className="cursor-pointer">
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {user.trang_thai === "dang_hoat_dong" && (
        <Button variant="ghost" size="sm" onClick={() => onDelete(user.ma_nguoi_dung)} className="cursor-pointer">
          <Trash2 className="h-4 w-4" />
        </Button>
      )}

      {user.trang_thai === "ngung_hoat_dong" && (
        <>
          <Button variant="ghost" size="sm" onClick={() => onRestore(user.ma_nguoi_dung)} className="cursor-pointer">
            <RotateCcw size={16} />
          </Button>

          <ConfirmModal
            onConfirm={() => onForceDelete(user.ma_nguoi_dung)}
            title="Xác nhận xóa vĩnh viễn người dùng?"
            description={`Bạn có chắc chắn muốn xoá người dùng "${user.ten}" vĩnh viễn không? Hành động này không thể hoàn tác.`}
          >
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <Trash className="text-red-600" />
            </Button>
          </ConfirmModal>
        </>
      )}
    </div>
  )
}
