'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HeroBanner() {
  const [featured, setFeatured] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeatured()
  }, [])

  useEffect(() => {
    if (featured.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length)
    }, 5000) // Auto slide every 5 seconds

    return () => clearInterval(interval)
  }, [featured])

  const fetchFeatured = async () => {
    try {
      // Lấy top 5 phim có rating cao nhất
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contents/top-rated?limit=5`)
      const data = await response.json()
      setFeatured(data.contents || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || featured.length === 0) return null

  const current = featured[currentIndex]

  return (
    <div className="relative h-[600px] w-full overflow-hidden mb-8">
      {/* Blurred Background - Only colors visible */}
      <div className="absolute inset-0 bg-black">
        {current.posterUrl && (
          <>
            {/* Blurred poster for color ambiance */}
            <img
              src={current.posterUrl}
              alt={current.title}
              className="w-full h-full object-cover scale-110"
              style={{
                filter: 'blur(60px) brightness(0.7) saturate(1.3)',
              }}
            />
            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/40"></div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-3xl">
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-2xl leading-tight">
            {current.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-4 mb-6">
            {current.releaseYear && (
              <span className="text-yellow-400 font-semibold text-lg">
                {current.releaseYear}
              </span>
            )}
            {current.rating && (
              <>
                <span className="text-gray-500">•</span>
                <span className="text-yellow-400 font-semibold text-lg">
                  {current.rating}/10
                </span>
              </>
            )}
            {current.genres && current.genres.length > 0 && (
              <>
                <span className="text-gray-500">•</span>
                <div className="flex gap-2">
                  {current.genres.slice(0, 3).map(cg => (
                    <span 
                      key={cg.genre.id}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full border border-white/20"
                    >
                      {cg.genre.name}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Description */}
          {current.description && (
            <p className="text-gray-200 text-lg mb-8 line-clamp-3 leading-relaxed max-w-2xl">
              {current.description}
            </p>
          )}

          {/* Action Buttons - Updated for legal compliance */}
          <div className="flex gap-4">
            <Link
              href={`/contents/${current.slug}`}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-10 py-4 rounded-lg transition-all hover:scale-105 shadow-lg"
            >
              Xem đánh giá chi tiết
            </Link>
            <Link
              href={`/contents/${current.slug}`}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-10 py-4 rounded-lg transition-all border border-white/30"
            >
              Xem Trailer
            </Link>
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="absolute bottom-8 right-8 flex gap-3">
        {featured.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(index)}
            className={`relative w-20 h-28 rounded-lg overflow-hidden transition-all ${
              index === currentIndex 
                ? 'ring-4 ring-yellow-500 scale-110 shadow-2xl' 
                : 'opacity-50 hover:opacity-100 hover:scale-105'
            }`}
          >
            {item.posterUrl && (
              <img
                src={item.posterUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            )}
          </button>
        ))}
      </div>

      {/* Navigation Arrows - Simple, No Icons */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length)}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 border border-white/20 text-white text-2xl font-light"
      >
        ‹
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % featured.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 border border-white/20 text-white text-2xl font-light"
      >
        ›
      </button>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {featured.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 rounded-full transition-all ${
              index === currentIndex 
                ? 'w-12 bg-yellow-500' 
                : 'w-8 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
