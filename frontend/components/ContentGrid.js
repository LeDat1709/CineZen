'use client'

import { useState, useEffect } from 'react'
import ContentCard from './ContentCard'

export default function ContentGrid({ type = null }) {
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchContents()
  }, [filter, type])

  const fetchContents = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/contents`;
      
      if (type === 'movies') {
        url = `${process.env.NEXT_PUBLIC_API_URL}/contents/movies`;
      } else if (type === 'series') {
        url = `${process.env.NEXT_PUBLIC_API_URL}/contents/series`;
      } else if (filter !== 'all') {
        url += `?type=${filter}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setContents(data.contents || []);
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Filter tabs */}
      {!type && (
        <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('MOVIE')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'MOVIE' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Phim Lẻ
          </button>
          <button
            onClick={() => setFilter('SERIES')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'SERIES' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Truyện
          </button>
        </div>
      )}

      {contents.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 opacity-30">🎬</div>
          <p className="text-xl text-gray-400">Chưa có nội dung nào</p>
          <p className="text-gray-500 mt-2 text-sm">Hãy thêm review đầu tiên từ Admin panel</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {contents.map(content => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      )}
    </div>
  )
}
