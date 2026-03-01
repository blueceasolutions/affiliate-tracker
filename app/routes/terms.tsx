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
          <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-2'>
            BLUECEA AFFILIATE PROGRAM TERMS OF SERVICE
          </h1>
          <h2 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-6'>
            Terms of Service
          </h2>
          <p className='text-sm text-slate-500 mb-2'>
            Effective Date: February 11, 2026
          </p>
          <p className='text-sm text-slate-500 font-semibold mb-8 border-l-2 pl-3 border-brand'>
            PRODUCT: CLARIOLANE
          </p>

          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50'>
              1. Subscription & Billing
            </h2>
            <ul className='list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400'>
              <li>
                <strong>Pricing:</strong> Access to Clariolane is $5.00 USD per
                month for international users. For users within the African
                continent, a localized rate of ₦2,900 NGN applies.
              </li>
              <li>
                <strong>Recurring Billing:</strong> Subscriptions automatically
                renew every 30 days via PayStack unless cancelled.
              </li>
              <li>
                <strong>Cancellation:</strong> You may cancel at any time via
                your dashboard. To avoid being charged for the next period, you
                must cancel at least 24 hours before your billing date.
              </li>
              <li>
                <strong>Affiliate Maintenance Fee:</strong> A 4% maintenance fee
                is deducted from the base plan fee before referral commissions
                are calculated.
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50'>
              2. Referral Program & Earnings
            </h2>
            <ul className='list-disc pl-6 space-y-4 text-slate-600 dark:text-slate-400'>
              <li>
                <strong>Commission Structure:</strong> Affiliates earn a 30%
                commission on the "Net Plan Fee" (Base Plan Fee minus 4%
                Maintenance Fee).
                <ul className='list-[circle] pl-6 mt-2 space-y-1 text-sm'>
                  <li>
                    International ($): $5.00 - 4% ($0.20) = $4.80 Net.
                    Commission: $1.44 USD.
                  </li>
                  <li>
                    African (₦): ₦2,900 - 4% (₦116) = ₦2,784 Net. Commission:
                    ₦835.20.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Currency Conversion:</strong> All earnings from Naira
                (₦) transactions are converted to USD ($) at the current market
                rate at the time of the transaction and added to your Available
                Balance.
              </li>
              <li>
                <strong>One-Time Payment:</strong> Commissions are one-time only
                for the initial signup. No recurring commissions are paid on
                renewals.
              </li>
              <li>
                <strong>Minimum Withdrawal:</strong> The minimum withdrawal
                limit is $10.00 USD. You can request a payout once your{' '}
                <a
                  href='https://affiliate.bluecea.com/affiliate/wallet'
                  className='text-brand hover:underline'
                  target='_blank'
                  rel='noreferrer'>
                  "Wallet"
                </a>{' '}
                balance reaches $10 USD.
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
              3. Payout Schedule & Fees
            </h2>
            <ul className='list-disc pl-6 space-y-4 text-slate-600 dark:text-slate-400'>
              <li>
                <strong>Monthly Payout Window:</strong> To ensure administrative
                accuracy, all pending withdrawals are processed and paid out
                between the 25th and 30th of each month.
              </li>
              <li>
                <strong>Transaction Fees:</strong>
                <ul className='list-[circle] pl-6 mt-2 space-y-2 text-sm'>
                  <li>
                    <strong>International Withdrawals:</strong> Users are
                    responsible for all gas/transaction fees. These are deducted
                    from the payout.
                    <p className='mt-1 pl-4 border-l-2 border-slate-200 dark:border-slate-700 italic'>
                      Transparency: Upon approval, a transaction receipt is
                      emailed to the user showing the gross amount, any
                      applicable gas fees, and the final net amount sent.
                    </p>
                  </li>
                  <li>
                    <strong>African Withdrawals (Naira):</strong> Blucea
                    Solutions Limited covers the transaction fees for localized
                    payouts to African bank accounts.
                  </li>
                </ul>
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50'>
              4. Active Account Requirement
            </h2>
            <p className='text-slate-600 dark:text-slate-400 mb-4'>
              <strong>Strict Policy:</strong> To earn or accumulate referral
              bonuses, you must maintain an Active Paid Subscription.
            </p>
            <ul className='list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400'>
              <li>
                <strong>Forfeiture on Cancellation:</strong> Once you cancel
                your subscription, you immediately forfeit your right to earn in
                the referral program. Any conversions occurring after the moment
                of cancellation—even if your current billing period has not yet
                expired—will not be credited and are permanently forfeited.
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50'>
              5. User Conduct
            </h2>
            <p className='text-slate-600 dark:text-slate-400 mb-4'>
              Users are prohibited from attempting to "game" the referral system
              through fake accounts or automated bots. Clariolane reserves the
              right to terminate accounts found engaging in fraudulent activity.
            </p>
          </section>

          <section className='mb-12'>
            <h2 className='text-xl font-semibold mb-4 text-slate-900 dark:text-slate-50'>
              6. Limitation of Liability
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
              <strong>Refund Requests:</strong> Refunds are generally not
              granted once a billing cycle has been processed. However, if you
              believe there has been a technical error or an unauthorized
              charge, please contact us at{' '}
              <a
                href='mailto:support@clariolane.com'
                className='text-brand hover:underline'>
                support@clariolane.com
              </a>{' '}
              within 7 days of the transaction, and we will investigate.
            </li>
            <li>
              <strong>Referral Impact:</strong> Refunded subscriptions are
              ineligible for referral earnings. If a referred user's payment is
              refunded or charged back, the associated commission will be
              deducted from the referrer's dashboard balance.
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
              <p className='text-slate-600 dark:text-slate-400 mb-2'>
                Every user can join the Blucea Affiliate Program. Once you
                select Clariolane as your promoted product, you will receive a
                unique referral link. Share this link with friends, students,
                and colleagues. When a new user signs up and completes a
                subscription via your link, you earn a one-time bonus. Earnings
                are calculated as 30% of the plan price after a 4% maintenance
                fee is deducted.
              </p>
              <ul className='list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-400'>
                <li>If your referral pays $5, you earn $1.44.</li>
                <li>
                  If your referral pays ₦2,900, you earn ₦835.20 (converted to
                  USD in your dashboard).
                </li>
              </ul>
            </div>

            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                How do I track my earnings?
              </h3>
              <p className='text-slate-600 dark:text-slate-400 mb-2'>
                Your{' '}
                <a
                  href='https://affiliate.bluecea.com/dashboard#'
                  className='text-brand hover:underline'
                  target='_blank'
                  rel='noreferrer'>
                  Bluecea Affiliate Dashboard
                </a>{' '}
                shows real-time stats, including:
              </p>
              <ul className='list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-400'>
                <li>Total clicks on your link.</li>
                <li>Number of successful (paid) subscribers.</li>
                <li>Your current withdrawable balance.</li>
              </ul>
            </div>

            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                Why am I not getting conversions (Referral Bonuses)?
              </h3>
              <p className='text-slate-600 dark:text-slate-400 mb-4'>
                Our "Active Member" policy requires a live subscription to
                benefit from the affiliate program. By cancelling your
                subscription, you are signaling the end of your partnership with
                the program. Therefore, any referrals made during a "Cancelled"
                or "Expired" state—including the remaining days of your final
                month—are forfeited.
              </p>
              <p className='text-slate-600 dark:text-slate-400 font-semibold mb-2'>
                To earn and accumulate bonuses, you must maintain an Active Paid
                Subscription to Clariolane.
              </p>
              <ul className='list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400'>
                <li>
                  <strong>The "Active" Rule:</strong> If your subscription is
                  inactive, expired, or has been cancelled, you are no longer
                  eligible to earn referral bonuses.
                </li>
                <li>
                  <strong>Immediate Forfeiture:</strong> Please note that once
                  you click "Cancel Subscription," you immediately forfeit your
                  right to earn new referral bonuses. Any conversions attempted
                  by your referrals during a cancelled or "grace period" state
                  will not be credited and are permanently forfeited.
                </li>
                <li>
                  <strong>System Tracking:</strong> Our system uses cookies to
                  track referrals. If a user does not use your specific link or
                  has cookies disabled, the system cannot attribute the sale. We
                  cannot manually credit referrals after a signup is complete.
                </li>
              </ul>
            </div>

            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                When can I withdraw my money?
              </h3>
              <p className='text-slate-600 dark:text-slate-400 mb-2'>
                Once your balance hits the $10 minimum, a "Request Withdrawal"
                button will be activated in your{' '}
                <a
                  href='https://affiliate.bluecea.com/affiliate/wallet'
                  className='text-brand hover:underline'
                  target='_blank'
                  rel='noreferrer'>
                  wallet
                </a>
                .
              </p>
              <ul className='list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400'>
                <li>
                  <strong>Pending Status:</strong> When you request a
                  withdrawal, the amount is held for processing.
                </li>
                <li>
                  <strong>Rejected Withdrawals:</strong> If a withdrawal is
                  rejected (e.g., due to incorrect bank details), the funds are
                  immediately returned to your "Available Balance."
                </li>
                <li>
                  <strong>Approved Withdrawals:</strong> Once approved, the
                  funds are deducted from your "Available Balance," and the
                  payout process begins.
                </li>
              </ul>
            </div>

            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                When will I receive my money?
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                We process all approved withdrawal requests once a month,
                between the 25th and the 30th. If your request is made after the
                25th, it may be rolled over to the following month's payout
                window.
              </p>
            </div>

            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                How are payments sent?
              </h3>
              <p className='text-slate-600 dark:text-slate-400 mb-2'>
                Payouts are processed via Bank Transfer or PayStack Payout.
                Please ensure your payment details are correctly filled out in
                your profile settings.
              </p>
              <ul className='list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400 mb-2'>
                <li>
                  <strong>Processing Time:</strong> Payouts are typically
                  finalized within 3–5 business days.
                </li>
              </ul>
              <div className='bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/50 mt-4'>
                <p className='text-amber-800 dark:text-amber-200 text-sm'>
                  <strong>Note on Transaction Costs:</strong> Blucea Solutions
                  Limited facilitates the referral program as a value-add for
                  active Clariolane subscribers. To maintain the commission
                  rate, all third-party processing fees, bank charges, or "gas
                  fees" incurred during the payout process are the sole
                  responsibility of the Affiliate (Non Africans ONLY). By
                  requesting a withdrawal, you agree to receive the net amount
                  after these mandatory deductions.
                </p>
              </div>
            </div>

            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                Why was my received amount lower than my withdrawal request?
                (International Users)
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                For international payouts, the user is responsible for the
                gas/transaction fees. Your automated email receipt will contain
                an attachment showing exactly how much the third-party
                processors charged for the transfer. For users receiving funds
                in Naira (African continent), these specific fees are currently
                covered by Bluecea Solutions Limited.
              </p>
            </div>

            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                How is the exchange rate determined?
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                For Naira earnings, we use the current market rate on the day
                the conversion is credited to your dashboard. For withdrawals,
                the Naira equivalent of your USD balance is determined by the
                exchange rate on the day of the payout (between the 25th and
                30th).
              </p>
            </div>

            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                What happens if my withdrawal is rejected?
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                If a withdrawal is rejected (usually due to incorrect banking
                details), the funds are automatically returned to your
                "Available Balance." You can update your profile and request a
                withdrawal again for the next cycle.
              </p>
            </div>

            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                Is the commission recurring?
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                No. The commission is a one-time reward for the initial signup.
                You do not receive additional payments for subsequent monthly
                renewals by the same user.
              </p>
            </div>

            <div>
              <h3 className='font-semibold text-slate-900 dark:text-slate-50 mb-2'>
                What if my friend forgot to use my link?
              </h3>
              <p className='text-slate-600 dark:text-slate-400'>
                Our system uses cookies to track your referrals. If a user does
                not use your specific link to sign up, the system cannot
                attribute the sale to you. We cannot manually add or
                retroactively credit referrals to your account after a signup is
                complete.
              </p>
            </div>

            <div className='bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 mt-8'>
              <h3 className='text-lg font-bold text-slate-900 dark:text-slate-50 mb-4'>
                Active Account Requirement
              </h3>
              <p className='text-slate-600 dark:text-slate-400 mb-4'>
                To be eligible to receive referral payouts, you must maintain an
                active, paid subscription. Any referrals generated or completed
                during a period when your account is deactivated, expired, or
                cancelled will not be credited to your dashboard or count toward
                your earnings.
              </p>
              <p className='text-slate-600 dark:text-slate-400 mb-6'>
                You can only use the email you used to signup for Clariolane to
                signup for the referral program (Clariolane), if not all
                referral bonuses will be forfeited because the system will see
                the account as Inactive.
              </p>

              <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/50'>
                <h4 className='font-semibold text-red-900 dark:text-red-300 mb-2'>
                  Important Note on "Active Status"
                </h4>
                <p className='text-sm text-red-800 dark:text-red-400'>
                  <strong>Strict Policy:</strong> To protect the integrity of
                  the Blucea Solutions ecosystem, referral earnings are reserved
                  for active members of the Clariolane community. Any referrals
                  generated while your account is in a "Cancelled" or "Expired"
                  state will not be recovered or credited back once you
                  resubscribe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
