'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface Settings {
  theme: 'light' | 'dark'
  fontSize: 'small' | 'medium' | 'large' | 'x-large'
  highContrast: boolean
  reducedMotion: boolean
  profilePhoto: string | null
}

interface SettingsContextType {
  settings: Settings
  loading: boolean
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>
}

const defaultSettings: Settings = {
  theme: 'light',
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  profilePhoto: null
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    if (token) {
      loadSettings()
    }
  }, [token])

  useEffect(() => {
    applySettings()
  }, [settings])

  async function loadSettings() {
    if (!token) return

    try {
      const res = await fetch('/api/settings', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateSettings(newSettings: Partial<Settings>) {
    if (!token) return

    const updated = { ...settings, ...newSettings }
    setSettings(updated)

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newSettings)
      })
    } catch (error) {
      console.error('Failed to update settings:', error)
    }
  }

  function applySettings() {
    const root = document.documentElement
    
    // Apply theme
    root.setAttribute('data-theme', settings.theme)
    
    // Apply font size
    root.setAttribute('data-font-size', settings.fontSize)
    
    // Apply high contrast
    root.setAttribute('data-high-contrast', settings.highContrast.toString())
    
    // Apply reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--transition-speed', '0s')
    } else {
      root.style.setProperty('--transition-speed', '0.3s')
    }
  }

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}
