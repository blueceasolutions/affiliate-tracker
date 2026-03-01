import { Link } from 'react-router'
import { ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react'

export default function HowItWorksPage() {
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
          <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-2'>
            How to Join the Blucea Affiliate Program
          </h1>
          <p className='text-lg text-slate-600 dark:text-slate-400 mb-8'>
            Earn commissions by sharing the power of speed reading with
            Clariolane. Follow these steps to set up your account and start
            earning today:
          </p>

          <div className='space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent'>
            {/* Step 1 */}
            <div className='relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active'>
              <div className='flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-[.is-active]:bg-brand group-[.is-active]:text-white group-[.is-active]:shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2'>
                <span className='font-bold text-sm'>1</span>
              </div>
              <div className='w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm'>
                <h3 className='font-bold text-slate-900 dark:text-slate-50 text-lg mb-1'>
                  Secure Your Active Subscription
                </h3>
                <p className='text-slate-500 dark:text-slate-400 text-sm'>
                  Before joining the affiliate program, you must have an Active
                  Paid Subscription to Clariolane.
                </p>
                <div className='mt-3 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-md border border-slate-100 dark:border-slate-700/50'>
                  <AlertTriangle className='h-4 w-4 shrink-0 text-amber-500' />
                  <p>
                    <strong>Note:</strong> If your subscription is cancelled,
                    expired, or inactive, the system will not credit any
                    commissions to your account.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className='relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active'>
              <div className='flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-[.is-active]:bg-brand group-[.is-active]:text-white group-[.is-active]:shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2'>
                <span className='font-bold text-sm'>2</span>
              </div>
              <div className='w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm'>
                <h3 className='font-bold text-slate-900 dark:text-slate-50 text-lg mb-1'>
                  Register for the Affiliate Portal
                </h3>
                <p className='text-slate-500 dark:text-slate-400 text-sm'>
                  Visit the Blucea Affiliate Link to create your affiliate
                  account.
                </p>
                <div className='mt-3 flex items-start gap-2 text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-2 rounded-md border border-red-100 dark:border-red-900/30'>
                  <AlertTriangle className='h-4 w-4 shrink-0 text-red-600 dark:text-red-500' />
                  <p>
                    <strong>CRITICAL:</strong> You must sign up using the same
                    email address you used for your Clariolane subscription. Our
                    system syncs these accounts to verify your active status
                    before approving commissions.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className='relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active'>
              <div className='flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-[.is-active]:bg-brand group-[.is-active]:text-white group-[.is-active]:shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2'>
                <span className='font-bold text-sm'>3</span>
              </div>
              <div className='w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm'>
                <h3 className='font-bold text-slate-900 dark:text-slate-50 text-lg mb-1'>
                  Wait for Admin Approval
                </h3>
                <p className='text-slate-500 dark:text-slate-400 text-sm mb-2'>
                  Once you submit your registration, your account will enter a
                  review state. You will see a message: "Account Pending
                  Approval."
                </p>
                <ul className='text-sm text-slate-500 dark:text-slate-400 list-disc pl-4 space-y-1'>
                  <li>
                    During this time, the "Promote Products" button will be
                    grayed out.
                  </li>
                  <li>
                    Our team typically reviews and activates accounts within
                    24–48 hours.
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className='relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active'>
              <div className='flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-[.is-active]:bg-brand group-[.is-active]:text-white group-[.is-active]:shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2'>
                <span className='font-bold text-sm'>4</span>
              </div>
              <div className='w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm'>
                <h3 className='font-bold text-slate-900 dark:text-slate-50 text-lg mb-1'>
                  Select Your Product
                </h3>
                <p className='text-slate-500 dark:text-slate-400 text-sm mb-2'>
                  Once approved, the "Promote Products" button will become
                  active.
                </p>
                <ol className='text-sm text-slate-500 dark:text-slate-400 list-decimal pl-4 space-y-1'>
                  <li>Click Promote Products.</li>
                  <li>
                    Select Clariolane from the list of available products.
                  </li>
                </ol>
              </div>
            </div>

            {/* Step 5 */}
            <div className='relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active'>
              <div className='flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-[.is-active]:bg-brand group-[.is-active]:text-white group-[.is-active]:shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2'>
                <span className='font-bold text-sm'>5</span>
              </div>
              <div className='w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm'>
                <h3 className='font-bold text-slate-900 dark:text-slate-50 text-lg mb-1'>
                  Generate & Share Your Link
                </h3>
                <p className='text-slate-500 dark:text-slate-400 text-sm mb-2'>
                  Click on "Generate Link." The system will provide a unique
                  referral URL.
                </p>
                <ul className='text-sm text-slate-500 dark:text-slate-400 list-disc pl-4 space-y-1'>
                  <li>
                    Copy this link and share it with friends, family, or your
                    social media audience.
                  </li>
                  <li>
                    When someone clicks your link and completes their $5 (or
                    ₦2,900) subscription, you earn your commission!
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 6 */}
            <div className='relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active'>
              <div className='flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-[.is-active]:bg-brand group-[.is-active]:text-white group-[.is-active]:shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2'>
                <span className='font-bold text-sm'>6</span>
              </div>
              <div className='w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm'>
                <h3 className='font-bold text-slate-900 dark:text-slate-50 text-lg mb-1'>
                  Track Your Conversions
                </h3>
                <p className='text-slate-500 dark:text-slate-400 text-sm mb-2'>
                  To see your success in real-time:
                </p>
                <ul className='text-sm text-slate-500 dark:text-slate-400 list-disc pl-4 space-y-1'>
                  <li>Visit your Conversions Page.</li>
                  <li>
                    Here, you can view all successful referrals and the exact
                    earnings generated from each.
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 7 */}
            <div className='relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active'>
              <div className='flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-[.is-active]:bg-brand group-[.is-active]:text-white group-[.is-active]:shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2'>
                <span className='font-bold text-sm'>7</span>
              </div>
              <div className='w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm'>
                <h3 className='font-bold text-slate-900 dark:text-slate-50 text-lg mb-1'>
                  Monitor Your Dashboard
                </h3>
                <p className='text-slate-500 dark:text-slate-400 text-sm'>
                  Your total withdrawable balance will reflect on your main
                  Affiliate Dashboard. Remember, payouts are processed between
                  the 25th and 30th of every month once you hit the $10 minimum.
                </p>
              </div>
            </div>
          </div>

          <div className='mt-12 bg-amber-50 dark:bg-amber-900/10 p-6 rounded-xl border border-amber-200 dark:border-amber-800/30'>
            <div className='flex items-center gap-2 mb-4'>
              <Lightbulb className='h-5 w-5 text-amber-500' />
              <h3 className='font-bold text-slate-900 dark:text-slate-50 text-lg'>
                Quick Summary for Success
              </h3>
            </div>
            <ul className='space-y-3'>
              <li className='flex items-start gap-2 text-slate-600 dark:text-slate-400'>
                <CheckCircle2 className='h-5 w-5 text-amber-500 shrink-0' />
                <span>
                  <strong>Email Match:</strong> Use the same email for
                  Clariolane and Blucea Affiliate.
                </span>
              </li>
              <li className='flex items-start gap-2 text-slate-600 dark:text-slate-400'>
                <CheckCircle2 className='h-5 w-5 text-amber-500 shrink-0' />
                <span>
                  <strong>Stay Active:</strong> Do not cancel your Clariolane
                  subscription, or you will forfeit incoming commissions.
                </span>
              </li>
              <li className='flex items-start gap-2 text-slate-600 dark:text-slate-400'>
                <CheckCircle2 className='h-5 w-5 text-amber-500 shrink-0' />
                <span>
                  <strong>Official Rules:</strong> For full details on fees and
                  policies, read our{' '}
                  <Link to='/terms' className='text font-semibold underline'>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to='/privacy' className='text font-semibold underline'>
                    Privacy Policy
                  </Link>
                  .
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
