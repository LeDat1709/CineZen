'use client'

import Image from 'next/image'

export default function AffiliateLinks({ content, compact = false }) {
  const streamingPlatforms = [
    {
      name: 'Clip TV',
      logo: 'https://play-lh.googleusercontent.com/iOeMQx01jPYTItq8qpTvl2rvbwwLc12l-paBR7YPZ8_sxCM0gwYGsd6ntNRs-kNZFDg=w240-h480-rw',
      url: 'https://cliptv.vn',
      affiliateParam: '?ref=cinezen'
    },
    {
      name: 'FPT Play',
      logo: 'https://images.fptplay53.net/media/photo/2026/01/28/logo-web_1769571521906.png',
      url: 'https://fptplay.vn',
      affiliateParam: '?utm_source=cinezen'
    },
    {
      name: 'VieON',
      logo: 'https://play-lh.googleusercontent.com/ybWP3ZXnTGMfmZzc--Dt8LsCU8mtTh5VXWBFQU0Jf1225e-OSe-cdjsXXBb-p9BI1rui',
      url: 'https://vieon.vn',
      affiliateParam: '?aff=cinezen'
    },
    {
      name: 'Galaxy Play',
      logo: 'https://assets.glxplay.io/web/images/logoglx.svg',
      url: 'https://galaxyplay.vn',
      affiliateParam: '?ref=cinezen'
    }
  ]

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-4">
        <p className="text-purple-200 text-sm font-medium text-center mb-1">
          🎬 Xem ở đâu?
        </p>
        <p className="text-gray-400 text-xs text-center mb-3">
          Các nền tảng streaming chính thức
        </p>
        <div className="flex justify-center gap-3">
          {streamingPlatforms.map((platform) => (
            <a
              key={platform.name}
              href={`${platform.url}${platform.affiliateParam}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="bg-white/10 backdrop-blur-sm rounded-lg p-2 hover:bg-white/20 hover:scale-105 transition-all duration-300 border border-white/10"
              title={`Xem trên ${platform.name}`}
            >
              <div className="relative w-12 h-12 flex items-center justify-center">
                <Image
                  src={platform.logo}
                  alt={platform.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className="mt-6 space-y-4">
      {/* Heading */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-3">
        <p className="text-sm text-purple-200 text-center font-medium mb-1">
          🎬 Xem ở đâu?
        </p>
        <p className="text-xs text-gray-400 text-center leading-relaxed">
          Trải nghiệm phim chất lượng cao trên các nền tảng streaming chính thức
        </p>
      </div>

      {/* Platform Logos Grid */}
      <div className="grid grid-cols-2 gap-3">
        {streamingPlatforms.map((platform) => (
          <a
            key={platform.name}
            href={`${platform.url}${platform.affiliateParam}`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10"
            title={`Xem trên ${platform.name}`}
          >
            <div className="relative w-full h-12 flex items-center justify-center">
              <Image
                src={platform.logo}
                alt={platform.name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </a>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 text-center">
        * Link liên kết hợp tác - Hỗ trợ duy trì website
      </p>

      {/* Google AdSense Below */}
      <div className="mt-6 bg-gray-900/50 border border-gray-800 rounded-lg p-4">
        <p className="text-xs text-gray-500 text-center mb-2">Quảng cáo</p>
        <div className="bg-gray-800/50 rounded flex items-center justify-center text-gray-600 text-sm" style={{ minHeight: '250px' }}>
          <div className="text-center">
            <p className="mb-1">Google AdSense</p>
            <p className="text-xs text-gray-700">300x250</p>
          </div>
        </div>
      </div>
    </div>
  )
}
