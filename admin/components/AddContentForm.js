'use client'

import { useState, useEffect } from 'react'

export default function AddContentForm({ onSuccess }) {
  const [step, setStep] = useState(1)
  const [contentData, setContentData] = useState({ type: 'MOVIE' })
  const [youtubeVideos, setYoutubeVideos] = useState([])
  const [selectedVideos, setSelectedVideos] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [loading, setLoading] = useState(false)
  const [genres, setGenres] = useState([])
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchGenres()
  }, [contentData.type])

  const fetchGenres = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/genres?type=${contentData.type}`,
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
    const formData = new FormData()
    formData.append('poster', file)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/supabase-upload/poster`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        setUploadedImage(data.publicUrl)
        setContentData({ ...contentData, posterUrl: data.publicUrl })
        
        const reader = new FileReader()
        reader.onloadend = () => setImagePreview(reader.result)
        reader.readAsDataURL(file)
        
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

  const fetchFromOMDB = async (title) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const type = contentData.type === 'SERIES' ? 'series' : 'movie'
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/fetch-content?title=${encodeURIComponent(title)}&type=${type}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      const data = await response.json()
      setContentData({ ...contentData, ...data })
      setStep(2)
    } catch (error) {
      alert('Lỗi khi lấy thông tin')
    } finally {
      setLoading(false)
    }
  }

  const searchYouTube = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/search-youtube?query=${encodeURIComponent(contentData.title)}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      const data = await response.json()
      setYoutubeVideos(data)
      setStep(3)
    } catch (error) {
      alert('Lỗi khi tìm video YouTube')
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      // Add genres to contentData
      const dataToSend = {
        ...contentData,
        genreIds: selectedGenres
      }
      
      const contentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/contents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      })

      const content = await contentResponse.json()

      for (const video of selectedVideos) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            contentId: content.id,
            youtubeVideoId: video.videoId,
            reviewerName: video.channelTitle
          })
        })
      }

      alert('Thêm thành công!')
      onSuccess()
    } catch (error) {
      alert('Lỗi khi lưu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Bước 1: Chọn loại và nhập tên</h2>
          
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Loại nội dung</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="MOVIE"
                  checked={contentData.type === 'MOVIE'}
                  onChange={(e) => setContentData({...contentData, type: e.target.value})}
                  className="mr-2"
                />
                Phim
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="SERIES"
                  checked={contentData.type === 'SERIES'}
                  onChange={(e) => setContentData({...contentData, type: e.target.value})}
                  className="mr-2"
                />
                Truyện/Series
              </label>
            </div>
          </div>

          <input
            type="text"
            placeholder={`Nhập tên ${contentData.type === 'MOVIE' ? 'phim' : 'truyện'}`}
            className="w-full px-4 py-2 border rounded mb-4"
            onKeyPress={(e) => e.key === 'Enter' && fetchFromOMDB(e.target.value)}
          />
          <button
            onClick={(e) => {
              const input = e.target.previousSibling
              fetchFromOMDB(input.value)
            }}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Đang tải...' : 'Tìm kiếm'}
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Bước 2: Chỉnh sửa thông tin</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Tên</label>
              <input
                type="text"
                value={contentData.title || ''}
                onChange={(e) => setContentData({...contentData, title: e.target.value})}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block mb-2">Ảnh poster</label>
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
                    value={contentData.posterUrl || ''}
                    onChange={(e) => {
                      setContentData({...contentData, posterUrl: e.target.value})
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
                Hiển thị thể loại cho: {contentData.type === 'MOVIE' ? '🎬 Phim' : '📚 Truyện'}
              </p>
              {selectedGenres.length > 0 && (
                <p className="text-sm text-blue-600 mt-1">
                  Đã chọn: {selectedGenres.length} thể loại
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2">Mô tả</label>
              <textarea
                value={contentData.description || ''}
                onChange={(e) => setContentData({...contentData, description: e.target.value})}
                className="w-full px-4 py-2 border rounded h-32"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Năm</label>
                <input
                  type="number"
                  value={contentData.releaseYear || ''}
                  onChange={(e) => setContentData({...contentData, releaseYear: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Đánh giá (0-10)</label>
                <input
                  type="number"
                  step="0.1"
                  value={contentData.rating || ''}
                  onChange={(e) => setContentData({...contentData, rating: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
            </div>
          </div>
          <button
            onClick={searchYouTube}
            disabled={loading}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Tiếp theo: Tìm video review
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Bước 3: Chọn video review</h2>
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {youtubeVideos.map(video => (
              <div key={video.videoId} className="flex items-start gap-4 p-4 border rounded">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedVideos([...selectedVideos, video])
                    } else {
                      setSelectedVideos(selectedVideos.filter(v => v.videoId !== video.videoId))
                    }
                  }}
                />
                <img src={video.thumbnail} alt={video.title} className="w-32" />
                <div>
                  <h3 className="font-semibold">{video.title}</h3>
                  <p className="text-sm text-gray-600">{video.channelTitle}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={saveContent}
            disabled={loading || selectedVideos.length === 0}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Đang lưu...' : `Lưu (${selectedVideos.length} video)`}
          </button>
        </div>
      )}
    </div>
  )
}
