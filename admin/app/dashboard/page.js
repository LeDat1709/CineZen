'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '../../components/AdminLayout'
import ContentList from '../../components/ContentList'

export default function Dashboard() {
  const [contents, setContents] = useState([])
  const router = useRouter()

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/')
      return
    }
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contents`)
      const data = await response.json()
      setContents(data.contents || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý nội dung</h1>
        <button
          onClick={() => router.push('/dashboard/add-content')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          + Thêm mới
        </button>
      </div>
      
      <ContentList contents={contents} onUpdate={fetchContents} />
    </AdminLayout>
  )
}
