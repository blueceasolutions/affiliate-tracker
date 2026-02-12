import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { trackClick } from '../lib/api'

export default function RefRoute() {
  const { code } = useParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) return

    const handleTracking = async () => {
      try {
        const link = await trackClick(code)

        // Store in localStorage for conversion tracking later
        // In a real app, this should probably be a cookie with an expiry
        localStorage.setItem('bluecea_affiliate_link_id', link.id)

        // Redirect to product URL
        // If product URL is external, use window.location.href
        // If it's internal (e.g. testing), we can use navigate
        // Assuming external for now or relative
        const url = link.product?.url || '/'

        // Delay slightly or just redirect
        window.location.href = url
      } catch (err) {
        console.error('Tracking error:', err)
        setError('Invalid link or product not found.')
      }
    }

    handleTracking()
  }, [code])

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center bg-slate-50'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-slate-900'>Oops!</h1>
          <p className='mt-2 text-slate-600'>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-screen items-center justify-center bg-slate-50'>
      <div className='flex flex-col items-center gap-4'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
        <p className='text-sm text-slate-500'>Redirecting...</p>
      </div>
    </div>
  )
}
