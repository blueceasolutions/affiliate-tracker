import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '../../components/ui/button'
import { Modal } from '../../components/ui/modal'
import { getAllWithdrawalRequests, updateWithdrawalStatus } from '../../lib/api'
import { Check, X, DollarSign, Eye } from 'lucide-react'

export default function AdminWithdrawals() {
  const queryClient = useQueryClient()
  const [selectedDetails, setSelectedDetails] = useState<any>(null)

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['admin-withdrawals'],
    queryFn: getAllWithdrawalRequests,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateWithdrawalStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] })
    },
  })

  const handleStatusUpdate = (id: string, status: string) => {
    updateMutation.mutate({ id, status })
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
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50'>
          Withdrawals
        </h1>
        <p className='text-slate-500 dark:text-slate-400'>
          Manage affiliate payout requests.
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
                  Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500'>
                  Amount
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500'>
                  Method
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500'>
                  Details
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
                    colSpan={7}
                    className='px-6 py-4 text-center text-sm text-slate-500'>
                    Loading...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='px-6 py-4 text-center text-sm text-slate-500'>
                    No withdrawal requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id}>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='text-sm font-medium text-slate-900 dark:text-slate-50'>
                        {req.profile?.full_name || 'Unknown'}
                      </div>
                      <div className='text-sm text-slate-500 dark:text-slate-400'>
                        {req.profile?.email}
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-slate-900 dark:text-slate-50'>
                      {new Date(req.requested_at).toLocaleDateString()}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-900 dark:text-slate-50'>
                      ${req.amount.toFixed(2)}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400 capitalize'>
                      {req.payment_method}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
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
          </table>
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
