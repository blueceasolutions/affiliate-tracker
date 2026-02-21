import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto'>
        <div className='mb-8'>
          <Link
            to='/'
            className='inline-flex items-center text-sm font-medium text-brand hover:text-brand-dark transition-colors'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Home
          </Link>
        </div>

        <div className='bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-12 prose dark:prose-invert prose-brand max-w-none'>
          <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-6'>
            Terms of Service & Privacy Policy
          </h1>

          <p className='text-sm text-slate-500 mb-8'>
            Last updated: February 2026
          </p>

          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50'>
              1. Introduction
            </h2>
            <p className='text-slate-600 dark:text-slate-400 mb-4'>
              Welcome to the Bluecea Affiliate Network. By signing up as an
              affiliate, you agree to be bound by these Terms of Service and our
              Privacy Policy.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50'>
              2. Affiliate Program Rules
            </h2>
            <ul className='list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400'>
              <li>You must be at least 18 years old to join.</li>
              <li>
                You must use ethical marketing practices—no spam or misleading
                claims.
              </li>
              <li>
                Commissions are paid upon successful conversion and subject to a
                holding period.
              </li>
              <li>The minimum withdrawal amount is $10.00 USD.</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50'>
              3. Privacy & Data Handling
            </h2>
            <p className='text-slate-600 dark:text-slate-400 mb-4'>
              We collect minimal information required to process payments and
              verify identity. We will not sell your data to third parties. We
              use secure cookies to accurately track referrals from your unique
              affiliate links.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50'>
              4. Termination
            </h2>
            <p className='text-slate-600 dark:text-slate-400'>
              Bluecea reserves the right to suspend or terminate any affiliate
              account found in violation of these terms, without prior notice or
              payout of pending balances resulting from fraudulent activity.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
