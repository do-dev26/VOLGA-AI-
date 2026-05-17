// Razorpay Subscription response type
export interface RazorpaySubscriptionResponse {
  razorpay_payment_id:      string
  razorpay_subscription_id: string
  razorpay_signature:       string
}

// Backward compat alias
export type RazorpayResponse = RazorpaySubscriptionResponse

export interface Plan {
  id:              string
  name:            string
  description:     string
  priceINR:        number
  priceDisplay:    string
  interval:        'month' | 'year' | 'one_time'
  intervalDisplay: string
  uploadLimit:     number
  monthlyAnalyses: number
  maxFileSizeMB:   number
  features:        string[]
  popular?:        boolean
}
