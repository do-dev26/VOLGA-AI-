'use client'
import { useAuthContext } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuth(requireAuth = false) {
  const { user, backendUser, loading, refreshBackendUser } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      router.replace('/auth/login')
    }
  }, [user, loading, requireAuth, router])

  return {
    user,
    backendUser,
    loading,
    isAuthenticated: !!user,
    isPro: backendUser?.plan === 'pro',
    refreshBackendUser,
  }
}
