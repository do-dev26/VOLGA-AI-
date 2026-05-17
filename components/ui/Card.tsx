import { cn } from '@/lib/utils';
import { X, Loader2 } from 'lucide-react';
import { HTMLAttributes, ReactNode, useEffect } from 'react';

// ─── Card ──────────────────────────────────────────────────────────────────
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  accent?: boolean;
}

export function Card({ hover, accent, children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'card',
        hover && 'card-hover',
        accent && 'border-[rgba(0,245,170,0.25)] bg-[rgba(0,245,170,0.03)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative card w-full max-w-lg shadow-2xl animate-in', className)}>
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-[#1f1f22]">
            <h2 className="font-semibold text-base">{title}</h2>
            <button onClick={onClose} className="text-[#52525b] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
              <X size={16} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Loader ────────────────────────────────────────────────────────────────
interface LoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  fullscreen?: boolean;
}

export function Loader({ text, size = 'md', fullscreen }: LoaderProps) {
  const sizes = { sm: 16, md: 24, lg: 36 };

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-[#09090b] flex flex-col items-center justify-center gap-4 z-50">
        <VolgaSpinner />
        {text && <p className="text-sm text-[#71717a] animate-pulse">{text}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <Loader2 size={sizes[size]} className="animate-spin text-[#00f5aa]" />
      {text && <p className="text-sm text-[#71717a]">{text}</p>}
    </div>
  );
}

function VolgaSpinner() {
  return (
    <svg width="48" height="48" viewBox="0 0 40 40" fill="none" className="animate-pulse">
      <polygon points="2,2 12,2 22,36 12,36" fill="white" />
      <polygon points="38,2 28,2 18,36 28,36" fill="white" />
      <polygon points="6,2 12,2 18,24 12,24" fill="#00f5aa" />
      <polygon points="34,2 28,2 22,24 28,24" fill="#00f5aa" />
      <polygon points="12,2 28,2 28,36 20,40 12,36" fill="#09090b" />
      <ellipse cx="20" cy="37" rx="4" ry="2" fill="#00f5aa" />
    </svg>
  );
}
