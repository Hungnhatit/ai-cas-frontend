import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, Lightbulb, BicepsFlexed, ChartNoAxesGantt, CircleSlash, CircleFadingArrowUp, AlarmClockCheck, CalendarCheck2 } from 'lucide-react';
import { PhanTichDanhGia } from '@/types/interfaces/ai-review';

interface Insight {
  type: 'strength' | 'improvement' | 'recommendation';
  title: string;
  description: string;
}

interface PerformanceInsightsProps {
  performance: PhanTichDanhGia
}

export default function PerformanceInsights({ performance }: PerformanceInsightsProps) {
  return (
    <div className='space-y-2'>
      <Card className="shadow-lg">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h1>Phân tích hiệu suất</h1>
          </CardTitle>
          <CardDescription className='text-[16px]'>
            Phân tích chi tiết năng lực của bạn dựa trên kết quả bài thi, xác định các điểm mạnh nổi bật và kỹ năng cần phát triển thêm để nâng cao hiệu suất học tập.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-1 gap-6">
            <Card className='gap-1'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <ChartNoAxesGantt size={28} className="text-blue-500" />
                  Tổng quan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {performance.tong_quan}
              </CardContent>
            </Card>

            <div className='grid grid-cols-2 gap-4'>
              <Card className='gap-1'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-lg'>
                    <BicepsFlexed className="text-green-500" />
                    Điểm mạnh
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {performance.diem_manh}
                </CardContent>
              </Card>

              <Card className='gap-1'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-lg'>
                    <CircleSlash size={24} className='text-orange-700' />
                    Điểm yếu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {performance.diem_yeu}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='gap-3'>
        <CardHeader>
          <CardTitle className='text-lg'>Đề xuất cải thiện</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div className="p-4 rounded-[3px] bg-gray-50 border-l-4 border border-blue-400  ">
              <div className="flex items-center gap-3">
                <div className={``}>
                  <CircleFadingArrowUp className='text-green-600' />
                  {/* <TrendingUp className="h-4 w-4 text-green-600" />
                  <TrendingDown className="h-4 w-4 text-orange-600" />
                  <Lightbulb className="h-4 w-4 text-blue-600" /> */}
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">{performance.de_xuat_cai_thien}</h5>
                  {/* <p className="text-sm text-muted-foreground">{insight.description}</p> */}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='gap-3'>
        <CardHeader>
          <CardTitle className='text-lg'>Hướng phát triển</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div className="p-4 rounded-[3px] bg-gray-50 border-l-4 border border-blue-400  ">
              <div className="flex items-center gap-3">
                <div className={`p-1 rounded-full `}>
                  <TrendingUp className="text-green-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">{performance.huong_phat_trien}</h5>
                  {/* <p className="text-sm text-muted-foreground">{insight.description}</p> */}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-2 gap-3'>
        <Card className='gap-3'>
          <CardHeader>
            <CardTitle className='text-lg'>Kế hoạch ngắn hạn</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <div className="p-4 rounded-[3px] bg-gray-50 border-l-4 border border-blue-400  ">
                <div className="flex items-start gap-3">
                  <div className={`p-1 rounded-full `}>
                    <AlarmClockCheck className='text-sky-700' />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-1">{performance.ke_hoach_ngan_han}</h5>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='gap-3'>
          <CardHeader>
            <CardTitle className='text-lg'>Kế hoạch dài hạn</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <div className="p-4 rounded-[3px] bg-gray-50 border-l-4 border border-blue-400  ">
                <div className="flex items-start gap-3">
                  <div className={`p-1 rounded-full `}>
                    <CalendarCheck2 className='text-purple-700' />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-1">{performance.ke_hoach_dai_han}</h5>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>      

    </div>

  );
}