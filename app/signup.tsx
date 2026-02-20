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

const signupSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type SignupFormValues = z.infer<typeof signupSchema>

export default function Signup() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.fullName },
        },
      })

      if (error) throw error

      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session) {
        navigate('/dashboard')
      } else {
        navigate('/')
        alert('Please check your email to confirm your account.')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup')
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
            Create an account
          </h2>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            Join the Bluecea Affiliate Network today.
          </p>
        </div>

        {/* Google SSO */}
        <GoogleSignInButton
          redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard`}
        />

        {/* Divider */}
        <div className='my-6'>
          <FormDivider label='or sign up with email' />
        </div>

        {/* Form */}
        <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
          {/* Full name */}
          <div>
            <label
              htmlFor='fullName'
              className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5'>
              Full name
            </label>
            <Input
              id='fullName'
              type='text'
              placeholder='Jane Doe'
              className={errors.fullName ? 'border-red-400' : ''}
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className='mt-1 text-xs text-red-500'>
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5'>
              Password
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
              className='block text-sm font-medium text-slate-700 mb-1.5'>
              Confirm password
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
            Create account
          </Button>
        </form>

        {/* Sign in CTA */}
        <p className='mt-6 text-center text-sm text-slate-600 dark:text-slate-400'>
          Already have an account?{' '}
          <Link
            to='/'
            className='font-semibold text-brand hover:text-brand-dark transition-colors'>
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
