'use client';
import { useState } from 'react';
import { ScoreCard } from './ScoreCard';
import { Findings } from './Findings';
import { ColumnInsights } from './ColumnInsights';
import { Anomalies, Recommendations, Patterns } from './Anomalies';
import type { AnalysisResult } from '@/types/analysis';
import { cn } from '@/lib/utils';
import { AlertTriangle, Columns, Zap, TrendingUp, BookOpen, XCircle } from 'lucide-react';

interface AnalysisPanelProps {
  result: AnalysisResult;
}

const TABS = [
  { id: 'findings', label: 'Findings', icon: AlertTriangle },
  { id: 'columns', label: 'Columns', icon: Columns },
  { id: 'recommendations', label: 'Fixes', icon: Zap },
  { id: 'anomalies', label: 'Anomalies', icon: XCircle },
  { id: 'patterns', label: 'Patterns', icon: TrendingUp },
] as const;

type Tab = typeof TABS[number]['id'];

export function AnalysisPanel({ result }: AnalysisPanelProps) {
  const [tab, setTab] = useState<Tab>('findings');

  const counts: Partial<Record<Tab, number>> = {
    findings: result.findings.length,
    columns: result.columns.length,
    recommendations: result.recommendations.length,
    anomalies: result.anomalies.length,
    patterns: result.patterns.length,
  };

  return (
    <div className="space-y-4 animate-in">
      <ScoreCard result={result} />

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all flex-shrink-0',
              tab === id
                ? 'bg-[rgba(0,245,170,0.1)] text-[#00f5aa] border border-[rgba(0,245,170,0.2)] font-medium'
                : 'text-[#71717a] hover:text-white hover:bg-white/5'
            )}
          >
            <Icon size={12} />
            {label}
            {counts[id] !== undefined && counts[id]! > 0 && (
              <span className={cn(
                'ml-0.5 px-1.5 py-0 rounded-full text-[10px] font-semibold',
                tab === id ? 'bg-[rgba(0,245,170,0.2)] text-[#00f5aa]' : 'bg-[#1f1f22] text-[#52525b]'
              )}>
                {counts[id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade">
        {tab === 'findings' && <Findings findings={result.findings} />}
        {tab === 'columns' && <ColumnInsights columns={result.columns} />}
        {tab === 'recommendations' && <Recommendations recommendations={result.recommendations} />}
        {tab === 'anomalies' && <Anomalies anomalies={result.anomalies} />}
        {tab === 'patterns' && <Patterns patterns={result.patterns} />}
      </div>
    </div>
  );
}
