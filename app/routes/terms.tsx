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
          {/* Terms of Service */}
          <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-6'>
            Terms of Service
          </h1>
          <p className='text-sm text-slate-500 mb-8'>
            Effective Date: February 11, 2026
          </p>

          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50'>
              1. Subscription & Billing
            </h2>
            <ul className='list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400'>
              <li>
                <strong>Pricing:</strong> Access to Clariolane is $5 USD per
                month.
              </li>
              <li>
                <strong>Recurring Billing:</strong> Subscriptions automatically
                renew every 30 days. Your card or means of payment will be
                debited via PayStack unless you cancel.
              </li>
              <li>
                <strong>Cancellation:</strong> You may cancel at any time via
                your dashboard. To avoid being charged for the next period, you
                must cancel before your billing date.
              </li>
              <li>
                <strong>Fees:</strong> Clariolane covers all transaction fees
                associated with your subscription.
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50'>
              2. Referral Program
            </h2>
            <ul className='list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400'>
              <li>
                <strong>Earnings:</strong> You earn $1.50 for every unique user
                who signs up via your link and completes a paid subscription.
              </li>
              <li>
                <strong>One-Time Payment:</strong> Referral commissions are
                one-time only. You do not receive recurring commissions if the
                referred user renews their subscription.
              </li>
              <li>
                <strong>Minimum Withdrawal:</strong> You can request a payout
                once your "Referral Dashboard" balance reaches $10 USD.
                <br />
                <em className='text-xs text-slate-500 dark:text-slate-400 mt-1 block'>
                  N/B: You are responsible for the transaction fees.
                </em>
              </li>
              <li>
                <strong>Tracking:</strong> Referrals are tracked via your unique
                link. If a user signs up without using your link, we cannot
                manually credit you for that referral.
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50'>
              3. User Conduct
            </h2>
            <p className='text-slate-600 dark:text-slate-400 mb-4'>
              Users are prohibited from attempting to "game" the referral system
              through fake accounts or automated bots. Clariolane reserves the
              right to terminate accounts found engaging in fraudulent activity.
            </p>
          </section>

          <section className='mb-12'>
            <h2 className='text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50'>
              4. Limitation of Liability
            </h2>
            <p className='text-slate-600 dark:text-slate-400 mb-4'>
              Clariolane provides practice tools to improve reading. We do not
              guarantee specific academic or professional results. The service
              is provided "as is."
            </p>
          </section>

          <hr className='my-12 border-slate-200 dark:border-slate-800' />

          {/* Refund Policy */}
          <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-6'>
            Refund Policy
          </h1>
          <p className='text-sm text-slate-500 mb-8'>
            Last Updated: February 11, 2026
          </p>

          <p className='text-slate-600 dark:text-slate-400 mb-6'>
            At Clariolane, we strive to provide the best tools for speed reading
            and comprehension. Because our service is a digital product provided
            instantly upon payment, our refund policy is as follows:
          </p>

          <ul className='list-disc pl-6 space-y-4 text-slate-600 dark:text-slate-400 mb-12'>
            <li>
              <strong>Subscription Renewals:</strong> You may cancel your
              monthly subscription at any time. To avoid being charged for the
              next billing cycle, you must cancel at least 24 hours before your
              renewal date.
            </li>
            <li>
              <strong>Partial Months:</strong> We do not offer prorated refunds
              for mid-month cancellations. If you cancel early, you will
              continue to have full access to Clariolane features until the end
              of your current 30-day billing period.
            </li>
            <li>
              <strong>Refund Requests:</strong> Refunds are generally not
              granted once a billing cycle has been processed. However, if you
              believe there has been a technical error or an unauthorized
              charge, please contact us at support@clariolane.com within 7 days
              of the transaction, and we will investigate.
            </li>
            <li>
              <strong>Referral Earnings:</strong> Refunded subscriptions do not
              count toward referral earnings. If a referred user's payment is
              refunded or charged back, the $1.50 commission will be deducted
              from the referrer's dashboard.
            </li>
          </ul>

          <hr className='my-12 border-slate-200 dark:border-slate-800' />

          {/* Referral Program FAQ */}
          <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-6'>
            Referral Program FAQ
          </h1>

          <div className='space-y-6'>
            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                How do I make money with Clariolane?
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                Every user gets a unique referral link in their dashboard. Share
                this link with friends, students, or colleagues. When someone
                signs up and subscribes for $5, you earn $1.50.
              </p>
            </div>

            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                How do I track my earnings?
              </h3>
              <p className='text-slate-600 dark:text-slate-400 mb-2'>
                Your Referral Dashboard shows real-time stats, including:
              </p>
              <ul className='list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-400'>
                <li>Total clicks on your link.</li>
                <li>Number of successful (paid) subscribers.</li>
                <li>Your current withdrawable balance.</li>
              </ul>
            </div>

            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                When can I withdraw my money?
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                Once your balance hits the $10 minimum, a "Withdraw" button will
                be activated in your dashboard.
              </p>
            </div>

            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                How are payments sent?
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                Payouts are processed via Bank Transfer or PayStack Payout.
                Please ensure your payment details are correctly filled out in
                your profile settings. (Note: Payouts are usually processed
                within 3–5 business days).
              </p>
            </div>

            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                Is the commission recurring?
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                No. The $1.50 is a one-time reward for the initial signup. You
                do not receive additional payments when the user renews their
                subscription for the second month.
              </p>
            </div>

            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                What if my friend forgot to use my link?
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                Our system uses cookies to track your referrals. If a user does
                not use your specific link to sign up, the system cannot
                attribute the sale to you. We cannot manually add referrals to
                your account after a signup is complete.
              </p>
            </div>

            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                Active Account Requirement
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                To be eligible to receive referral payouts, you must maintain an
                active, paid subscription. Any referrals generated or completed
                during a period when your account is deactivated, expired, or
                cancelled will not be credited to your dashboard or count toward
                your earnings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
