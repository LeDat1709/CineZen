'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [showGenreMenu, setShowGenreMenu] = useState(false)
  const [movieGenres, setMovieGenres] = useState([])
  const [seriesGenres, setSeriesGenres] = useState([])

  useEffect(() => {
    fetchGenres()
  }, [])

  const fetchGenres = async () => {
    try {
      // Fetch movie genres
      const movieRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/genres?type=MOVIE`)
      const movieData = await movieRes.json()
      setMovieGenres(Array.isArray(movieData) ? movieData : [])

      // Fetch series genres
      const seriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/genres?type=SERIES`)
      const seriesData = await seriesRes.json()
      setSeriesGenres(Array.isArray(seriesData) ? seriesData : [])
    } catch (error) {
      console.error('Error fetching genres:', error)
    }
  }

  return (
    <header className="bg-[#0f0f0f] border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
              <span className="text-xl">🎬</span>
            </div>
            <span className="text-xl font-bold">CineZen</span>
            <span className="text-xs text-gray-500">Review hay & chill</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
              Trang chủ
            </Link>
            <Link href="/movies" className="text-gray-300 hover:text-white transition-colors text-sm">
              Phim Lẻ
            </Link>
            <Link href="/series" className="text-gray-300 hover:text-white transition-colors text-sm">
              Truyện
            </Link>
            
            {/* Genre Mega Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setShowGenreMenu(true)}
              onMouseLeave={() => setShowGenreMenu(false)}
            >
              <button className="text-gray-300 hover:text-white transition-colors text-sm flex items-center gap-1">
                Thể loại
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Mega Menu */}
              {showGenreMenu && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-2xl p-6 w-[700px]">
                  <div className="grid grid-cols-2 gap-8">
                    {/* Movie Genres */}
                    <div>
                      <h3 className="text-white font-bold mb-3 pb-2 border-b border-gray-700">
                        🎬 Phim Lẻ
                      </h3>
                      <div className="grid grid-cols-2 gap-x-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {movieGenres.map(genre => (
                          <Link
                            key={genre.id}
                            href={`/movies?genre=${genre.slug}`}
                            className="block text-sm text-gray-400 hover:text-yellow-500 transition-colors py-1.5"
                          >
                            {genre.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Series Genres */}
                    <div>
                      <h3 className="text-white font-bold mb-3 pb-2 border-b border-gray-700">
                        📚 Truyện
                      </h3>
                      <div className="grid grid-cols-2 gap-x-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {seriesGenres.map(genre => (
                          <Link
                            key={genre.id}
                            href={`/series?genre=${genre.slug}`}
                            className="block text-sm text-gray-400 hover:text-yellow-500 transition-colors py-1.5"
                          >
                            {genre.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Tìm kiếm phim, diễn viên..."
                className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-md focus:outline-none focus:border-purple-500 text-sm w-64 text-white placeholder-gray-500"
              />
              <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
