'use client';
import { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.resetPassword(email);
      setSent(true);
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] grid-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="card p-6">
          {sent ? (
            <div className="text-center space-y-3 py-4">
              <CheckCircle2 size={32} className="text-[#00f5aa] mx-auto" />
              <h2 className="font-semibold">Check your inbox</h2>
              <p className="text-sm text-[#71717a]">We sent a reset link to <span className="text-white">{email}</span></p>
              <Link href="/auth/login" className="text-sm text-[#00f5aa] hover:underline block mt-4">Back to sign in</Link>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <Link href="/auth/login" className="flex items-center gap-1.5 text-xs text-[#52525b] hover:text-white mb-4 transition-colors">
                  <ArrowLeft size={12} /> Back to sign in
                </Link>
                <h2 className="font-semibold">Reset password</h2>
                <p className="text-xs text-[#71717a] mt-1">Enter your email and we'll send a reset link.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input type="email" className="input-field" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Button type="submit" loading={loading} className="w-full">Send reset link</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
