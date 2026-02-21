import { useState } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { Button } from '../../components/ui/button'
import { getAffiliates, updateAffiliateStatus } from '../../lib/api'
import { Check, X, Ban, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Profile } from '../../types'

export default function AdminAffiliates() {
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-affiliates', page],
    queryFn: () => getAffiliates(page, 15),
    placeholderData: keepPreviousData,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Profile['status'] }) =>
      updateAffiliateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-affiliates'] })
    },
  })

  const handleStatusUpdate = (id: string, status: Profile['status']) => {
    updateMutation.mutate({ id, status })
  }

  const affiliates = data?.data || []
  const totalPages = data?.totalPages || 1

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50'>
          Affiliates
        </h1>
        <p className='text-slate-500 dark:text-slate-400'>
          Manage affiliate accounts and approvals.
        </p>
      </div>

      <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-slate-200 dark:divide-slate-800'>
            <thead className='bg-slate-50 dark:bg-slate-800/50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Affiliate
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500'>
                  Joined Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500'>
                  Status
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900'>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className='px-6 py-4 text-center text-sm text-slate-500'>
                    Loading...
                  </td>
                </tr>
              ) : affiliates.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className='px-6 py-4 text-center text-sm text-slate-500'>
                    No affiliates found.
                  </td>
                </tr>
              ) : (
                affiliates.map((affiliate: Profile) => (
                  <tr key={affiliate.id}>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='text-sm font-medium text-slate-900 dark:text-slate-50'>
                        {affiliate.full_name || 'Unknown'}
                      </div>
                      <div className='text-sm text-slate-500 dark:text-slate-400'>
                        {affiliate.email}
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-slate-900 dark:text-slate-50'>
                      {new Date(affiliate.created_at).toLocaleDateString()}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 capitalize
                        ${
                          affiliate.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : affiliate.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                        {affiliate.status}
                      </span>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-right text-sm font-medium'>
                      <div className='flex justify-end gap-2'>
                        {affiliate.status !== 'active' && (
                          <Button
                            size='sm'
                            variant='outline'
                            className='text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200'
                            onClick={() =>
                              handleStatusUpdate(affiliate.id, 'active')
                            }
                            title='Activate'>
                            <Check className='h-4 w-4' />
                          </Button>
                        )}
                        {affiliate.status === 'active' && (
                          <Button
                            size='sm'
                            variant='outline'
                            className='text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200'
                            onClick={() =>
                              handleStatusUpdate(affiliate.id, 'suspended')
                            }
                            title='Suspend'>
                            <Ban className='h-4 w-4' />
                          </Button>
                        )}
                        {affiliate.status === 'pending' && (
                          <Button
                            size='sm'
                            variant='outline'
                            className='text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200'
                            onClick={() =>
                              handleStatusUpdate(affiliate.id, 'suspended')
                            }
                            title='Reject'>
                            <X className='h-4 w-4' />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
