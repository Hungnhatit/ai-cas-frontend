'use client'
import { PostService } from '@/services/postService';
import { Post } from '@/types/interfaces/model';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useRouter } from 'next/navigation';

interface PostDetailProps {
  post_id: number,
}

const PostDetail = ({ post_id }: PostDetailProps) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDetail = async () => {
      if (!post_id) return;
      setLoading(true);
      try {
        const res = await PostService.getPostByID(post_id);
        setPost(res.data || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [post_id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <h1 className="text-2xl font-bold">404 - Không tìm thấy</h1>
      </div>
    )
  }

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* Hero Header */}
      <div className="relative h-[400px] w-full bg-slate-900">
        <img
          src={post.anh_bia}
          alt={post.tieu_de}
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container mx-auto max-w-4xl">
            <Button
              variant="link"
              className="text-white hover:text-blue-300 pl-0 mb-4 transition cursor-pointer"
              onClick={() => router.push('/post')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
            </Button>
            <div className="flex items-center gap-3 text-slate-300 text-sm mb-4">
              <Badge className="bg-blue-600 text-white border-none">Technology</Badge>
              <span>•</span>
              <span>{new Date(post.ngay_tao).toLocaleDateString('vi-VN')}</span>
              <span>•</span>
              <span>Tác giả #{post.ma_tac_gia}</span>
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tighter text-white md:text-5xl lg:leading-[1.1]">
              {post.tieu_de}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-6 py-12">
        {post.tom_tat && (
          <div className="mb-10 rounded-xl bg-slate-50 p-6 md:p-8 text-lg font-medium text-slate-700 italic border-l-4 border-blue-600">
            {post.tom_tat}
          </div>
        )}

        <div
          className=" prose prose-slate max-w-none
    prose-p:my-4
    prose-p:leading-7
    prose-img:rounded-xl
    prose-img:shadow
    prose-headings:font-bold"
          dangerouslySetInnerHTML={{ __html: post.noi_dung || "" }}
        />

        <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-8">
          <div className="text-slate-500 text-sm">
            Cập nhật lần cuối: {new Date(post.ngay_cap_nhat).toLocaleDateString('vi-VN')}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Share</Button>
            <Button variant="outline" size="sm">Save</Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PostDetail