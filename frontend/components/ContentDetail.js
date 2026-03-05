'use client'

import { useState } from 'react'
import YouTubeEmbed from './YouTubeEmbed'
import AffiliateLinks from './AffiliateLinks'
import InArticleAd from './InArticleAd'

export default function ContentDetail({ content }) {
  const [imageError, setImageError] = useState(false)

  // Debug: Check if reviewContent exists
  console.log('Content data:', content)
  console.log('Review Content:', content?.reviewContent)

  if (!content) return <div className="text-center py-12 text-white">Không tìm thấy nội dung</div>

  return (
    <div className="max-w-7xl mx-auto">
      {/* Disclaimer */}
      <div className="mb-6 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
        <p className="text-purple-300 text-sm font-medium mb-1">📝 Bài viết đánh giá & phân tích</p>
        <p className="text-gray-400 text-xs">
          Nội dung dưới đây là ý kiến cá nhân phục vụ mục đích phê bình điện ảnh
        </p>
      </div>

      {/* Main Content Area - Blog Style */}
      <div className="grid lg:grid-cols-[1fr_350px] gap-8 mb-8">
        {/* Left Column - Main Content */}
        <div className="space-y-8">
          {/* Movie Info Card */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {content.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-4 flex-wrap text-sm">
              {content.releaseYear && (
                <span className="text-gray-400">📅 {content.releaseYear}</span>
              )}
              {content.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="text-white font-semibold">{content.rating}</span>
                  <span className="text-gray-500">/10</span>
                </div>
              )}
              {content.type && (
                <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs uppercase tracking-wider">
                  {content.type === 'MOVIE' ? 'Phim lẻ' : 'Phim Bộ'}
                </span>
              )}
              {content.country && (
                <span className="text-gray-400">🌍 {content.country}</span>
              )}
            </div>

            {/* Genres */}
            {content.genres && content.genres.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
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
          </div>

          {/* Description */}
          {content.description && (
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">📝</span>
                <h2 className="text-xl font-bold text-purple-300">Tóm tắt</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-base">
                {content.description}
              </p>
            </div>
          )}

          {/* Detailed Review Content - Blog Style */}
          {content.reviewContent && (
            <article className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-b border-yellow-500/40 px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <span className="text-3xl">✍️</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-yellow-400 mb-1">Đánh giá chi tiết</h2>
                    <p className="text-gray-300 text-sm">Phân tích chuyên sâu từ biên tập viên</p>
                  </div>
                </div>
              </div>
              
              <div className="px-8 py-10 md:px-12 md:py-12">
                <div 
                  className="review-content prose prose-invert prose-xl max-w-none
                    prose-headings:font-bold prose-headings:tracking-tight
                    prose-h1:text-4xl prose-h1:text-white prose-h1:mb-6 prose-h1:mt-10 prose-h1:pb-3 prose-h1:border-b prose-h1:border-white/10
                    prose-h2:text-3xl prose-h2:text-yellow-400 prose-h2:mb-5 prose-h2:mt-8 prose-h2:flex prose-h2:items-center prose-h2:gap-3
                    prose-h3:text-2xl prose-h3:text-blue-400 prose-h3:mb-4 prose-h3:mt-6
                    prose-p:text-gray-200 prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-lg
                    prose-a:text-blue-400 prose-a:underline prose-a:decoration-blue-400/30 hover:prose-a:text-blue-300 hover:prose-a:decoration-blue-300
                    prose-strong:text-yellow-300 prose-strong:font-bold
                    prose-em:text-purple-300 prose-em:italic
                    prose-ul:text-gray-200 prose-ul:my-6 prose-ul:space-y-3
                    prose-ol:text-gray-200 prose-ol:my-6 prose-ol:space-y-3
                    prose-li:text-lg prose-li:leading-relaxed
                    prose-li:marker:text-yellow-500
                    prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-8 prose-img:border prose-img:border-white/10
                    prose-blockquote:border-l-4 prose-blockquote:border-yellow-500 prose-blockquote:bg-yellow-500/5 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-gray-300 prose-blockquote:rounded-r-lg
                    prose-code:text-pink-400 prose-code:bg-pink-500/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-gray-950 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-6"
                  dangerouslySetInnerHTML={{ __html: content.reviewContent }}
                />
              </div>
              
              {/* Bottom decoration */}
              <div className="h-2 bg-gradient-to-r from-yellow-600/50 via-orange-600/50 to-red-600/50"></div>
            </article>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Poster - Sticky */}
          <div className="lg:sticky lg:top-24">
            {content.posterUrl && (
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl mb-4 bg-gray-900">
                {!imageError ? (
                  <img
                    src={content.posterUrl}
                    alt={content.title}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="text-gray-600 text-4xl">🖼️</div>
                  </div>
                )}
              </div>
            )}
            
            {/* Affiliate Links */}
            <AffiliateLinks content={content} />
          </div>
        </div>
      </div>

      {/* In-Article Ad - Before reviews */}
      <div className="mb-8">
        <InArticleAd />
      </div>

      {/* Reviews Section */}
      {content.reviews && content.reviews.length > 0 && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">📹 Video Reviews</h2>
            <p className="text-gray-400 text-sm">
              {content.reviews.length} review{content.reviews.length > 1 ? 's' : ''} từ cộng đồng
            </p>
          </div>
          
          <div className="space-y-6">
            {content.reviews.map((review, index) => (
              <div key={review.id}>
                {review.youtubeVideoId && (
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
                )}

                {/* Affiliate reminder after first review */}
                {index === 0 && content.reviews.length > 1 && (
                  <div className="my-8">
                    <AffiliateLinks content={content} compact />
                  </div>
                )}

                {/* In-Article Ad after 2nd review */}
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
      <div className="mt-8">
        <InArticleAd position="bottom" />
      </div>
    </div>
  )
}
