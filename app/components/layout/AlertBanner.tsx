import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  unreadNotificationsQuery,
  unreadNotificationsKey,
} from '../../api/queries/notifications'
import { markNotificationAsRead } from '../../lib/api'
import type { AffiliateNotification } from '../../types'
import { X, Bell } from 'lucide-react'

export function AlertBanner() {
  const queryClient = useQueryClient()
  const { data: notifications = [] } = useQuery({
    ...unreadNotificationsQuery,
    refetchInterval: 30000,
  })

  const [visibleNotification, setVisibleNotification] =
    useState<AffiliateNotification | null>(null)

  useEffect(() => {
    if (notifications.length > 0 && !visibleNotification) {
      setVisibleNotification(notifications[0])
    }
  }, [notifications, visibleNotification])

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [unreadNotificationsKey] })
    },
  })

  if (!visibleNotification || notifications.length === 0) return null

  const handleDismiss = () => {
    markAsReadMutation.mutate(visibleNotification.id)
    setVisibleNotification(null)
  }

  return (
    <div className='bg-brand dark:bg-brand-dark text-white px-4 py-3 sm:px-6 lg:px-8'>
      <div className='flex items-center justify-between flex-wrap gap-2 max-w-7xl mx-auto'>
        <div className='flex items-center flex-1'>
          <span className='flex p-2 rounded-lg bg-brand-light/20 dark:bg-brand/20'>
            <Bell className='h-5 w-5 text-white' aria-hidden='true' />
          </span>
          <p className='ml-3 font-medium truncate'>
            <span className='hidden md:inline'>
              {visibleNotification.title} -&nbsp;
            </span>
            <span>{visibleNotification.message}</span>
          </p>
        </div>
        <div className='order-2 shrink-0 sm:order-3 sm:ml-2'>
          <button
            type='button'
            className='-mr-1 flex p-2 rounded-md hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2 transition-colors'
            onClick={handleDismiss}>
            <span className='sr-only'>Dismiss</span>
            <X className='h-5 w-5 text-white' aria-hidden='true' />
          </button>
        </div>
      </div>
    </div>
  )
}
