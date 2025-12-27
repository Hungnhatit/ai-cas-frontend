"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostService } from "@/services/postService";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "../ui/carousel";
import { IoNewspaperOutline } from "react-icons/io5";

interface RelatedPostsProps {
  current_post_id: number;
}

export const RelatedPosts = ({ current_post_id }: RelatedPostsProps) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await PostService.getRelatedPosts(current_post_id);
        if (res.success) {
          setPosts(res.data);
        }
      } catch (error) {
        console.error("Failed to load related posts", error);
      } finally {
        setLoading(false);
      }
    };

    if (current_post_id) {
      fetchRelated();
    }
  }, [current_post_id]);

  if (!loading && posts.length === 0) return null;

  console.log(posts);

  return (
    <Card className="gap-2 rounded-xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <IoNewspaperOutline className="text-orange-600 h-8 w-8" />
          <p className="text-xl">Bài viết đề xuất</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="">
          {loading
            ?
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-48 bg-slate-100 rounded-lg animate-pulse" />
                <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse" />
              </div>
            ))
            :
            (
              <Carousel
                opts={{
                  align: "start",
                }}
                className="w-full">
                <CarouselContent>
                  {
                    posts.map((post) => (
                      <CarouselItem key={post.ma_bai_viet} className="basis-1/4">
                        <Link href={`/post/${post.ma_bai_viet}`} key={post.ma_bai_viet} className="group">
                          <Card className="h-full gap-2 border-none py-2 px-2 shadow-none transition-shadow bg-transparent">
                            <div className="relative aspect-video rounded-lg overflow-hidden mb-3 border border-slate-100">
                              <img
                                src={post.anh_bia || "/images/placeholder.jpg"}
                                alt={post.tieu_de}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            <CardContent className="p-0">
                              <h4 className="font-bold text-lg leading-snug text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {post.tieu_de}
                              </h4>
                              <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                                {post.tom_tat}
                              </p>
                            </CardContent>
                          </Card>
                        </Link>
                      </CarouselItem>
                    ))
                  }
                </CarouselContent>
                <CarouselPrevious className="cursor-pointer" />
                <CarouselNext className="cursor-pointer" />
              </Carousel>
            )
          }
        </div>
      </CardContent>

    </Card>
  );
};