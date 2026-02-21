import { ShieldAlert, User, Mail } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export default function AdminSettings() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return null
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      return data
    },
  })

  return (
    <div className='space-y-8 animate-in fade-in duration-500'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50'>
            Admin Settings
          </h1>
          <p className='text-slate-500 dark:text-slate-400 mt-1'>
            Manage your admin account preferences.
          </p>
        </div>
      </div>

      <section className='space-y-4'>
        <h2 className='text-xl font-semibold text-slate-900 dark:text-slate-50'>
          Profile Information
        </h2>
        <div className='rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm'>
          <div className='grid gap-6 md:grid-cols-2'>
            <div>
              <label className='block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1'>
                Full Name
              </label>
              <div className='flex items-center text-slate-900 dark:text-slate-50 font-medium bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-lg'>
                <User className='w-4 h-4 mr-2 text-slate-400' />
                {profile?.full_name || 'Admin User'}
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1'>
                Email Address
              </label>
              <div className='flex items-center text-slate-900 dark:text-slate-50 font-medium bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-lg'>
                <Mail className='w-4 h-4 mr-2 text-slate-400' />
                {profile?.email || 'admin@bluecea.com'}
              </div>
            </div>
          </div>
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
                Permanently delete your admin account. This action requires
                super-admin privileges.
              </p>
            </div>
            <Button
              variant='danger'
              onClick={() => alert('Action restricted to super-admins only.')}>
              Delete Account
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
