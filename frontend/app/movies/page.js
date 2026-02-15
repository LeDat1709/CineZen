'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ContentCard from '../../components/ContentCard'
import InFeedAd from '../../components/InFeedAd'

export default function MoviesPage() {
  const searchParams = useSearchParams()
  const genreFromUrl = searchParams.get('genre')
  
  const [contents, setContents] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  
  // Filter states
  const [filters, setFilters] = useState({
    genre: genreFromUrl || null,
    year: null,
    rating: null,
    sortBy: 'latest'
  })
  
  // Temp filters for modal
  const [tempFilters, setTempFilters] = useState({ ...filters })
  
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  // Generate year options (current year down to 1950)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i)

  useEffect(() => {
    fetchGenres()
  }, [])

  useEffect(() => {
    if (genreFromUrl) {
      setFilters(prev => ({ ...prev, genre: genreFromUrl }))
      setTempFilters(prev => ({ ...prev, genre: genreFromUrl }))
    }
  }, [genreFromUrl])

  useEffect(() => {
    fetchContents()
  }, [filters, page])

  const fetchGenres = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/genres?type=MOVIE`)
      const data = await response.json()
      // API returns array directly, not { genres: [...] }
      setGenres(Array.isArray(data) ? data : data.genres || [])
    } catch (error) {
      console.error('Error fetching genres:', error)
    }
  }

  const fetchContents = async () => {
    setLoading(true)
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/contents/movies?page=${page}&limit=24`
      
      if (filters.genre) url += `&genre=${filters.genre}`
      if (filters.year) url += `&year=${filters.year}`
      if (filters.rating) url += `&minRating=${filters.rating}`
      if (filters.sortBy) url += `&sort=${filters.sortBy}`

      const response = await fetch(url)
      const data = await response.json()
      setContents(data.contents || [])
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching contents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilter = () => {
    setFilters({ ...tempFilters })
    setPage(1)
    setShowFilter(false)
  }

  const handleResetFilter = () => {
    const resetFilters = {
      genre: null,
      year: null,
      rating: null,
      sortBy: 'latest'
    }
    setTempFilters(resetFilters)
    setFilters(resetFilters)
    setPage(1)
    setShowFilter(false)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.genre) count++
    if (filters.year) count++
    if (filters.rating) count++
    if (filters.sortBy !== 'latest') count++
    return count
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">🎬 Phim Lẻ</h1>
          <p className="text-gray-400">Khám phá và đọc review các bộ phim hay nhất</p>
        </div>

        {/* Filter Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg transition-colors"
          >
            <span>▼ Bộ lọc</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="mb-6 mx-2 p-6 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Genre Filter */}
              <div>
                <label className="block text-white font-medium mb-3">Thể loại</label>
                <select
                  value={tempFilters.genre || ''}
                  onChange={(e) => setTempFilters({ ...tempFilters, genre: e.target.value || null })}
                  className="w-full px-4 py-2.5 bg-gray-900/50 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none appearance-none cursor-pointer"
                  style={{ backgroundImage: 'none' }}
                >
                  <option value="">Tất cả</option>
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.slug}>{genre.name}</option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-white font-medium mb-3">Năm phát hành</label>
                <select
                  value={tempFilters.year || ''}
                  onChange={(e) => setTempFilters({ ...tempFilters, year: e.target.value || null })}
                  className="w-full px-4 py-2.5 bg-gray-900/50 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none appearance-none cursor-pointer"
                  style={{ backgroundImage: 'none' }}
                >
                  <option value="">Tất cả</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-white font-medium mb-3">Đánh giá tối thiểu</label>
                <select
                  value={tempFilters.rating || ''}
                  onChange={(e) => setTempFilters({ ...tempFilters, rating: e.target.value || null })}
                  className="w-full px-4 py-2.5 bg-gray-900/50 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none appearance-none cursor-pointer"
                  style={{ backgroundImage: 'none' }}
                >
                  <option value="">Tất cả</option>
                  <option value="9">9+ ⭐</option>
                  <option value="8">8+ ⭐</option>
                  <option value="7">7+ ⭐</option>
                  <option value="6">6+ ⭐</option>
                  <option value="5">5+ ⭐</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-white font-medium mb-3">Sắp xếp theo</label>
                <select
                  value={tempFilters.sortBy}
                  onChange={(e) => setTempFilters({ ...tempFilters, sortBy: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-900/50 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none appearance-none cursor-pointer"
                  style={{ backgroundImage: 'none' }}
                >
                  <option value="latest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="rating">Đánh giá cao</option>
                  <option value="year">Năm phát hành</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleApplyFilter}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold rounded-lg transition-all"
              >
                Lọc kết quả →
              </button>
              <button
                onClick={handleResetFilter}
                className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg transition-colors"
              >
                Đặt lại
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Affiliate Section */}
        <InFeedAd />

        {/* Content Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : contents.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-30">🎬</div>
            <p className="text-xl text-gray-400">Không tìm thấy phim nào</p>
            <p className="text-gray-500 mt-2 text-sm">Hãy thử điều chỉnh bộ lọc</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {contents.map(content => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex flex-col items-center gap-4 mt-8">
                <div className="text-gray-400 text-sm">
                  Trang {page} / {pagination.pages} ({pagination.total} phim)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-gray-800/50 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors"
                  >
                    ← Trước
                  </button>
                  
                  <div className="flex gap-2">
                    {[...Array(Math.min(pagination.pages, 10))].map((_, i) => {
                      let pageNum
                      if (pagination.pages <= 10) {
                        pageNum = i + 1
                      } else if (page <= 5) {
                        pageNum = i + 1
                      } else if (page >= pagination.pages - 4) {
                        pageNum = pagination.pages - 9 + i
                      } else {
                        pageNum = page - 5 + i
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            page === pageNum
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                    className="px-4 py-2 rounded-lg bg-gray-800/50 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors"
                  >
                    Sau →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
