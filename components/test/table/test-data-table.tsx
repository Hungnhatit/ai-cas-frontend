import React from 'react';
import {
  Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Test } from '@/types/interfaces/model';
import { Button } from '@/components/ui/button';
import { getStatusLabel } from '@/utils/test';
import { formatDate } from '@/utils/formatDate';
import ConfirmModal from '@/components/modals/confirm-modal';

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

interface TestDataTableProps {
  tests: Test[],
  handleRestore: (test_id: number) => void
  handleForceDelete: (test_id: number) => void
}

const TestDataTable = ({ tests, handleRestore, handleForceDelete }: TestDataTableProps) => {
  return (
    <Table className='border '>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Tên bài kiểm tra</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Chỉnh sửa lần cuối</TableHead>
          <TableHead className='pl-4'>Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className='bg-white'>
        {tests.map((test) => (
          <TableRow key={test.ma_kiem_tra}>
            <TableCell className="font-medium">{test.tieu_de}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${test.trang_thai === 'hoat_dong' ? 'bg-green-100 text-green-700' :
                test.trang_thai === 'ban_nhap' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                {/* {test.trang_thai.charAt(0).toUpperCase() + test.trang_thai.slice(1)} */}
                {getStatusLabel(test.trang_thai)}
              </span>
            </TableCell>
            <TableCell>{formatDate(test.ngay_cap_nhat)}</TableCell>
            <TableCell >
              <div>
                <Button onClick={() => handleRestore(test.ma_kiem_tra)} variant="ghost" size="sm" className='cursor-pointer text-blue-600'>Khôi phục</Button>
                <ConfirmModal
                  onConfirm={() => handleForceDelete(test.ma_kiem_tra)}
                  title="Are you sure to delete this test permantly? This action can't be undone!"
                  description='Delete permantly test'
                >
                  <Button variant="ghost" size="sm" className='cursor-pointer text-red-600'>Xoá vĩnh viễn</Button>
                </ConfirmModal>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default TestDataTable

