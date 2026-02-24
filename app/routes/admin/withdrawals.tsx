import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '../../components/ui/button'
import { Modal } from '../../components/ui/modal'
import {
  adminWithdrawalsQuery,
  adminWithdrawalsKey,
} from '../../api/queries/adminWithdrawals'
import { updateWithdrawalStatusMutation } from '../../api/mutations/updateWithdrawalStatus'
import { adminPendingCountsKey } from '../../api/queries/adminPendingCounts' // Added import
import { Check, X, DollarSign, Eye, Search } from 'lucide-react' // Added Search

export default function WithdrawalsPage() {
  const queryClient = useQueryClient()

  // Custom Filters & Pagination state
  const [emailFilter, setEmailFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const limit = 20

  // Debounce email filter for API
  const [debouncedEmail, setDebouncedEmail] = useState(emailFilter)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedEmail(emailFilter), 500)
    return () => clearTimeout(timer)
  }, [emailFilter])

  const [selectedDetails, setSelectedDetails] = useState<any>(null)

  // Handle API fetching with React Query
  const { data: qData, isLoading } = useQuery(
    adminWithdrawalsQuery(page, limit, debouncedEmail, statusFilter),
  )

  const withdrawsQuery = qData ? qData.data : []
  const totalPages = qData ? qData.totalPages : 1
  const requests = withdrawsQuery

  const updateStatusMutation = useMutation({
    ...updateWithdrawalStatusMutation,
    onSuccess: () => {
      // Invalidate both pending counts and admin withdrawals query to refresh UI
      queryClient.invalidateQueries({ queryKey: [adminPendingCountsKey] })
      queryClient.invalidateQueries({ queryKey: [adminWithdrawalsKey] })
    },
  })

  const handleStatusUpdate = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus })
  }

  const formatDetailsPreview = (req: any) => {
    if (!req.payment_details) return '-'
    if (req.payment_method === 'paypal') return req.payment_details.email || '-'
    if (req.payment_method === 'bank')
      return `${req.payment_details.bank_name || ''} - ${req.payment_details.account_number || ''}`
    if (req.payment_method === 'crypto')
      return req.payment_details.address || '-'
    return JSON.stringify(req.payment_details).substring(0, 30) + '...'
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
            Withdrawal Requests
          </h1>
          <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
            Manage affiliate withdrawal implementations and processes.
          </p>
        </div>
      </div>

      <div className='bg-white dark:bg-slate-900 shadow rounded-lg pointer-events-auto'>
        {/* FILTERS */}
        <div className='p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <div className='relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Search className='h-4 w-4 text-slate-400' />
              </div>
              <input
                type='text'
                className='block p-2 w-full pl-10 rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm focus:ring-brand focus:border-brand'
                placeholder='Search by affiliate email...'
                value={emailFilter}
                onChange={(e) => {
                  setEmailFilter(e.target.value)
                  setPage(1) // Reset to page 1 on search
                }}
              />
            </div>
          </div>
          <div className='sm:w-48'>
            <select
              className='block p-2 w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm focus:ring-brand focus:border-brand'
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1) // Reset to page 1 on status change
              }}>
              <option value='ALL'>All Statuses</option>
              <option value='pending'>Pending</option>
              <option value='paid'>Paid</option>
              <option value='rejected'>Rejected</option>
            </select>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-slate-200 dark:divide-slate-800'>
            <thead className='bg-slate-50 dark:bg-slate-800/50'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                  Affiliate
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                  Amount
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                  Payment Method
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                  Date
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                  Status
                </th>
                <th scope='col' className='relative px-6 py-3'>
                  <span className='sr-only'>Actions</span>
                </th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody className='bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800'>
                {[...Array(2)].map((_, i) => (
                  <tr key={i} className='animate-pulse'>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2'></div>
                      <div className='h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded'></div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded'></div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <div className='h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded'></div>
                        <div className='h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded'></div>
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded'></div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full'></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody className='bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800'>
                {requests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className='px-6 py-4 text-center text-sm text-slate-500'>
                      No withdrawal requests found.
                    </td>
                  </tr>
                ) : (
                  requests.map((req: any) => (
                    <tr key={req.id}>
                      <td className='whitespace-nowrap px-6 py-4'>
                        <div className='text-sm font-medium text-slate-900 dark:text-slate-50'>
                          {req.profile?.full_name || 'Unknown'}
                        </div>
                        <div className='text-sm text-slate-500 dark:text-slate-400'>
                          {req.profile?.email}
                        </div>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-900 dark:text-slate-50'>
                        ${req.amount.toFixed(2)}
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <span className='capitalize text-sm text-slate-900 dark:text-slate-50 mr-2'>
                            {req.payment_method}
                          </span>
                          <span className='max-w-[150px] truncate text-sm text-slate-500 dark:text-slate-400'>
                            {formatDetailsPreview(req)}
                          </span>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-7 px-2'
                            onClick={() =>
                              setSelectedDetails({
                                ...req.payment_details,
                                method: req.payment_method,
                              })
                            }>
                            <Eye className='h-4 w-4 text-slate-400' />
                          </Button>
                        </div>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-sm text-slate-900 dark:text-slate-50'>
                        {new Date(req.requested_at).toLocaleDateString()}
                      </td>
                      <td className='whitespace-nowrap px-6 py-4'>
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 capitalize
                        ${
                          req.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : req.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : req.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className='whitespace-nowrap px-6 py-4 text-right text-sm font-medium'>
                        {req.status === 'pending' && (
                          <div className='flex justify-end gap-2'>
                            <Button
                              size='sm'
                              variant='outline'
                              className='text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200'
                              onClick={() => handleStatusUpdate(req.id, 'paid')}
                              title='Mark as Paid'>
                              <DollarSign className='h-4 w-4' />
                            </Button>
                            <Button
                              size='sm'
                              variant='outline'
                              className='text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200'
                              onClick={() =>
                                handleStatusUpdate(req.id, 'rejected')
                              }
                              title='Reject'>
                              <X className='h-4 w-4' />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            )}
          </table>
        </div>

        {/* Pagination Details and Controls */}
        <div className='bg-white dark:bg-slate-900 px-4 py-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 sm:px-6'>
          <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
            <div>
              <p className='text-sm text-slate-700 dark:text-slate-400'>
                Showing page <span className='font-medium'>{page}</span> of{' '}
                <span className='font-medium'>{totalPages}</span>
              </p>
            </div>
            <div>
              <nav
                className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
                aria-label='Pagination'>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'>
                  <span className='sr-only'>Previous</span>
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || totalPages === 0}
                  className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'>
                  <span className='sr-only'>Next</span>
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!selectedDetails}
        onClose={() => setSelectedDetails(null)}
        title='Payment Details'>
        <div className='space-y-4'>
          <div className='bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg'>
            <h4 className='text-sm font-semibold capitalize mb-4 text-slate-900 dark:text-slate-50 border-b border-slate-200 dark:border-slate-700 pb-2'>
              {selectedDetails?.method} Details
            </h4>
            <div className='space-y-3'>
              {selectedDetails &&
                Object.entries(selectedDetails)
                  .filter(([k]) => k !== 'method')
                  .map(([key, value]) => (
                    <div key={key} className='flex flex-col'>
                      <span className='text-xs font-medium text-slate-500 dark:text-slate-400 capitalize bg-transparent mb-0.5'>
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className='text-sm text-slate-900 dark:text-slate-100 font-mono break-all'>
                        {String(value)}
                      </span>
                    </div>
                  ))}
            </div>
          </div>
          <div className='flex justify-end pt-2'>
            <Button onClick={() => setSelectedDetails(null)}>Done</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
