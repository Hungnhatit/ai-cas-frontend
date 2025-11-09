'use client'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function HeaderBar({ test, loading, total_points, router, onSave, onCancel }: any) {
  return (
    <div className="bg-[#232f3e] top-0 z-10 mb-4 -mx-4 -mt-4">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className='cursor-pointer flex items-center justify-center hover:bg-gray-600'
              onClick={() => router.push('/tests')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" color='white' />
              <span className='text-white'>Quay lại</span>
            </Button>
            <div className='space-y-1'>
              <div className='flex items-center'>
                <h1 className="text-xl font-semibold text-white mr-2">{test?.tieu_de}</h1>
                {test?.trang_thai === 'hoat_dong'
                  ? <Badge className={cn('bg-blue-500')}>Active</Badge>
                  : <Badge className={cn('bg-gray-300')}>Draft</Badge>}
              </div>
              <p className="text-sm text-white">
                {test?.cau_hoi?.length} câu hỏi{test?.cau_hoi?.length !== 1 ? 's' : ''} • {total_points} điểm
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" className='cursor-pointer rounded-[3px]' onClick={onCancel}>
              Huỷ
            </Button>
            <Button
              onClick={onSave}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer rounded-[3px]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang tạo bài thi...
                </>
              ) : (
                <>
                  <Save className='h-4 w-4' />
                  {test?.trang_thai === 'hoat_dong' ? 'Lưu thay đổi' : 'Xuất bản'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
