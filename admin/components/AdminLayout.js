'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">CineZen Admin</h1>
              <div className="flex space-x-4">
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-blue-600"
                >
                  Nội dung
                </Link>
                <Link 
                  href="/dashboard/genres" 
                  className="text-gray-700 hover:text-blue-600"
                >
                  Thể loại
                </Link>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}
