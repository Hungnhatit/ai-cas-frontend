"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BsStars } from "react-icons/bs";
import { CheckCircle, Brain, GraduationCap, Users, Target, ShieldCheck, BadgeCheck, Album } from "lucide-react";
import { GiSkills } from "react-icons/gi";
import { GrDocumentMissing } from "react-icons/gr";
import { MdOutlineModelTraining, MdOutlinePersonalInjury } from "react-icons/md";
import { FaUncharted } from "react-icons/fa";

const whyAIs = [
  {
    title: 'Đo lường kỹ năng thực tế',
    description: 'Đánh giá khả năng sử dụng AI trong các tình huống học tập và công việc thực tế, không chỉ dựa trên lý thuyết',
    icon: <GiSkills size={24} className="text-white" />,
    color: "bg-blue-500"
  },
  {
    title: 'Phát hiện lỗ hổng kiến thức',
    description: 'Xác định chính xác những điểm còn thiếu hoặc hiểu chưa đúng để người học cải thiện hiệu quả hơn',
    icon: <GrDocumentMissing size={24} className="text-white" />,
    color: "bg-rose-500"
  },
  {
    title: 'Chuẩn hóa theo tiêu chuẩn giáo dục',
    description: 'Xây dựng hệ thống đánh giá dựa trên các nguyên tắc và chuẩn mực giáo dục hiện đại, minh bạch và đáng tin cậy',
    icon: <Album size={24} className="text-white" />,
    color: "bg-emerald-500"
  },
  {
    title: 'Định hướng học tập cá nhân hóa',
    description: 'Đề xuất lộ trình học tập phù hợp với năng lực, mục tiêu và trình độ của từng người học.',
    icon: <MdOutlinePersonalInjury size={24} className="text-white" />,
    color: "bg-violet-500"
  },
  {
    title: 'Đảm bảo đạo đức & trách nhiệm AI',
    description: 'Nâng cao nhận thức về việc sử dụng AI một cách đúng đắn, có trách nhiệm và phù hợp với chuẩn mực xã hội.',
    icon: <FaUncharted size={24} className="text-white font-bold" />,
    color: "bg-amber-500"
  },
  {
    title: 'Hỗ trợ ra quyết định đào tạo',
    description: 'Cung cấp dữ liệu và báo cáo rõ ràng để giáo viên, nhà trường và tổ chức đưa ra quyết định đào tạo hiệu quả.',
    icon: <MdOutlineModelTraining size={24} className="text-white" />,
    color: "bg-cyan-500"
  },
]

