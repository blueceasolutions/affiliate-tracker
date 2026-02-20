import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link } from 'react-router'
import { supabase } from './lib/supabase'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { AuthLayout } from './components/auth/AuthLayout'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setSent(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className='w-full max-w-sm'>
        {sent ? (
          /* Success state */
          <div className='text-center'>
            <div
              className='w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6'
              style={{ background: 'rgba(76,63,138,0.1)' }}>
              <svg
                width='28'
                height='28'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#4c3f8a'
                strokeWidth='2'>
                <rect x='2' y='4' width='20' height='16' rx='2' />
                <path d='m2 7 10 7 10-7' />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2'>
              Check your email
            </h2>
            <p className='text-sm text-slate-500 dark:text-slate-400 mb-1'>
              We sent a password reset link to
            </p>
            <p className='text-sm font-semibold text-slate-800 dark:text-slate-200 mb-8'>
              {getValues('email')}
            </p>
            <p className='text-xs text-slate-400 dark:text-slate-500'>
              Didn't receive it?{' '}
              <button
                type='button'
                onClick={() => setSent(false)}
                className='text-brand hover:text-brand-dark font-medium transition-colors'>
                Try again
              </button>
            </p>
          </div>
        ) : (
          /* Form state */
          <>
            <div className='mb-8'>
              <h2 className='text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1'>
                Forgot password?
              </h2>
              <p className='text-sm text-slate-500 dark:text-slate-400'>
                No worries — we'll send you reset instructions.
              </p>
            </div>

            <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5'>
                  Email address
                </label>
                <Input
                  id='email'
                  type='email'
                  autoComplete='email'
                  placeholder='you@example.com'
                  className={errors.email ? 'border-red-400' : ''}
                  {...register('email')}
                />
                {errors.email && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {error && (
                <div className='rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-4 py-3'>
                  <p className='text-sm text-red-700 dark:text-red-400'>
                    {error}
                  </p>
                </div>
              )}

              <Button
                type='submit'
                className='w-full h-11 text-sm font-semibold'
                isLoading={isLoading}>
                Send reset link
              </Button>
            </form>

            <p className='mt-6 text-center text-sm text-slate-600 dark:text-slate-400'>
              Remember it?{' '}
              <Link
                to='/'
                className='font-semibold text-brand hover:text-brand-dark transition-colors'>
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  )
}
