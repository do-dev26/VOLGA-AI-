'use client';
import { useState } from 'react';
import { Hash, Calendar, Type, ToggleLeft, HelpCircle, ChevronDown } from 'lucide-react';
import type { ColumnInsight } from '@/types/analysis';
import { getScoreColor, cn } from '@/lib/utils';

interface ColumnInsightsProps {
  columns: ColumnInsight[];
}

const TYPE_ICONS = {
  number: Hash,
  date: Calendar,
  string: Type,
  boolean: ToggleLeft,
  mixed: HelpCircle,
  unknown: HelpCircle,
};

export function ColumnInsights({ columns }: ColumnInsightsProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {columns.map((col) => {
        const Icon = TYPE_ICONS[col.type] ?? HelpCircle;
        const color = getScoreColor(col.score);
        const isOpen = expanded === col.name;

        return (
          <div key={col.name} className="card card-hover overflow-hidden">
            <button
              className="w-full flex items-center gap-3 p-4 text-left"
              onClick={() => setExpanded(isOpen ? null : col.name)}
            >
              <div className="w-8 h-8 rounded-lg bg-[#141416] flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-[#52525b]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{col.name}</span>
                  <span className="badge badge-muted text-[9px] py-0 px-1.5">{col.type}</span>
                  {col.issues.length > 0 && (
                    <span className="badge text-[9px] py-0 px-1.5 bg-[rgba(248,113,113,0.1)] text-[#f87171] border-[rgba(248,113,113,0.2)]">
                      {col.issues.length} issue{col.issues.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1.5">
                  <div className="flex-1 h-1 bg-[#1f1f22] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${col.score}%`, background: color }}
                    />
                  </div>
                  <span className="text-xs font-semibold flex-shrink-0" style={{ color }}>{col.score}</span>
                </div>
              </div>

              <ChevronDown
                size={14}
                className={cn('text-[#52525b] transition-transform flex-shrink-0', isOpen && 'rotate-180')}
              />
            </button>

            {isOpen && (
              <div className="border-t border-[#1f1f22] px-4 pb-4 pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade">
                <Metric label="Nulls" value={`${col.nullPercentage}%`} warn={col.nullPercentage > 10} />
                <Metric label="Unique" value={`${col.uniquePercentage}%`} />
                <Metric label="Null count" value={String(col.nullCount)} />
                <Metric label="Unique count" value={String(col.uniqueCount)} />
                {col.min !== undefined && <Metric label="Min" value={String(col.min)} />}
                {col.max !== undefined && <Metric label="Max" value={String(col.max)} />}
                {col.mean !== undefined && <Metric label="Mean" value={String(col.mean)} />}

                {col.sampleValues.length > 0 && (
                  <div className="col-span-2 sm:col-span-4">
                    <p className="text-[10px] text-[#52525b] mb-1.5">Sample values</p>
                    <div className="flex flex-wrap gap-1">
                      {col.sampleValues.map((v, i) => (
                        <span key={i} className="badge badge-muted text-[10px] py-0 px-2 font-mono">{v || '(empty)'}</span>
                      ))}
                    </div>
                  </div>
                )}

                {col.issues.length > 0 && (
                  <div className="col-span-2 sm:col-span-4">
                    <p className="text-[10px] text-[#52525b] mb-1.5">Issues</p>
                    <div className="space-y-1">
                      {col.issues.map((issue, i) => (
                        <p key={i} className="text-xs text-[#f87171]">· {issue}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Metric({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div>
      <p className="text-[10px] text-[#52525b] mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${warn ? 'text-[#f87171]' : 'text-[#a1a1aa]'}`}>{value}</p>
    </div>
  );
}
