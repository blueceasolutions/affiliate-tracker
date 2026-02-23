import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Sidebar } from '../../components/layout/Sidebar'
import { Header } from '../../components/layout/Header'
import { MobileSidebar } from '../../components/layout/MobileSidebar'
import { AlertBanner } from '../../components/layout/AlertBanner'

export default function DashboardLayout() {
  const { user, loading, role } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/')
    } else if (!loading && user && role !== null) {
      if (location.pathname.startsWith('/admin') && role !== 'admin') {
        navigate('/dashboard')
      }
    }
  }, [user, loading, role, navigate, location.pathname])

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center bg-white dark:bg-slate-950'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-brand'></div>
      </div>
    )
  }

  // Prevent flash of content before redirect
  if (!user) return null
  if (location.pathname.startsWith('/admin') && role !== 'admin') return null

  return (
    <div className='flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden'>
      <Sidebar />
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className='flex flex-1 flex-col overflow-hidden'>
        <AlertBanner />
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className='flex-1 overflow-y-auto p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
