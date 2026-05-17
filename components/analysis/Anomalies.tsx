'use client';
import { TrendingUp, AlertOctagon, CheckCircle2, Zap, Search } from 'lucide-react';
import type { Anomaly, Recommendation, Pattern } from '@/types/analysis';
import { getSeverityColor } from '@/lib/utils';

// ─── Anomalies ──────────────────────────────────────────────────────────────
export function Anomalies({ anomalies }: { anomalies: Anomaly[] }) {
  if (anomalies.length === 0) {
    return (
      <div className="card p-8 flex flex-col items-center gap-3 text-center">
        <CheckCircle2 size={28} className="text-[#00f5aa]" />
        <p className="text-sm font-medium">No anomalies detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {anomalies.map((a) => {
        const sevColor = getSeverityColor(a.severity);
        return (
          <div key={a.id} className="card p-4">
            <div className="flex items-start gap-3">
              <AlertOctagon size={16} style={{ color: sevColor }} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{a.type.replace('_', ' ')}</span>
                  <span className="badge badge-muted text-[9px]">{a.column}</span>
                  <span
                    className="badge text-[9px] py-0 px-1.5"
                    style={{ background: `${sevColor}15`, color: sevColor, border: `0.5px solid ${sevColor}40` }}
                  >
                    {a.severity}
                  </span>
                </div>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">{a.description}</p>
                <p className="text-xs text-[#52525b] mt-1 font-mono">
                  Row {a.rowIndex + 1}: {String(a.value)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Recommendations ────────────────────────────────────────────────────────
export function Recommendations({ recommendations }: { recommendations: Recommendation[] }) {
  const priority = { high: 0, medium: 1, low: 2 };
  const sorted = [...recommendations].sort((a, b) => priority[a.priority] - priority[b.priority]);

  if (sorted.length === 0) {
    return (
      <div className="card p-8 flex flex-col items-center gap-3 text-center">
        <CheckCircle2 size={28} className="text-[#00f5aa]" />
        <p className="text-sm font-medium">No recommendations</p>
      </div>
    );
  }

  const priorityColors = {
    high: { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', text: '#f87171' },
    medium: { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', text: '#fbbf24' },
    low: { bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)', text: '#60a5fa' },
  };

  return (
    <div className="space-y-2">
      {sorted.map((rec, i) => {
        const colors = priorityColors[rec.priority];
        return (
          <div key={rec.id} className="card p-4 flex gap-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0"
              style={{ background: colors.bg, color: colors.text, border: `0.5px solid ${colors.border}` }}
            >
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{rec.action}</span>
                {rec.autoFixable && (
                  <span className="badge badge-accent text-[9px] py-0 px-1.5">
                    <Zap size={8} /> auto-fix
                  </span>
                )}
              </div>
              <p className="text-xs text-[#a1a1aa] leading-relaxed mb-2">{rec.description}</p>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-[#52525b]">Impact: <span className="text-[#a1a1aa]">{rec.estimatedImpact}</span></span>
                <span style={{ color: colors.text }} className="font-medium capitalize">{rec.priority} priority</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Patterns ───────────────────────────────────────────────────────────────
export function Patterns({ patterns }: { patterns: Pattern[] }) {
  if (patterns.length === 0) {
    return (
      <div className="card p-8 flex flex-col items-center gap-3 text-center">
        <Search size={28} className="text-[#52525b]" />
        <p className="text-sm font-medium">No patterns detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {patterns.map((p) => {
        const health = p.violations === 0 ? 'good' : p.violations < 10 ? 'warning' : 'bad';
        const healthColors = {
          good: '#00f5aa', warning: '#fbbf24', bad: '#f87171',
        };

        return (
          <div key={p.id} className="card p-4 flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-[#141416] flex items-center justify-center flex-shrink-0">
              <TrendingUp size={16} className="text-[#52525b]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-medium capitalize">{p.type}</span>
                <span className="badge badge-muted text-[9px]">{p.column}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#52525b]">
                <span>Format: <code className="text-[#a1a1aa] font-mono text-[10px]">{p.format}</code></span>
                {p.violations > 0 && (
                  <span style={{ color: healthColors[health] }}>{p.violations} violations</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span
                className="text-lg font-black"
                style={{ color: healthColors[health] }}
              >
                {p.matchPercentage}%
              </span>
              <p className="text-[9px] text-[#52525b]">match</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
