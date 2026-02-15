'use client'

import { useState, useEffect } from 'react'

export default function GenreManager() {
  const [genres, setGenres] = useState([])
  const [filter, setFilter] = useState('MOVIE')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', forType: 'MOVIE' })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchGenres()
  }, [filter])

  const fetchGenres = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/genres?type=${filter}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      const data = await response.json()
      setGenres(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/genres/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/genres`
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowForm(false)
        setFormData({ name: '', forType: 'MOVIE' })
        setEditingId(null)
        fetchGenres()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa thể loại này?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/genres/${id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )

      if (response.ok) {
        fetchGenres()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEdit = (genre) => {
    setFormData({ name: genre.name, forType: genre.forType })
    setEditingId(genre.id)
    setShowForm(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Quản lý thể loại</h2>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setFormData({ name: '', forType: filter })
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Thêm thể loại
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('MOVIE')}
          className={`px-4 py-2 rounded ${
            filter === 'MOVIE' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          🎬 Phim
        </button>
        <button
          onClick={() => setFilter('SERIES')}
          className={`px-4 py-2 rounded ${
            filter === 'SERIES' ? 'bg-purple-600 text-white' : 'bg-gray-200'
          }`}
        >
          📚 Truyện
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">
            {editingId ? 'Sửa thể loại' : 'Thêm thể loại mới'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Tên thể loại</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Loại</label>
              <select
                value={formData.forType}
                onChange={(e) => setFormData({...formData, forType: e.target.value})}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="MOVIE">Phim</option>
                <option value="SERIES">Truyện</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {editingId ? 'Cập nhật' : 'Thêm'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({ name: '', forType: 'MOVIE' })
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Tên thể loại</th>
              <th className="px-6 py-3 text-left">Slug</th>
              <th className="px-6 py-3 text-left">Loại</th>
              <th className="px-6 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {genres.map(genre => (
              <tr key={genre.id}>
                <td className="px-6 py-4">{genre.name}</td>
                <td className="px-6 py-4 text-gray-500">{genre.slug}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    genre.forType === 'MOVIE' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {genre.forType === 'MOVIE' ? 'Phim' : 'Truyện'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(genre)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(genre.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
