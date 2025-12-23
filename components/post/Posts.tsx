'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Calendar, Clock, User, ChevronRight
} from 'lucide-react';
import { Post } from '@/types/interfaces/model';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PostService } from '@/services/postService';
import { Badge } from '../ui/badge';
import PostDetailPage from '@/app/post/[id]/page';
import PostPagination from './PostPagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formatDate } from '@/utils/formatDate';

const PostCard = ({ post, onClick }: { post: Post; onClick: () => void }) => {
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
        <img
          src={post.anh_bia}
          alt={post.tieu_de}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
          }}
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-slate-600 backdrop-blur-sm shadow-sm">
            Blog
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(post.ngay_tao)}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300"></span>
          <Clock className="h-3 w-3" />
          <span>5 phút đọc</span>
        </div>
        <h3 className="mb-2 text-lg font-bold leading-tight text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {post.tieu_de}
        </h3>
        <p className="mb-4 text-sm text-slate-600 line-clamp-3 flex-1">
          {post.tom_tat}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center">
              <User className="h-3 w-3" />
            </div>
            <span>Tác giả:  #{post.tac_gia.ten}</span>
          </div>
          <span className="text-xs text-blue-600 font-semibold group-hover:translate-x-1 transition-transform flex items-center">
            Đọc thêm <ChevronRight className="h-3 w-3 ml-1" />
          </span>
        </div>
      </div>
    </div>
  );
};

const SearchInput = ({ defaultValue, onSearch }: { defaultValue: string, onSearch: (val: string) => void }) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        placeholder="Tìm kiếm bài viết..."
        className="pl-9 rounded-[3px] border-gray-300 shadow-none"
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
      />
    </form>
  );
};

const PostsPage = ({ navigate }: { navigate: (path: string, id?: number) => void }) => {
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filtered = data.filter((post) =>
    [post.tieu_de, post.tom_tat].some(field => field?.toLowerCase().includes(search.toLowerCase()))
  )

  const currentPage = Number(searchParams.get('page')) || 1;
  const currentSearch = searchParams.get('q') || '';
  const limit = 9;

  const createQueryString = useCallback(
    (name: string, value: string | number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, String(value));
      return params.toString();
    },
    [searchParams]
  );

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await PostService.getPost({
        page: currentPage,
        limit: limit,
        q: currentSearch,
        sort_by: 'ngay_tao',
        sort_dir: 'desc'
      });

      if (res.success) {
        setData(res.data.posts);
        setTotal(res.data.pagination.total);
      }
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage, currentSearch]);

  const handlePageChange = (page: number) => {
    router.push(`${pathname}?${createQueryString('page', page)}`);
  }

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-8">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Bài viết mới nhất
            </h1>
            <p className="text-slate-500 text-lg mt-2">Cập nhật tin tức giáo dục và xu hướng AI mới</p>
          </div>
          <div className='relative w-full max-w-sm'>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Tìm kiếm bài viết..."
              className="pl-9 rounded-[3px] border-gray-300 shadow-none"
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
          </div>
        ) : filtered.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <PostCard
                  key={post.ma_bai_viet}
                  post={post}
                  onClick={() => router.push(`/post/${post.ma_bai_viet}`)}
                />
              ))}
            </div>

            <PostPagination
              page={currentPage}
              total={total}
              limit={limit}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 py-12 text-center">
            <div className="rounded-full bg-slate-100 p-3 mb-4">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">Không tìm thấy bài viết</h3>
            <p className="text-slate-500 max-w-sm mt-1">
              Chúng tôi không tìm thấy kết quả nào cho từ khóa "{search}". Hãy thử tìm kiếm khác.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => handleSearch("")}
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

interface PostProps {
  post_id: number
}

const Posts = ({ post_id }: PostProps) => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [detailId, setDetailId] = useState<number>(Number);
  const navigate = (path: string, id?: number) => {
    window.scrollTo(0, 0);
    if (path === 'detail' && id) {
      setDetailId(id);
      setView('detail');
    } else {
      setView('list');
      setDetailId(undefined);
    }
  };

  return (
    <div className="font-sans text-slate-900 antialiased">
      <main>
        {view === 'list' ? (
          <PostsPage navigate={navigate} />
        ) : (
          <PostDetailPage post_id={post_id} />
        )}
      </main>
    </div>
  );
}

export default Posts