'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Header() {
  const [showGenreMenu, setShowGenreMenu] = useState(false)
  const [showCountryMenu, setShowCountryMenu] = useState(false)
  const [showYearMenu, setShowYearMenu] = useState(false)
  const [movieGenres, setMovieGenres] = useState([])
  const [seriesGenres, setSeriesGenres] = useState([])
  
  // Timeout refs for delayed close
  const genreTimeoutRef = useRef(null)
  const countryTimeoutRef = useRef(null)
  const yearTimeoutRef = useRef(null)

  // Popular countries
  const countries = [
    { name: 'Việt Nam', slug: 'viet-nam' },
    { name: 'Hàn Quốc', slug: 'han-quoc' },
    { name: 'Trung Quốc', slug: 'trung-quoc' },
    { name: 'Nhật Bản', slug: 'nhat-ban' },
    { name: 'Thái Lan', slug: 'thai-lan' },
    { name: 'Mỹ', slug: 'my' },
    { name: 'Anh', slug: 'anh' },
    { name: 'Pháp', slug: 'phap' },
    { name: 'Ấn Độ', slug: 'an-do' },
    { name: 'Đài Loan', slug: 'dai-loan' },
    { name: 'Hồng Kông', slug: 'hong-kong' },
    { name: 'Philippines', slug: 'philippines' }
  ]

  // Recent years
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

  const handleGenreMouseEnter = () => {
    if (genreTimeoutRef.current) clearTimeout(genreTimeoutRef.current)
    setShowGenreMenu(true)
  }

  const handleGenreMouseLeave = () => {
    genreTimeoutRef.current = setTimeout(() => {
      setShowGenreMenu(false)
    }, 300)
  }

  const handleCountryMouseEnter = () => {
    if (countryTimeoutRef.current) clearTimeout(countryTimeoutRef.current)
    setShowCountryMenu(true)
  }

  const handleCountryMouseLeave = () => {
    countryTimeoutRef.current = setTimeout(() => {
      setShowCountryMenu(false)
    }, 300)
  }

  const handleYearMouseEnter = () => {
    if (yearTimeoutRef.current) clearTimeout(yearTimeoutRef.current)
    setShowYearMenu(true)
  }

  const handleYearMouseLeave = () => {
    yearTimeoutRef.current = setTimeout(() => {
      setShowYearMenu(false)
    }, 300)
  }

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
          <Link href="/" className="flex items-center space-x-3">
            <img 
              src="https://cdzhcgozjilldlpngapi.supabase.co/storage/v1/object/public/Image/Logo/logonew.png" 
              alt="ReviewPhim Logo" 
              className="h-10 w-auto"
            />
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
              onMouseEnter={handleGenreMouseEnter}
              onMouseLeave={handleGenreMouseLeave}
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

            {/* Country Menu */}
            <div 
              className="relative"
              onMouseEnter={handleCountryMouseEnter}
              onMouseLeave={handleCountryMouseLeave}
            >
              <button className="text-gray-300 hover:text-white transition-colors text-sm flex items-center gap-1">
                Quốc gia
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showCountryMenu && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-2xl p-6 w-[400px]">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {countries.map(country => (
                      <Link
                        key={country.slug}
                        href={`/movies?country=${country.slug}`}
                        className="block text-sm text-gray-400 hover:text-yellow-500 transition-colors py-1.5"
                      >
                        {country.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Year Menu */}
            <div 
              className="relative"
              onMouseEnter={handleYearMouseEnter}
              onMouseLeave={handleYearMouseLeave}
            >
              <button className="text-gray-300 hover:text-white transition-colors text-sm flex items-center gap-1">
                Năm phát hành
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showYearMenu && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-2xl p-6 w-[300px]">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {years.map(year => (
                      <Link
                        key={year}
                        href={`/movies?year=${year}`}
                        className="block text-sm text-gray-400 hover:text-yellow-500 transition-colors py-1.5"
                      >
                        {year}
                      </Link>
                    ))}
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
