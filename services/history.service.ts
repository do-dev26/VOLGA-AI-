import { getToken } from '@/lib/token'
import type { HistoryItem } from '@/types/user'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const historyService = {
  async getUserHistory(_userId: string, limitCount = 20): Promise<HistoryItem[]> {
    // _userId ignore karo — token se backend khud identify karta hai
    const token = await getToken()
    const res = await fetch(`${BACKEND_URL}/api/files/?limit=${limitCount}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('History fetch nahi hui')

    const files = await res.json()
    return files.map((f: any): HistoryItem => ({
      id:           f.id,
      userId:       '',
      fileName:     f.name,
      fileSize:     (f.size_kb ?? 0) * 1024,
      rowCount:     f.original_rows ?? 0,
      columnCount:  f.original_cols ?? 0,
      overallScore: 0,
      analysisDate: new Date(f.created_at),
      status:       f.status === 'done' ? 'complete' : f.status ?? 'complete',
      resultId:     f.analysis_id ?? '',
    }))
  },

  async deleteAnalysis(fileId: string): Promise<void> {
    const token = await getToken()
    const res = await fetch(`${BACKEND_URL}/api/files/${fileId}`, {
      method:  'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Delete fail ho gaya')
  },
}
