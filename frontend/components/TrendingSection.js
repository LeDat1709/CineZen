'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function TrendingSection() {
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrending()
  }, [])

  const fetchTrending = async () => {
    try {
      // Lấy top 10 phim có rating cao nhất (cả phim và truyện)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contents/top-rated?limit=10`)
      const data = await response.json()
      setTrending(data.contents || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return null

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🔥 Trending Tuần Này
          </h2>
          <p className="text-sm text-gray-400 mt-1">Những review được yêu thích nhất</p>
        </div>
      </div>

      {/* Horizontal Scroll */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {trending.map((content, index) => (
            <Link
              key={content.id}
              href={`/contents/${content.slug}`}
              className="flex-shrink-0 w-[280px] group"
            >
              <div className="relative">
                {/* Rank Badge */}
                <div className="absolute -left-2 -top-2 z-10 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-xl text-black shadow-lg">
                  {index + 1}
                </div>

                {/* Card */}
                <div className="bg-[#1a1a1a] rounded-lg overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-purple-900/50">
                  {/* Poster */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {content.posterUrl ? (
                      <Image
                        src={content.posterUrl}
                        alt={content.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <span className="text-4xl opacity-30">🎬</span>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold flex items-center gap-1">
                      ⭐ {content.rating}
                    </div>

                    {/* Type Badge */}
                    <div className={`absolute top-2 left-2 ${
                      content.type === 'MOVIE' ? 'bg-blue-600' : 'bg-purple-600'
                    } px-2 py-1 rounded text-xs font-semibold`}>
                      {content.type === 'MOVIE' ? 'Phim' : 'Truyện'}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                      {content.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{content.releaseYear}</span>
                      {content.genres && content.genres.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="line-clamp-1">
                            {content.genres.map(cg => cg.genre.name).join(', ')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Scroll Hint */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0f0f0f] to-transparent pointer-events-none"></div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
