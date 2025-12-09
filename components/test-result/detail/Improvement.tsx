import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlarmClockCheck, CalendarCheck2, CircleFadingArrowUp, TrendingUp } from 'lucide-react'

interface ImprovementProps {
  de_xuat_cai_thien?: string,
  huong_phat_trien?: string,
  ke_hoach_ngan_han?: string,
  ke_hoach_dai_han?: string,
  tai_nguyen_de_xuat?: string
}

const Improvement = ({ de_xuat_cai_thien, huong_phat_trien, ke_hoach_ngan_han, ke_hoach_dai_han, tai_nguyen_de_xuat }: ImprovementProps) => {
  return (
    <div className='space-y-4'>
      <Card className='gap-3'>
        <CardHeader>
          <CardTitle className='text-lg'>Đề xuất cải thiện</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <div className="p-4 rounded-[3px] bg-gray-50 border-l-4 border border-blue-400  ">
              <div className="flex items-center gap-3">
                <div className={``}>
                  <CircleFadingArrowUp className='text-green-600' />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">{de_xuat_cai_thien}</h5>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='gap-3'>
        <CardHeader>
          <CardTitle className='text-lg'>Hướng phát triển</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <div className="p-4 rounded-[3px] bg-gray-50 border-l-4 border border-blue-400  ">
              <div className="flex items-center gap-3">
                <div className={`p-1 rounded-full `}>
                  <TrendingUp className="text-green-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">{huong_phat_trien}</h5>
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
                    <h5 className="font-medium text-gray-900 mb-1">{ke_hoach_ngan_han}</h5>
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
                    <h5 className="font-medium text-gray-900 mb-1">{ke_hoach_dai_han}</h5>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

export default Improvement