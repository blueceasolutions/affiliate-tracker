import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useAuth } from '../../context/AuthContext'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  // We might not need useAuth here directly if we just use supabase.auth.signInWithPassword
  // but let's import it to be consistent with context usage if needed later.

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        throw error
      }

      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-slate-100'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-bold tracking-tight text-slate-900'>
            Welcome back
          </h2>
          <p className='mt-2 text-sm text-slate-600'>
            Sign in to access your dashboard
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-4 rounded-md shadow-sm'>
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
                autoComplete='current-password'
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
              Sign in
            </Button>
          </div>

          <div className='text-center text-sm'>
            <span className='text-slate-600'>Don't have an account? </span>
            <Link
              to='/signup'
              className='font-medium text-blue-600 hover:text-blue-500'>
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
