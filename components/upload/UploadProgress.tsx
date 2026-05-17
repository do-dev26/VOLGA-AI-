'use client';
import { cn } from '@/lib/utils';
import type { AnalysisStatus } from '@/types/analysis';

interface UploadProgressProps {
  status: AnalysisStatus;
  progress: number;
  fileName?: string;
}

const STATUS_LABELS: Record<AnalysisStatus, string> = {
  idle: '',
  uploading: 'Reading file…',
  parsing: 'Parsing data…',
  analyzing: 'AI analyzing…',
  complete: 'Analysis complete',
  error: 'Analysis failed',
};

export function UploadProgress({ status, progress, fileName }: UploadProgressProps) {
  if (status === 'idle') return null;

  const isError = status === 'error';
  const isComplete = status === 'complete';

  return (
    <div className="card p-4 space-y-3 animate-in">
      <div className="flex items-center justify-between text-sm">
        <span className={cn(
          'font-medium',
          isError ? 'text-[#f87171]' : isComplete ? 'text-[#00f5aa]' : 'text-white'
        )}>
          {STATUS_LABELS[status]}
        </span>
        {fileName && <span className="text-xs text-[#52525b] truncate max-w-[200px]">{fileName}</span>}
      </div>

      <div className="h-1 bg-[#1f1f22] rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isError ? 'bg-[#f87171]' : 'bg-[#00f5aa]'
          )}
          style={{ width: `${isComplete ? 100 : progress}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {(['uploading', 'parsing', 'analyzing', 'complete'] as AnalysisStatus[]).map((s, i) => {
          const statuses: AnalysisStatus[] = ['uploading', 'parsing', 'analyzing', 'complete'];
          const currentIdx = statuses.indexOf(status);
          const isDone = i < currentIdx || isComplete;
          const isActive = s === status;

          return (
            <div key={s} className="flex items-center gap-1.5">
              <div className={cn(
                'w-1.5 h-1.5 rounded-full transition-colors',
                isError ? 'bg-[#f87171]' : isDone || isActive ? 'bg-[#00f5aa]' : 'bg-[#27272a]'
              )} />
              <span className={cn(
                'text-[10px] capitalize',
                isActive ? 'text-[#a1a1aa]' : isDone ? 'text-[#52525b]' : 'text-[#27272a]'
              )}>
                {s === 'uploading' ? 'Read' : s === 'parsing' ? 'Parse' : s === 'analyzing' ? 'AI' : 'Done'}
              </span>
              {i < 3 && <div className="w-4 h-px bg-[#1f1f22]" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
