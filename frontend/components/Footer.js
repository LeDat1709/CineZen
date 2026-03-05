export default function Footer() {
  return (
    <footer className="glass-effect border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="https://kwseglsgutzjfluiypiy.supabase.co/storage/v1/object/public/Image/logonew.png" 
                alt="CineZen Logo" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-400">
              Thế giới review phim & phim bộ. Nơi bạn đắm chìm vào câu chuyện sau giờ học, giờ làm.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Khám phá</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-purple-400 transition-colors">Trang chủ</a></li>
              <li><a href="/movies" className="hover:text-purple-400 transition-colors">Phim</a></li>
              <li><a href="/series" className="hover:text-purple-400 transition-colors">Phim Bộ</a></li>
              <li><a href="/privacy" className="hover:text-purple-400 transition-colors">Chính sách bảo mật</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Kết nối</h3>
            <p className="text-gray-400 mb-4">Theo dõi chúng tôi để cập nhật review mới nhất</p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 glass-effect rounded-full flex items-center justify-center hover:bg-purple-500/20 transition-colors">
                📘
              </a>
              <a href="#" className="w-10 h-10 glass-effect rounded-full flex items-center justify-center hover:bg-purple-500/20 transition-colors">
                🐦
              </a>
              <a href="#" className="w-10 h-10 glass-effect rounded-full flex items-center justify-center hover:bg-purple-500/20 transition-colors">
                📷
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 space-y-6">
          {/* Copyright */}
          <p className="text-center text-gray-400">
            &copy; 2026 CineZen. Thế giới review phim & phim bộ của bạn.
          </p>
          
          {/* TMDb Attribution */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <img 
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" 
                alt="TMDb Logo" 
                className="h-5"
              />
              <span className="text-gray-500 text-xs">
                Powered by The Movie Database (TMDb)
              </span>
            </div>
            <p className="text-xs text-gray-600 text-center max-w-2xl">
              This product uses the TMDb API but is not endorsed or certified by TMDb.
            </p>
          </div>
          
          {/* Legal Disclaimer */}
          <p className="text-xs text-gray-500 max-w-4xl mx-auto text-center leading-relaxed">
            <strong>Tuyên bố miễn trừ trách nhiệm:</strong> Chúng tôi không lưu trữ hay cung cấp các tệp video vi phạm bản quyền. 
            Mọi nội dung trên website đều là ý kiến cá nhân và phục vụ mục đích phê bình, đánh giá điện ảnh. 
            Chúng tôi khuyến khích người xem ủng hộ các tác phẩm điện ảnh thông qua các nền tảng phát hành chính thức.
          </p>
        </div>
      </div>
    </footer>
  )
}
