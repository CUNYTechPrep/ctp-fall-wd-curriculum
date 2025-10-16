'use client'

import { useState, FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter')
      return
    }

    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter')
      return
    }

    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number')
      return
    }

    setLoading(true)

    try {
      await signUp(email, password)
      alert('Sign up successful! Please sign in.')
      router.push('/login')
    } catch (err: any) {
      setError(err.message || 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: '500px', paddingTop: '4rem' }}>
      <div className="page-header">
        <h1>Sign Up</h1>
        <p>Create your account to get started.</p>
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
            <small style={{ display: 'block', marginTop: '0.5rem', opacity: 0.7 }}>
              Must be 8+ characters with uppercase, lowercase, and numbers
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="button" disabled={loading} style={{ width: '100%' }}>
            {loading ? <span className="loading"></span> : 'Sign Up'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Already have an account? <Link href="/login" style={{ color: 'var(--primary)' }}>Sign in</Link>
      </p>
    </div>
  )
}
