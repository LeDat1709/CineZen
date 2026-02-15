import './globals.css'

export const metadata = {
  title: 'CineZen - Thế giới Review Phim & Truyện',
  description: 'Khám phá thế giới điện ảnh qua những review chất lượng. Nơi bạn đắm chìm vào câu chuyện sau giờ học, giờ làm.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        {children}
      </body>
    </html>
  )
}
