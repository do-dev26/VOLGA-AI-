'use client'
import { useState } from 'react'
import { Check, Loader2, Zap, Crown } from 'lucide-react'
import type { Plan } from '@/types/payment'
import { razorpayService } from '@/services/razorpay.service'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface PricingCardProps {
  plan:           Plan
  currentPlanId?: string
  userEmail:      string
  userName:       string
  subscriptionStatus?: string | null
  onUpgradeSuccess?: () => void
}

export function PricingCard({
  plan, currentPlanId, userEmail, userName,
  subscriptionStatus, onUpgradeSuccess,
}: PricingCardProps) {
  const [loading, setLoading]     = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const isCurrentPlan  = currentPlanId === plan.id
  const isFree         = plan.priceINR === 0
  const canCancel      = isCurrentPlan && !isFree &&
    (subscriptionStatus === 'active' || subscriptionStatus === 'authenticated')

  const handleUpgrade = async () => {
    if (isCurrentPlan || isFree || loading) return
    setLoading(true)
    await razorpayService.initiatePayment({
      plan, userEmail, userName,
      onSuccess: () => {
        toast.success(`🎉 ${plan.name} activate ho gaya!`)
        onUpgradeSuccess?.()
        setLoading(false)
      },
      onFailure: (err) => {
        toast.error(err)
        setLoading(false)
      },
    })
  }

  const handleCancel = async () => {
    if (!canCancel || cancelling) return
    setCancelling(true)
    try {
      const { message } = await razorpayService.cancelSubscription()
      toast.success(message)
      onUpgradeSuccess?.()
    } catch (err: any) {
      toast.error(err.message ?? 'Cancel nahi hua')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className={cn(
      'relative rounded-2xl p-6 flex flex-col gap-5 transition-all duration-200',
      plan.popular
        ? 'border border-[#00f5aa] bg-[rgba(0,245,170,0.04)]'
        : 'border border-[#1f1f22] bg-[#111113]',
      isCurrentPlan && 'ring-1 ring-[#00f5aa]/40'
    )}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="badge badge-accent text-[10px] px-3 py-1 flex items-center gap-1">
            <Zap size={10} fill="currentColor" /> Most Popular
          </span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-base">{plan.name}</h3>
          {isCurrentPlan && (
            <span className="badge badge-accent text-[9px] px-2 py-0.5 flex items-center gap-1">
              <Crown size={9} /> Current
            </span>
          )}
        </div>
        <p className="text-xs text-[#52525b] leading-relaxed">{plan.description}</p>
      </div>

      <div className="flex items-end gap-1">
        <span className="text-4xl font-black" style={{ color: plan.popular ? '#00f5aa' : '#ffffff' }}>
          {plan.priceDisplay}
        </span>
        <span className="text-sm text-[#52525b] mb-1">{plan.intervalDisplay}</span>
      </div>

      {/* Upgrade button */}
      {!isCurrentPlan && !isFree && (
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className={cn(
            'w-full h-11 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2',
            plan.popular
              ? 'bg-[#00f5aa] text-[#09090b] hover:opacity-90 active:scale-[0.98]'
              : 'bg-transparent border border-[#00f5aa] text-[#00f5aa] hover:bg-[rgba(0,245,170,0.08)]'
          )}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : `Upgrade to ${plan.name}`}
        </button>
      )}
      {isFree && !isCurrentPlan && (
        <div className="w-full h-11 rounded-lg text-sm font-bold flex items-center justify-center text-[#52525b] bg-[#1a1a1e] cursor-default">
          Free Forever
        </div>
      )}
      {isCurrentPlan && (
        <div className="space-y-2">
          <div className="w-full h-11 rounded-lg text-sm font-bold flex items-center justify-center text-[#52525b] bg-[#1f1f22] cursor-default">
            Current Plan
          </div>
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full h-8 rounded-lg text-xs text-[#f87171] hover:bg-[rgba(248,113,113,0.08)] transition-colors flex items-center justify-center gap-1"
            >
              {cancelling ? <Loader2 size={12} className="animate-spin" /> : 'Cancel subscription'}
            </button>
          )}
          {subscriptionStatus === 'halted' && (
            <p className="text-[10px] text-[#fbbf24] text-center">
              ⚠️ Payment fail hua — subscription halted hai
            </p>
          )}
        </div>
      )}

      <div className="h-px bg-[#1f1f22]" />

      <ul className="space-y-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-xs text-[#a1a1aa]">
            <Check size={13} className="text-[#00f5aa] flex-shrink-0 mt-0.5" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-2 border-t border-[#1f1f22] grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[10px] text-[#3f3f46]">Files/mo</p>
          <p className="text-xs font-semibold text-[#71717a]">
            {plan.uploadLimit === -1 ? '∞' : plan.uploadLimit}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#3f3f46]">Max rows</p>
          <p className="text-xs font-semibold text-[#71717a]">
            {plan.monthlyAnalyses === -1 ? '∞' : `${(plan.monthlyAnalyses / 1000).toFixed(0)}K`}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#3f3f46]">File size</p>
          <p className="text-xs font-semibold text-[#71717a]">{plan.maxFileSizeMB}MB</p>
        </div>
      </div>
    </div>
  )
}
