"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Brain, GraduationCap, Users, Target, ShieldCheck, BadgeCheck, Album } from "lucide-react";
import { GiSkills } from "react-icons/gi";
import { GrDocumentMissing } from "react-icons/gr";
import { MdOutlineModelTraining, MdOutlinePersonalInjury } from "react-icons/md";
import { FcMindMap } from "react-icons/fc";

const whyAIs = [
  {
    title: 'Đo lường kỹ năng thực tế',
    description: 'Đánh giá khả năng sử dụng AI trong các tình huống học tập và công việc thực tế, không chỉ dựa trên lý thuyết',
    icon: <GiSkills size={24} className="text-"/>
  },
  {
    title: 'Phát hiện lỗ hổng kiến thức',
    description: 'Xác định chính xác những điểm còn thiếu hoặc hiểu chưa đúng để người học cải thiện hiệu quả hơn',
    icon: <GrDocumentMissing size={24} className="text-"/>
  },
  {
    title: 'Chuẩn hóa theo tiêu chuẩn giáo dục',
    description: 'Xây dựng hệ thống đánh giá dựa trên các nguyên tắc và chuẩn mực giáo dục hiện đại, minh bạch và đáng tin cậy',
    icon: <Album size={24} className="text-"/>
  },
  {
    title: 'Định hướng học tập cá nhân hóa',
    description: 'Đề xuất lộ trình học tập phù hợp với năng lực, mục tiêu và trình độ của từng người học.',
    icon: <MdOutlinePersonalInjury size={24} className="text-"/>
  },
  {
    title: 'Đảm bảo đạo đức & trách nhiệm AI',
    description: 'Nâng cao nhận thức về việc sử dụng AI một cách đúng đắn, có trách nhiệm và phù hợp với chuẩn mực xã hội.',
    icon: <FcMindMap size={24} className="text-"/>
  },
  {
    title: 'Hỗ trợ ra quyết định đào tạo',
    description: 'Cung cấp dữ liệu và báo cáo rõ ràng để giáo viên, nhà trường và tổ chức đưa ra quyết định đào tạo hiệu quả.',
    icon: <MdOutlineModelTraining size={24} className="text-"/>
  },
]

export const AboutUs = () => {
  return (
    <div className="w-full bg-gradient-to-b from-sky-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="">
          <Badge variant="default" className="bg-slate-800 text-white text-[16px] px-4 py-1 mb-4">
            Hệ thống đánh giá năng lực sử dụng AI
            <BadgeCheck className="h-5 w-5" />
          </Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
          Về chúng tôi
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600">
          Chúng tôi xây dựng <strong>Hệ thống Đánh giá Năng lực Sử dụng AI</strong> nhằm đo lường,
          phát triển và chuẩn hóa kỹ năng AI cho người học trong kỷ nguyên số — một cách minh bạch,
          khoa học và phù hợp với môi trường giáo dục hiện đại.
        </p>
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Button size="lg">Khám phá hệ thống</Button>
          <Button size="lg" variant="outline">Liên hệ tư vấn</Button>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="text-sky-600" /> Sứ mệnh
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 leading-relaxed">
              Sứ mệnh của chúng tôi là giúp học sinh, sinh viên, giáo viên và người đi làm
              <strong> hiểu đúng – dùng đúng – dùng hiệu quả AI</strong>.
              Hệ thống không chỉ đánh giá kiến thức, mà còn tập trung vào tư duy phản biện,
              đạo đức AI và khả năng ứng dụng thực tế trong học tập và công việc.
            </CardContent>
          </Card>

          <Card className="rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="text-sky-600" /> Tầm nhìn
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 leading-relaxed">
              Trở thành nền tảng đánh giá năng lực AI đáng tin cậy hàng đầu trong giáo dục,
              được sử dụng rộng rãi tại các trường học, trung tâm đào tạo và doanh nghiệp,
              góp phần hình thành lực lượng lao động có trách nhiệm với AI.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why AI Competency */}
      <section className="bg-sky-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800">
            Vì sao cần đánh giá năng lực sử dụng AI?
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-center text-slate-600">
            AI đang thay đổi cách chúng ta học tập và làm việc. Tuy nhiên, việc sử dụng AI
            thiếu định hướng có thể dẫn đến lệ thuộc, sai lệch thông tin hoặc vi phạm đạo đức.
            Đánh giá đúng năng lực là bước đầu để sử dụng AI một cách bền vững.
          </p>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyAIs.map((item, idx) => (
              <Card key={idx} className="rounded-md hover:shadow-md transition">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {item.icon}
                    <p className="text-slate-600">{item.title}</p>
                  </CardTitle>
                </CardHeader>
                <CardContent className="">
                  <p>{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-800">Giá trị cốt lõi</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="text-sky-600" /> Giáo dục làm trung tâm
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              Mọi thiết kế và tính năng đều hướng tới trải nghiệm học tập tích cực,
              dễ hiểu, dễ tiếp cận cho mọi đối tượng người học.
            </CardContent>
          </Card>

          <Card className="rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="text-sky-600" /> Minh bạch & tin cậy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              Thuật toán đánh giá rõ ràng, dữ liệu được bảo mật,
              kết quả có thể giải thích và kiểm chứng.
            </CardContent>
          </Card>

          <Card className="rounded-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="text-sky-600" /> Đồng hành phát triển
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600">
              Không chỉ chấm điểm, chúng tôi cung cấp lộ trình cải thiện năng lực AI
              phù hợp cho từng cá nhân và tổ chức.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* System Overview */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800">Hệ thống của chúng tôi gồm những gì?</h2>
          <div className="mt-12 grid lg:grid-cols-2 gap-8">
            <Card className="rounded-md">
              <CardHeader>
                <CardTitle>Bài đánh giá năng lực AI</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 leading-relaxed">
                Bao gồm các bài trắc nghiệm và tình huống thực tế nhằm đánh giá:
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Hiểu biết cơ bản về AI</li>
                  <li>Kỹ năng sử dụng công cụ AI</li>
                  <li>Tư duy phản biện với kết quả AI</li>
                  <li>Nhận thức về đạo đức và giới hạn của AI</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-md">
              <CardHeader>
                <CardTitle>Báo cáo & lộ trình phát triển</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 leading-relaxed">
                Sau mỗi bài đánh giá, người dùng nhận được báo cáo chi tiết,
                phân tích điểm mạnh – điểm yếu và đề xuất lộ trình học tập
                cá nhân hóa để nâng cao năng lực AI.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </div>
  );
}
