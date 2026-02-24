import { Link } from 'react-router'
import { MoveLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center'>
      <div className='space-y-6 max-w-md'>
        <div className='space-y-2'>
          <h1 className='text-6xl font-bold tracking-tighter text-slate-900 dark:text-slate-50'>
            404
          </h1>
          <h2 className='text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50'>
            Page not found
          </h2>
          <p className='text-slate-500 dark:text-slate-400'>
            Sorry, we couldn't find the page you're looking for. It might have
            been moved, deleted, or you may have mistyped the address.
          </p>
        </div>

        <div className='flex flex-col sm:flex-row justify-center gap-3 pt-4'>
          <Link
            to='/'
            className='inline-flex h-10 items-center justify-center rounded-md bg-brand px-8 text-sm font-medium text-white shadow transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50 dark:bg-brand-dark dark:hover:bg-brand-dark/90'>
            <MoveLeft className='mr-2 h-4 w-4' />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
