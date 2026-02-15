'use client'

import Link from 'next/link'

export default function ContentList({ contents, onUpdate }) {
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

  return (
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
          {contents.map(content => (
            <tr key={content.id}>
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
                  {content.type === 'MOVIE' ? 'Phim' : 'Truyện'}
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
              <td className="px-6 py-4">{content.rating}/10</td>
              <td className="px-6 py-4">{content.reviews?.length || 0}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/contents/${content.slug}`}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800"
                    title="Xem trên trang chính"
                  >
                    👁️ Xem
                  </Link>
                  <button
                    onClick={() => window.open(`/dashboard/edit/${content.id}`, '_self')}
                    className="text-green-600 hover:text-green-800"
                    title="Chỉnh sửa"
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(content.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Xóa"
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
