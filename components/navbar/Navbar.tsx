'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, Upload, History, Settings, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard#analyze', label: 'Analyze', icon: Upload },
  { href: '/history', label: 'History', icon: History },
  { href: '/dashboard#settings', label: 'Settings', icon: Settings },
];

export function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?';

  const handleLogout = async () => {
    await authService.logout();
    toast.success('Signed out');
    router.push('/');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#1f1f22] h-14">
        <div className="max-w-screen-xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
            <VolgaMark size={26} />
            <span className="font-black tracking-[0.12em] text-[14px] text-white">VOLGA</span>
            <span className="badge badge-accent text-[9px] py-0.5 px-2">AI</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm transition-colors relative',
                    active ? 'text-white font-medium' : 'text-[#71717a] hover:text-white hover:bg-white/5'
                  )}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#00f5aa] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: upgrade + avatar */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard#upgrade"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,245,170,0.3)] bg-[rgba(0,245,170,0.06)] text-[#00f5aa] text-xs font-medium hover:bg-[rgba(0,245,170,0.12)] transition-colors"
            >
              Upgrade
            </Link>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#1a1a1e] border border-[#27272a] flex items-center justify-center text-[11px] font-semibold text-[#a1a1aa]">
                  {initials}
                </div>
                <ChevronDown size={12} className={cn('text-[#52525b] transition-transform', userMenuOpen && 'rotate-180')} />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 card shadow-xl z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#1f1f22]">
                      <p className="text-sm font-medium truncate">{user?.displayName || 'User'}</p>
                      <p className="text-xs text-[#52525b] truncate">{user?.email}</p>
                    </div>
                    <div className="p-1">
                      <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <LayoutDashboard size={14} /> Dashboard
                      </Link>
                      <Link href="/history" className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <History size={14} /> History
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-[#f87171] hover:bg-[rgba(248,113,113,0.08)] transition-colors">
                        <LogOut size={14} /> Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 pt-14">
          <div className="absolute inset-0 bg-[#09090b]/95 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
          <div className="relative bg-[#09090b] border-b border-[#1f1f22] p-4 space-y-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors',
                  pathname === href ? 'bg-[rgba(0,245,170,0.08)] text-[#00f5aa] font-medium' : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'
                )}
              >
                <Icon size={16} /> {label}
              </Link>
            ))}
            <button
              onClick={() => { setMobileOpen(false); handleLogout(); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-[#f87171] hover:bg-[rgba(248,113,113,0.08)] transition-colors"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      )}
    </>
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
