import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import Post from '@/components/admin/post/Post'
import React from 'react'

const PostPage = () => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <Post />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default PostPage