import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { Button } from './button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
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
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 text-center'>
      <div
        className='fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity'
        onClick={onClose}
        aria-hidden='true'
        ref={overlayRef}
      />

      <div className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
        <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
          <div className='flex items-center justify-between mb-4'>
            <h3
              className='text-lg font-semibold leading-6 text-slate-900'
              id='modal-title'>
              {title}
            </h3>
            <div className='ml-3 flex h-7 items-center'>
              <button
                type='button'
                className='relative rounded-md bg-white text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                onClick={onClose}>
                <span className='sr-only'>Close</span>
                <X className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>
          </div>
          <div className='mt-2'>{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
