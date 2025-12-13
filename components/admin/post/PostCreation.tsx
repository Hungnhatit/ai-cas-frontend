'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast" // Giả sử bạn dùng shadcn toast
import { Loader2 } from 'lucide-react'
import TiptapEditor from './TiptapEditor'
import { PostService } from '@/services/postService'
import { useAuth } from '@/providers/auth-provider'

const PostCreation = () => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    status: 'nhap',
  });
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [selectedFiles, setSelectedFile] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFile(filesArray);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  }

  const handleCreatePost = async () => {
    if (!formData.title.trim()) {
      toast({ title: "Lỗi", description: "Vui lòng nhập tiêu đề", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await PostService.createPost({
        ma_tac_gia: user?.ma_nguoi_dung || 1,
        tieu_de: formData.title,
        tom_tat: formData.summary,
        noi_dung: content,
        trang_thai: formData.status,
        anh_bia: thumbnail,
        files: selectedFiles
      });

      if (res.success) {
        toast({ title: "Thành công", description: "Tạo bài viết thành công!" });
      }

      // Reset form (Tùy chọn)
      // window.location.href = '/posts'; 
    } catch (error: any) {
      console.error(error);
      toast({ title: "Thất bại", description: error.message || "Có lỗi xảy ra", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      {/* Header cũ giữ nguyên */}
      <div className="-m-4 bg-[#232f3e] flex flex-col lg:flex-row p-5 lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Tạo bài viết mới</h2>
          <p className="text-white mt-2">
            Trang này cho phép bạn tạo nội dung chia sẻ kiến thức...
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Cột chính: Nội dung */}
        <div className="md:col-span-3 space-y-6">
          <Card className="gap-3">
            <CardHeader>
              <CardTitle className='text-lg'>Nội dung bài viết</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Tiêu đề */}
              <div className="space-y-3">
                <Label>Tiêu đề bài viết <span className="text-red-500">*</span></Label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề..."
                  className='h-10 rounded-[3px] shadow-none border-gray-300'
                />
              </div>

              {/* Tóm tắt */}
              <div className="space-y-3">
                <Label>Mô tả bài viết</Label>
                <Textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="Mô tả bài viết..."
                  className="h-24 rounded-[3px] shadow-none border-gray-300"
                />
              </div>

              {/* Editor Tiptap */}
              <div className="space-y-3">
                <Label>Nội dung chi tiết</Label>
                <div className="">
                  <TiptapEditor
                    content={content}
                    onChange={setContent}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cột phải: Cài đặt & Ảnh bìa */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-slate-900">Xuất bản & Cài đặt</h3>

            {/* Ảnh bìa */}
            <div className="space-y-3">
              <Label>Ảnh bìa (Thumbnail)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="cursor-pointer rounded-[3px] shadow-none border-gray-300"
              />
              {thumbnailPreview && (
                <div className="mt-2 relative w-full h-32 rounded-md overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            {/* Trạng thái */}
            <div className="space-y-3">
              <Label>Trạng thái</Label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-10 rounded-[3px] border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="nhap">Bản nháp</option>
                <option value="cho_duyet">Gửi duyệt</option>
              </select>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col gap-2">
              <Button onClick={handleCreatePost} className="bg-[#28538f] hover:bg-[#3667ac] w-full cursor-pointer rounded-[3px] shadow-none" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</> : "Lưu bài viết"}
              </Button>
              <Button variant="outline" className="w-full cursor-pointer text-white bg-red-500 rounded-[3px] shadow-none" disabled={isLoading}>
                Hủy bỏ
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PostCreation