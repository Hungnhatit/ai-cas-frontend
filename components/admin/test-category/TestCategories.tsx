'use client'
import ConfirmModal from '@/components/modals/confirm-modal'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { categoryService } from '@/services/categoryService'
import { TestCategory } from '@/types/interfaces/model'
import { formatDate } from '@/utils/formatDate'
import { Calendar, SquarePen, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const TestCategories = () => {
  const [cates, setCates] = useState<TestCategory[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCates = async () => {
      const res = await categoryService.getCategories();
      if (res.success) {
        setCates(res.data);
      }
    }

    fetchCates();
  }, [])


  return (
    <div className="space-y-6">
      <div className="bg-[#232f3e] -mx-4 -mt-4 p-5">
        <h1 className="text-3xl font-bold text-white mb-2">Quản lý danh mục bài kiểm tra</h1>
        <p className="text-white">Quản lý người dùng, vai trò và trạng thái</p>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[50px] text-center border-r">STT</TableHead>
              <TableHead className="w-[40px] text-center border-r">ID</TableHead>
              <TableHead className="border-r">Tên khung năng lực</TableHead>
              <TableHead className="border-r">Mô tả chi tiết</TableHead>
              <TableHead className="border-r">Ngày tạo</TableHead>
              <TableHead className="border-r">Cập nhật lần cuối</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cates.length > 0 ? (
              cates.map((competency, index) => (
                <TableRow key={competency.ma_danh_muc} className="hover:bg-gray-50">
                  <TableCell className="bg-gray-100 text-center font-medium border-r">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-center font-medium border-r">
                    {competency.ma_danh_muc}
                  </TableCell>

                  <TableCell className="border-r">
                    <div
                      className="text-base gap-2 text-gray-900 hover:underline cursor-pointer transition-all"
                      onClick={() => router.push(`/admin/competency/${competency.ma_danh_muc}`)}>
                      {competency.ten_danh_muc}
                    </div>
                  </TableCell>

                  <TableCell className="border-r">
                    <span className={`text-wrap text-base line-clamp-3 leading-[23px]`}>
                      {competency.mo_ta}
                    </span>
                  </TableCell>

                  <TableCell className="border-r">{formatDate(competency.ngay_tao)}</TableCell>

                  <TableCell className="border-r text-gray-500">
                    <div className="flex items-center text-nowrap">
                      <Calendar size={16} className="mr-2" />
                      {formatDate(competency.ngay_cap_nhat)}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => { }}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-[3px] cursor-pointer"
                          >
                            <SquarePen className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Chỉnh sửa</TooltipContent>
                      </Tooltip>

                      <ConfirmModal
                        onConfirm={() => { }}
                        title="Bạn chắc chắn muốn xoá bài thi? Hành động này không thể hoàn tác"
                        description="Xoá vĩnh viễn bài thi"
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-[3px] cursor-pointer"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Xoá</TooltipContent>
                        </Tooltip>
                      </ConfirmModal>

                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center italic text-gray-500">
                  Không tìm thấy bài test nào!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default TestCategories