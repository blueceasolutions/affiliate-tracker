import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { getWallet, getStats } from '../../lib/api'
import {
  DollarSign,
  MousePointer,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react'
import { Link } from 'react-router'

export default function DashboardOverview() {
  const { user } = useAuth()

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
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      name: 'Total Earnings',
      value: wallet ? `$${wallet.total_earned.toFixed(2)}` : '$0.00',
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      name: 'Total Conversions',
      value: stats?.conversions || 0,
      icon: ShoppingCart,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      name: 'Total Clicks',
      value: stats?.clicks || 0,
      icon: MousePointer,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
  ]

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
          Dashboard
        </h1>
        <p className='text-slate-500'>
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
              className='flex items-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
              <div
                className={`mr-4 flex h-12 w-12 items-center justify-center rounded-full ${stat.bg}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className='text-sm font-medium text-slate-500'>
                  {stat.name}
                </p>
                {isLoading ? (
                  <div className='h-8 w-24 animate-pulse rounded bg-slate-100 mt-1' />
                ) : (
                  <p className='text-2xl font-bold text-slate-900'>
                    {stat.value}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity or detailed charts could go here */}
      <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
        <h3 className='text-lg font-medium text-slate-900 mb-4'>
          Quick Actions
        </h3>
        <div className='flex gap-4'>
          <Link
            to='/affiliate/products'
            className='inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
            Promote Products
          </Link>
          <Link
            to='/affiliate/wallet'
            className='inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
            View Wallet
          </Link>
        </div>
      </div>
    </div>
  )
}
