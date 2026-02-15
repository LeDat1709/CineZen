'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '../../../components/AdminLayout'
import GenreManager from '../../../components/GenreManager'

export default function GenresPage() {
  const router = useRouter()

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/')
    }
  }, [])

  return (
    <AdminLayout>
      <GenreManager />
    </AdminLayout>
  )
}
