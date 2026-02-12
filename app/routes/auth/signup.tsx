import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

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
          data: {
            full_name: data.fullName,
          },
        },
      })

      if (error) {
        throw error
      }

      // If email confirmation is disabled, we can redirect directly.
      // Or show a message "Check your email"
      // For this MVP, assuming auto-confirm or redirect handled by Supabase or just redirect to dashboard/login
      // If session is established immediately (auto confirm off or enabled but "Enable email confirmations" is off on supabase)

      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session) {
        navigate('/dashboard')
      } else {
        // Email confirmation required case
        navigate('/') // or show a success message
        alert('Please check your email to confirm your account.')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-slate-100'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-bold tracking-tight text-slate-900'>
            Create an account
          </h2>
          <p className='mt-2 text-sm text-slate-600'>
            Join the affiliate program today
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4 rounded-md shadow-sm'>
            <div>
              <label htmlFor='fullName' className='sr-only'>
                Full Name
              </label>
              <Input
                id='fullName'
                type='text'
                placeholder='Full Name'
                className={errors.fullName ? 'border-red-500' : ''}
                {...register('fullName')}
              />
              {errors.fullName && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor='email-address' className='sr-only'>
                Email address
              </label>
              <Input
                id='email-address'
                type='email'
                autoComplete='email'
                placeholder='Email address'
                className={errors.email ? 'border-red-500' : ''}
                {...register('email')}
              />
              {errors.email && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <Input
                id='password'
                type='password'
                autoComplete='new-password'
                placeholder='Password'
                className={errors.password ? 'border-red-500' : ''}
                {...register('password')}
              />
              {errors.password && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor='confirmPassword' className='sr-only'>
                Confirm Password
              </label>
              <Input
                id='confirmPassword'
                type='password'
                autoComplete='new-password'
                placeholder='Confirm Password'
                className={errors.confirmPassword ? 'border-red-500' : ''}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className='rounded-md bg-red-50 p-4'>
              <div className='flex'>
                <div className='ml-3'>
                  <h3 className='text-sm font-medium text-red-800'>{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <Button type='submit' className='w-full' isLoading={isLoading}>
              Sign up
            </Button>
          </div>

          <div className='text-center text-sm'>
            <span className='text-slate-600'>Already have an account? </span>
            <Link
              to='/'
              className='font-medium text-blue-600 hover:text-blue-500'>
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
