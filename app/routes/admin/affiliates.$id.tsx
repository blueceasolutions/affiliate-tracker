import { useParams, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import {
  adminAffiliateQuery,
  adminAffiliateMetricsQuery,
} from '../../api/queries/adminAffiliate'
import {
  ArrowLeft,
  MousePointerClick,
  TrendingUp,
  DollarSign,
  Wallet2,
  Activity,
} from 'lucide-react'
import { Button } from '../../components/ui/button'

export default function AdminAffiliateDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: profile, isLoading: isLoadingProfile } = useQuery(
    adminAffiliateQuery(id!),
  )
  const { data: metrics, isLoading: isLoadingMetrics } = useQuery(
    adminAffiliateMetricsQuery(id!),
  )

  if (isLoadingProfile || isLoadingMetrics) {
    return (
      <div className='flex justify-center p-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-brand'></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className='text-center p-12'>
        <h2 className='text-xl font-bold text-slate-900 dark:text-white'>
          Affiliate Not Found
        </h2>
        <Button
          variant='outline'
          className='mt-4'
          onClick={() => navigate('/admin/affiliates')}>
          Back to List
        </Button>
      </div>
    )
  }

  const statCards = [
    {
      name: 'Total Clicks',
      value: metrics?.total_clicks || 0,
      icon: MousePointerClick,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/40',
    },
    {
      name: 'Total Conversions',
      value: metrics?.total_conversions || 0,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/40',
    },
    {
      name: 'Total Earned',
      value: `$${(metrics?.total_earned || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    },
    {
      name: 'Available Balance',
      value: `$${(metrics?.available_balance || 0).toFixed(2)}`,
      icon: Wallet2,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-100 dark:bg-indigo-900/40',
    },
    {
      name: 'Total Withdrawn',
      value: `$${(metrics?.total_withdrawn || 0).toFixed(2)}`,
      icon: Activity,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/40',
    },
  ]

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='sm'
          className='text-slate-500'
          onClick={() => navigate('/admin/affiliates')}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back
        </Button>
      </div>

      <div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm'>
        <div className='flex items-center gap-4 mb-6'>
          <div className='h-16 w-16 bg-brand-light/20 dark:bg-brand/20 text-brand rounded-full flex items-center justify-center text-xl font-bold'>
            {(profile.full_name || profile.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>
              {profile.full_name || 'Unknown Affiliate'}
            </h1>
            <p className='text-slate-500 dark:text-slate-400'>
              {profile.email}
            </p>
            <div className='mt-2 flex items-center gap-2'>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                ${
                  profile.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : profile.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}>
                {profile.status}
              </span>
              <span className='text-xs text-slate-500 dark:text-slate-400'>
                Joined {new Date(profile.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <h3 className='text-lg font-medium text-slate-900 dark:text-white mb-4'>
          Performance Metrics
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {statCards.map((stat) => (
            <div
              key={stat.name}
              className='bg-slate-50 dark:bg-slate-800/50 rounded-lg p-5 border border-slate-100 dark:border-slate-700/50 flex items-center gap-4'>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                  {stat.name}
                </p>
                <p className='text-2xl font-bold text-slate-900 dark:text-white mt-1'>
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
