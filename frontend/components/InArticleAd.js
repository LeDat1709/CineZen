'use client'

export default function InArticleAd({ position = 'middle' }) {
  return (
    <div className="my-8">
      {/* Google AdSense Placeholder */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6">
        <p className="text-xs text-gray-500 text-center mb-3">Quảng cáo</p>
        <div className="bg-gray-800/50 rounded flex items-center justify-center text-gray-600 text-sm" style={{ minHeight: '250px' }}>
          <div className="text-center">
            <p className="mb-2">Google AdSense</p>
            <p className="text-xs text-gray-700">
              {position === 'bottom' ? '728x90 Leaderboard' : '336x280 Large Rectangle'}
            </p>
          </div>
        </div>
      </div>

      {/* Hoặc Native Ad */}
      {/* <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-800/30 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500 uppercase">Đề xuất</span>
          <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded">Tài trợ</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-white">Phim hay đang hot</h3>
        <p className="text-sm text-gray-400 mb-4">Xem ngay trên Netflix với ưu đãi đặc biệt</p>
        <a href="#" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
          Xem ngay →
        </a>
      </div> */}
    </div>
  )
}
