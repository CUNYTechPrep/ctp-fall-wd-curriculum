'use client'

import { useState, FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      router.push('/settings')
    } catch (err: any) {
      setError(err.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: '500px', paddingTop: '4rem' }}>
      <div className="page-header">
        <h1>Sign In</h1>
        <p>Welcome back! Please sign in to your account.</p>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="button" disabled={loading} style={{ width: '100%' }}>
            {loading ? <span className="loading"></span> : 'Sign In'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Don't have an account? <Link href="/signup" style={{ color: 'var(--primary)' }}>Sign up</Link>
      </p>
    </div>
  )
}
