import { Link, useLocation } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard,
  ShoppingBag,
  Wallet,
  Users,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '../../lib/utils'

export function Sidebar() {
  const { role } = useAuth()
  const location = useLocation()

  const affiliateLinks = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/affiliate/products', icon: ShoppingBag },
    { name: 'Wallet', href: '/affiliate/wallet', icon: Wallet },
  ]

  const adminLinks = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Withdrawals', href: '/admin/withdrawals', icon: Wallet },
    { name: 'Affiliates', href: '/admin/affiliates', icon: Users },
  ]

  const links = role === 'admin' ? adminLinks : affiliateLinks

  return (
    <div className='flex h-full w-64 flex-col bg-white border-r border-slate-200'>
      <div className='flex h-16 items-center justify-center border-b border-slate-200 px-4'>
        <h1 className='text-xl font-bold text-blue-600'>Bluecea Affiliate</h1>
      </div>
      <div className='flex-1 overflow-y-auto py-4'>
        <nav className='space-y-1 px-2'>
          {links.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname === link.href
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                )}>
                <Icon
                  className={cn(
                    'mr-3 h-5 w-5 shrink-0 transition-colors',
                    isActive
                      ? 'text-blue-700'
                      : 'text-slate-400 group-hover:text-slate-500',
                  )}
                />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className='border-t border-slate-200 p-4'>
        {/* Footer or extra links could go here */}
      </div>
    </div>
  )
}
