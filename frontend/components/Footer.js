export default function Footer() {
  return (
    <footer className="glass-effect border-t border-white/10 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="https://cdzhcgozjilldlpngapi.supabase.co/storage/v1/object/public/Image/Logo/logonew.png" 
                alt="ReviewPhim Logo" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-400">
              Thế giới review phim & truyện. Nơi bạn đắm chìm vào câu chuyện sau giờ học, giờ làm.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Khám phá</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-purple-400 transition-colors">Trang chủ</a></li>
              <li><a href="/movies" className="hover:text-purple-400 transition-colors">Phim</a></li>
              <li><a href="/series" className="hover:text-purple-400 transition-colors">Truyện</a></li>
              <li><a href="/genres" className="hover:text-purple-400 transition-colors">Thể loại</a></li>
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
        
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 ReviewPhim. Thế giới review phim & truyện của bạn.</p>
        </div>
      </div>
    </footer>
  )
}
