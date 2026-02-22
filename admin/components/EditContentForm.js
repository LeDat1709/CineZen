'use client'

import { useState, useEffect } from 'react'

export default function EditContentForm({ contentId, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'MOVIE',
    description: '',
    posterUrl: '',
    releaseYear: '',
    rating: '',
    country: ''
  })
  const [selectedGenres, setSelectedGenres] = useState([])
  const [genres, setGenres] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchContent()
    fetchGenres()
  }, [contentId])

  useEffect(() => {
    if (formData.type) {
      fetchGenres()
    }
  }, [formData.type])

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/contents/${contentId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      const data = await response.json()
      
      setFormData({
        title: data.title || '',
        type: data.type || 'MOVIE',
        description: data.description || '',
        posterUrl: data.posterUrl || '',
        releaseYear: data.releaseYear || '',
        rating: data.rating || '',
        country: data.country || ''
      })
      
      // Extract genre IDs from the genres array
      if (data.genres && data.genres.length > 0) {
        const genreIds = data.genres.map(cg => cg.genre.id)
        setSelectedGenres(genreIds)
      }
      
      // Set reviews
      if (data.reviews && data.reviews.length > 0) {
        setReviews(data.reviews)
      }
      
      setImagePreview(data.posterUrl)
    } catch (error) {
      console.error('Error:', error)
      alert('Lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const fetchGenres = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/genres?type=${formData.type}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      const data = await response.json()
      setGenres(data)
    } catch (error) {
      console.error('Error fetching genres:', error)
    }
  }

  const handleImageUpload = async (file) => {
    if (!file) return

    setLoading(true)
    const formDataUpload = new FormData()
    formDataUpload.append('poster', file)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/supabase-upload/poster`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataUpload
      })

      const data = await response.json()
      
      if (data.success) {
        setFormData({ ...formData, posterUrl: data.publicUrl })
        setImagePreview(data.publicUrl)
        alert('Upload ảnh thành công!')
      } else {
        alert('Lỗi: ' + (data.error || 'Không thể upload'))
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Lỗi khi upload ảnh')
    } finally {
      setLoading(false)
    }
  }

  const addReview = async (videoId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contentId: parseInt(contentId),
          youtubeVideoId: videoId,
          reviewerName: 'Manual Added'
        })
      })

      if (response.ok) {
        const newReview = await response.json()
        setReviews([...reviews, newReview])
        alert('✅ Đã thêm review!')
      } else {
        alert('❌ Không thể thêm review')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Lỗi khi thêm review')
    }
  }

  const deleteReview = async (reviewId) => {
    if (!confirm('Bạn có chắc muốn xóa review này?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/reviews/${reviewId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )

      if (response.ok) {
        setReviews(reviews.filter(r => r.id !== reviewId))
        alert('✅ Đã xóa review!')
      } else {
        alert('❌ Không thể xóa review')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Lỗi khi xóa review')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/contents/${contentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...formData,
            releaseYear: parseInt(formData.releaseYear),
            rating: parseFloat(formData.rating),
            genreIds: selectedGenres
          })
        }
      )

      if (response.ok) {
        alert('Cập nhật thành công!')
        onSuccess()
      } else {
        const error = await response.json()
        alert('Lỗi: ' + (error.error || 'Không thể cập nhật'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Lỗi khi cập nhật')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-10">Đang tải...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <div className="space-y-6">
        {/* Type */}
        <div>
          <label className="block mb-2 font-semibold">Loại nội dung</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="MOVIE"
                checked={formData.type === 'MOVIE'}
                onChange={(e) => {
                  setFormData({...formData, type: e.target.value})
                  setSelectedGenres([])
                }}
                className="mr-2"
              />
              Phim
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="SERIES"
                checked={formData.type === 'SERIES'}
                onChange={(e) => {
                  setFormData({...formData, type: e.target.value})
                  setSelectedGenres([])
                }}
                className="mr-2"
              />
              Truyện/Series
            </label>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block mb-2 font-semibold">Tên</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        {/* Poster Image */}
        <div>
          <label className="block mb-2 font-semibold">Ảnh poster</label>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                className="w-full px-4 py-2 border rounded"
              />
              <p className="text-sm text-gray-500 mt-1">Hoặc nhập URL ảnh bên dưới</p>
              <input
                type="text"
                placeholder="URL ảnh poster"
                value={formData.posterUrl}
                onChange={(e) => {
                  setFormData({...formData, posterUrl: e.target.value})
                  setImagePreview(e.target.value)
                }}
                className="w-full px-4 py-2 border rounded mt-2"
              />
            </div>
            {imagePreview && (
              <div className="w-32">
                <img src={imagePreview} alt="Preview" className="w-full rounded shadow" />
              </div>
            )}
          </div>
        </div>

        {/* Genre - Multi Select */}
        <div>
          <label className="block mb-2 font-semibold">Thể loại (chọn nhiều)</label>
          <div className="border rounded p-4 max-h-60 overflow-y-auto bg-gray-50">
            {genres.length === 0 ? (
              <p className="text-gray-500 text-sm">Đang tải thể loại...</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {genres.map(genre => (
                  <label key={genre.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedGenres([...selectedGenres, genre.id])
                        } else {
                          setSelectedGenres(selectedGenres.filter(id => id !== genre.id))
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{genre.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Hiển thị thể loại cho: {formData.type === 'MOVIE' ? '🎬 Phim' : '📚 Truyện'}
          </p>
          {selectedGenres.length > 0 && (
            <p className="text-sm text-blue-600 mt-1">
              Đã chọn: {selectedGenres.length} thể loại
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-semibold">Mô tả</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-2 border rounded h-32"
          />
        </div>

        {/* Year, Country and Rating */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 font-semibold">Năm phát hành</label>
            <input
              type="number"
              value={formData.releaseYear}
              onChange={(e) => setFormData({...formData, releaseYear: e.target.value})}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Quốc gia</label>
            <select
              value={formData.country || ''}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Chọn quốc gia</option>
              <option value="viet-nam">🇻🇳 Việt Nam</option>
              <option value="han-quoc">🇰🇷 Hàn Quốc</option>
              <option value="trung-quoc">🇨🇳 Trung Quốc</option>
              <option value="nhat-ban">🇯🇵 Nhật Bản</option>
              <option value="thai-lan">🇹🇭 Thái Lan</option>
              <option value="my">🇺🇸 Mỹ</option>
              <option value="anh">🇬🇧 Anh</option>
              <option value="phap">🇫🇷 Pháp</option>
              <option value="an-do">🇮🇳 Ấn Độ</option>
              <option value="dai-loan">🇹🇼 Đài Loan</option>
              <option value="hong-kong">🇭🇰 Hồng Kông</option>
              <option value="philippines">🇵🇭 Philippines</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold">Đánh giá (0-10)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: e.target.value})}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        </div>

        {/* Reviews Management */}
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🎥</span> Quản lý Reviews ({reviews.length})
          </h3>
          
          {/* Current Reviews */}
          {reviews.length > 0 && (
            <div className="mb-4 space-y-2">
              {reviews.map(review => (
                <div key={review.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <img 
                      src={`https://img.youtube.com/vi/${review.youtubeVideoId}/default.jpg`}
                      alt="Thumbnail"
                      className="w-20 h-14 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{review.reviewerName || 'Unknown'}</p>
                      <a 
                        href={`https://youtube.com/watch?v=${review.youtubeVideoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {review.youtubeVideoId}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Review */}
          <div className="bg-white p-4 rounded-lg border-2 border-dashed border-blue-300">
            <h4 className="font-semibold text-gray-700 mb-2">Thêm review mới</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập link YouTube hoặc Video ID"
                className="flex-1 px-4 py-2 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target
                    const url = input.value.trim()
                    if (url) {
                      let videoId = null
                      try {
                        const urlObj = new URL(url)
                        if (urlObj.hostname.includes('youtube.com')) {
                          videoId = urlObj.searchParams.get('v')
                        } else if (urlObj.hostname.includes('youtu.be')) {
                          videoId = urlObj.pathname.slice(1)
                        }
                      } catch (e) {
                        if (url.length === 11) videoId = url
                      }
                      
                      if (videoId) {
                        addReview(videoId)
                        input.value = ''
                      } else {
                        alert('❌ Link YouTube không hợp lệ!')
                      }
                    }
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.target.parentElement.querySelector('input')
                  const url = input.value.trim()
                  if (url) {
                    let videoId = null
                    try {
                      const urlObj = new URL(url)
                      if (urlObj.hostname.includes('youtube.com')) {
                        videoId = urlObj.searchParams.get('v')
                      } else if (urlObj.hostname.includes('youtu.be')) {
                        videoId = urlObj.pathname.slice(1)
                      }
                    } catch (e) {
                      if (url.length === 11) videoId = url
                    }
                    
                    if (videoId) {
                      addReview(videoId)
                      input.value = ''
                    } else {
                      alert('❌ Link YouTube không hợp lệ!')
                    }
                  }
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Thêm
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              💡 Nhấn Enter hoặc click "Thêm" để thêm review
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {saving ? 'Đang lưu...' : 'Cập nhật'}
          </button>
          <button
            type="button"
            onClick={onSuccess}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Hủy
          </button>
        </div>
      </div>
    </form>
  )
}
