import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Modal } from '../../components/ui/modal'
import {
  paymentMethodsQuery,
  paymentMethodsKey,
} from '../../api/queries/paymentMethods'
import { createPaymentMethodMutation } from '../../api/mutations/createPaymentMethod'
import { updatePaymentMethodMutation } from '../../api/mutations/updatePaymentMethod'
import { deletePaymentMethodMutation } from '../../api/mutations/deletePaymentMethod'
import { CreditCard, Plus, Edit2, ShieldAlert } from 'lucide-react'
import type { PaymentMethod } from '../../types'

export default function AffiliateSettings() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)

  const queryClient = useQueryClient()

  const { data: paymentMethods = [], isLoading } = useQuery(paymentMethodsQuery)

  const deleteMutation = useMutation({
    ...deletePaymentMethodMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [paymentMethodsKey] })
    },
  })

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      deleteMutation.mutate(id)
    }
  }

  const openNewModal = () => {
    setEditingMethod(null)
    setIsModalOpen(true)
  }

  return (
    <div className='space-y-8 animate-in fade-in duration-500'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50'>
            Settings
          </h1>
          <p className='text-slate-500 dark:text-slate-400 mt-1'>
            Manage your account settings and payment methods.
          </p>
        </div>
      </div>

      {/* Payment Methods Section */}
      <section className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-slate-900 dark:text-slate-50'>
            Payment Methods
          </h2>
          <Button onClick={openNewModal} size='sm'>
            <Plus className='mr-2 h-4 w-4' />
            Add Method
          </Button>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {isLoading ? (
            <div className='h-32 text-sm text-slate-500 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center'>
              Loading...
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className='col-span-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 text-center text-slate-500 dark:text-slate-400'>
              No payment methods found. Add one to start receiving withdrawals.
            </div>
          ) : (
            paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => handleEdit(method)}
                className='group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all duration-200'>
                <div className='flex justify-between items-start mb-4'>
                  <div className='p-2 bg-slate-100 dark:bg-slate-800 rounded-lg'>
                    <CreditCard className='h-5 w-5 text-slate-700 dark:text-slate-300' />
                  </div>
                  <div className='flex z-30 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <button
                      onClick={() => handleEdit(method)}
                      className='text-slate-400 hover:text-blue-500 transition-colors'
                      title='Edit'>
                      <Edit2 className='h-4 w-4' />
                    </button>
                    {/* <button
                      onClick={() => handleDelete(method.id)}
                      className='text-slate-400 hover:text-red-500 transition-colors'
                      title='Delete'>
                      <Trash2 className='h-4 w-4' />
                    </button> */}
                  </div>
                </div>

                <h3 className='font-medium text-slate-900 dark:text-slate-50 uppercase tracking-wider text-sm mb-1'>
                  {method.type} ({method.currency})
                </h3>

                <div className='text-sm text-slate-500 dark:text-slate-400 truncate'>
                  {method.type === 'bank' &&
                    (method.details.account_number || 'No account number')}
                  {method.type === 'crypto' &&
                    (method.details.address || 'No wallet address')}
                </div>

                {method.is_default && (
                  <span className='absolute top-4 right-4 inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20'>
                    Default
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Danger Zone */}
      <section className='space-y-4 pt-8 border-t border-slate-200 dark:border-slate-800'>
        <h2 className='text-xl font-semibold text-red-600 dark:text-red-400 flex items-center'>
          <ShieldAlert className='w-5 h-5 mr-2' />
          Danger Zone
        </h2>
        <div className='rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 p-6'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
            <div>
              <h3 className='font-medium text-slate-900 dark:text-slate-50'>
                Delete Account
              </h3>
              <p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
            <Button variant='danger' onClick={() => setIsDeleteModalOpen(true)}>
              Delete Account
            </Button>
          </div>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}>
        <PaymentMethodForm
          initialData={editingMethod}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: [paymentMethodsKey] })
            setIsModalOpen(false)
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title='Delete Account'>
        <div className='space-y-4'>
          <p className='text-sm text-slate-600 dark:text-slate-400'>
            Account deletion currently requires contacting support. Please email
            us to process your request securely.
          </p>
          <div className='flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800'>
            <Button variant='ghost' onClick={() => setIsDeleteModalOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() =>
                (window.location.href = 'mailto:hello@bluecea.com')
              }>
              Contact Support
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

