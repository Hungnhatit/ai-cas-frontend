import { LandingLayout } from '@/components/layout/landing-layout'
import Posts from '@/components/post/Posts'
import React from 'react';

interface PostPageProps {
  params: { id: number }
}

const PostPage = ({ params }: PostPageProps) => {
  return (
    <LandingLayout>
      <Posts post_id={params.id} />
    </LandingLayout>
  )
}

export default PostPage
