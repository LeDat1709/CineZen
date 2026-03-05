'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function ContentList({ contents, onUpdate }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 10

  // Filter contents based on search
  const filteredContents = contents.filter(content =>
    content.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredContents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentContents = filteredContents.slice(startIndex, endIndex)

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/contents/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg font-medium transition-colors ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300'
        }`}
      >
        ← Trước
      </button>
    )

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className="px-4 py-2 rounded-lg font-medium bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300 transition-colors"
        >
          1
        </button>
      )
      if (startPage > 2) {
        pages.push(
          <span key="dots1" className="px-2 text-gray-500">
            ...
          </span>
        )
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPage === i
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300'
          }`}
        >
          {i}
        </button>
      )
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots2" className="px-2 text-gray-500">
            ...
          </span>
        )
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className="px-4 py-2 rounded-lg font-medium bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300 transition-colors"
        >
          {totalPages}
        </button>
      )
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg font-medium transition-colors ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300'
        }`}
      >
        Sau →
      </button>
    )

    return pages
  }

  return (
    <div className="space-y-4">
      {/* Search and Stats */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo tên phim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-semibold text-blue-600">{startIndex + 1}-{Math.min(endIndex, filteredContents.length)}</span> trong tổng số <span className="font-semibold text-blue-600">{filteredContents.length}</span> nội dung
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Poster</th>
              <th className="px-6 py-3 text-left">Loại</th>
              <th className="px-6 py-3 text-left">Tên</th>
              <th className="px-6 py-3 text-left">Năm</th>
              <th className="px-6 py-3 text-left">Đánh giá</th>
              <th className="px-6 py-3 text-left">Reviews</th>
              <th className="px-6 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentContents.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  {searchTerm ? '🔍 Không tìm thấy kết quả phù hợp' : '📭 Chưa có nội dung nào'}
                </td>
              </tr>
            ) : (
              currentContents.map(content => (
                <tr key={content.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {content.posterUrl ? (
                      <img 
                        src={content.posterUrl} 
                        alt={content.title}
                        className="w-12 h-16 object-cover rounded shadow"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/48x64?text=No+Image'
                        }}
                      />
                    ) : (
                      <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs text-white ${
                      content.type === 'MOVIE' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      {content.type === 'MOVIE' ? 'Phim' : 'Phim Bộ'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="font-medium">{content.title}</div>
                      {content.genre && (
                        <div className="text-xs text-gray-500 mt-1">
                          {content.genre.name}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{content.releaseYear}</td>
                  <td className="px-6 py-4">
                    {content.rating ? (
                      <span className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{content.rating}</span>
                        <span className="text-gray-400 text-sm">/10</span>
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                      {content.reviews?.length || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/contents/${content.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Xem trên trang chính"
                      >
                        👁️ Xem
                      </Link>
                      <button
                        onClick={() => window.open(`/dashboard/edit/${content.id}`, '_self')}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Chỉnh sửa"
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(content.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Xóa"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-center gap-2">
            {renderPagination()}
          </div>
        </div>
      )}
    </div>
  )
}
