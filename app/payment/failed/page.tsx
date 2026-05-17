'use client';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      <div className="card max-w-sm w-full p-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.2)] flex items-center justify-center mx-auto">
          <XCircle size={32} className="text-[#f87171]" />
        </div>
        <h1 className="text-xl font-black">Payment Failed</h1>
        <p className="text-sm text-[#71717a]">
          Something went wrong with your payment. No amount was deducted. Please try again.
        </p>
        <Link href="/pricing" className="btn-primary w-full justify-center">
          Try Again
        </Link>
        <Link href="/dashboard" className="btn-ghost w-full justify-center">
          Go to Dashboard
        </Link>
        <p className="text-xs text-[#3f3f46]">
          Need help? <a href="mailto:hello@volga.ai" className="text-[#00f5aa] hover:underline">Contact support</a>
        </p>
      </div>
    </div>
  );
}
