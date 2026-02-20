import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router'
import { supabase } from './lib/supabase'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { AuthLayout } from './components/auth/AuthLayout'
import { GoogleSignInButton } from './components/auth/GoogleSignInButton'
import { FormDivider } from './components/auth/FormDivider'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className='w-full max-w-sm'>
        {/* Heading */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1'>
            Welcome back
          </h2>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            Please enter your details to sign in.
          </p>
        </div>

        {/* Google SSO */}
        <GoogleSignInButton />

        {/* Divider */}
        <div className='my-6'>
          <FormDivider />
        </div>

        {/* Email / Password form */}
        <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5'>
              Email address
            </label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'>
                  <rect x='2' y='4' width='20' height='16' rx='2' />
                  <path d='m2 7 10 7 10-7' />
                </svg>
              </span>
              <Input
                id='email'
                type='email'
                autoComplete='email'
                placeholder='you@example.com'
                className={`pl-9 ${errors.email ? 'border-red-400' : ''}`}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className='mt-1 text-xs text-red-500'>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className='flex items-center justify-between mb-1.5'>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-slate-700 dark:text-slate-300'>
                Password
              </label>
              <Link
                to='/forgot-password'
                className='text-sm font-medium text-brand hover:text-brand-dark transition-colors'>
                Forgot password?
              </Link>
            </div>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'>
                  <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
                  <path d='M7 11V7a5 5 0 0 1 10 0v4' />
                </svg>
              </span>
              <Input
                id='password'
                type='password'
                autoComplete='current-password'
                placeholder='••••••••'
                className={`pl-9 ${errors.password ? 'border-red-400' : ''}`}
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className='mt-1 text-xs text-red-500'>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember me */}
          <div className='flex items-center gap-2'>
            <input
              id='rememberMe'
              type='checkbox'
              className='h-4 w-4 rounded border-slate-300 accent-brand cursor-pointer'
              {...register('rememberMe')}
            />
            <label
              htmlFor='rememberMe'
              className='text-sm text-slate-600 dark:text-slate-400 cursor-pointer'>
              Remember me for 30 days
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className='rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-4 py-3'>
              <p className='text-sm text-red-700 dark:text-red-400'>{error}</p>
            </div>
          )}

          {/* Submit */}
          <Button
            type='submit'
            className='w-full h-11 text-sm font-semibold'
            isLoading={isLoading}>
            Sign in
          </Button>
        </form>

        {/* Sign up CTA */}
        <p className='mt-6 text-center text-sm text-slate-600 dark:text-slate-400'>
          Don't have an account?{' '}
          <Link
            to='/signup'
            className='font-semibold text-brand hover:text-brand-dark transition-colors'>
            Sign up for free
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
