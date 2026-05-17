import type { Plan } from '@/types/payment';

// ✅ Plans defined SERVER-SIDE only — never hardcoded in frontend components
// Frontend always fetches from /api/plans

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Try VOLGA AI with no commitment',
    priceINR: 0,
    priceDisplay: '₹0',
    interval: 'month',
    intervalDisplay: 'forever',
    uploadLimit: 3,
    monthlyAnalyses: 10,
    maxFileSizeMB: 5,
    features: [
      'Up to 10 analyses/month',
      'Files up to 5MB',
      'Basic quality score',
      'CSV support',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For individuals and small teams',
    priceINR: 49900,        // ₹499/month in paise
    priceDisplay: '₹499',
    interval: 'month',
    intervalDisplay: '/month',
    uploadLimit: 100,
    monthlyAnalyses: 500,
    maxFileSizeMB: 50,
    popular: true,
    features: [
      'Up to 500 analyses/month',
      'Files up to 50MB',
      'Full AI analysis + recommendations',
      'CSV, XLSX, XLS support',
      'Column insights & anomaly detection',
      'Pattern detection',
      'Priority support',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For growing teams with heavy data needs',
    priceINR: 149900,       // ₹1499/month in paise
    priceDisplay: '₹1,499',
    interval: 'month',
    intervalDisplay: '/month',
    uploadLimit: 1000,
    monthlyAnalyses: 5000,
    maxFileSizeMB: 200,
    features: [
      'Up to 5,000 analyses/month',
      'Files up to 200MB',
      'Everything in Pro',
      'Team collaboration (coming soon)',
      'API access (coming soon)',
      'Dedicated support',
      'Custom integrations',
    ],
  },
];
