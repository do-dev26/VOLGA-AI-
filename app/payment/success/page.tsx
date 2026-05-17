'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push('/dashboard'), 5000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      <div className="card max-w-sm w-full p-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[rgba(0,245,170,0.1)] border border-[rgba(0,245,170,0.2)] flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} className="text-[#00f5aa]" />
        </div>
        <h1 className="text-xl font-black">Payment Successful!</h1>
        <p className="text-sm text-[#71717a]">
          Your plan has been upgraded. You can now enjoy all the benefits of your new plan.
        </p>
        <p className="text-xs text-[#3f3f46]">Redirecting to dashboard in 5 seconds…</p>
        <Link href="/dashboard" className="btn-primary w-full justify-center">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
