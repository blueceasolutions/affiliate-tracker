import { useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import type { Product } from '../../types'

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  url: z.string().url('Must be a valid URL'),
  payout_per_conversion: z.coerce
    .number()
    .min(0.01, 'Payout must be greater than 0'),
  is_affiliate_enabled: z.boolean().default(true),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: Product | null
  onSubmit: (data: ProductFormValues) => Promise<void>
  isLoading: boolean
  onCancel: () => void
}

export function ProductForm({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      name: '',
      description: '',
      url: '',
      payout_per_conversion: 0,
      is_affiliate_enabled: true,
    },
  })

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || '',
        url: initialData.url,
        payout_per_conversion: initialData.payout_per_conversion,
        is_affiliate_enabled: initialData.is_affiliate_enabled,
      })
    } else {
      reset({
        name: '',
        description: '',
        url: '',
        payout_per_conversion: 0,
        is_affiliate_enabled: true,
      })
    }
  }, [initialData, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <label
          htmlFor='name'
          className='block text-sm font-medium text-slate-700 dark:text-slate-300'>
          Product Name
        </label>
        <Input
          id='name'
          placeholder='e.g. Premium Subscription'
          className={errors.name ? 'border-red-500' : ''}
          {...register('name')}
        />
        {errors.name && (
          <p className='mt-1 text-sm text-red-500'>{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='description'
          className='block text-sm font-medium text-slate-700 dark:text-slate-300'>
          Description
        </label>
        <textarea
          id='description'
          rows={3}
          className='flex w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 ring-offset-white dark:ring-offset-slate-950 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          placeholder='Product details...'
          {...register('description')}
        />
        {errors.description && (
          <p className='mt-1 text-sm text-red-500'>
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor='url'
          className='block text-sm font-medium text-slate-700 dark:text-slate-300'>
          Product URL
        </label>
        <Input
          id='url'
          type='url'
          placeholder='https://example.com/product'
          className={errors.url ? 'border-red-500' : ''}
          {...register('url')}
        />
        {errors.url && (
          <p className='mt-1 text-sm text-red-500'>{errors.url.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='payout'
          className='block text-sm font-medium text-slate-700 dark:text-slate-300'>
          Payout per Conversion ($)
        </label>
        <Input
          id='payout'
          type='number'
          step='0.01'
          placeholder='0.00'
          className={errors.payout_per_conversion ? 'border-red-500' : ''}
          {...register('payout_per_conversion')}
        />
        {errors.payout_per_conversion && (
          <p className='mt-1 text-sm text-red-500'>
            {errors.payout_per_conversion.message}
          </p>
        )}
      </div>

      <div className='flex items-center space-x-2'>
        <input
          type='checkbox'
          id='is_affiliate_enabled'
          className='h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600'
          {...register('is_affiliate_enabled')}
        />
        <label
          htmlFor='is_affiliate_enabled'
          className='text-sm font-medium text-slate-700 dark:text-slate-300'>
          Enable for Affiliates
        </label>
      </div>

      <div className='flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800'>
        <Button
          type='button'
          variant='ghost'
          onClick={onCancel}
          disabled={isLoading}>
          Cancel
        </Button>
        <Button type='submit' isLoading={isLoading}>
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
}
