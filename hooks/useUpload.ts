'use client'
import { useState, useCallback } from 'react'
import { parseFile } from '@/lib/csv'
import { uploadService, type UploadResult } from '@/services/upload.service'
import type { ParsedData, AnalysisStatus } from '@/types/analysis'
import toast from 'react-hot-toast'

const MAX_SIZE_MB = 50

export function useUpload() {
  const [file, setFile]             = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [status, setStatus]         = useState<AnalysisStatus>('idle')
  const [progress, setProgress]     = useState(0)
  const [error, setError]           = useState<string | null>(null)

  const validateFile = (f: File): string | null => {
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (!['csv', 'xlsx', 'xls'].includes(ext ?? '')) return 'Sirf CSV aur Excel files supported hain.'
    if (f.size > MAX_SIZE_MB * 1024 * 1024) return `File ${MAX_SIZE_MB}MB se choti honi chahiye.`
    return null
  }

  const upload = useCallback(async (f: File) => {
    const validationError = validateFile(f)
    if (validationError) { toast.error(validationError); setError(validationError); return }

    setFile(f)
    setError(null)
    setStatus('uploading')
    setProgress(10)

    try {
      // Step 1: Python backend pe upload karo (plan check + limit check wahan hoga)
      const result = await uploadService.uploadFile(f, setProgress)
      setUploadResult(result)
      setProgress(60)

      // Step 2: Content frontend pe parse karo (analysis ke liye)
      setStatus('parsing')
      const data = await parseFile(f)
      setParsedData(data)
      setProgress(100)
      setStatus('complete')
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : 'Upload fail ho gaya'
      setError(msg)
      setStatus('error')
      toast.error(msg)
    }
  }, [])

  const reset = useCallback(() => {
    setFile(null)
    setParsedData(null)
    setUploadResult(null)
    setStatus('idle')
    setProgress(0)
    setError(null)
  }, [])

  return { file, parsedData, uploadResult, status, progress, error, upload, reset }
}
