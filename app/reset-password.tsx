import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate } from 'react-router'
import { supabase } from './lib/supabase'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { AuthLayout } from './components/auth/AuthLayout'

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

/**
 * ResetPassword — allows the user to set a new password after clicking
 * the email reset link (Supabase establishes the session automatically).
 * Single responsibility: update user password only.
 */
export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) throw error

      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className='w-full max-w-sm'>
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1'>
            Set new password
          </h2>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            Must be at least 6 characters.
          </p>
        </div>

        <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
          {/* New password */}
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5'>
              New password
            </label>
            <Input
              id='password'
              type='password'
              autoComplete='new-password'
              placeholder='••••••••'
              className={errors.password ? 'border-red-400' : ''}
              {...register('password')}
            />
            {errors.password && (
              <p className='mt-1 text-xs text-red-500'>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5'>
              Confirm new password
            </label>
            <Input
              id='confirmPassword'
              type='password'
              autoComplete='new-password'
              placeholder='••••••••'
              className={errors.confirmPassword ? 'border-red-400' : ''}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className='mt-1 text-xs text-red-500'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {error && (
            <div className='rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-4 py-3'>
              <p className='text-sm text-red-700 dark:text-red-400'>{error}</p>
            </div>
          )}

          <Button
            type='submit'
            className='w-full h-11 text-sm font-semibold'
            isLoading={isLoading}>
            Reset password
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
}
