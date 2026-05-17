'use client';
import { AlertTriangle, Info, XCircle, CheckCircle2, Wrench } from 'lucide-react';
import type { Finding } from '@/types/analysis';
import { getSeverityColor } from '@/lib/utils';

interface FindingsProps {
  findings: Finding[];
}

const SEVERITY_ICONS = {
  critical: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const SEVERITY_COLORS = {
  critical: { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', text: '#f87171' },
  warning: { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', text: '#fbbf24' },
  info: { bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)', text: '#60a5fa' },
};

export function Findings({ findings }: FindingsProps) {
  if (findings.length === 0) {
    return (
      <div className="card p-8 flex flex-col items-center gap-3 text-center">
        <CheckCircle2 size={28} className="text-[#00f5aa]" />
        <p className="text-sm font-medium">No issues found</p>
        <p className="text-xs text-[#52525b]">Your dataset looks clean!</p>
      </div>
    );
  }

  const sorted = [...findings].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="space-y-2">
      {sorted.map((f) => {
        const Icon = SEVERITY_ICONS[f.severity];
        const colors = SEVERITY_COLORS[f.severity];
        return (
          <div
            key={f.id}
            className="rounded-xl p-4 border"
            style={{ background: colors.bg, borderColor: colors.border }}
          >
            <div className="flex items-start gap-3">
              <Icon size={16} style={{ color: colors.text }} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{f.title}</span>
                  {f.fixable && (
                    <span className="badge badge-accent text-[9px] py-0 px-1.5">
                      <Wrench size={8} /> fixable
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">{f.description}</p>
                {f.affectedColumns.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {f.affectedColumns.map((col) => (
                      <span key={col} className="badge badge-muted text-[10px] py-0 px-2">{col}</span>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#52525b] flex-shrink-0">
                {f.affectedRows > 0 ? `${f.affectedRows} rows` : ''}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
