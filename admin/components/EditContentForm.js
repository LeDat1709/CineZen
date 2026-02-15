'use client'

import { useState, useEffect } from 'react'

export default function EditContentForm({ contentId, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'MOVIE',
    description: '',
    posterUrl: '',
    releaseYear: '',
    rating: ''
  })
  const [selectedGenres, setSelectedGenres] = useState([])
  const [genres, setGenres] = useState([])
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
        rating: data.rating || ''
      })
      
      // Extract genre IDs from the genres array
      if (data.genres && data.genres.length > 0) {
        const genreIds = data.genres.map(cg => cg.genre.id)
        setSelectedGenres(genreIds)
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

        {/* Year and Rating */}
        <div className="grid grid-cols-2 gap-4">
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
