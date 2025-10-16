'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useSettings } from '@/contexts/SettingsContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, loading: authLoading, signOut, token } = useAuth()
  const { settings, updateSettings } = useSettings()
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB')
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }

      const { url } = await res.json()
      await updateSettings({ profilePhoto: url })
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="loading"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container">
      <nav className="nav">
        <div className="nav-brand">Profile</div>
        <Link href="/settings" className="nav-link">Settings</Link>
        <button onClick={signOut} className="button button-secondary">
          Sign Out
        </button>
      </nav>

      <div className="page-header">
        <h1>Your Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '2rem' }}>Profile Photo</h2>

        {settings.profilePhoto ? (
          <img
            src={settings.profilePhoto}
            alt="Profile"
            className="profile-photo"
            style={{ marginBottom: '1rem' }}
          />
        ) : (
          <div
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '3rem'
            }}
          >
            {user.userId?.[0]?.toUpperCase() || '?'}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="button"
          disabled={uploading}
        >
          {uploading ? <span className="loading"></span> : 'Upload Photo'}
        </button>

        {uploadError && (
          <div className="error-message" style={{ marginTop: '1rem' }}>
            {uploadError}
          </div>
        )}

        <p style={{ marginTop: '1rem', opacity: 0.7, fontSize: '0.875rem' }}>
          Max file size: 5MB | Formats: JPG, PNG, GIF
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Account Information</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <strong>Email:</strong> {user.userId}
          </div>
          <div>
            <strong>Account Status:</strong> <span style={{ color: 'var(--success)' }}>Active</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Current Settings</h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <div>Theme: <strong>{settings.theme}</strong></div>
          <div>Font Size: <strong>{settings.fontSize}</strong></div>
          <div>High Contrast: <strong>{settings.highContrast ? 'On' : 'Off'}</strong></div>
          <div>Reduced Motion: <strong>{settings.reducedMotion ? 'On' : 'Off'}</strong></div>
        </div>
        <Link href="/settings" className="button" style={{ marginTop: '1rem' }}>
          Edit Settings
        </Link>
      </div>
    </div>
  )
}
