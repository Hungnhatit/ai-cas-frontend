import { ChevronRight, Facebook, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

const LandingFooter = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">C</div>
              <span>AICAS</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Nền tảng đánh giá năng lực nhân sự hàng đầu, giúp doanh nghiệp tối ưu hóa nguồn lực và cá nhân phát triển sự nghiệp vững chắc thông qua công nghệ AI.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://www.facebook.com/hungnhat23/" className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-400 hover:text-white transition-all">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-blue-700 hover:text-white transition-all">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Sản phẩm</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronRight className="h-3 w-3" /> Đánh giá 360 độ</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronRight className="h-3 w-3" /> Test IQ/EQ/MBTI</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronRight className="h-3 w-3" /> Khung năng lực ASK</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronRight className="h-3 w-3" /> Lộ trình phát triển IDP</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Tài nguyên</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronRight className="h-3 w-3" /> Blog nhân sự</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronRight className="h-3 w-3" /> Thư viện đề thi mẫu</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronRight className="h-3 w-3" /> Báo cáo mẫu</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ChevronRight className="h-3 w-3" /> Trung tâm hỗ trợ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Liên hệ</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <span>48 Cao Thắng, Phường Hải Châu, Thành phố Đà Nẵng</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500 shrink-0" />
                <a href="mailto:contact@competencyhub.vn" className="hover:text-white transition-colors">nhatpro204@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                <a href="tel:083 306 7858" className="hover:text-white transition-colors">083 306 7858</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2025 AICAS. Bản quyền đã được bảo lưu.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-white transition-colors">Sơ đồ trang web</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter