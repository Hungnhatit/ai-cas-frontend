'use client';
import React from 'react'
import { Button } from '../ui/button'
import { Award, Clock, NotebookPen, Sparkles, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const Post = () => {
  const router = useRouter();

  return (
    <div>
      <div className="-m-4 bg-[#232f3e] flex flex-col lg:flex-row p-5 lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Quản lý bài viết</h2>
          <p className="text-white mt-2">Bảng điều khiển quản lý bài viết, giúp giảng viên theo dõi tình trạng, chỉnh sửa và quản lý nội dung học tập của mình một cách nhanh chóng và thuận tiện.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => {router.push('/posts/create') }} className="bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-[3px]">
            + Tạo bài viết mới
          </Button>
        </div>
      </div>

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
            <div className="text-2xl font-bold text-blue-600">12</div>
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
    </div>
  )
}

export default Post