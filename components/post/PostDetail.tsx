'use client'
import { PostService } from '@/services/postService';
import { Post } from '@/types/interfaces/model';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useRouter } from 'next/navigation';
import { FaQuoteLeft } from "react-icons/fa";
import { FaQuoteRight } from "react-icons/fa";
import ShareButton from '../share-post/ShareButton';

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
        <h1 className="text-2xl font-bold">404 - Không tìm thấy trang</h1>
      </div>
    )
  }

  return (
    <article className="">
      {/* Hero Header */}
      <div className="relative h-[400px] w-full bg-slate-900">
        <img
          src={post.anh_bia}
          alt={post.tieu_de}
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container mx-auto max-w-4xl space-y-4">
            <div className="flex items-center gap-3 text-slate-300 text-sm mb-4">
              <Badge className="bg-blue-600 text-white border-none">Technology</Badge>
            </div>
            <h1 className="text-3xl text-center font-bold text-white md:text-5xl lg:leading-[1.1]">
              {post.tieu_de}
            </h1>
            <div className='flex justify-center gap-20'>
              <div className='flex items-center gap-3 text-white'>
                <span>{new Date(post.ngay_tao).toLocaleDateString('vi-VN')}</span>
                <span>•</span>
                <span>Đăng bởi: {post.tac_gia.ten}</span>
              </div>


              <ShareButton
                title={post.tieu_de}
                description={post.tom_tat || ''}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container shadow-xl mb-4 mx-auto max-w-4xl px-8 py-12 rounded-lg">
        {post.tom_tat && (
          <div className="relative mb-10 rounded-xl text-justify bg-slate-50 p-6 md:p-8 text-lg font-medium text-slate-700 italic border-l-4 border border-blue-600">
            <FaQuoteLeft className="rotate-6 absolute top-4 left-4 text-blue-300 text-2xl" />

            <p className="px-6 text-justify">
              {post.tom_tat}
            </p>

            <FaQuoteRight className="rotate-6 absolute bottom-4 right-4 text-blue-300 text-2xl" />
          </div>
        )}

        <div
          // className="prose prose-slate max-w-none [&_p]:min-h-[1.5rem]"
          className="
              prose prose-slate max-w-none bg-slate-50 rounded-xl
              
              /* Fix lỗi mất dòng khi enter (thẻ p rỗng) */
              [&_p]:min-h-[1.5rem] text-[18px] 
              
              prose-headings:font-bold prose-headings:text-slate-900

              /* custom heading */
              [&_h1]:text-3xl 
              [&_h1]:mb-4
              [&_h1]:font-bold

              [&_h2]:text-2xl
              [&_h2]:mt-6
              [&_h2]:mb-4
              
              /* custom image */
              [&_img]:rounded-lg
              [&_img]:mb-2
              
              /* custom link */
              [&_a]:text-blue-700 
              [&_a]:no-underline 
              hover:[&_a]:underline

              [&_ul]:m-2
              "
          dangerouslySetInnerHTML={{ __html: post.noi_dung || '' }}
        />     
      </div>
    </article>
  );
}

export default PostDetail