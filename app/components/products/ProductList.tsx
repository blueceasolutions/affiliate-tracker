import { Edit } from 'lucide-react'
import type { Product } from '../../types'
import { Button } from '../ui/button'

interface ProductListProps {
  products: Product[]
  isLoading: boolean
  onEdit: (product: Product) => void
}

export function ProductList({ products, isLoading, onEdit }: ProductListProps) {
  if (isLoading) {
    return (
      <div className='space-y-4'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800'
          />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className='rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center'>
        <p className='text-slate-500 dark:text-slate-400'>
          No products found. Create your first one!
        </p>
      </div>
    )
  }

  return (
    <div className='overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'>
      <table className='min-w-full divide-y divide-slate-200 dark:divide-slate-800'>
        <thead className='bg-slate-50 dark:bg-slate-800/50'>
          <tr>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400'>
              Name
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400'>
              Commission
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400'>
              Status
            </th>
            <th scope='col' className='relative px-6 py-3'>
              <span className='sr-only'>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900'>
          {products.map((product) => (
            <tr key={product.id}>
              <td className='whitespace-nowrap px-6 py-4'>
                <div className='text-sm font-medium text-slate-900 dark:text-slate-50'>
                  {product.name}
                </div>
                <div className='text-sm text-slate-500 dark:text-slate-400'>
                  {product.url}
                </div>
              </td>
              <td className='whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400'>
                {product.payout_per_conversion}%
              </td>
              <td className='whitespace-nowrap px-6 py-4'>
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    product.is_affiliate_enabled
                      ? 'bg-green-100 text-green-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}>
                  {product.is_affiliate_enabled ? 'Active' : 'Disabled'}
                </span>
              </td>
              <td className='whitespace-nowrap px-6 py-4 text-right text-sm font-medium'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onEdit(product)}>
                  <Edit className='h-4 w-4 mr-1' />
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