const paymentMethodSchema = z.object({
  currency: z.enum(['USD', 'NGN']),
  type: z.enum(['bank', 'crypto']),
  details: z.any(),
  is_default: z.boolean().default(false),
})

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>

function PaymentMethodForm({
  initialData,
  onSuccess,
  onCancel,
}: {
  initialData: PaymentMethod | null
  onSuccess: () => void
  onCancel: () => void
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(
      paymentMethodSchema,
    ) as Resolver<PaymentMethodFormValues>,
    defaultValues: initialData || {
      currency: 'USD',
      type: 'bank',
      is_default: false,
      details: {},
    },
  })

  const createMutation = useMutation({
    ...createPaymentMethodMutation,
    onSuccess,
  })

  const updateMutation = useMutation({
    ...updatePaymentMethodMutation,
    onSuccess,
  })

  const onSubmit = (data: PaymentMethodFormValues) => {
    // Basic formatting for details based on type
    let finalDetails = {}
    if (data.type === 'crypto') {
      finalDetails = {
        address: data.details.address,
        network: data.details.network,
      }
    } else if (data.type === 'bank') {
      finalDetails = {
        bank_name: data.details.bank_name,
        account_name: data.details.account_name,
        account_number: data.details.account_number,
        routing_number: data.details.routing_number,
        swift_code: data.details.swift_code,
      }
    }

    const payload = { ...data, details: finalDetails }

    if (initialData) {
      updateMutation.mutate({ id: initialData.id, updates: payload })
    } else {
      createMutation.mutate(payload as any)
    }
  }

  const selectedCurrency = watch('currency')
  const selectedType = watch('type')

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-5 animate-in fade-in zoom-in-95 duration-300'>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
            Currency
          </label>
          <select
            className='flex w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors'
            {...register('currency', {
              onChange: (e) => {
                if (e.target.value === 'NGN' && selectedType === 'crypto') {
                  setValue('type', 'bank')
                }
              },
            })}>
            <option value='USD'>USD</option>
            <option value='NGN'>NGN</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
            Method Type
          </label>
          <select
            className='flex w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors'
            {...register('type')}>
            <option value='bank'>Bank Transfer</option>
            {selectedCurrency === 'USD' && (
              <option value='crypto'>Crypto</option>
            )}
          </select>
        </div>
      </div>

      <div className='space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800'>
        {selectedType === 'crypto' && (
          <>
            <div>
              <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
                Wallet Address
              </label>
              <Input
                placeholder='0x...'
                {...register('details.address')}
                defaultValue={initialData?.details?.address}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
                Network
              </label>
              <Input
                placeholder='e.g. ERC20, TRC20'
                {...register('details.network')}
                defaultValue={initialData?.details?.network}
              />
            </div>
          </>
        )}

        {selectedType === 'bank' && (
          <>
            <div>
              <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
                Bank Name
              </label>
              <Input
                {...register('details.bank_name')}
                defaultValue={initialData?.details?.bank_name}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
                Account Name
              </label>
              <Input
                {...register('details.account_name')}
                defaultValue={initialData?.details?.account_name}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
                Account Number
              </label>
              <Input
                {...register('details.account_number')}
                defaultValue={initialData?.details?.account_number}
              />
            </div>
            {selectedCurrency === 'USD' && (
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
                    Routing Number
                  </label>
                  <Input
                    {...register('details.routing_number')}
                    defaultValue={initialData?.details?.routing_number}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
                    SWIFT Code
                  </label>
                  <Input
                    {...register('details.swift_code')}
                    defaultValue={initialData?.details?.swift_code}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className='flex items-center space-x-2 pt-2'>
        <input
          type='checkbox'
          id='is_default'
          className='rounded border-slate-300 text-blue-600 outline-none focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900'
          {...register('is_default')}
        />
        <label
          htmlFor='is_default'
          className='text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer text-balance'>
          Set as default payment method
        </label>
      </div>

      <div className='flex justify-end gap-3 pt-6'>
        <Button type='button' variant='ghost' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' isLoading={isPending}>
          {initialData ? 'Save Changes' : 'Add Method'}
        </Button>
      </div>
    </form>
  )
}
