'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function TrendingSection() {
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrending()
  }, [])

  const fetchTrending = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contents/trending?limit=10`)
      const data = await response.json()
      setTrending(data.contents || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || trending.length === 0) return null

  return (
    <div className="mb-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-6">Trending Tuần Này</h2>
        
        {/* Horizontal Scroll Container */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {trending.map((content) => (
              <div key={content.id} className="flex-shrink-0 w-[180px]">
                <Link href={`/contents/${content.slug}`}>
                  <div className="group cursor-pointer">
                    {/* Poster Image - Same as ContentCard */}
                    <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-gray-900 mb-2">
                      {content.posterUrl ? (
                        <img
                          src={content.posterUrl}
                          alt={content.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextElementSibling.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      
                      {/* Fallback */}
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 items-center justify-center" style={{ display: content.posterUrl ? 'none' : 'flex' }}>
                        <div className="text-gray-600 text-sm">🖼️</div>
                      </div>
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Rating badge */}
                      {content.rating && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                          {content.rating}
                        </div>
                      )}
                    </div>

                    {/* Title and Year below poster - Same as ContentCard */}
                    <div className="px-1 text-center">
                      <h3 className="font-medium text-sm text-white line-clamp-2 mb-1 group-hover:text-yellow-500 transition-colors">
                        {content.title}
                      </h3>
                      <div className="text-xs text-gray-500 space-y-0.5">
                        <p>{content.releaseYear}</p>
                        {content.genres && content.genres.length > 0 && (
                          <p className="line-clamp-1">
                            {content.genres.map(cg => cg.genre.name).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
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
    </div>
  )
}
