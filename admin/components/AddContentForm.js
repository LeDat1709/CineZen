'use client'

import { useState, useEffect, useRef } from 'react'

export default function AddContentForm({ onSuccess }) {
  const [step, setStep] = useState(1)
  const [contentData, setContentData] = useState({ type: 'MOVIE' })
  const [youtubeVideos, setYoutubeVideos] = useState([])
  const [selectedVideos, setSelectedVideos] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [genres, setGenres] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const searchInputRef = useRef(null)

  // Validation helper
  const validateStep2 = () => {
    const errors = []
    
    // Required fields
    if (!contentData.title?.trim()) errors.push('• Thiếu tên phim')
    if (!contentData.posterUrl) errors.push('• Thiếu ảnh poster')
    if (!contentData.description?.trim()) errors.push('• Thiếu mô tả')
    if (!contentData.releaseYear) errors.push('• Thiếu năm phát hành')
    if (!contentData.country) errors.push('• Chưa chọn quốc gia')
    if (selectedGenres.length === 0) errors.push('• Chưa chọn thể loại')
    
    if (errors.length > 0) {
      alert(`❌ Vui lòng điền đầy đủ thông tin:\n\n${errors.join('\n')}`)
      return false
    }
    
    // Optional warnings
    if (!contentData.rating) {
      const confirm = window.confirm('⚠️ Chưa có rating. Bạn có muốn tiếp tục không?')
      return confirm
    }
    
    return true
  }

  useEffect(() => {
    if (contentData.type) {
      fetchGenres()
    }
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
    setLoadingMessage('🔍 Đang tìm kiếm trên OMDB...')
    try {
      const token = localStorage.getItem('token')
      const type = contentData.type === 'SERIES' ? 'series' : 'movie'
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/fetch-content?title=${encodeURIComponent(title)}&type=${type}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      const data = await response.json()
      
      if (data.error) {
        // Allow user to continue without OMDB data
        const shouldContinue = window.confirm(
          `⚠️ Không tìm thấy trên OMDB: ${data.error}\n\n` +
          `Bạn có muốn tiếp tục nhập thủ công không?`
        )
        if (shouldContinue) {
          setStep(2)
          setLoadingMessage('')
        }
        setLoading(false)
        return
      }
      
      console.log('📦 Data from OMDB:', data)
      
      // Merge with existing type
      setContentData({ ...contentData, ...data })
      setImagePreview(data.posterUrl)
      
      // Auto-select genres immediately
      if (data.omdbGenres && data.omdbGenres !== 'N/A' && genres.length > 0) {
        const omdbGenreNames = data.omdbGenres.split(',').map(g => g.trim().toLowerCase())
        console.log('🎬 OMDB Genres:', omdbGenreNames)
        console.log('📚 Available Genres:', genres.map(g => ({ id: g.id, name: g.name })))
        
        const matchedIds = genres.filter(g => {
          const genreName = g.name.toLowerCase()
          const matched = omdbGenreNames.some(omdbGenre => {
            // Try multiple matching strategies
            const isMatch = (
              genreName === omdbGenre || // Exact match
              genreName.includes(omdbGenre) || // Contains
              omdbGenre.includes(genreName) || // Reverse contains
              // Special mappings
              (omdbGenre === 'sci-fi' && genreName.includes('khoa học')) ||
              (omdbGenre === 'action' && genreName.includes('hành động')) ||
              (omdbGenre === 'thriller' && (genreName.includes('gây cấn') || genreName.includes('kinh dị'))) ||
              (omdbGenre === 'drama' && genreName.includes('chính kịch')) ||
              (omdbGenre === 'comedy' && genreName.includes('hài')) ||
              (omdbGenre === 'horror' && genreName.includes('kinh dị')) ||
              (omdbGenre === 'romance' && genreName.includes('lãng mạn')) ||
              (omdbGenre === 'adventure' && genreName.includes('phiêu lưu')) ||
              (omdbGenre === 'crime' && genreName.includes('tội phạm')) ||
              (omdbGenre === 'mystery' && genreName.includes('bí ẩn'))
            )
            if (isMatch) {
              console.log(`✅ Matched: "${omdbGenre}" → "${g.name}"`)
            }
            return isMatch
          })
          return matched
        }).map(g => g.id)
        
        console.log('🎯 Matched Genre IDs:', matchedIds)
        
        if (matchedIds.length > 0) {
          setSelectedGenres(matchedIds)
          setLoadingMessage(`✅ Đã lấy thông tin và chọn ${matchedIds.length} thể loại!`)
        } else {
          console.warn('⚠️ No genres matched!')
          setLoadingMessage('✅ Đã lấy thông tin thành công!')
        }
      } else {
        console.log('ℹ️ No OMDB genres or genres not loaded yet')
        setLoadingMessage('✅ Đã lấy thông tin thành công!')
      }
      
      setTimeout(() => {
        setStep(2)
        setLoadingMessage('')
      }, 1000)
    } catch (error) {
      console.error('❌ Error:', error)
      alert('❌ Lỗi khi lấy thông tin: ' + error.message)
      setLoadingMessage('')
    } finally {
      setLoading(false)
    }
  }

  const searchYouTube = async () => {
    // Validate before searching
    if (!validateStep2()) return
    
    setLoading(true)
    setLoadingMessage('🎥 Đang tìm video reviews trên YouTube...')
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/search-youtube?query=${encodeURIComponent(contentData.title)}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      const data = await response.json()
      setYoutubeVideos(data)
      
      setLoadingMessage(`✅ Tìm thấy ${data.length} video reviews!`)
      setTimeout(() => {
        setStep(3)
        setLoadingMessage('')
      }, 500)
    } catch (error) {
      alert('❌ Lỗi khi tìm video YouTube: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async () => {
    if (selectedVideos.length === 0) {
      alert('⚠️ Vui lòng chọn ít nhất 1 video review!')
      return
    }
    
    setLoading(true)
    setLoadingMessage('💾 Đang lưu nội dung...')
    
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

      if (!contentResponse.ok) {
        const error = await contentResponse.json()
        throw new Error(error.error || 'Không thể lưu nội dung')
      }

      const content = await contentResponse.json()
      
      setLoadingMessage(`📹 Đang lưu ${selectedVideos.length} video reviews...`)

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

      setLoadingMessage('✅ Hoàn thành!')
      setTimeout(() => {
        alert('🎉 Thêm thành công!')
        onSuccess()
      }, 500)
    } catch (error) {
      alert('❌ Lỗi khi lưu: ' + error.message)
      setLoadingMessage('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Progress Indicator - Enhanced */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-3 font-bold text-lg transition-all duration-300 ${
              step >= 1 
                ? 'border-blue-600 bg-blue-600 text-white shadow-lg' 
                : 'border-gray-300 bg-white text-gray-400'
            }`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <span className={`mt-2 font-semibold text-sm ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              🔍 Tìm kiếm
            </span>
          </div>
          
          {/* Connector 1-2 */}
          <div className={`flex-1 h-1 mx-4 rounded transition-all duration-300 ${
            step >= 2 ? 'bg-blue-600' : 'bg-gray-300'
          }`}></div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-3 font-bold text-lg transition-all duration-300 ${
              step >= 2 
                ? 'border-blue-600 bg-blue-600 text-white shadow-lg' 
                : 'border-gray-300 bg-white text-gray-400'
            }`}>
              {step > 2 ? '✓' : '2'}
            </div>
            <span className={`mt-2 font-semibold text-sm ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              📝 Thông tin
            </span>
          </div>
          
          {/* Connector 2-3 */}
          <div className={`flex-1 h-1 mx-4 rounded transition-all duration-300 ${
            step >= 3 ? 'bg-blue-600' : 'bg-gray-300'
          }`}></div>
          
          {/* Step 3 */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-3 font-bold text-lg transition-all duration-300 ${
              step >= 3 
                ? 'border-green-600 bg-green-600 text-white shadow-lg' 
                : 'border-gray-300 bg-white text-gray-400'
            }`}>
              3
            </div>
            <span className={`mt-2 font-semibold text-sm ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
              🎥 Reviews
            </span>
          </div>
        </div>
        
        {/* Loading Message */}
        {loadingMessage && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <span className="font-medium">{loadingMessage}</span>
            </div>
          </div>
        )}
      </div>

      {step === 1 && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">🔍 Tìm kiếm phim/truyện</h2>
            <p className="text-gray-600">Nhập tên để tự động lấy thông tin từ OMDB</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="mb-6">
              <label className="block mb-3 font-semibold text-gray-700">Loại nội dung</label>
              <div className="flex gap-4">
                <label className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                  contentData.type === 'MOVIE' 
                    ? 'border-blue-600 bg-blue-600 text-white shadow-md' 
                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                }`}>
                  <input
                    type="radio"
                    value="MOVIE"
                    checked={contentData.type === 'MOVIE'}
                    onChange={(e) => setContentData({...contentData, type: e.target.value})}
                    className="hidden"
                  />
                  <span className="text-2xl">🎬</span>
                  <span className="font-semibold">Phim Lẻ</span>
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                  contentData.type === 'SERIES' 
                    ? 'border-blue-600 bg-blue-600 text-white shadow-md' 
                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                }`}>
                  <input
                    type="radio"
                    value="SERIES"
                    checked={contentData.type === 'SERIES'}
                    onChange={(e) => setContentData({...contentData, type: e.target.value})}
                    className="hidden"
                  />
                  <span className="text-2xl">📚</span>
                  <span className="font-semibold">Truyện/Series</span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-3 font-semibold text-gray-700">
                Tên {contentData.type === 'MOVIE' ? 'phim' : 'truyện'}
              </label>
              <input
                ref={searchInputRef}
                type="text"
                placeholder={`VD: ${contentData.type === 'MOVIE' ? 'Inception, Parasite, Avatar...' : 'Breaking Bad, Game of Thrones...'}`}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    fetchFromOMDB(e.target.value.trim())
                  }
                }}
                disabled={loading}
              />
            </div>
            
            <button
              onClick={() => {
                const inputValue = searchInputRef.current?.value?.trim()
                if (inputValue) {
                  fetchFromOMDB(inputValue)
                } else {
                  alert('⚠️ Vui lòng nhập tên phim/truyện')
                }
              }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Đang tìm kiếm...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>🔍</span>
                  Tìm kiếm & Lấy thông tin tự động
                </span>
              )}
            </button>
            
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">💡 Mẹo:</span> Hệ thống sẽ tự động lấy: Poster, Mô tả, Năm, Rating, Quốc gia từ OMDB
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">📝 Kiểm tra & Chỉnh sửa thông tin</h2>
            <p className="text-gray-600">Xem lại thông tin đã lấy tự động và điều chỉnh nếu cần</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600">✅</span>
                <span className="text-sm font-semibold text-green-700">Đã lấy tự động từ OMDB</span>
              </div>
              {contentData.omdbGenres && contentData.omdbGenres !== 'N/A' && (
                <div className="text-xs text-green-600 mt-1">
                  📋 Thể loại từ OMDB: {contentData.omdbGenres}
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">Tên phim/truyện</label>
              <input
                type="text"
                value={contentData.title || ''}
                onChange={(e) => setContentData({...contentData, title: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Tên phim/truyện"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Ảnh poster</label>
              <div className="flex items-start gap-4">
                {imagePreview && (
                  <div className="w-40">
                    <img src={imagePreview} alt="Preview" className="w-full rounded-lg shadow-lg border-2 border-gray-200" />
                    <p className="text-xs text-center text-green-600 mt-2">✓ Đã có poster</p>
                  </div>
                )}
                <div className="flex-1">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      className="w-full px-4 py-2 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-2">📤 Upload ảnh mới nếu muốn thay đổi</p>
                  </div>
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Hoặc nhập URL ảnh poster"
                      value={contentData.posterUrl || ''}
                      onChange={(e) => {
                        setContentData({...contentData, posterUrl: e.target.value})
                        setImagePreview(e.target.value)
                      }}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">Thể loại (chọn nhiều)</label>
              <div className="border-2 border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto bg-gray-50">
                {genres.length === 0 ? (
                  <p className="text-gray-500 text-sm">Đang tải thể loại...</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {genres.map(genre => (
                      <label key={genre.id} className="flex items-center space-x-2 cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors">
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
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm">{genre.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {selectedGenres.length > 0 && (
                <p className="text-sm text-blue-600 mt-2 font-medium">
                  ✓ Đã chọn: {selectedGenres.length} thể loại
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-700">Mô tả</label>
              <textarea
                value={contentData.description || ''}
                onChange={(e) => setContentData({...contentData, description: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none h-32"
                placeholder="Mô tả nội dung phim/truyện"
              />
              {contentData.descriptionEn && contentData.descriptionEn !== contentData.description && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">📝 Bản gốc (English):</p>
                  <p className="text-sm text-gray-700">{contentData.descriptionEn}</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Năm phát hành</label>
                <input
                  type="number"
                  value={contentData.releaseYear || ''}
                  onChange={(e) => setContentData({...contentData, releaseYear: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="2024"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Quốc gia</label>
                <select
                  value={contentData.country || ''}
                  onChange={(e) => setContentData({...contentData, country: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
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
                <label className="block mb-2 font-semibold text-gray-700">Đánh giá (0-10)</label>
                <input
                  type="number"
                  step="0.1"
                  value={contentData.rating || ''}
                  onChange={(e) => setContentData({...contentData, rating: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="8.5"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              ← Quay lại
            </button>
            <button
              onClick={searchYouTube}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Tiếp theo: Tìm video review →'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">🎥 Chọn video reviews</h2>
            <p className="text-gray-600">Chọn các video review hay nhất cho nội dung này</p>
          </div>
          
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">💡 Gợi ý:</span> Chọn 3-10 video reviews chất lượng cao từ các reviewer uy tín
            </p>
          </div>
          
          <div className="space-y-3 mb-6 max-h-[500px] overflow-y-auto pr-2">
            {youtubeVideos.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">Không tìm thấy video nào</p>
                <p className="text-sm text-gray-400">Bạn có thể thêm link YouTube thủ công bên dưới</p>
              </div>
            ) : (
              youtubeVideos.map(video => (
                <label 
                  key={video.videoId} 
                  className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedVideos.find(v => v.videoId === video.videoId)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedVideos.find(v => v.videoId === video.videoId) !== undefined}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVideos([...selectedVideos, video])
                      } else {
                        setSelectedVideos(selectedVideos.filter(v => v.videoId !== video.videoId))
                      }
                    }}
                    className="mt-1 w-5 h-5 text-green-600"
                  />
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-40 rounded shadow-md flex-shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">📺 {video.channelTitle}</p>
                  </div>
                </label>
              ))
            )}
          </div>
          
          {/* Manual YouTube Link Input */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>🔗</span> Thêm link YouTube thủ công
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập link YouTube (vd: https://youtube.com/watch?v=...)"
                className="flex-1 px-4 py-2 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target
                    const url = input.value.trim()
                    if (url) {
                      // Extract video ID from URL
                      let videoId = null
                      try {
                        const urlObj = new URL(url)
                        if (urlObj.hostname.includes('youtube.com')) {
                          videoId = urlObj.searchParams.get('v')
                        } else if (urlObj.hostname.includes('youtu.be')) {
                          videoId = urlObj.pathname.slice(1)
                        }
                      } catch (e) {
                        // Try direct video ID
                        if (url.length === 11) videoId = url
                      }
                      
                      if (videoId && !selectedVideos.some(v => v.videoId === videoId)) {
                        setSelectedVideos([...selectedVideos, { 
                          videoId, 
                          channelTitle: 'Manual Added',
                          title: 'Manually added video'
                        }])
                        input.value = ''
                        alert('✅ Đã thêm video!')
                      } else if (selectedVideos.some(v => v.videoId === videoId)) {
                        alert('⚠️ Video này đã được thêm rồi!')
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
                    // Extract video ID from URL
                    let videoId = null
                    try {
                      const urlObj = new URL(url)
                      if (urlObj.hostname.includes('youtube.com')) {
                        videoId = urlObj.searchParams.get('v')
                      } else if (urlObj.hostname.includes('youtu.be')) {
                        videoId = urlObj.pathname.slice(1)
                      }
                    } catch (e) {
                      // Try direct video ID
                      if (url.length === 11) videoId = url
                    }
                    
                    if (videoId && !selectedVideos.some(v => v.videoId === videoId)) {
                      setSelectedVideos([...selectedVideos, { 
                        videoId, 
                        channelTitle: 'Manual Added',
                        title: 'Manually added video'
                      }])
                      input.value = ''
                      alert('✅ Đã thêm video!')
                    } else if (selectedVideos.some(v => v.videoId === videoId)) {
                      alert('⚠️ Video này đã được thêm rồi!')
                    } else {
                      alert('❌ Link YouTube không hợp lệ!')
                    }
                  }
                }}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                Thêm
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              💡 Nhấn Enter hoặc click "Thêm" để thêm video
            </p>
          </div>
          
          <div className="sticky bottom-0 bg-white pt-4 border-t-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">
                Đã chọn: <span className="font-bold text-green-600">{selectedVideos.length}</span> video
              </span>
              {selectedVideos.length > 0 && (
                <button
                  onClick={() => setSelectedVideos([])}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Bỏ chọn tất cả
                </button>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                ← Quay lại
              </button>
              <button
                onClick={saveContent}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Đang lưu...
                  </span>
                ) : selectedVideos.length > 0 ? (
                  `✓ Lưu nội dung (${selectedVideos.length} video)`
                ) : (
                  '✓ Lưu nội dung (không có video)'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
