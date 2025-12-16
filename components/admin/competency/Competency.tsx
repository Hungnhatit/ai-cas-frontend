'use client'

import ConfirmModal from "@/components/modals/confirm-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/providers/auth-provider"
import { competencyService } from "@/services/competency/competencyService"
import { Competency } from "@/types/interfaces/model"
import { formatDate } from "@/utils/formatDate"
import { Calendar, Info, Link, NotebookPen, RotateCcw, SquarePen, Trash, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export const CompetencyApp = () => {
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const fetchCompetency = async () => {
      try {
        const res = await competencyService.getCompetencies();
        if (res.data) {
          setCompetencies(res.data);
        }
      } catch (error) {
        console.log(error);
        toast.error(`Error when fetching competency: ${error}`);
      } finally {
        setLoading(false);
      }
    }

    if (user?.ma_nguoi_dung) {
      fetchCompetency();
    }
  }, [user?.ma_nguoi_dung]);

  console.log('COMPETENCY: ', competencies);

  const handleEdit = async () => {
    try {

    } catch (error) {

    }
  }
  return (
    <div className="space-y-6">
      <div className="bg-[#232f3e] -mx-4 -mt-4 p-5">
        <h1 className="text-3xl font-bold text-white mb-2">Khung năng lực & Tiêu chí đánh giá</h1>
        <p className="text-white">Xây dựng, chỉnh sửa và theo dõi các tiêu chí của mỗi khung năng lực</p>
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[50px] text-center border-r">STT</TableHead>
              <TableHead className="w-[40px] text-center border-r">ID</TableHead>
              <TableHead className="border-r">Tên khung năng lực</TableHead>
              <TableHead className="border-r">Mô tả chi tiết</TableHead>
              <TableHead className="border-r flex items-center justify-between">Số tiêu chí</TableHead>
              <TableHead className="border-r">Ngày tạo</TableHead>
              <TableHead className="border-r">Cập nhật lần cuối</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competencies.length > 0 ? (
              competencies.map((competency, index) => (
                <TableRow key={competency.ma_khung_nang_luc} className="hover:bg-gray-50">
                  <TableCell className="bg-gray-100 text-center font-medium border-r">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-center font-medium border-r">
                    {competency.ma_khung_nang_luc}
                  </TableCell>

                  <TableCell className="border-r">
                    <div
                      className="text-base gap-2 text-gray-900 hover:underline cursor-pointer transition-all"
                      onClick={() => router.push(`/admin/competency/${competency.ma_khung_nang_luc}`)}>
                      {competency.ten_nang_luc}
                    </div>
                  </TableCell>

                  <TableCell className="border-r">
                    <span className={`text-wrap text-base line-clamp-3 leading-[23px]`}>
                      {competency.mo_ta}
                    </span>
                  </TableCell>

                  <TableCell className="border-r text-center">{competency.tong_so_tieu_chi}</TableCell>

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

      <Card className="shadow-none gap-2 bg-transparent rounded-none border-none">
        <CardHeader>
          <CardTitle className="flex items-center text-xl gap-2">
            <NotebookPen size={20} className="text-slate-600" />
            <p>Ghi chú: Chức năng quản lý Khung năng lực & Tiêu chí đánh giá</p>
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="ml-4 italic list-disc text-gray-600 space-y-1">
            <li>
              Khung năng lực là tập hợp các năng lực chính dùng để đánh giá học viên/nhân sự.
            </li>
            <li>
              Mỗi khung năng lực bao gồm nhiều tiêu chí đánh giá tương ứng.
            </li>
            <li>
              Tiêu chí dùng để phân tách các mức độ đánh giá và tính điểm theo trọng số.
            </li>
            <li>
              Khi cập nhật khung năng lực, toàn bộ tiêu chí liên quan cũng được cập nhật theo.
            </li>
            <li className="text-red-700 font-bold">
              Lưu ý: việc xoá một khung năng lực sẽ tự động xoá các tiêu chí đánh giá liên quan
            </li>
            <li>
              Có thể sử dụng cho bài kiểm tra, báo cáo năng lực, đánh giá theo AI hoặc giảng viên.
            </li>
            <li>
              Dữ liệu được dùng để tính điểm tổng, kết luận, gợi ý cải thiện và phân tích chuyên sâu.
            </li>
          </ul>

        </CardContent>

      </Card>
    </div >
  )
}