'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be 6+ characters'); return; }
    setLoading(true);
    try {
      await authService.signup(email, password, name);
      toast.success('Account created!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message ?? 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] grid-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <VolgaMark />
          <h1 className="text-xl font-black tracking-widest mt-3">VOLGA</h1>
          <p className="text-sm text-[#52525b] mt-1">Create your free account</p>
        </div>

        <div className="card p-6 space-y-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-[#71717a] mb-1.5 block">Full name</label>
              <input className="input-field" placeholder="Jordan Smith" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs text-[#71717a] mb-1.5 block">Email</label>
              <input type="email" className="input-field" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs text-[#71717a] mb-1.5 block">Password</label>
              <input type="password" className="input-field" placeholder="6+ characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" loading={loading} className="w-full mt-1">Create account</Button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#1f1f22]" />
            <span className="text-[10px] text-[#3f3f46]">or</span>
            <div className="flex-1 h-px bg-[#1f1f22]" />
          </div>

          <Button variant="ghost" onClick={async () => { setLoading(true); try { await authService.loginWithGoogle(); router.push('/dashboard'); } catch(e:any){toast.error(e.message);} finally{setLoading(false);} }} loading={loading} className="w-full">
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-xs text-[#52525b] mt-4">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#00f5aa] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function VolgaMark() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mx-auto">
      <polygon points="2,2 12,2 22,36 12,36" fill="white" />
      <polygon points="38,2 28,2 18,36 28,36" fill="white" />
      <polygon points="6,2 12,2 18,24 12,24" fill="#00f5aa" />
      <polygon points="34,2 28,2 22,24 28,24" fill="#00f5aa" />
      <polygon points="12,2 28,2 28,36 20,40 12,36" fill="#09090b" />
      <ellipse cx="20" cy="37" rx="4" ry="2" fill="#00f5aa" />
    </svg>
  );
}
