'use client'
import { Navbar } from '@/components/navbar/Navbar'
import { PricingSection } from '@/components/payment/PricingSection'
import { useAuth } from '@/hooks/useAuth'
import { Loader } from '@/components/ui/Card'
import { useRouter } from 'next/navigation'
import { PLANS } from '@/lib/plans'
import { Check, ShieldCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  const { user, backendUser, loading, refreshBackendUser } = useAuth()
  const router = useRouter()

  if (loading) return <Loader fullscreen text="Loading…" />

  const handleUpgradeSuccess = async () => {
    await refreshBackendUser()
    setTimeout(() => router.push('/dashboard'), 1500)
  }

  // ── Logged OUT — public pricing page ──────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white">
        <PublicNav />
        <main className="pt-14">
          <div className="max-w-screen-xl mx-auto px-4 py-16">
            <PublicPricingSection />
          </div>
        </main>
      </div>
    )
  }

  // ── Logged IN — live upgrade flow ──────────────────────
  return (
    <div className="min-h-screen bg-[#09090b]">
      <Navbar />
      <main className="pt-14">
        <div className="max-w-screen-xl mx-auto px-4 py-16">
          <PricingSection
            currentPlanId={backendUser?.plan ?? 'free'}
            subscriptionStatus={backendUser?.subscription_status}
            userEmail={user.email ?? ''}
            userName={user.displayName ?? ''}
            onUpgradeSuccess={handleUpgradeSuccess}
          />
        </div>
      </main>
    </div>
  )
}

// ── Public pricing — logged out users ke liye ─────────
function PublicPricingSection() {
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black mb-3">Simple, transparent pricing</h1>
        <p className="text-[#71717a] text-base">Upgrade anytime. Cancel anytime. No hidden fees.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={[
              'relative rounded-2xl p-6 flex flex-col gap-5',
              plan.popular
                ? 'border border-[#00f5aa] bg-[rgba(0,245,170,0.04)]'
                : 'border border-[#1f1f22] bg-[#111113]',
            ].join(' ')}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="badge badge-accent text-[10px] px-3 py-1">⚡ Most Popular</span>
              </div>
            )}

            <div>
              <h3 className="font-bold text-base mb-1">{plan.name}</h3>
              <p className="text-xs text-[#52525b] leading-relaxed">{plan.description}</p>
            </div>

            <div className="flex items-end gap-1">
              <span className="text-4xl font-black" style={{ color: plan.popular ? '#00f5aa' : '#fff' }}>
                {plan.priceDisplay}
              </span>
              <span className="text-sm text-[#52525b] mb-1">{plan.intervalDisplay}</span>
            </div>

            {/* CTA — logged out → signup */}
            <Link
              href={plan.priceINR === 0 ? '/auth/signup' : '/auth/signup?intent=pro'}
              className={[
                'w-full h-11 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all',
                plan.popular
                  ? 'bg-[#00f5aa] text-[#09090b] hover:opacity-90'
                  : plan.priceINR === 0
                  ? 'bg-[#1a1a1e] text-[#71717a]'
                  : 'border border-[#00f5aa] text-[#00f5aa] hover:bg-[rgba(0,245,170,0.08)]',
              ].join(' ')}
            >
              {plan.priceINR === 0 ? 'Get started free' : `Get ${plan.name}`}
              <ArrowRight size={14} />
            </Link>

            <div className="h-px bg-[#1f1f22]" />

            <ul className="space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-xs text-[#a1a1aa]">
                  <Check size={13} className="text-[#00f5aa] flex-shrink-0 mt-0.5" />
                  {f}
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
        ))}
      </div>

      {/* Sign in nudge */}
      <p className="text-center mt-8 text-sm text-[#52525b]">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-[#00f5aa] hover:underline">Sign in to upgrade</Link>
      </p>

      {/* Trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs text-[#3f3f46]">
        {['Secured by Razorpay', '256-bit SSL', 'UPI · Cards · Net Banking', 'Cancel anytime'].map((t) => (
          <span key={t} className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-[#00f5aa]" /> {t}
          </span>
        ))}
      </div>
    </div>
  )
}

// Minimal nav for logged-out pricing page
function PublicNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#1f1f22] h-14">
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <VolgaMark size={26} />
          <span className="font-black tracking-[0.12em] text-[14px]">VOLGA</span>
          <span className="badge badge-accent text-[9px] py-0.5 px-2">AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="btn-ghost text-sm py-2 px-4">Sign in</Link>
          <Link href="/auth/signup" className="btn-primary text-sm py-2 px-4">
            Get started <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </nav>
  )
}

function VolgaMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <polygon points="2,2 12,2 22,36 12,36" fill="white" />
      <polygon points="38,2 28,2 18,36 28,36" fill="white" />
      <polygon points="6,2 12,2 18,24 12,24" fill="#00f5aa" />
      <polygon points="34,2 28,2 22,24 28,24" fill="#00f5aa" />
      <polygon points="12,2 28,2 28,36 20,40 12,36" fill="#09090b" />
      <ellipse cx="20" cy="37" rx="4" ry="2" fill="#00f5aa" />
    </svg>
  )
}
