'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import YouTubeEmbed from './YouTubeEmbed'
import AffiliateLinks from './AffiliateLinks'
import InArticleAd from './InArticleAd'

export default function ContentDetail({ slug }) {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [slug])

  const fetchContent = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contents/${slug}`)
      const data = await response.json()
      setContent(data)
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-white">Đang tải...</div>
  if (!content) return <div className="text-center py-12 text-white">Không tìm thấy nội dung</div>

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-12">
        {/* Poster */}
        <div>
          {content.posterUrl && (
            <div className="sticky top-24">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={content.posterUrl}
                  alt={content.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Affiliate Links */}
              <div className="mt-6">
                <AffiliateLinks content={content} />
              </div>
            </div>
          )}
        </div>
        
        {/* Info */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {content.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-6 flex-wrap text-sm">
            {content.releaseYear && (
              <span className="text-gray-400">{content.releaseYear}</span>
            )}
            {content.rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="text-white font-semibold">{content.rating}</span>
                <span className="text-gray-500">/10</span>
              </div>
            )}
            {content.type && (
              <span className="text-gray-400 uppercase text-xs tracking-wider">
                {content.type === 'MOVIE' ? 'Phim lẻ' : 'Series'}
              </span>
            )}
          </div>

          {/* Genres */}
          {content.genres && content.genres.length > 0 && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {content.genres.map(cg => (
                <span 
                  key={cg.genre.id} 
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-sm text-gray-300 transition-colors"
                >
                  {cg.genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {content.description && (
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed text-base">
                {content.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* In-Article Ad */}
      <div className="mb-12">
        <InArticleAd />
      </div>

      {/* Reviews Section */}
      {content.reviews && content.reviews.length > 0 && (
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Video Reviews</h2>
            <p className="text-gray-400 text-sm">
              {content.reviews.length} review{content.reviews.length > 1 ? 's' : ''} từ cộng đồng
            </p>
          </div>
          
          <div className="space-y-6">
            {content.reviews.map((review, index) => (
              <div key={review.id}>
                <div className="bg-[#1a1a1a]/50 backdrop-blur-sm rounded-lg overflow-hidden border border-white/5">
                  <YouTubeEmbed videoId={review.youtubeVideoId} />
                  {(review.reviewerName || review.reviewSummary) && (
                    <div className="p-5">
                      {review.reviewerName && (
                        <p className="font-medium text-white mb-2">{review.reviewerName}</p>
                      )}
                      {review.reviewSummary && (
                        <p className="text-gray-400 text-sm leading-relaxed">{review.reviewSummary}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* In-Article Ad between reviews */}
                {index === 1 && content.reviews.length > 2 && (
                  <div className="my-8">
                    <InArticleAd />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Ad */}
      <div className="mt-12">
        <InArticleAd position="bottom" />
      </div>
    </div>
  )
}
