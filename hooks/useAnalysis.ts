'use client'
import { useState, useCallback } from 'react'
import { analysisService } from '@/services/analysis.service'
import type { AnalysisResult, ParsedData } from '@/types/analysis'
import toast from 'react-hot-toast'

export function useAnalysis() {
  const [result, setResult]   = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const analyze = useCallback(async (data: ParsedData, fileName: string, fileId?: string) => {
    setLoading(true)
    setError(null)
    try {
      const analysisResult = await analysisService.analyze(data, fileName, fileId)
      setResult(analysisResult)
      toast.success('Analysis complete!')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Analysis fail ho gayi'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null); setError(null); setLoading(false)
  }, [])

  return { result, loading, error, analyze, reset }
}
