import ClientLayout from '@/components/layout/client-layout';
import DocumentDetailPage from '@/components/library/detail';
import { useParams } from 'next/navigation';
import React from 'react'

interface PageProps {
  params: { id: number };
}

const TestLibraryDetailPage = ({ params }: PageProps) => {
  return (
    <ClientLayout>
      <DocumentDetailPage test_id={params.id} />
    </ClientLayout>
  )
}

export default TestLibraryDetailPage