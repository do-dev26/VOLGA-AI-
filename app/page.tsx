'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Zap, Shield, BarChart3, Upload, CheckCircle, Star } from 'lucide-react';

const FEATURES = [
  { icon: Zap, title: 'Instant Analysis', desc: 'AI scans your CSV or Excel in seconds — no waiting, no setup.' },
  { icon: BarChart3, title: 'Quality Scoring', desc: 'Get a 0–100 data health score with column-level breakdowns.' },
  { icon: Shield, title: 'Smart Fixes', desc: 'Auto-detect duplicates, nulls, outliers, and type mismatches.' },
  { icon: Upload, title: 'Any Format', desc: 'CSV, XLSX, XLS — drag, drop, done.' },
];

const STATS = [
  { value: '2M+', label: 'Rows processed' },
  { value: '98%', label: 'Accuracy rate' },
  { value: '<3s', label: 'Avg. scan time' },
  { value: '12k+', label: 'Files cleaned' },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-x-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#1f1f22]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <VolgaMark size={28} />
            <span style={{ fontWeight: 900, letterSpacing: '0.12em', fontSize: '15px' }}>VOLGA</span>
            <span className="badge badge-accent text-[10px] py-0.5 px-2">AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#71717a]">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm py-2 px-4">Sign in</Link>
            <Link href="/auth/signup" className="btn-primary text-sm py-2 px-4">
              Get started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6 text-center max-w-4xl mx-auto">
        <div
          className="inline-flex items-center gap-2 mb-8 badge badge-accent text-xs"
          style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s' }}
        >
          <Star size={11} fill="currentColor" /> Now with AI-powered pattern detection
        </div>

        <h1
          className="text-5xl md:text-7xl font-black mb-6 leading-[1.05] tracking-tight"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s 0.1s ease',
          }}
        >
          Your data,{' '}
          <span className="text-gradient">perfectly clean.</span>
        </h1>

        <p
          className="text-[#71717a] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s 0.2s ease',
          }}
        >
          Upload any CSV or Excel file. VOLGA AI detects issues, scores your data quality,
          and gives you actionable fixes — in seconds.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s 0.3s ease',
          }}
        >
          <Link href="/auth/signup" className="btn-primary text-base py-3 px-8">
            Start for free <ArrowRight size={16} />
          </Link>
          <Link href="/auth/login" className="btn-ghost text-base py-3 px-8">
            Sign in to dashboard
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-2xl mx-auto">
          {STATS.map((s) => (
            <div key={s.label} className="card p-4 text-center card-hover">
              <div className="text-2xl font-black text-[#00f5aa]">{s.value}</div>
              <div className="text-xs text-[#52525b] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12 text-[#a1a1aa]">
          Everything you need to trust your data
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card card-hover p-6 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-[rgba(0,245,170,0.08)] border border-[rgba(0,245,170,0.15)] flex items-center justify-center flex-shrink-0">
                <f.icon size={18} className="text-[#00f5aa]" />
              </div>
              <div>
                <div className="font-semibold text-sm mb-1">{f.title}</div>
                <div className="text-[#71717a] text-sm leading-relaxed">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 text-center">
        <div className="max-w-xl mx-auto card p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,245,170,0.04)] to-transparent" />
          <CheckCircle size={32} className="text-[#00f5aa] mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-3">Ready to clean your data?</h2>
          <p className="text-[#71717a] text-sm mb-6">No credit card required. Free tier available.</p>
          <Link href="/auth/signup" className="btn-primary">
            Get started free <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1f1f22] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#3f3f46]">
          <div className="flex items-center gap-2">
            <VolgaMark size={18} />
            <span className="font-bold tracking-widest">VOLGA AI</span>
          </div>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-[#71717a] transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-[#71717a] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#71717a] transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-[#71717a] transition-colors">Contact</Link>
          </div>
          <span>© 2025 VOLGA AI. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

function VolgaMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <polygon points="2,2 12,2 22,36 12,36" fill="white" />
      <polygon points="38,2 28,2 18,36 28,36" fill="white" />
      <polygon points="6,2 12,2 18,24 12,24" fill="#00f5aa" />
      <polygon points="34,2 28,2 22,24 28,24" fill="#00f5aa" />
      <polygon points="12,2 28,2 28,36 20,40 12,36" fill="#09090b" />
      <ellipse cx="20" cy="37" rx="4" ry="2" fill="#00f5aa" />
    </svg>
  );
}
