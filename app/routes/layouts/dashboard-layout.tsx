import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Sidebar } from '../../components/layout/Sidebar'
import { Header } from '../../components/layout/Header'
import { MobileSidebar } from '../../components/layout/MobileSidebar'

export default function DashboardLayout() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  // Prevent flash of content before redirect
  if (!user) return null

  return (
    <div className='flex h-screen bg-slate-50 overflow-hidden'>
      <Sidebar />
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className='flex flex-1 flex-col overflow-hidden'>
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className='flex-1 overflow-y-auto p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
