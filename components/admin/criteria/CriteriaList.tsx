'use client';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Criteria } from "@/types/interfaces/model";
import { formatDate } from "@/utils/formatDate";
import { Edit, Info, Trash } from "lucide-react";
import { useState } from "react";

interface Props {
  data: Criteria[];
}

const CriteriaList = ({ data }: Props) => {
  const [selected, setSelected] = useState<number[]>([]);

  const isAllChecked = selected?.length === data?.length;

  const toggleAll = () => {
    if (isAllChecked) {
      setSelected([]);
    } else {
      setSelected(data.map((item) => item.ma_tieu_chi));
    }
  };

  const toggleItem = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((v) => v !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <div>
      <Table className="border">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox checked={isAllChecked} onCheckedChange={toggleAll} className="shadow-none border-gray-400 cursor-pointer" />
            </TableHead>
            <TableHead className="">STT</TableHead>
            <TableHead className="">ID</TableHead>
            <TableHead className="">Tên tiêu chí</TableHead>
            <TableHead className="">Mô tả chi tiết</TableHead>
            <TableHead className="flex items-center justify-between gap-1">
              Trọng số
              <Tooltip>
                <TooltipProvider>
                  <TooltipTrigger asChild className="cursor-pointer">
                    <Info size={14} />
                  </TooltipTrigger>
                  <TooltipContent className="text-sm">
                    Trọng số thể hiện mức độ quan trọng của mỗi tiêu chí trong tổng điểm đánh giá cuối cùng. <br />
                    Giá trị càng cao thì tiêu chí đó càng ảnh hưởng lớn đến kết quả.</TooltipContent>
                </TooltipProvider>
              </Tooltip>
            </TableHead>
            <TableHead className="">Ngày tạo</TableHead>
            <TableHead className="">Ngày cập nhật</TableHead>
            <TableHead className="">Hành động</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.ma_tieu_chi} className="h-10">
              <TableCell className="">
                <Checkbox
                  checked={selected.includes(item.ma_tieu_chi)}
                  onCheckedChange={() => toggleItem(item.ma_tieu_chi)}
                  className="shadow-none border-gray-400 cursor-pointer"
                />
              </TableCell>
              <TableCell className="text-center">{index + 1}</TableCell>

              <TableCell className="text-center">{item.ma_tieu_chi}</TableCell>
              <TableCell className="">{item.ten_tieu_chi}</TableCell>
              <TableCell className="whitespace-normal break-words">{item.mo_ta}</TableCell>
              <TableCell className="text-center">{item.trong_so}</TableCell>
              <TableCell className="">{formatDate(item.ngay_tao)}</TableCell>
              <TableCell className="">{formatDate(item.ngay_cap_nhat)}</TableCell>
              <TableCell className="flex items-center">
                <div>
                  <Tooltip>
                    <TooltipProvider>
                      <TooltipTrigger asChild>
                        <Button variant='ghost' onClick={() => { }} className="cursor-pointer">
                          <Edit className="text-green-800" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Chỉnh sửa</TooltipContent>
                    </TooltipProvider>
                  </Tooltip>
                </div>
                <div>
                  <Tooltip>
                    <TooltipProvider>
                      <TooltipTrigger asChild>
                        <Button variant='ghost' onClick={() => { }} className="cursor-pointer">
                          <Trash className="text-red-800" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Xoá</TooltipContent>
                    </TooltipProvider>
                  </Tooltip>
                </div>


              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
export default CriteriaList;