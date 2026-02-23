import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { affiliateConversionsQuery } from '../../api/queries/affiliateConversions'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../../components/ui/button'

function obfuscateEmail(email: string | null | undefined) {
  if (!email || !email.includes('@')) return 'Unknown'
  const [username, domain] = email.split('@')
  if (username.length <= 2) return `${username}***@${domain}`
  return `${username.substring(0, 2)}***@${domain}`
}

export default function Conversions() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery(affiliateConversionsQuery(page))

  const conversions = data?.data || []
  const totalPages = data?.totalPages || 1

  return (
    <div className='max-w-7xl mx-auto space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50'>
          Conversions
        </h1>
        <p className='text-slate-500 dark:text-slate-400'>
          Track your successful referrals and earnings.
        </p>
      </div>

      <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-slate-200 dark:divide-slate-800'>
            <thead className='bg-slate-50 dark:bg-slate-800/50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Product
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  End User
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Earnings
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900'>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className='animate-pulse'>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded'></div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded'></div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded'></div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded'></div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-right'>
                      <div className='h-5 w-16 ml-auto bg-slate-200 dark:bg-slate-700 rounded-full'></div>
                    </td>
                  </tr>
                ))
              ) : conversions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className='px-6 py-8 text-center text-sm text-slate-500'>
                    You don't have any conversions yet. Keep sharing your links!
                  </td>
                </tr>
              ) : (
                conversions.map((conv: any) => (
                  <tr key={conv.id}>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-slate-900 dark:text-slate-100'>
                      {new Date(conv.created_at).toLocaleDateString()}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100'>
                      {conv.product?.name || 'Unknown Product'}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                      {obfuscateEmail(conv.end_user_identifier)}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm font-bold text-emerald-600 dark:text-emerald-400'>
                      +${Number(conv.payout_amount).toFixed(2)}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-right'>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize
                        ${
                          conv.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : conv.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                        {conv.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Details and Controls */}
        <div className='flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 sm:px-6'>
          <div className='flex flex-1 justify-between sm:hidden'>
            <Button
              variant='outline'
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Previous
            </Button>
            <Button
              variant='outline'
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              Next
            </Button>
          </div>
          <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
            <div>
              <p className='text-sm text-slate-700 dark:text-slate-300'>
                Page <span className='font-medium'>{page}</span> of{' '}
                <span className='font-medium'>{totalPages}</span>
              </p>
            </div>
            <div>
              <nav
                className='isolate inline-flex -space-x-px rounded-md shadow-sm'
                aria-label='Pagination'>
                <Button
                  variant='outline'
                  className='rounded-l-md rounded-r-none px-2 py-2'
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  <span className='sr-only'>Previous</span>
                  <ChevronLeft className='h-5 w-5' aria-hidden='true' />
                </Button>
                <Button
                  variant='outline'
                  className='rounded-r-md rounded-l-none px-2 py-2'
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                  <span className='sr-only'>Next</span>
                  <ChevronRight className='h-5 w-5' aria-hidden='true' />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
