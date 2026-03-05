import Header from '../../components/Header'
import Footer from '../../components/Footer'

export const metadata = {
  title: 'Chính sách bảo mật - ReviewPhim',
  description: 'Chính sách bảo mật và quyền riêng tư của ReviewPhim'
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Chính sách bảo mật</h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            {/* Introduction */}
            <section className="bg-white/5 rounded-lg p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                Tại ReviewPhim, chúng tôi cam kết bảo vệ quyền riêng tư của bạn. 
                Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Sử dụng Cookie</h2>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Website của chúng tôi sử dụng cookie để:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Cải thiện trải nghiệm người dùng</li>
                  <li>Phân tích lưu lượng truy cập website</li>
                  <li>Cá nhân hóa nội dung và quảng cáo</li>
                  <li>Hỗ trợ chương trình tiếp thị liên kết (Affiliate Marketing)</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  Bạn có thể tắt cookie trong cài đặt trình duyệt, nhưng điều này có thể ảnh hưởng đến trải nghiệm sử dụng website.
                </p>
              </div>
            </section>

            {/* Google AdSense */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Google AdSense & Quảng cáo</h2>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Chúng tôi sử dụng Google AdSense để hiển thị quảng cáo trên website. 
                  Google có thể sử dụng cookie để hiển thị quảng cáo dựa trên lượt truy cập trước đó của bạn.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Bạn có thể tùy chỉnh cài đặt quảng cáo của Google tại: 
                  <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 ml-1">
                    Google Ads Settings
                  </a>
                </p>
              </div>
            </section>

            {/* Affiliate Marketing */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Tiếp thị liên kết (Affiliate)</h2>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  ReviewPhim tham gia các chương trình tiếp thị liên kết với các nền tảng streaming như:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Netflix</li>
                  <li>FPT Play</li>
                  <li>VieON</li>
                  <li>Galaxy Play</li>
                  <li>Clip TV</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  Khi bạn nhấp vào các liên kết này và thực hiện mua hàng, chúng tôi có thể nhận được hoa hồng. 
                  Điều này không làm tăng chi phí của bạn và giúp chúng tôi duy trì website.
                </p>
              </div>
            </section>

            {/* Data Collection */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Thu thập dữ liệu</h2>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Chúng tôi có thể thu thập các thông tin sau:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Địa chỉ IP</li>
                  <li>Loại trình duyệt và thiết bị</li>
                  <li>Trang web bạn truy cập</li>
                  <li>Thời gian truy cập</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  Thông tin này chỉ được sử dụng để cải thiện dịch vụ và không được chia sẻ với bên thứ ba 
                  (ngoại trừ các dịch vụ phân tích như Google Analytics).
                </p>
              </div>
            </section>

            {/* Third Party Services */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Dịch vụ bên thứ ba</h2>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Website sử dụng các dịch vụ bên thứ ba:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li><strong>Google Analytics:</strong> Phân tích lưu lượng truy cập</li>
                  <li><strong>YouTube:</strong> Nhúng video review</li>
                  <li><strong>TMDb API:</strong> Dữ liệu phim và poster</li>
                </ul>
                <p className="text-gray-300 leading-relaxed">
                  Các dịch vụ này có chính sách bảo mật riêng mà chúng tôi khuyến khích bạn đọc.
                </p>
              </div>
            </section>

            {/* User Rights */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Quyền của người dùng</h2>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Bạn có quyền:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Yêu cầu xóa dữ liệu cá nhân</li>
                  <li>Từ chối cookie (thông qua cài đặt trình duyệt)</li>
                  <li>Yêu cầu thông tin về dữ liệu được thu thập</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Liên hệ</h2>
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <p className="text-gray-300 leading-relaxed">
                  Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua email: 
                  <span className="text-purple-400 ml-1">privacy@reviewphim.com</span>
                </p>
              </div>
            </section>

            {/* Last Updated */}
            <section className="text-center pt-8 border-t border-white/10">
              <p className="text-gray-500 text-sm">
                Cập nhật lần cuối: 27 tháng 2, 2026
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
