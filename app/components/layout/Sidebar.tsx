import { Link, useLocation } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { getAdminPendingCounts } from '../../lib/api'
import {
  LayoutDashboard,
  ShoppingBag,
  Wallet,
  Users,
  Settings,
  LogOut,
  Link as LinkIcon,
} from 'lucide-react'
import { cn } from '../../lib/utils'

export function SidebarContent() {
  const { user, role, signOut } = useAuth()
  const location = useLocation()

  const { data: pendingCounts } = useQuery({
    queryKey: ['adminPendingCounts'],
    queryFn: getAdminPendingCounts,
    enabled: role === 'admin',
    refetchInterval: 60000, // Refresh every minute
  })

  const affiliateLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/affiliate/products', icon: ShoppingBag },
    { name: 'Payouts', href: '/affiliate/wallet', icon: Wallet },
  ]

  const adminLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    {
      name: 'Withdrawals',
      href: '/admin/withdrawals',
      icon: Wallet,
      badge: pendingCounts?.withdrawals,
    },
    {
      name: 'Affiliates',
      href: '/admin/affiliates',
      icon: Users,
      badge: pendingCounts?.affiliates,
    },
  ]

  const links = role === 'admin' ? adminLinks : affiliateLinks

  // Extract initials for fallback avatar
  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  const userFullName = user?.user_metadata?.full_name || 'User'
  const userEmail = user?.email || ''

  return (
    <div className='flex h-full w-64 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800'>
      {/* 1. Brand Logo Area */}
      <div className='flex h-20 items-center px-6 shrink-0'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-brand dark:bg-brand-dark shadow-sm shrink-0'>
            {/* Using LinkIcon as a close approximation to the chain-link icon in the design */}
            <LinkIcon className='h-5 w-5 text-white' />
          </div>
          <div className='flex flex-col'>
            <span className='text-[17px] font-bold text-slate-900 dark:text-slate-100 leading-tight'>
              Bluecea
            </span>
            <span className='text-[13px] font-medium text-slate-500 dark:text-slate-400 leading-tight'>
              Affiliate Portal
            </span>
          </div>
        </div>
      </div>

      {/* Separator under header like in design (implied by layout, but let's add a subtle one) */}
      <div className='px-6'>
        <div className='h-px w-full bg-slate-100 dark:bg-slate-800/50 mb-6'></div>
      </div>

      {/* 2. Main Navigation Area */}
      <div className='flex-1 overflow-y-auto px-4'>
        <nav className='flex flex-col gap-1.5'>
          {links.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname === link.href
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'group flex items-center rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors',
                  isActive
                    ? 'text-slate-900 dark:text-slate-100'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50',
                )}>
                <Icon
                  className={cn(
                    'mr-3 h-[18px] w-[18px] shrink-0 transition-colors',
                    isActive
                      ? 'text-brand dark:text-brand-muted'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400',
                  )}
                  strokeWidth={2.5}
                />
                <span className='flex-1'>{link.name}</span>
                {!!(link as any).badge && (
                  <span className='ml-auto inline-flex items-center justify-center rounded-full bg-brand text-white px-2 py-0.5 text-xs font-medium leading-none'>
                    {(link as any).badge}
                  </span>
                )}
              </Link>
            )
          })}

          {/* Separator above Settings */}
          <div className='my-3 h-px w-full bg-slate-100 dark:bg-slate-800/50'></div>

          {/* 3. Settings Link */}
          <Link
            to='/settings'
            className={cn(
              'group flex items-center rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors',
              location.pathname === '/settings'
                ? 'bg-brand/10 dark:bg-brand/20 text-brand dark:text-brand-muted'
                : 'bg-slate-100/80 dark:bg-slate-800 text-brand-dark dark:text-brand-light hover:bg-slate-200 dark:hover:bg-slate-700',
            )}>
            <Settings
              className='mr-3 h-[18px] w-[18px] shrink-0 text-brand-dark dark:text-brand-light'
              strokeWidth={2.5}
            />
            Settings
          </Link>
        </nav>
      </div>

      {/* 4. User Profile Footer */}
      <div className='p-4 mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3 min-w-0'>
            {/* Avatar block */}
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 font-semibold shadow-sm overflow-hidden'>
              {/* As a placeholder for the illustrated avatar in the image, we use an initials fallback with an orange tint (matching the image aesthetic) */}
              {user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={userFullName}
                  className='h-full w-full object-cover'
                />
              ) : (
                getInitials(userFullName)
              )}
            </div>

            <div className='flex flex-col min-w-0 pr-2'>
              <span className='truncate text-[14px] font-semibold text-slate-900 dark:text-slate-100'>
                {userFullName}
              </span>
              <span className='truncate text-[12px] font-medium text-slate-500 dark:text-slate-400'>
                {userEmail}
              </span>
            </div>
          </div>

          <button
            onClick={signOut}
            title='Sign out'
            className='flex shrink-0 items-center justify-center p-2 rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'>
            {/* Using LogOut icon formatted to look like the exit arrow in the image */}
            <LogOut className='h-[18px] w-[18px] rotate-0' strokeWidth={2.5} />
            <span className='sr-only'>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <div className='hidden md:flex h-full'>
      <SidebarContent />
    </div>
  )
}
