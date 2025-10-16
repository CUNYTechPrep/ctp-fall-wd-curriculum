'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => void
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const storedToken = localStorage.getItem('accessToken')
    if (storedToken) {
      try {
        const res = await fetch('/api/auth/user', {
          headers: { Authorization: `Bearer ${storedToken}` }
        })
        
        if (res.ok) {
          const data = await res.json()
          setUser(data)
          setToken(storedToken)
        } else {
          localStorage.removeItem('accessToken')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('accessToken')
      }
    }
    setLoading(false)
  }

  async function signIn(email: string, password: string) {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error)
    }

    const { accessToken } = await res.json()
    localStorage.setItem('accessToken', accessToken)
    setToken(accessToken)
    await checkAuth()
    router.push('/settings')
  }

  async function signUp(email: string, password: string) {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error)
    }
  }

  function signOut() {
    localStorage.removeItem('accessToken')
    setUser(null)
    setToken(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
