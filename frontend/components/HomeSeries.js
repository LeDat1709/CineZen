'use client'

import { useState, useEffect } from 'react'
import ContentCard from './ContentCard'
import Link from 'next/link'

export default function HomeSeries() {
  const [topRated, setTopRated] = useState([])
  const [latest, setLatest] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [topRes, latestRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/contents/top-rated?type=SERIES&limit=12`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/contents/latest?type=SERIES&limit=12`)
      ])

      const topData = await topRes.json()
      const latestData = await latestRes.json()

      setTopRated(topData.contents || [])
      setLatest(latestData.contents || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-10">Đang tải...</div>
  }

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            📚 Truyện
          </h2>
          <p className="text-sm text-gray-400 mt-1">Review truyện hay, đọc là mê</p>
        </div>
        <Link 
          href="/series" 
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
        >
          Xem tất cả
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Top Rated Series */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-300">⭐ Top Truyện Hay Nhất</h3>
          <span className="text-xs text-gray-500">Dựa trên đánh giá</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {topRated.map(content => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      </div>

      {/* Latest Series */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-300">🆕 Truyện Mới Cập Nhật</h3>
          <span className="text-xs text-gray-500">Mới nhất</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {latest.map(content => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      </div>
    </section>
  )
}
