'use client'
import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

interface BackendUser {
  id: string
  firebase_uid: string
  email: string
  name: string
  plan: 'free' | 'pro'
  subscription_status: string | null
  files_used_month: number
  limits: {
    files_per_month: number
    max_rows: number
    cloud: boolean
    pdf: boolean
    ai_analysis: boolean
  }
  pro_since: string | null
}

interface AuthContextValue {
  user: User | null
  backendUser: BackendUser | null
  loading: boolean
  refreshBackendUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null, backendUser: null, loading: true,
  refreshBackendUser: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]               = useState<User | null>(null)
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null)
  const [loading, setLoading]         = useState(true)
  const synced                        = useRef(false)

  const syncBackend = async (firebaseUser: User) => {
    try {
      const token = await firebaseUser.getIdToken()
      const res = await fetch(`${BACKEND_URL}/api/auth/sync`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setBackendUser(data)
      }
    } catch (e) {
      console.warn('Backend sync failed:', e)
    }
  }

  const refreshBackendUser = async () => {
    if (!user) return
    const token = await user.getIdToken()
    const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) setBackendUser(await res.json())
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u && !synced.current) {
        synced.current = true
        await syncBackend(u)
      }
      if (!u) {
        synced.current = false
        setBackendUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  return (
    <AuthContext.Provider value={{ user, backendUser, loading, refreshBackendUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() { return useContext(AuthContext) }
