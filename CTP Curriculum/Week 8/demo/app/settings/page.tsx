'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useSettings } from '@/contexts/SettingsContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function SettingsPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { settings, loading: settingsLoading, updateSettings } = useSettings()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  if (authLoading || settingsLoading) {
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
        <div className="nav-brand">Settings</div>
        <Link href="/profile" className="nav-link">Profile</Link>
        <button onClick={signOut} className="button button-secondary">
          Sign Out
        </button>
      </nav>

      <div className="page-header">
        <h1>Accessibility Settings</h1>
        <p>Customize your experience</p>
      </div>

      <div className="settings-grid">
        {/* Theme Setting */}
        <div className="card">
          <div className="setting-item">
            <div>
              <div className="setting-label">Theme</div>
              <div className="setting-description">
                Choose between light and dark mode
              </div>
            </div>
            <select
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' })}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        {/* Font Size Setting */}
        <div className="card">
          <div className="setting-item">
            <div>
              <div className="setting-label">Font Size</div>
              <div className="setting-description">
                Adjust text size for better readability
              </div>
            </div>
            <select
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: e.target.value as any })}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="x-large">Extra Large</option>
            </select>
          </div>
        </div>

        {/* High Contrast Setting */}
        <div className="card">
          <div className="setting-item">
            <div>
              <div className="setting-label">High Contrast</div>
              <div className="setting-description">
                Increase contrast for better visibility
              </div>
            </div>
            <div
              className={`toggle ${settings.highContrast ? 'active' : ''}`}
              onClick={() => updateSettings({ highContrast: !settings.highContrast })}
              role="switch"
              aria-checked={settings.highContrast}
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  updateSettings({ highContrast: !settings.highContrast })
                }
              }}
            >
              <div className="toggle-slider"></div>
            </div>
          </div>
        </div>

        {/* Reduced Motion Setting */}
        <div className="card">
          <div className="setting-item">
            <div>
              <div className="setting-label">Reduced Motion</div>
              <div className="setting-description">
                Minimize animations and transitions
              </div>
            </div>
            <div
              className={`toggle ${settings.reducedMotion ? 'active' : ''}`}
              onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
              role="switch"
              aria-checked={settings.reducedMotion}
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  updateSettings({ reducedMotion: !settings.reducedMotion })
                }
              }}
            >
              <div className="toggle-slider"></div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ opacity: 0.7 }}>
          Settings are automatically saved and synced across devices
        </p>
      </div>
    </div>
  )
}
