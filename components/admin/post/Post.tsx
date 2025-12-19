'use client';
import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '../../ui/button'
import { Award, Clock, MoreHorizontal, NotebookPen, Sparkles, Trash, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { useAuth } from '@/providers/auth-provider';
import { PostService } from '@/services/postService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Input } from '../../ui/input';
import { Post } from '@/types/interfaces/model';
import { formatDate } from '@/utils/formatDate';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../ui/pagination';
import ConfirmModal from '../../modals/confirm-modal';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import toast from 'react-hot-toast';
const STATUS_LABEL: Record<NonNullable<Post["trang_thai"]>, string> = {
  nhap: "Nháp",
  cho_duyet: "Chờ duyệt",
  da_dang: "Đã đăng",
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const STATUS_VARIANT: Record<NonNullable<Post["trang_thai"]>, any> = {
  nhap: "secondary",
  cho_duyet: "outline",
  da_dang: "default",
};

const ITEM_PER_PAGE = 10;

const Post = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | NonNullable<Post["trang_thai"]>>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);
  const limit = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [res] = await Promise.all([
          PostService.getPostByInstructorId(user?.ma_nguoi_dung, {
            page: page,
            limit: limit,
            q: debouncedSearch,
            trang_thai: status
          })
        ]);

        if (res.success) {
          setPosts(res.data.items);
          setTotalPages(res.data.pagination.totalPages);
          setTotalItems(res.data.pagination.total);
        }
      } catch (error) {

      }
    }
    fetchPosts();
  }, [user?.ma_nguoi_dung, page, debouncedSearch, status]);


  /**
   * Pagination
   */
  const indexOfLastItem = currentPage * ITEM_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEM_PER_PAGE;
  const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleDeletePost = async (post_id: number) => {
    try {
      await PostService.deletePost(post_id);
      setPosts((prev) => prev.filter((post) => post.ma_bai_viet !== post_id));
      toast.success('Test has been archived successfully!');
    } catch (error) {
      toast.error(`Failed to archive test: ${error}`);
    }
  }

  return (
    <div>
      <div className="-m-4 bg-[#232f3e] flex flex-col lg:flex-row p-5 lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Quản lý bài viết</h2>
          <p className="text-white mt-2">Bảng điều khiển quản lý bài viết, giúp giảng viên theo dõi tình trạng, chỉnh sửa và quản lý nội dung học tập của mình một cách nhanh chóng và thuận tiện.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { router.push('/instructor/post/create') }} className="bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-[3px]">
            + Tạo bài viết mới
          </Button>
        </div>
      </div>

      <div className='space-y-3'>
        {/* Post management status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className='gap-0 rounded-[3px] hover:shadow-lg transition-all cursor-pointer'>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                Bài viết
                <span><NotebookPen size={18} className='mr-2' color='blue' /></span>
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{totalItems}</div>
              <div className="text-sm text-gray-600">Tổng số bài test đã được tạo</div>
            </CardContent>
          </Card>
          <Card className='gap-1 rounded-[3px] hover:shadow-lg transition-all cursor-pointer'>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                Tổng số lượt nộp
                <span><Users size={18} className='mr-2' color='green' /></span>
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">Hoạt động</div>
              <div className="text-sm text-gray-600">Trên tất cả các bài test</div>
            </CardContent>
          </Card>
          <Card className='gap-1 rounded-[3px] hover:shadow-lg transition-all cursor-pointer'>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                Đang chờ chấm điểm
                <span><Clock size={18} className='mr-2' color='red' /></span>
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-gray-600">Drafts</div>
            </CardContent>
          </Card>
          <Card className='gap-1 rounded-[3px] hover:shadow-lg transition-all cursor-pointer'>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                Điểm trung bình
                <span><Award size={18} className='mr-2 font-bold' color='orange' /></span>
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-600">1,245</div>
              <div className="text-sm text-gray-600">Total Attempts</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Tìm kiếm theo tiêu đề..."
            className="sm:max-w-xs rounded-[3px] border-slate-300 shadow-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select value={status} onValueChange={(v: any) => setStatus(v)}>
            <SelectTrigger className="sm:w-48 rounded-[3px] shadow-none border-slate-300 cursor-pointer">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className='cursor-pointer rounded-[3px]' value="all">Tất cả trạng thái</SelectItem>
              <SelectItem className='cursor-pointer rounded-[3px]' value="nhap">Nháp</SelectItem>
              <SelectItem className='cursor-pointer rounded-[3px]' value="cho_duyet">Chờ duyệt</SelectItem>
              <SelectItem className='cursor-pointer rounded-[3px]' value="da_dang">Đã đăng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border shadow-sm">
          <Table className='rounded-[3px]'>
            <TableHeader className='rounded-[3px]'>
              <TableRow className='rounded-[3px] bg-slate-200'>
                <TableHead className='text-center rounded-[3px]'>STT</TableHead>
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center w-[100px]">Thumbnail</TableHead>
                <TableHead className='w-[300px]'>Tiêu đề</TableHead>
                <TableHead className='w-[300px]'>Tóm tắt</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Ngày cập nhật</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    Không có bài viết nào
                  </TableCell>
                </TableRow>
              )}

              {posts.map((post, index) => (
                <TableRow key={post.ma_bai_viet}>
                  <TableCell className='text-center'>{index + 1}</TableCell>
                  <TableCell className='text-center'>{post.ma_bai_viet}</TableCell>
                  <TableCell className='text-center'>
                    {post.anh_bia ? (
                      <img
                        src={post.anh_bia}
                        alt={post.tieu_de}
                        className="h-14 w-20 rounded-[3px] object-contain"
                      />
                    ) : (
                      <div className="h-14 w-20 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      <p className='text-wrap'>{post.tieu_de}</p>
                    </div>
                  </TableCell>
                  <TableCell className='line-clamp-2'>
                    <p className='text-wrap line-clamp-3'>
                      {post.tom_tat}
                    </p>
                  </TableCell>

                  <TableCell>
                    {post.trang_thai && (
                      <Badge variant={STATUS_VARIANT[post.trang_thai]}>
                        {STATUS_LABEL[post.trang_thai]}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDate(post.ngay_tao)}
                  </TableCell>
                  <TableCell>
                    {formatDate(post.ngay_cap_nhat)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className=''>
                        <Button variant="ghost" size="icon" className='cursor-pointer'>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className='rounded-[3px]'>
                        <DropdownMenuItem className='rounded-[3px] cursor-pointer' onClick={() => router.push(`/instructor/post/${post.ma_bai_viet}/edit`)}>Xem chi tiết</DropdownMenuItem>
                        <DropdownMenuItem className='rounded-[3px] cursor-pointer'>Chỉnh sửa</DropdownMenuItem>

                        <ConfirmModal
                          onConfirm={() => handleDeletePost(post.ma_bai_viet)}
                          title="Bạn chắc chắn muốn xoá bài viết? Hành động này không thể hoàn tác"
                          description="Xoá vĩnh viễn bài viết"
                        >
                          <DropdownMenuItem
                            className="rounded-[3px] cursor-pointer text-red-600"
                            onSelect={(e) => e.preventDefault()}
                            >
                          Xóa
                        </DropdownMenuItem>
                      </ConfirmModal>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-5 pb-5">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  onClick={() => handlePageChange(page - 1)}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                if (totalPages > 7 && Math.abs(p - page) > 2 && p !== 1 && p !== totalPages) {
                  if (Math.abs(p - page) === 3) {
                    return <PaginationItem key={p}><PaginationEllipsis /></PaginationItem>
                  }
                  return null;
                }

                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => handlePageChange(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  onClick={() => handlePageChange(page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="text-center text-xs text-muted-foreground mt-2">
            Hiển thị {posts.length} kết quả (Trang {page}/{totalPages})
          </div>
        </div>
      )}
    </div>


    </div >
  )
}

export default Post