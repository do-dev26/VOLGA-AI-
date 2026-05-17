'use client'
import { useEffect, useState } from 'react'
import { historyService } from '@/services/history.service'
import type { HistoryItem } from '@/types/user'
import { formatRelativeTime, getScoreColor, formatNumber } from '@/lib/utils'
import { BarChart3, FileText, Zap, TrendingUp, ExternalLink, Trash2 } from 'lucide-react'
import Link from 'next/link'

// ─── StatsCards ─────────────────────────────────────────
export function StatsCards({ userId }: { userId: string }) {
  const [stats, setStats]   = useState({ total: 0, avgScore: 0, thisMonth: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    historyService.getUserHistory(userId, 100)
      .then((history) => {
        const total    = history.length
        const avgScore = total > 0
          ? Math.round(history.reduce((s, h) => s + h.overallScore, 0) / total)
          : 0
        const now = new Date()
        const thisMonth = history.filter(
          (h) => new Date(h.analysisDate).getMonth() === now.getMonth()
        ).length
        setStats({ total, avgScore, thisMonth })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  const cards = [
    { label: 'Total files',  value: formatNumber(stats.total),   icon: FileText, color: '#60a5fa' },
    { label: 'Avg quality',  value: stats.avgScore ? `${stats.avgScore}` : '—', icon: BarChart3, color: getScoreColor(stats.avgScore) },
    { label: 'This month',   value: String(stats.thisMonth),      icon: TrendingUp, color: '#00f5aa' },
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="card p-3 text-center">
          <Icon size={16} style={{ color }} className="mx-auto mb-2" />
          {loading
            ? <div className="skeleton h-5 w-10 mx-auto mb-1 rounded" />
            : <div className="text-lg font-black" style={{ color }}>{value}</div>}
          <div className="text-[9px] text-[#52525b] mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  )
}

// ─── UsageCard ───────────────────────────────────────────
export function UsageCard({
  filesUsedMonth, limit, plan,
}: {
  filesUsedMonth: number
  limit: number
  plan: string
}) {
  const unlimited = limit === -1
  const pct   = unlimited ? 0 : Math.min(100, Math.round((filesUsedMonth / limit) * 100))
  const color = pct >= 90 ? '#f87171' : pct >= 70 ? '#fbbf24' : '#00f5aa'

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-[#00f5aa]" />
          <span className="text-xs font-medium">Monthly usage</span>
        </div>
        {plan === 'free' && (
          <Link href="/pricing" className="text-[10px] text-[#00f5aa] hover:underline">
            Upgrade
          </Link>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span className="text-2xl font-black" style={{ color: unlimited ? '#00f5aa' : color }}>
          {filesUsedMonth}
        </span>
        <span className="text-xs text-[#52525b] mb-1">
          / {unlimited ? '∞' : limit} files
        </span>
      </div>

      {!unlimited && (
        <div className="h-1.5 bg-[#1f1f22] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
      )}

      <p className="text-[10px] text-[#52525b]">
        {unlimited
          ? 'Pro plan — unlimited files'
          : pct >= 90
          ? 'Almost at limit — consider upgrading'
          : `${limit - filesUsedMonth} files remaining this month`}
      </p>
    </div>
  )
}

// ─── HistoryList ─────────────────────────────────────────
export function HistoryList({
  userId, limit: listLimit = 20, compact = false,
}: { userId: string; limit?: number; compact?: boolean }) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    historyService.getUserHistory(userId, listLimit)
      .then(setHistory)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId, listLimit])

  const handleDelete = async (id: string) => {
    await historyService.deleteAnalysis(id)
    setHistory((prev) => prev.filter((h) => h.id !== id))
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f22]">
        <span className="text-xs font-medium">Recent files</span>
        {!compact && (
          <Link href="/history" className="text-[10px] text-[#00f5aa] hover:underline">View all</Link>
        )}
      </div>

      {loading ? (
        <div className="p-4 space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}
        </div>
      ) : history.length === 0 ? (
        <div className="p-6 text-center">
          <FileText size={20} className="text-[#3f3f46] mx-auto mb-2" />
          <p className="text-xs text-[#52525b]">No files yet</p>
        </div>
      ) : (
        <div className="divide-y divide-[#0f0f11]">
          {history.map((item) => {
            const color = getScoreColor(item.overallScore)
            return (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.015] group transition-colors">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0"
                  style={{ background: `${color}18`, color }}
                >
                  <FileText size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{item.fileName}</p>
                  <p className="text-[10px] text-[#52525b] mt-0.5">
                    {formatNumber(item.rowCount)} rows · {formatRelativeTime(new Date(item.analysisDate))}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[rgba(248,113,113,0.1)] text-[#3f3f46] hover:text-[#f87171] transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {compact && history.length > 0 && (
        <div className="px-4 py-3 border-t border-[#1f1f22]">
          <Link href="/history" className="text-[10px] text-[#00f5aa] hover:underline flex items-center gap-1">
            View all history <ExternalLink size={10} />
          </Link>
        </div>
      )}
    </div>
  )
}
