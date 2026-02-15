'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function GenreCategories() {
  const [movieGenres, setMovieGenres] = useState([])
  const [seriesGenres, setSeriesGenres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGenres()
  }, [])

  const fetchGenres = async () => {
    try {
      const [movieRes, seriesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/genres?type=MOVIE`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/genres?type=SERIES`)
      ])

      const movieData = await movieRes.json()
      const seriesData = await seriesRes.json()

      setMovieGenres(movieData.slice(0, 6)) // Lấy 6 thể loại phim
      setSeriesGenres(seriesData.slice(0, 6)) // Lấy 6 thể loại truyện
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return null

  const gradients = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-yellow-500 to-orange-500',
    'from-indigo-500 to-purple-500',
  ]

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Bạn đang quan tâm gì?</h2>

      {/* Movie Genres */}
      <div className="mb-6">
        <h3 className="text-sm text-gray-400 mb-3 uppercase tracking-wide">Phim Lẻ</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {movieGenres.map((genre, index) => (
            <Link
              key={genre.id}
              href={`/genre/${genre.slug}?type=MOVIE`}
              className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${gradients[index % gradients.length]} p-6 hover:scale-105 transition-transform duration-300 group`}
            >
              <div className="relative z-10">
                <h4 className="font-bold text-white text-lg mb-1">{genre.name}</h4>
                <p className="text-white/80 text-xs">Xem chi tiết →</p>
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Series Genres */}
      <div>
        <h3 className="text-sm text-gray-400 mb-3 uppercase tracking-wide">Truyện</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {seriesGenres.map((genre, index) => (
            <Link
              key={genre.id}
              href={`/genre/${genre.slug}?type=SERIES`}
              className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${gradients[index % gradients.length]} p-6 hover:scale-105 transition-transform duration-300 group`}
            >
              <div className="relative z-10">
                <h4 className="font-bold text-white text-lg mb-1">{genre.name}</h4>
                <p className="text-white/80 text-xs">Xem chi tiết →</p>
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            </Link>
          ))}
        </div>
      </div>

      {/* View All Button */}
      <div className="mt-6 text-center">
        <button className="text-gray-400 hover:text-white transition-colors text-sm">
          +32 chủ đề
          <br />
          <span className="text-xs">Xem tất cả →</span>
        </button>
      </div>
    </section>
  )
}
