'use client'

import Image from 'next/image'

export default function AffiliateLinks({ content }) {
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
  
  return (
    <div className="mt-6 space-y-4">
      {/* Heading */}
      <div>
        <p className="text-sm text-gray-300 text-center leading-relaxed">
          Bạn có thể trải nghiệm phim chân thực hơn với các nền tảng
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
            title={platform.name}
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
        * Link liên kết - Hỗ trợ website
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
