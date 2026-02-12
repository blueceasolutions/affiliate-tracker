import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Modal } from '../../components/ui/modal'
import {
  getWallet,
  getWithdrawalRequests,
  requestWithdrawal,
} from '../../lib/api'
import { CreditCard, History, Wallet } from 'lucide-react'

export default function AffiliateWallet() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: wallet, isLoading: isLoadingWallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: getWallet,
  })

  const { data: withdrawals = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['withdrawals'],
    queryFn: getWithdrawalRequests,
  })

  const availableBalance = wallet?.available_balance || 0

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
            Wallet
          </h1>
          <p className='text-slate-500'>Manage earnings and withdrawals.</p>
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

      <div className='rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden'>
        <div className='px-6 py-4 border-b border-slate-200'>
          <h3 className='font-semibold text-slate-900'>Withdrawal History</h3>
        </div>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-slate-200'>
            <thead className='bg-slate-50'>
              <tr>
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200 bg-white'>
              {isLoadingHistory ? (
                <tr>
                  <td
                    colSpan={4}
                    className='px-6 py-4 text-center text-sm text-slate-500'>
                    Loading history...
                  </td>
                </tr>
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className='px-6 py-4 text-center text-sm text-slate-500'>
                    No withdrawal history found.
                  </td>
                </tr>
              ) : (
                withdrawals.map((req) => (
                  <tr key={req.id}>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-slate-900'>
                      {new Date(req.requested_at).toLocaleDateString()}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900'>
                      ${req.amount.toFixed(2)}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-slate-500 capitalize'>
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
                                : 'bg-slate-100 text-slate-800'
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
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='Request Withdrawal'>
        <WithdrawalForm
          maxAmount={availableBalance}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['wallet'] })
            queryClient.invalidateQueries({ queryKey: ['withdrawals'] })
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
    <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium text-slate-500'>{title}</p>
          <p className='text-2xl font-bold text-slate-900'>{value}</p>
        </div>
        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-slate-50'>
          <Icon className='h-6 w-6 text-slate-400' />
        </div>
      </div>
      <p className='mt-1 text-xs text-slate-400'>{description}</p>
    </div>
  )
}

const withdrawalSchema = z.object({
  amount: z.coerce.number().min(1, 'Minimum withdrawal is $1'),
  payment_method: z.string().min(1, 'Select a payment method'),
  payment_details: z
    .string()
    .min(3, 'Enter payment details (e.g. email or wallet address)'),
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema) as Resolver<WithdrawalFormValues>,
    defaultValues: {
      payment_method: 'paypal',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: WithdrawalFormValues) =>
      requestWithdrawal(data.amount, data.payment_method, {
        detail: data.payment_details,
      }),
    onSuccess,
  })

  const onSubmit = (data: WithdrawalFormValues) => {
    if (data.amount > maxAmount) {
      alert(`Amount exceeds available balance of $${maxAmount}`)
      return
    }
    mutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium text-slate-700'>
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
        <p className='text-xs text-slate-500 mt-1'>
          Available: ${maxAmount.toFixed(2)}
        </p>
      </div>

      <div>
        <label className='block text-sm font-medium text-slate-700'>
          Payment Method
        </label>
        <select
          className='flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600'
          {...register('payment_method')}>
          <option value='paypal'>PayPal</option>
          <option value='crypto'>Crypto</option>
          <option value='bank'>Bank Transfer</option>
        </select>
      </div>

      <div>
        <label className='block text-sm font-medium text-slate-700'>
          Payment Details
        </label>
        <Input
          placeholder='Email, Wallet Address, or IBAN'
          {...register('payment_details')}
          className={errors.payment_details ? 'border-red-500' : ''}
        />
        {errors.payment_details && (
          <p className='text-xs text-red-500 mt-1'>
            {errors.payment_details.message}
          </p>
        )}
      </div>

      <div className='flex justify-end gap-3 pt-4'>
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
