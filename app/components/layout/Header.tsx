import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/button'
import { LogOut, User } from 'lucide-react'

export function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className='flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6'>
      <div className='flex items-center'>
        {/* Breadcrumbs or page title could go here */}
      </div>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2 text-sm text-slate-700'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-slate-100'>
            <User className='h-4 w-4 text-slate-500' />
          </div>
          <span className='hidden sm:inline-block font-medium'>
            {user?.user_metadata?.full_name || user?.email}
          </span>
        </div>
        <Button variant='ghost' size='sm' onClick={signOut} title='Sign out'>
          <LogOut className='h-4 w-4' />
          <span className='sr-only'>Sign out</span>
        </Button>
      </div>
    </header>
  )
}
