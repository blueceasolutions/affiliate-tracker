import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { getWallet, getStats } from '../../lib/api'
import {
  DollarSign,
  MousePointer,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { Link } from 'react-router'

export default function DashboardOverview() {
  const { user, status } = useAuth()

  const { data: wallet, isLoading: isLoadingWallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: getWallet,
  })

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
  })

  const isLoading = isLoadingWallet || isLoadingStats

  const statsData = [
    {
      name: 'Available Balance',
      value: wallet ? `$${wallet.available_balance.toFixed(2)}` : '$0.00',
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      name: 'Total Earnings',
      value: wallet ? `$${wallet.total_earned.toFixed(2)}` : '$0.00',
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      name: 'Total Conversions',
      value: stats?.conversions || 0,
      icon: ShoppingCart,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      name: 'Total Clicks',
      value: stats?.clicks || 0,
      icon: MousePointer,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
    },
  ]

  return (
    <div className='space-y-8'>
      {status === 'pending' && (
        <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4 shadow-sm'>
          <div className='flex'>
            <div className='shrink-0'>
              <AlertCircle
                className='h-5 w-5 text-yellow-500'
                aria-hidden='true'
              />
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-yellow-800 focus:outline-none'>
                Account Pending Approval
              </h3>
              <div className='mt-2 text-sm text-yellow-700'>
                <p>
                  Your affiliate account is currently under review by an
                  administrator. You will be able to access promotion tools
                  inside the "Products" tab once activated.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50'>
          Dashboard
        </h1>
        <p className='text-slate-500 dark:text-slate-400'>
          Welcome back, {user?.user_metadata?.full_name || user?.email}. Here's
          how you are performing.
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {statsData.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className='flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm'>
              <div
                className={`mr-4 flex h-12 w-12 items-center justify-center rounded-full ${stat.bg}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                  {stat.name}
                </p>
                {isLoading ? (
                  <div className='h-8 w-24 animate-pulse rounded bg-slate-100 dark:bg-slate-800 mt-1' />
                ) : (
                  <p className='text-2xl font-bold text-slate-900 dark:text-slate-50'>
                    {stat.value}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity or detailed charts could go here */}
      <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm'>
        <h3 className='text-lg font-medium text-slate-900 dark:text-slate-50 mb-4'>
          Quick Actions
        </h3>
        <div className='flex gap-4'>
          {status === 'active' ? (
            <Link
              to='/affiliate/products'
              className='inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
              Promote Products
            </Link>
          ) : (
            <button
              disabled
              className='inline-flex items-center justify-center rounded-md bg-slate-300 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-white dark:text-slate-400 shadow-sm cursor-not-allowed'>
              Promote Products
            </button>
          )}
          <Link
            to='/affiliate/wallet'
            className='inline-flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
            View Wallet
          </Link>
        </div>
      </div>
    </div>
  )
}
