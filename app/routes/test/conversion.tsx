import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { recordConversion } from '../../lib/api'

export default function SimulateConversion() {
  const [linkId, setLinkId] = useState<string | null>(null)
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('bluecea_affiliate_link_id')
    if (stored) {
      setLinkId(stored)
    }
  }, [])

  const handleConversion = async () => {
    if (!linkId) return
    setStatus('loading')
    try {
      await recordConversion(linkId, 0) // Amount is handled by backend logic/product lookup
      setStatus('success')
      setMessage(
        'Conversion recorded successfully! Check the affiliate wallet.',
      )
    } catch (error: any) {
      setStatus('error')
      setMessage(error.message || 'Failed to record conversion')
    }
  }

  return (
    <div className='flex h-screen items-center justify-center bg-slate-50 p-4'>
      <div className='w-full max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-center'>
        <h1 className='text-xl font-bold text-slate-900'>
          Simulate Conversion
        </h1>
        <p className='text-sm text-slate-500'>
          This page simulates a user completing a purchase/subscription.
        </p>

        {linkId ? (
          <div className='rounded bg-blue-50 p-2 text-xs text-blue-700 font-mono'>
            Link ID: {linkId}
          </div>
        ) : (
          <div className='rounded bg-yellow-50 p-2 text-xs text-yellow-700'>
            No affiliate link found in this browser session. Visit a ref link
            first.
          </div>
        )}

        <Button
          className='w-full'
          onClick={handleConversion}
          disabled={!linkId || status === 'loading' || status === 'success'}
          isLoading={status === 'loading'}>
          {status === 'success' ? 'Proceesed' : 'Complete Purchase'}
        </Button>

        {message && (
          <p
            className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
