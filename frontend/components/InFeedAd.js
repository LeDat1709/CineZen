'use client'

import Image from 'next/image'

export default function InFeedAd({ position }) {
  const streamingPlatforms = [
    {
      name: 'Clip TV',
      logo: 'https://play-lh.googleusercontent.com/iOeMQx01jPYTItq8qpTvl2rvbwwLc12l-paBR7YPZ8_sxCM0gwYGsd6ntNRs-kNZFDg=w240-h480-rw',
      color: 'from-red-600 to-red-700',
      url: 'https://cliptv.vn',
      affiliateParam: '?ref=cinezen'
    },
    {
      name: 'FPT Play',
      logo: 'https://images.fptplay53.net/media/photo/2026/01/28/logo-web_1769571521906.png',
      color: 'from-orange-600 to-orange-700',
      url: 'https://fptplay.vn',
      affiliateParam: '?utm_source=cinezen'
    },
    {
      name: 'VieON',
      logo: 'https://play-lh.googleusercontent.com/ybWP3ZXnTGMfmZzc--Dt8LsCU8mtTh5VXWBFQU0Jf1225e-OSe-cdjsXXBb-p9BI1rui',
      color: 'from-purple-600 to-purple-700',
      url: 'https://vieon.vn',
      affiliateParam: '?aff=cinezen'
    },
    {
      name: 'Galaxy Play',
      logo: 'https://assets.glxplay.io/web/images/logoglx.svg',
      color: 'from-blue-600 to-blue-700',
      url: 'https://galaxyplay.vn',
      affiliateParam: '?ref=cinezen'
    }
  ]

  return (
    <div className="my-8">
      {/* Streaming Platforms Affiliate */}
      <div className="bg-gradient-to-r from-[#1a0a2e]/50 to-[#0f0520]/50 border border-[#2a1a4e]/40 rounded-lg p-8">
        <div className="flex items-center justify-between flex-wrap gap-6">
          {/* Left side - Text */}
          <div className="flex-1 min-w-[300px]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Đề xuất</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">
              🎬 Xem Phim Chất Lượng Cao
            </h3>
            <p className="text-gray-300 mb-4">
              Bạn có thể có trải nghiệm phim chất lượng hơn với các nền tảng
            </p>
            
            {/* Platform Logos Grid */}
            <div className="grid grid-cols-4 gap-3 max-w-md">
              {streamingPlatforms.map((platform) => (
                <a
                  key={platform.name}
                  href={`${platform.url}${platform.affiliateParam}`}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group border border-white/10"
                  title={platform.name}
                >
                  <div className="relative w-full h-12 flex items-center justify-center">
                    <Image
                      src={platform.logo}
                      alt={platform.name}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform"
                      unoptimized
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-gradient-to-br from-[#1a0a2e] to-[#2a1a4e] rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-6xl">🎬</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
