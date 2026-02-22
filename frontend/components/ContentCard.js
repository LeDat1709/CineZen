import Link from 'next/link'
import { useState } from 'react'

export default function ContentCard({ content }) {
  const [imageError, setImageError] = useState(false)

  return (
    <Link href={`/contents/${content.slug}`}>
      <div className="group cursor-pointer">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-gray-900 mb-2">
          {content.posterUrl && !imageError ? (
            <img
              src={content.posterUrl}
              alt={content.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-gray-600 text-sm text-center px-2">
                {imageError ? '🖼️' : 'No Image'}
              </div>
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Rating badge */}
          {content.rating && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
              {content.rating}
            </div>
          )}
        </div>

        {/* Title and Year below poster */}
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
  )
}
