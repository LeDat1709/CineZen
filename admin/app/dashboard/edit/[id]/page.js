'use client'

import { useParams, useRouter } from 'next/navigation'
import AdminLayout from '../../../../components/AdminLayout'
import EditContentForm from '../../../../components/EditContentForm'

export default function EditContentPage() {
  const params = useParams()
  const router = useRouter()

  return (
    <AdminLayout>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 mb-4"
        >
          ← Quay lại
        </button>
        <h1 className="text-3xl font-bold">Chỉnh sửa nội dung</h1>
      </div>

      <EditContentForm 
        contentId={params.id}
        onSuccess={() => router.push('/dashboard')}
      />
    </AdminLayout>
  )
}
