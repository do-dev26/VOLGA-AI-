'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import type { ParsedData } from '@/types/analysis';
import { formatNumber, truncate } from '@/lib/utils';

interface FilePreviewProps {
  data: ParsedData;
}

export function FilePreview({ data }: FilePreviewProps) {
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const totalPages = Math.ceil(data.rows.length / pageSize);
  const rows = data.rows.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#1f1f22]">
        <div className="flex items-center gap-2">
          <Eye size={14} className="text-[#00f5aa]" />
          <span className="text-sm font-medium">Preview</span>
        </div>
        <span className="text-xs text-[#52525b]">
          {formatNumber(data.totalRows)} rows · {data.headers.length} columns
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1f1f22]">
              <th className="px-3 py-2.5 text-left text-[#3f3f46] font-medium w-10">#</th>
              {data.headers.map((h) => (
                <th key={h} className="px-3 py-2.5 text-left text-[#71717a] font-medium whitespace-nowrap">
                  {truncate(h, 20)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-[#0f0f11] hover:bg-white/[0.015] transition-colors">
                <td className="px-3 py-2 text-[#3f3f46]">{page * pageSize + i + 1}</td>
                {data.headers.map((_, j) => (
                  <td key={j} className="px-3 py-2 text-[#a1a1aa] whitespace-nowrap">
                    {row[j] === '' || row[j] === undefined
                      ? <span className="text-[#f87171] italic">null</span>
                      : truncate(row[j], 30)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#1f1f22]">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 text-xs text-[#71717a] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-xs text-[#52525b]">Page {page + 1} of {totalPages}</span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="flex items-center gap-1 text-xs text-[#71717a] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