export const AboutUs = () => {
  return (
    <div className="flex justify-center bg-gradient-to-b from-sky-50 to-white">
      <div className="max-w-7xl py-4">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="mb-4">
            <Badge variant="default" className="bg-gradient-to-r from-slate-800 via-purple-700 to-cyan-700 text-white text-[16px] px-4 py-1 mb-4">
              <BsStars />
              Hệ thống đánh giá năng lực sử dụng AI
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
            Về chúng tôi
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-800">
            Chúng tôi xây dựng <strong>Hệ thống đánh giá năng lực sử dụng AI</strong> nhằm đo lường,
            phát triển và chuẩn hóa kỹ năng AI cho người học trong kỷ nguyên số — một cách minh bạch,
            khoa học và phù hợp với môi trường giáo dục hiện đại.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Button size="lg" className="bg-[#18243d] hover:bg-slate-600 cursor-pointer">Khám phá hệ thống</Button>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="container mx-auto px-4 pt-8 pb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="group px-1 rounded-2xl gap-3 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="gap-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600">
                    <Target size={28} strokeWidth={2.5} />
                  </div>
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-slate-900">Sứ mệnh</CardDescription>
              </CardHeader>
              <CardContent className="relative text-slate-800 leading-relaxed">
                <div className="absolute -top-36 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Target size={180} className="text-rose-400 transform rotate-12" />
                </div>
                Sứ mệnh của chúng tôi là giúp học sinh, sinh viên, giáo viên và người đi làm
                <strong> hiểu đúng – dùng đúng – dùng hiệu quả AI</strong>.
                Hệ thống không chỉ đánh giá kiến thức, mà còn tập trung vào tư duy phản biện,
                đạo đức AI và khả năng ứng dụng thực tế trong học tập và công việc.
              </CardContent>
            </Card>

            <Card className="group px-1 rounded-2xl gap-3 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="w-14 h-14 bg-[#0E172B]/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 text-indigo-300 border border-white/10">
                    <Brain size={28} strokeWidth={2.5} className="text-[#3d4464]" />
                  </div>
                </CardTitle>
                <CardDescription className="text-2xl font-bold text-slate-900">Tầm nhìn</CardDescription>
              </CardHeader>
              <CardContent className="relative text-slate-800 leading-relaxed">
                <div className="absolute -top-36 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Brain size={180} className="text-[#5a6edd] transform -rotate-12" />
                </div>
                Trở thành nền tảng đánh giá năng lực AI đáng tin cậy hàng đầu trong giáo dục,
                được sử dụng rộng rãi tại các trường học, trung tâm đào tạo và doanh nghiệp,
                góp phần hình thành lực lượng lao động có trách nhiệm với AI.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Why AI Competency */}
        <section className="bg-sky-100 px-8 py-16 rounded-4xl">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-slate-800">
              Vì sao cần đánh giá năng lực sử dụng AI?
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-slate-800">
              AI đang thay đổi cách chúng ta học tập và làm việc. Tuy nhiên, việc sử dụng AI
              thiếu định hướng có thể dẫn đến lệ thuộc, sai lệch thông tin hoặc vi phạm đạo đức.
              Đánh giá đúng năng lực là bước đầu để sử dụng AI một cách bền vững.
            </p>

            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyAIs.map((item, idx) => (
                <Card key={idx} className="rounded-md shadow-lg hover:shadow-2xl transition">
                  <CardHeader className="gap-4
                  ">
                    <CardTitle className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </CardTitle>
                    <CardDescription>
                      <p className="text-slate-800 font-bold text-xl">{item.title}</p>
                    </CardDescription>
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
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-4xl font-bold text-center text-slate-800">Giá trị cốt lõi</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <Card className="border-none rounded-xl gap-3">
              <CardHeader className="flex flex-col items-center gap-4">
                <CardTitle className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <GraduationCap size={32} className="text-blue-600" />
                </CardTitle>
                <CardDescription className="text-xl font-bold text-black">
                  Giáo dục làm trung tâm
                </CardDescription>
              </CardHeader>
              <CardContent className="text-slate-600 text-center">
                Mọi thiết kế và tính năng đều hướng tới trải nghiệm học tập tích cực,
                dễ hiểu, dễ tiếp cận cho mọi đối tượng người học.
              </CardContent>
            </Card>

            <Card className="border-none rounded-xl gap-3 bg-indigo-50/50 border-indigo-100 ring-4 ring-indigo-100">
              <CardHeader className="flex flex-col items-center gap-4">
                <CardTitle className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <ShieldCheck size={32} className="text-blue-600" />
                </CardTitle>
                <CardDescription className="text-xl font-bold text-black">
                  Minh bạch & tin cậy
                </CardDescription>
              </CardHeader>
              <CardContent className="text-slate-600 text-center">
                Thuật toán đánh giá rõ ràng, dữ liệu được bảo mật,
                kết quả có thể giải thích và kiểm chứng.
              </CardContent>
            </Card>

            <Card className="border-none rounded-xl gap-3">
              <CardHeader className="flex flex-col items-center gap-4">
                <CardTitle className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <Users size={32} className="text-blue-600" />
                </CardTitle>
                <CardDescription className="text-xl font-bold text-black">
                  Đồng hành phát triển
                </CardDescription>
              </CardHeader>
              <CardContent className="text-slate-600 text-center">
                Không chỉ chấm điểm, chúng tôi cung cấp lộ trình cải thiện năng lực AI
                phù hợp cho từng cá nhân và tổ chức.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* System Overview */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-16 rounded-4xl">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white">Hệ thống của chúng tôi gồm những gì?</h2>
            <div className="mt-8 grid lg:grid-cols-2 gap-8">
              <Card className="rounded-md gap-3 bg-transparent border-none">
                <CardHeader>
                  <CardTitle className="text-slate-300 text-center text-2xl">Bài đánh giá năng lực AI</CardTitle>
                </CardHeader>
                <CardContent className="text-white leading-relaxed">
                  Bao gồm các bài trắc nghiệm và tình huống thực tế nhằm đánh giá:
                  <ul className="text-white list-disc ml-6 mt-2 space-y-1">
                    <li>Hiểu biết cơ bản về AI</li>
                    <li>Kỹ năng sử dụng công cụ AI</li>
                    <li>Tư duy phản biện với kết quả AI</li>
                    <li>Nhận thức về đạo đức và giới hạn của AI</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="rounded-md gap-3 bg-transparent border-none">
                <CardHeader>
                  <CardTitle className="text-slate-300 text-center text-2xl">Báo cáo & lộ trình phát triển</CardTitle>
                </CardHeader>
                <CardContent className="text-white leading-relaxed text-justify">
                  Sau mỗi bài đánh giá, hệ thống tự động tạo báo cáo phân tích toàn diện dựa trên kết quả làm bài của người dùng. Báo cáo không chỉ cung cấp điểm số tổng quan mà còn phân tích chi tiết theo từng nhóm năng lực, giúp người học nhận diện rõ điểm mạnh, điểm còn hạn chế và mức độ thành thạo trong việc sử dụng AI.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
