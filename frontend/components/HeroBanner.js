'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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
    <div className="relative h-[500px] w-full overflow-hidden mb-8">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {current.posterUrl && (
          <Image
            src={current.posterUrl}
            alt={current.title}
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-2xl">
            {current.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-3 mb-8">
            {current.releaseYear && (
              <span className="text-gray-300 text-base">
                {current.releaseYear}
              </span>
            )}
            {current.genres && current.genres.length > 0 && (
              <>
                <span className="text-gray-500">•</span>
                <span className="text-gray-300 text-base">
                  {current.genres.map(cg => cg.genre.name).join(', ')}
                </span>
              </>
            )}
          </div>

          {/* Action Button */}
          <Link
            href={`/contents/${current.slug}`}
            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-md transition-all hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Xem ngay
          </Link>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        {featured.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(index)}
            className={`relative w-16 h-20 rounded overflow-hidden transition-all ${
              index === currentIndex 
                ? 'ring-2 ring-yellow-500 scale-110' 
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            {item.posterUrl && (
              <Image
                src={item.posterUrl}
                alt={item.title}
                fill
                className="object-cover"
              />
            )}
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % featured.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
