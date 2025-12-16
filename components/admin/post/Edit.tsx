'use client'
import TiptapEditor from '@/components/admin/post/TiptapEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PostService } from '@/services/postService';
import { Loader2, ArrowLeft } from 'lucide-react'; // Import thêm icon
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface EditPostProps {
  post_id: number
}

interface PostFormData {
  title: string;
  summary: string;
  status: string;
}

const EditPost = ({ post_id }: EditPostProps) => {
  const router = useRouter();

  // State quản lý loading
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [content, setContent] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    summary: '',
    status: 'nhap'
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await PostService.getPostByID(post_id);
        if (res.success && res.data) {
          const post = res.data;

          setFormData({
            title: post.tieu_de,
            summary: post.tom_tat || '',
            status: post.trang_thai || 'nhap'
          });
          setContent(post.noi_dung || '');

          if (post.anh_bia) {
            setThumbnailPreview(post.anh_bia);
          }
        }
      } catch (error) {
        console.error("Lỗi tải bài viết:", error);
      } finally {
        setIsFetching(false);
      }
    }
    fetchPost();
  }, [post_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const objectUrl = URL.createObjectURL(file);
      setThumbnailPreview(objectUrl);
    }
  };

  console.log('THUMBNAIL: ', thumbnailFile);

  const handleUpdatePost = async () => {
    if (!formData.title.trim()) {
      alert("Vui lòng nhập tiêu đề bài viết");
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append('tieu_de', formData.title);
      data.append('tom_tat', formData.summary);
      data.append('noi_dung', content);
      data.append('trang_thai', formData.status);

      if (thumbnailFile) {
        data.append('anh_bia', thumbnailFile);
      }

      const res = await PostService.updatePost(post_id, data);

      console.log('PAYLOAD: ', data);

      if (res.success) {
        toast.success('Updated successfully!')
        // router.push('/posts'); 
      } else {
        alert(res.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi hệ thống khi cập nhật bài viết");
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="-m-4 bg-[#232f3e] flex flex-col lg:flex-row p-5 lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Chỉnh sửa bài viết</h2>
          <p className="text-white mt-2">Cập nhật nội dung, hình ảnh và trạng thái của bài viết.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="text-black bg-white hover:bg-gray-100 cursor-pointer rounded-[3px]"
          >
            <ArrowLeft size={16} className="mr-2" /> Quay lại
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Cột chính: Nội dung */}
        <div className="md:col-span-3 space-y-6">
          <Card className="gap-3 border-none shadow-sm">
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
                  placeholder="Mô tả ngắn gọn về bài viết..."
                  className="h-[300px] !text-[15px] rounded-[3px] shadow-none border-gray-300 resize-none"
                />
              </div>

              {/* Editor Tiptap */}
              <div className="space-y-3">
                <Label>Nội dung chi tiết</Label>
                <div className="min-h-[400px]">
                  <TiptapEditor
                    content={content}
                    onChange={setContent}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="sticky top-3 z-10 space-y-6 self-start">
          <Card className=" p-6 space-y-4 border-none shadow-sm">
            <h3 className="font-semibold text-slate-900 border-b pb-2">Cài đặt & Xuất bản</h3>

            {/* Ảnh bìa */}
            <div className="space-y-3">
              <Label>Ảnh bìa (Thumbnail)</Label>
              <div className="flex flex-col gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="cursor-pointer rounded-[3px] shadow-none border-gray-300 file:text-blue-600 file:font-semibold"
                />

                {thumbnailPreview ? (
                  <div className="relative w-full h-40 rounded-md overflow-hidden border border-slate-200 bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 rounded-md border border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                    Chưa có ảnh bìa
                  </div>
                )}
              </div>
            </div>

            {/* Trạng thái */}
            <div className="space-y-3">
              <Label>Trạng thái</Label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-10 rounded-[3px] border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="nhap">Bản nháp (Draft)</option>
                <option value="cho_duyet">Chờ duyệt (Pending)</option>
                <option value="da_dang">Đã đăng (Published)</option>
              </select>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col gap-3">
              <Button
                onClick={handleUpdatePost}
                className="bg-[#28538f] hover:bg-[#3667ac] w-full cursor-pointer rounded-[3px] shadow-none font-semibold"
                disabled={isLoading}
              >
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang cập nhật...</> : "Lưu thay đổi"}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="w-full cursor-pointer text-red-600 border-red-200 hover:bg-red-50 rounded-[3px] shadow-none"
                disabled={isLoading}
              >
                Hủy bỏ
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EditPost