import { LandingLayout } from '@/components/layout/landing-layout'
import PostDetail from '@/components/post/PostDetail'
import React from 'react';

interface PostDetailPageProps {
  params: { id: number }
}

const PostDetailPage = ({ params }: PostDetailPageProps) => {
  return (
    <LandingLayout>
      <PostDetail post_id={params.id} />
    </LandingLayout>
  )
}

export default PostDetailPage