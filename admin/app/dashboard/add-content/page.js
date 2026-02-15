'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '../../../components/AdminLayout'
import AddContentForm from '../../../components/AddContentForm'

export default function AddContent() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/dashboard')
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Thêm nội dung mới</h1>
      <AddContentForm onSuccess={handleSuccess} />
    </AdminLayout>
  )
}
