/**
 * razorpay.service.ts
 *
 * Public key flow:
 *   - NEXT_PUBLIC_RAZORPAY_KEY_ID — env var se aata hai (checkout open karne ke liye)
 *   - Backend /create-subscription bhi razorpay_key return karta hai (same key)
 *   - Dono available hain — backend return ka use karo, env fallback hai
 *
 * Subscription flow (order flow NAHI):
 *   1. Backend se subscription_id lo  → /api/plans/create-subscription
 *   2. Razorpay Checkout kholo        → subscription_id pass karo
 *   3. Handler mein verify karo       → /api/plans/verify-subscription
 */

import type { Plan, RazorpaySubscriptionResponse } from '@/types/payment'
import { getToken } from '@/lib/token'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
// Public key — checkout open karne ke liye (secret nahi)
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? ''

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false)
    if ((window as any).Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload  = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

interface InitiatePaymentOptions {
  plan:      Plan
  userName:  string
  userEmail: string
  onSuccess: () => void
  onFailure: (error: string) => void
}

export const razorpayService = {
  async initiatePayment({ plan, userName, userEmail, onSuccess, onFailure }: InitiatePaymentOptions) {
    // Step 1: Razorpay SDK load karo
    const loaded = await loadRazorpayScript()
    if (!loaded) {
      onFailure('Payment gateway load nahi hua. Dobara try karo.')
      return
    }

    // Step 2: Backend se subscription_id lo
    let subscription_id: string
    let razorpay_key: string

    try {
      const token = await getToken()
      const res = await fetch(`${BACKEND_URL}/api/plans/create-subscription`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        onFailure(err.detail ?? 'Subscription create nahi hua')
        return
      }

      const data    = await res.json()
      subscription_id = data.subscription_id
      // Backend ka key use karo, env var fallback hai
      razorpay_key    = data.razorpay_key || RAZORPAY_KEY_ID

      if (!subscription_id) {
        onFailure('Subscription ID nahi mili backend se')
        return
      }
      if (!razorpay_key) {
        onFailure('Razorpay key missing — NEXT_PUBLIC_RAZORPAY_KEY_ID set karo')
        return
      }
    } catch {
      onFailure('Server se connect nahi ho saka')
      return
    }

    // Step 3: Razorpay Checkout kholo — subscription_id (order_id NAHI)
    const options = {
      key:             razorpay_key,
      subscription_id,
      name:            'VOLGA AI',
      description:     `${plan.name} Plan — ₹${plan.priceINR / 100}/month`,
      image:           '/icons/favicon.svg',
      prefill:         { name: userName, email: userEmail },
      theme:           { color: '#00f5aa', backdrop_color: '#09090b' },
      modal:           { backdropclose: false, escape: false, animation: true },

      // Step 4: Payment successful — verify karo
      handler: async (response: RazorpaySubscriptionResponse) => {
        try {
          const token = await getToken()
          const verifyRes = await fetch(`${BACKEND_URL}/api/plans/verify-subscription`, {
            method:  'POST',
            headers: {
              Authorization:  `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_payment_id:      response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature:       response.razorpay_signature,
            }),
          })

          if (!verifyRes.ok) {
            const err = await verifyRes.json().catch(() => ({}))
            onFailure(err.detail ?? 'Payment verify nahi hua')
            return
          }

          onSuccess()
        } catch {
          onFailure('Verification failed. Support se contact karo.')
        }
      },
    }

    const rzp = new (window as any).Razorpay(options)
    rzp.on('payment.failed', (r: any) => {
      onFailure(r.error?.description ?? 'Payment fail ho gaya')
    })
    rzp.open()
  },

  async cancelSubscription(): Promise<{ message: string }> {
    const token = await getToken()
    const res = await fetch(`${BACKEND_URL}/api/plans/cancel`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const e = await res.json().catch(() => ({}))
      throw new Error(e.detail ?? 'Cancel nahi hua')
    }
    return res.json()
  },

  async getPlanStatus() {
    const token = await getToken()
    const res = await fetch(`${BACKEND_URL}/api/plans/status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Plan status fetch nahi hua')
    return res.json()
  },
}
