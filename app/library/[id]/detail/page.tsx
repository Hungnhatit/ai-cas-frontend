import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import DocumentDetailPage from '@/components/library/detail'
import React from 'react'

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}


const page = ({ params, searchParams }: PageProps) => {
  return (
    <AuthGuard>
      <DashboardLayout>
        <DocumentDetailPage params={params} searchParams={searchParams} />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default page
