import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className='text-sm text-slate-500 mb-8'>
            Effective Date: February 11, 2026
          </p>

          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50'>
              Overview
            </h2>
            <p className='text-slate-600 dark:text-slate-400 mb-4'>
              At Clariolane, we respect your privacy. This policy explains what
              data we collect and how we use it to provide our speed reading and
              comprehension services.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50'>
              Data We Collect
            </h2>
            <ul className='list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400'>
              <li>
                <strong>Account Information:</strong> Name and email address
                (via direct signup or SSO providers like Google/Apple).
              </li>
              <li>
                <strong>Usage Data:</strong> Practice test scores, Words Per
                Minute (WPM) progress, and comprehension levels.
              </li>
              <li>
                <strong>Referral Data:</strong> Clicks on your unique referral
                link and successful conversions.
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50'>
              Payment Processing
            </h2>
            <p className='text-slate-600 dark:text-slate-400 mb-4'>
              We use PayStack to process all payments. Clariolane never sees or
              stores your credit/debit card details. All financial data is
              handled securely by PayStack according to their privacy standards.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50'>
              How We Use Your Data
            </h2>
            <ul className='list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400'>
              <li>To manage your account and track your reading progress.</li>
              <li>To process your monthly subscription.</li>
              <li>To calculate and pay out referral earnings.</li>
              <li>To send essential service updates or password resets.</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50'>
              Third-Party Sharing
            </h2>
            <p className='text-slate-600 dark:text-slate-400 mb-4'>
              We do not sell your data. We only share information with third
              parties (like PayStack for payments or your SSO provider)
              necessary to run the service.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
