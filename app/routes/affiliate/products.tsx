import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Check, Copy, Link as LinkIcon } from 'lucide-react'
import { Button } from '../../components/ui/button'
import {
  getAffiliateProducts,
  getAffiliateLink,
  generateAffiliateLink,
} from '../../lib/api'
import type { Product } from '../../types'

export default function AffiliateProducts() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['affiliate-products'],
    queryFn: getAffiliateProducts,
  })

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
          Available Products
        </h1>
        <p className='text-slate-500'>
          Choose products to promote and start earning.
        </p>
      </div>

      {isLoading ? (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-48 animate-pulse rounded-xl bg-slate-100'
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className='rounded-lg border border-dashed border-slate-300 p-8 text-center'>
          <p className='text-slate-500'>
            No products available for promotion yet.
          </p>
        </div>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [link, setLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const { data: existingLink } = useQuery({
    queryKey: ['affiliate-link', product.id],
    queryFn: () => getAffiliateLink(product.id),
  })

  const generateMutation = useMutation({
    mutationFn: () => generateAffiliateLink(product.id),
    onSuccess: (data) => {
      setLink(`${window.location.origin}/ref/${data.unique_code}`)
    },
  })

  // Effect to set link if it exists
  if (existingLink && !link) {
    setLink(`${window.location.origin}/ref/${existingLink.unique_code}`)
  }

  const handleAction = () => {
    if (link) {
      navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else {
      generateMutation.mutate()
    }
  }

  const isLinkReady = !!link
  const isLoading = generateMutation.isPending

  return (
    <div className='flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md'>
      <h3 className='text-lg font-semibold text-slate-900'>{product.name}</h3>
      <p className='mt-2 text-sm text-slate-500 flex-1'>
        {product.description || 'No description provided.'}
      </p>

      <div className='my-4'>
        <div className='text-sm font-medium text-slate-900'>Payout</div>
        <div className='text-2xl font-bold text-blue-600'>
          ${product.payout_per_conversion.toFixed(2)}
        </div>
        <div className='text-xs text-slate-500'>per conversion</div>
      </div>

      <div className='mt-auto pt-4 border-t border-slate-100'>
        {isLinkReady ? (
          <div className='space-y-2'>
            <div className='rounded bg-slate-50 p-2 text-xs text-slate-600 break-all font-mono border border-slate-200'>
              {link}
            </div>
            <Button
              className='w-full'
              variant={copied ? 'secondary' : 'primary'}
              onClick={handleAction}>
              {copied ? (
                <>
                  <Check className='mr-2 h-4 w-4' />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className='mr-2 h-4 w-4' />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        ) : (
          <Button
            className='w-full'
            onClick={handleAction}
            isLoading={isLoading}
            variant='outline'>
            <LinkIcon className='mr-2 h-4 w-4' />
            Generate Link
          </Button>
        )}
      </div>
    </div>
  )
}
