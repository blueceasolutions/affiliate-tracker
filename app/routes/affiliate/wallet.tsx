import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Modal } from '../../components/ui/modal'
import { walletQuery, walletKey } from '../../api/queries/wallet'
import { withdrawalsQuery, withdrawalsKey } from '../../api/queries/withdrawals'
import { paymentMethodsQuery } from '../../api/queries/paymentMethods'
import { requestWithdrawalMutation } from '../../api/mutations/requestWithdrawal'
import { useNavigate } from 'react-router'
import {
  CreditCard,
  History,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export default function AffiliateWallet() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const queryClient = useQueryClient()

  const { data: wallet, isLoading: isLoadingWallet } = useQuery(walletQuery)

  const { data, isLoading: isLoadingHistory } = useQuery(
    withdrawalsQuery(page, statusFilter),
  )

  const withdrawals = data?.data || []
  const totalPages = data?.totalPages || 1

  const availableBalance = wallet?.available_balance || 0

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50'>
            Wallet
          </h1>
          <p className='text-slate-500 dark:text-slate-400'>
            Manage earnings and withdrawals.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={availableBalance <= 0}>
          <CreditCard className='mr-2 h-4 w-4' />
          Request Withdrawal
        </Button>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        <StatsCard
          title='Available Balance'
          value={`$${availableBalance.toFixed(2)}`}
          icon={Wallet}
          description='Ready to withdraw'
        />
        <StatsCard
          title='Total Withdrawn'
          value={`$${(wallet?.total_withdrawn || 0).toFixed(2)}`}
          icon={History}
          description='Lifetime payouts'
        />
        <StatsCard
          title='Total Earned'
          value={`$${(wallet?.total_earned || 0).toFixed(2)}`}
          icon={CreditCard}
          description='Lifetime earnings'
        />
      </div>

      <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden'>
        <div className='px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <h3 className='font-semibold text-slate-900 dark:text-slate-50'>
            Withdrawal History
          </h3>
          <div className='sm:w-48'>
            <select
              className='block p-2 w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm focus:ring-brand focus:border-brand'
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
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
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Amount
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Method
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900'>
              {isLoadingHistory ? (
                <tr>
                  <td
                    colSpan={4}
                    className='px-6 py-4 text-center text-sm text-slate-500 dark:text-slate-400'>
                    Loading history...
                  </td>
                </tr>
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className='px-6 py-4 text-center text-sm text-slate-500 dark:text-slate-400'>
                    No withdrawal history found.
                  </td>
                </tr>
              ) : (
                withdrawals.map((req) => (
                  <tr key={req.id}>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-slate-900 dark:text-slate-50'>
                      {new Date(req.requested_at).toLocaleDateString()}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-50'>
                      ${req.amount.toFixed(2)}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400 capitalize'>
                      {req.payment_method}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='Request Withdrawal'>
        <WithdrawalForm
          maxAmount={availableBalance}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: [walletKey] })
            queryClient.invalidateQueries({ queryKey: [withdrawalsKey] })
            setIsModalOpen(false)
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

function StatsCard({ title, value, icon: Icon, description }: any) {
  return (
    <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
            {title}
          </p>
          <p className='text-2xl font-bold text-slate-900 dark:text-slate-50'>
            {value}
          </p>
        </div>
        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800/50'>
          <Icon className='h-6 w-6 text-slate-400 dark:text-slate-500' />
        </div>
      </div>
      <p className='mt-1 text-xs text-slate-400 dark:text-slate-500'>
        {description}
      </p>
    </div>
  )
}

const withdrawalSchema = z.object({
  amount: z.coerce.number().min(10, 'Minimum withdrawal is $10'),
  payment_method_id: z.string().min(1, 'Select a payment method'),
})

type WithdrawalFormValues = z.infer<typeof withdrawalSchema>

function WithdrawalForm({
  maxAmount,
  onSuccess,
  onCancel,
}: {
  maxAmount: number
  onSuccess: () => void
  onCancel: () => void
}) {
  const navigate = useNavigate()

  const { data: paymentMethods = [], isLoading } = useQuery(paymentMethodsQuery)

  // Pre-select default payment method if it exists
  const defaultMethod = paymentMethods.find((m) => m.is_default)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema) as Resolver<WithdrawalFormValues>,
  })

  const mutation = useMutation({
    ...requestWithdrawalMutation,
    onSuccess,
    onError: (err: any) => {
      alert(err.message || 'An error occurred while requesting withdrawal.')
    },
  })

  const onSubmit = (data: WithdrawalFormValues) => {
    if (data.amount > maxAmount) {
      alert(`Amount exceeds available balance of $${maxAmount.toFixed(2)}`)
      return
    }
    const selectedMethod = paymentMethods.find(
      (m) => m.id === data.payment_method_id,
    )
    if (!selectedMethod) {
      alert('Invalid payment method')
      return
    }

    mutation.mutate({
      amount: data.amount,
      method: selectedMethod.type,
      details: selectedMethod.details,
    })
  }

  if (isLoading) {
    return (
      <div className='text-sm text-slate-500 py-4 text-center'>
        Loading payment methods...
      </div>
    )
  }

  if (paymentMethods.length === 0) {
    return (
      <div className='text-center py-6 space-y-4'>
        <p className='text-sm text-slate-600 dark:text-slate-400'>
          You don't have any payment methods configured.
        </p>
        <Button
          onClick={() => {
            onCancel()
            navigate('/affiliate/settings')
          }}>
          Go to Settings to add one
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-5 animate-in fade-in duration-300'>
      <div>
        <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
          Amount ($)
        </label>
        <Input
          type='number'
          step='0.01'
          max={maxAmount}
          {...register('amount')}
          className={errors.amount ? 'border-red-500' : ''}
        />
        {errors.amount && (
          <p className='text-xs text-red-500 mt-1'>{errors.amount.message}</p>
        )}
        <div className='flex justify-between mt-1 text-xs text-slate-500 dark:text-slate-400'>
          <span>Min: $10.00</span>
          <span>Max: ${maxAmount.toFixed(2)}</span>
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
          Payment Method
        </label>
        <div className='space-y-2 max-h-[240px] overflow-y-auto p-1'>
          {paymentMethods.map((method) => {
            const detailPreview =
              method.type === 'paypal'
                ? method.details.email
                : method.type === 'bank'
                  ? method.details.account_number
                  : method.details.address
            return (
              <label
                key={method.id}
                className='flex items-center space-x-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'>
                <input
                  type='radio'
                  value={method.id}
                  defaultChecked={defaultMethod?.id === method.id}
                  className='h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900'
                  {...register('payment_method_id')}
                />
                <div className='flex flex-col'>
                  <span className='text-sm font-medium text-slate-900 dark:text-slate-50 uppercase'>
                    {method.type} ({method.currency})
                  </span>
                  <span className='text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]'>
                    {detailPreview}
                  </span>
                </div>
              </label>
            )
          })}
        </div>
        {errors.payment_method_id && (
          <p className='text-xs text-red-500 mt-1'>
            {errors.payment_method_id.message}
          </p>
        )}
      </div>

      <div className='flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800'>
        <Button type='button' variant='ghost' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' isLoading={mutation.isPending}>
          Submit Request
        </Button>
      </div>
    </form>
  )
}
