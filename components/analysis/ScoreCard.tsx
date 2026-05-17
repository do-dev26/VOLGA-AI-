'use client';
import { getScoreColor, getScoreLabel, formatNumber } from '@/lib/utils';
import type { AnalysisResult } from '@/types/analysis';

interface ScoreCardProps {
  result: AnalysisResult;
}

export function ScoreCard({ result }: ScoreCardProps) {
  const color = getScoreColor(result.overallScore);
  const label = getScoreLabel(result.overallScore);
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (result.overallScore / 100) * circ;

  return (
    <div className="card p-6">
      <div className="flex items-center gap-6">
        {/* Ring */}
        <div className="relative flex-shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="none" stroke="#1f1f22" strokeWidth="8" />
            <circle
              cx="50" cy="50" r={r}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black" style={{ color }}>{result.overallScore}</span>
            <span className="text-[9px] text-[#52525b] uppercase tracking-wider">score</span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold">{label}</span>
            <span className="badge badge-accent text-[10px]">{result.fileName}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Stat label="Rows" value={formatNumber(result.rowCount)} />
            <Stat label="Columns" value={String(result.columnCount)} />
            <Stat label="Issues" value={String(result.summary.totalIssues)} accent={result.summary.criticalIssues > 0} />
            <Stat label="Duplicates" value={String(result.summary.duplicateRows)} />
          </div>

          {/* Issue breakdown */}
          <div className="flex gap-3 mt-3 text-xs">
            {result.summary.criticalIssues > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f87171]" />
                <span className="text-[#f87171]">{result.summary.criticalIssues} critical</span>
              </span>
            )}
            {result.summary.warningIssues > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                <span className="text-[#fbbf24]">{result.summary.warningIssues} warnings</span>
              </span>
            )}
            {result.summary.infoIssues > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]" />
                <span className="text-[#60a5fa]">{result.summary.infoIssues} info</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-[#52525b]">{label}</span>
      <span className={`text-xs font-semibold ${accent ? 'text-[#f87171]' : 'text-[#a1a1aa]'}`}>{value}</span>
    </div>
  );
}
