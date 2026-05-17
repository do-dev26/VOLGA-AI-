import { getToken } from '@/lib/token'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export interface UploadResult {
  file_id:     string
  name:        string
  rows:        number
  cols:        number
  size_kb:     number
  status:      string
  content_b64: string
}

export const uploadService = {
  /**
   * File seedha Python backend pe bhejo — Firebase Storage NAHI.
   * Backend content parse karke row/col count return karta hai.
   */
  async uploadFile(file: File, onProgress?: (p: number) => void): Promise<UploadResult> {
    const token    = await getToken()
    const formData = new FormData()
    formData.append('file', file)

    onProgress?.(10)

    const res = await fetch(`${BACKEND_URL}/api/files/upload`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}` },
      body:    formData,
      // Content-Type mat lagao — browser khud multipart set karta hai
    })

    onProgress?.(90)

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail ?? 'Upload fail ho gaya')
    }

    onProgress?.(100)
    return res.json()
  },

  async listFiles(limit = 30): Promise<any[]> {
    const token = await getToken()
    const res = await fetch(`${BACKEND_URL}/api/files/?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Files fetch nahi hue')
    return res.json()
  },

  async deleteFile(fileId: string): Promise<void> {
    const token = await getToken()
    const res = await fetch(`${BACKEND_URL}/api/files/${fileId}`, {
      method:  'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Delete fail ho gaya')
  },
}
