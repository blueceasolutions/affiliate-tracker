import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { SidebarContent } from './Sidebar'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className='fixed inset-0 z-50 flex'>
      <div
        className='fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity'
        onClick={onClose}
        aria-hidden='true'
        ref={overlayRef}
      />

      <div className='relative flex flex-1 w-full max-w-xs'>
        <div className='absolute top-0 right-0 -mr-12 pt-2'>
          {/* Close button could go here, but clicking overlay also works */}
        </div>

        <SidebarContent onLinkClick={onClose} />
      </div>
      <div className='shrink-0 w-14' aria-hidden='true'>
        {/* Dummy element to force sidebar to not take full width if we wanted, 
            but max-w-xs handles it. Keeping for layout if needed. */}
      </div>
    </div>,
    document.body,
  )
}
