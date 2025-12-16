"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, TrendingUp, CheckCircle, Star, ArrowRight, CheckCircle2, Sparkles, Brain, Target, ShieldCheck } from "lucide-react"
import { LandingLayout } from "@/components/layout/landing-layout"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter();

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-indigo-600" />,
      title: "Đánh giá thích ứng (Adaptive)",
      description: "Hệ thống tự động điều chỉnh độ khó câu hỏi dựa trên năng lực thực tế của người học, giúp đánh giá chính xác trình độ."
    },
    {
      icon: <Target className="h-6 w-6 text-indigo-600" />,
      title: "Lộ trình cá nhân hóa",
      description: "Sau khi đánh giá, AI đề xuất lộ trình học tập riêng biệt để lấp đầy các lỗ hổng kiến thức."
    },
    {
      icon: <Award className="h-6 w-6 text-indigo-600" />,
      title: "Chứng chỉ Blockchain",
      description: "Kết quả đánh giá được cấp chứng chỉ số, xác thực minh bạch và có giá trị tham khảo toàn cầu."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-indigo-600" />,
      title: "Bảo mật & Liêm chính",
      description: "Công nghệ AI giám sát (Proctoring) đảm bảo tính công bằng và minh bạch trong quá trình làm bài kiểm tra."
    }
  ];

  // useEffect(() => {
  //   if (!loading && user) {
  //     router.push("/dashboard")
  //   }
  // }, [user, loading, router])

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  //     </div>
  //   )
  // }

  // if (user) {
  //   return null;
  // }

  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl opacity-50 -translate-x-1/3 translate-y-1/4"></div>

        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge variant="secondary" className="mb-4 text-indigo-700 border-indigo-100 bg-indigo-50">
            <Sparkles className="w-3 h-3 mr-1" /> Phiên bản 2.0 đã ra mắt
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-tight">
            Chuẩn hóa năng lực AI <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              cho Tương lai Giáo dục
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Hệ thống đánh giá toàn diện giúp người học định vị năng lực sử dụng Trí tuệ nhân tạo, từ đó xây dựng lộ trình phát triển sự nghiệp bền vững.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-full h-12 px-8 text-base w-full sm:w-auto shadow-indigo-200 shadow-xl hover:shadow-2xl hover:shadow-indigo-200 transition-all cursor-pointer">
              Bắt đầu đánh giá <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full h-12 px-8 text-base w-full sm:w-auto bg-white/50 backdrop-blur-sm cursor-pointer">
              Tìm hiểu quy trình
            </Button>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section id="about" className="py-16 px-4 border-t border-border bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">10k+</div>
              <div className="text-muted-foreground text-sm">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-muted-foreground text-sm">Expert Instructors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-muted-foreground text-sm">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-muted-foreground text-sm">Completion Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Visions */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl transform rotate-3 scale-105 opacity-10"></div>
              <img
                src="https://res.cloudinary.com/drjv3ft4p/image/upload/v1765854036/baodanang.vn-dataimages-202504-original-_images1773133_lxd_9130_vha0wf.jpg"
                alt="Students collaborating"
                className="relative rounded-lg shadow-xl w-full object-cover h-[400px] md:h-[500px]"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-slate-100 max-w-xs hidden md:block">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-2 rounded-full text-green-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Chuẩn xác tuyệt đối</h4>
                    <p className="text-sm text-slate-500 mt-1">Hệ thống AI phân tích dữ liệu thời gian thực.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Badge variant="default" className="bg-indigo-100 px-3 py-1 text-[16px] text-[#4e33b9] border-none">Về chúng tôi</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Sứ mệnh phổ cập <span className="text-indigo-600">Năng lực AI</span> cho thế hệ trẻ Việt Nam
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Trong kỷ nguyên số, AI không còn là công nghệ xa vời mà là kỹ năng sinh tồn. Hệ thống của chúng tôi ra đời nhằm xóa bỏ khoảng cách về kỹ năng số, cung cấp thước đo chuẩn xác để các cơ sở giáo dục và doanh nghiệp có tiếng nói chung.
              </p>

              <div className="space-y-4 pt-4">
                {[
                  "Xây dựng khung năng lực chuẩn quốc tế.",
                  "Kết nối nhân tài AI với doanh nghiệp.",
                  "Tạo môi trường học tập thích ứng cá nhân hóa."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Button variant="outline">Tìm hiểu thêm về đội ngũ</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Segment Tab */}
      <section className="py-20 bg-slate-100/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Giải pháp cho mọi đối tượng</h2>
            <p className="text-xl text-slate-600">Hệ thống được thiết kế tùy biến để đáp ứng nhu cầu đặc thù của từng nhóm người dùng.</p>
          </div>

          <Tabs defaultValue="student">
            <div className="flex justify-center mb-10">
              <TabsList className="h-10 bg-white p-1.5 gap-2 shadow-sm border border-slate-200 rounded-md">
                <TabsTrigger value="student" className="rounded-sm px-6 py-2 cursor-pointer transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                  Dành cho Học viên
                </TabsTrigger>
                <TabsTrigger value="educator" className="rounded-sm px-6 py-2 cursor-pointer transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                  Dành cho Giảng viên
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="student" className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="order-2 md:order-1 space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900">Nâng cao lợi thế cạnh tranh</h3>
                  <p className="text-slate-600">
                    Sở hữu hồ sơ năng lực AI được chứng thực giúp bạn nổi bật trước nhà tuyển dụng. Hệ thống gợi ý các kỹ năng còn thiếu và cung cấp tài liệu học tập phù hợp.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>Bài test nhanh 15 phút</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>Phân tích điểm mạnh/yếu chi tiết</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>Lộ trình học tập miễn phí</li>
                  </ul>
                  <Button className="mt-4 cursor-pointer">Đăng ký thi thử</Button>
                </div>
                <div className="order-1 md:order-2">
                  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Student" className="rounded-xl shadow-md w-full h-64 object-cover" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="educator" className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="order-2 md:order-1 space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900">Công cụ hỗ trợ giảng dạy 4.0</h3>
                  <p className="text-slate-600">
                    Giúp giảng viên đánh giá nhanh trình độ của lớp học, từ đó điều chỉnh giáo án phù hợp. Tự động hóa việc chấm điểm và phân tích thống kê.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>Tạo đề thi tự động bằng AI</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>Báo cáo năng lực lớp học trực quan</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>Kho ngân hàng câu hỏi phong phú</li>
                  </ul>
                  <Button className="mt-4">Tạo tài khoản Giảng viên</Button>
                </div>
                <div className="order-1 md:order-2">
                  <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Educator" className="rounded-xl shadow-md w-full h-64 object-cover" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tất cả những gì bạn cần và dạy</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Những công cụ mạnh mẽ dành cho sinh viên, giảng viên và nhà quản lý để tạo ra những trải nghiệm học tập tuyệt vời.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg bg-white hover:-translate-y-1 transition-transform duration-300">
                <CardHeader>
                  <div className="mb-4 bg-indigo-50 w-12 h-12 rounded-lg flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-slate-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* CTA SECTION */}
      <section className="py-20 bg-indigo-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Sẵn sàng để kiểm tra năng lực?</h2>
          <p className="text-indigo-200 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Tham gia cùng hơn 15,000 người học và bắt đầu hành trình chinh phục công nghệ AI ngay hôm nay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white cursor-pointer text-indigo-900 hover:bg-indigo-50 h-14 px-8 text-lg font-semibold">
              Đăng ký miễn phí
            </Button>
            <Button variant="default" size="lg" className="border-indigo-400 hover:text-white cursor-pointer text-white h-14 px-8 text-lg">
              Liên hệ tư vấn
            </Button>
          </div>
        </div>
      </section>
    </LandingLayout>
  )
}
