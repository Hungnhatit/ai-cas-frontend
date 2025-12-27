import ClientLayout from '@/components/layout/client-layout';
import { LandingLayout } from '@/components/layout/landing-layout';
import DocumentDetailPage from '@/components/library/detail';
import { useParams } from 'next/navigation';
import React from 'react'

interface PageProps {
  params: { id: number };
}

const TestLibraryDetailPage = ({ params }: PageProps) => {
  return (
    <LandingLayout>
      <DocumentDetailPage test_id={params.id} />
    </LandingLayout>
  )
}

export default TestLibraryDetailPage