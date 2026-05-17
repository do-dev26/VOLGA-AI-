'use client'
import { PricingCard } from './PricingCard'
import { ShieldCheck } from 'lucide-react'
import { PLANS } from '@/lib/plans'

interface PricingSectionProps {
  currentPlanId?:      string
  subscriptionStatus?: string | null
  userEmail:           string
  userName:            string
  onUpgradeSuccess?:   () => void
  title?:    string
  subtitle?: string
}

export function PricingSection({
  currentPlanId = 'free',
  subscriptionStatus,
  userEmail,
  userName,
  onUpgradeSuccess,
  title    = 'Simple, transparent pricing',
  subtitle = 'Upgrade anytime. Cancel anytime. No hidden fees.',
}: PricingSectionProps) {
  // Plans local PLANS constant se (backend se sync nahi karni in production)
  // Agar backend se chahiye: GET /api/plans/status se limits lo
  const plans = PLANS

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black mb-2">{title}</h2>
        <p className="text-sm text-[#71717a]">{subtitle}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            currentPlanId={currentPlanId}
            subscriptionStatus={subscriptionStatus}
            userEmail={userEmail}
            userName={userName}
            onUpgradeSuccess={onUpgradeSuccess}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs text-[#3f3f46]">
        {[
          'Secured by Razorpay',
          '256-bit SSL encryption',
          'UPI · Cards · Net Banking · Wallets',
          'Cancel anytime',
        ].map((t) => (
          <span key={t} className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-[#00f5aa]" /> {t}
          </span>
        ))}
      </div>
    </div>
  )
}
