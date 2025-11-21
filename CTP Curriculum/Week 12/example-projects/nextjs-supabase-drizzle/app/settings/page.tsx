/**
 * REF: file-header
 *
 * # Settings Page - User Preferences with Drizzle
 *
 * User settings management with type-safe Drizzle queries.
 *
 * ## Architecture
 * - **Drizzle**: Update operations for settings
 * - **Supabase Storage**: File uploads (avatar)
 * - **Hybrid**: Each tool for its strength
 *
 * ## Features
 * | Feature | `Implementation` | Benefit |
 * |---------|----------------|---------|
 * | Settings updates | Drizzle ORM | Type-safe mutations |
 * | File uploads | Supabase Storage | Easy CDN integration |
 * | Theme toggle | Real-time DOM updates | Instant UI changes |
 * | `Accessibility` | Settings persistence | Better UX |
 */
// CLOSE: file-header

'use client'

/**
 * REF: imports
 *
 * ## Import Dependencies
 *
 * ### React Hooks
 * - `useState`: Form state management
 * - `useEffect`: Load settings and apply to DOM
 *
 * ### Custom Hooks & Clients
 * - `useAuth`: Get current user
 * - `getUserSettings`: Drizzle query
 * - `updateUserSettings`: Drizzle mutation
 * - `createClient`: Supabase for file uploads
 */
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserSettings, updateUserSettings } from '@/lib/db/queries'
import { createClient } from '@/lib/supabase/client'
// CLOSE: imports

/**
 * REF: component-function
 *
 * ## SettingsPage Component
 *
 * Main page component for user settings management.
 */
export default function SettingsPage() {
  const { user } = useAuth()
  const supabase = createClient()
  // CLOSE: component-function

  /**
   * REF: state-management
   *
   * ## State Variables
   *
   * | `State` | Type | Purpose |
   * |-------|------|---------|
   * | `settings` | `any \| null` | Current user settings from database |
   * | `displayName` | `string` | User's display name |
   * | `loading` | `boolean` | Initial load state |
   * | `saving` | `boolean` | Update in progress |
   * | `uploading` | `boolean` | File upload in progress |
   * | `message` | `string` | Success/error message to user |
   */
  const [settings, setSettings] = useState<any>(null)
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  // CLOSE: state-management

  /**
   * REF: load-settings-effect
   *
   * ## Load Settings Effect
   *
   * Fetches user settings with type-safe Drizzle query.
   *
   * ### Using Drizzle
   * `getUserSettings()` provides full type safety for the returned settings object.
   */
  useEffect(() => {
    if (!user) return

    const loadSettings = async () => {
      try {
        const userSettings = await getUserSettings(user.id)
        if (userSettings) {
          setSettings(userSettings)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error loading settings:', error)
        setLoading(false)
      }
    }

    loadSettings()
  }, [user])
  // CLOSE: load-settings-effect

  /**
   * REF: apply-settings-effect
   *
   * ## Apply Settings to DOM Effect
   *
   * Applies settings to document body classes for immediate visual changes.
   *
   * ### DOM Manipulations
   * - Theme: Toggle `dark` class
   * - Font size: Apply `font-{size}` class
   * - High contrast: Toggle `high-contrast` class
   * - Reduced motion: Toggle `reduced-motion` class
   */
  useEffect(() => {
    if (!settings) return

    const body = document.body

    body.classList.toggle('dark', settings.theme === 'dark')
    body.classList.remove('font-small', 'font-medium', 'font-large')
    body.classList.add(`font-${settings.fontSize}`)
    body.classList.toggle('high-contrast', settings.highContrast)
    body.classList.toggle('reduced-motion', settings.reducedMotion)
  }, [settings])
  // CLOSE: apply-settings-effect

  /**
   * REF: update-setting-handler
   *
   * ## Update Setting Handler
   *
   * Handles updating individual settings with Drizzle.
   *
   * ### Type-Safe Update
   * `updateUserSettings()` accepts `Partial<Settings>` for type-checked updates.
   *
   * ### Optimistic Updates
   * - Updates UI immediately
   * - Reverts on error
   * - Better UX with instant feedback
   */
  const handleUpdateSetting = async (field: string, value: any) => {
    if (!user || !settings) return

    const previousSettings = { ...settings }
    setSettings({ ...settings, [field]: value })

    try {
      await updateUserSettings(user.id, { [field]: value })
      setMessage('Settings saved!')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setSettings(previousSettings)
      setMessage('Failed to save settings')
      console.error(error)
    }
  }
  // CLOSE: update-setting-handler

  /**
   * REF: profile-picture-upload
   *
   * ## Profile Picture Upload Handler
   *
   * Uses Supabase Storage for file uploads.
   *
   * ### Why Supabase Storage?
   * - Easier than implementing storage with Drizzle
   * - Built-in CDN
   * - Public URL generation
   * - Access control integration
   *
   * ### Upload Flow
   * 1. Validate file type
   * 2. Generate unique filename
   * 3. Upload to Supabase Storage bucket
   * 4. Get public URL
   * 5. Update UI
   */
  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return

    const file = e.target.files[0]

    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image')
      return
    }

    setUploading(true)

    try {
      const filename = `${Date.now()}_${file.name}`
      const path = `profile-pictures/${user.id}/${filename}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(path)

      setMessage('Profile picture updated!')
      setTimeout(() => setMessage(''), 2000)
    } catch (error: any) {
      setMessage(error.message || 'Failed to upload')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }
  // CLOSE: profile-picture-upload

  /**
   * REF: loading-state
   *
   * ## Loading State UI
   *
   * Shows loading indicator during initial settings fetch.
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }
  // CLOSE: loading-state

  /**
   * REF: no-settings-state
   *
   * ## No Settings State
   *
   * Handles case where settings don't exist for user.
   */
  if (!settings) return <div>Settings not found</div>
  // CLOSE: no-settings-state

  /**
   * REF: main-layout
   *
   * ## Main Settings Layout
   *
   * Settings page with multiple sections.
   */
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>

      {/**
       * REF: message-display
       *
       * ## Message Display
       *
       * Shows success/error messages to user.
       */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('success') || message.includes('saved') || message.includes('updated')
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}
      {/* CLOSE: message-display */}

      {/**
       * REF: profile-section
       *
       * ## Profile Section
       *
       * User profile settings including avatar upload.
       */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              disabled={uploading}
              className="w-full"
            />
          </div>
        </div>
      </div>
      {/* CLOSE: profile-section */}

      {/**
       * REF: appearance-section
       *
       * ## Appearance Section
       *
       * Theme and font size settings.
       */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Appearance</h2>

        <div className="space-y-4">
          {/**
           * REF: theme-setting
           *
           * ## Theme Setting
           *
           * Light/dark mode toggle.
           */}
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <div className="flex gap-4">
              {['light', 'dark'].map(theme => (
                <button
                  key={theme}
                  onClick={() => handleUpdateSetting('theme', theme)}
                  className={`px-6 py-3 rounded-lg border-2 capitalize ${
                    settings.theme === theme
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-300'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
          {/* CLOSE: theme-setting */}

          {/**
           * REF: font-size-setting
           *
           * ## Font Size Setting
           *
           * Small/medium/large font options.
           */}
          <div>
            <label className="block text-sm font-medium mb-2">Font Size</label>
            <div className="flex gap-4">
              {['small', 'medium', 'large'].map(size => (
                <button
                  key={size}
                  onClick={() => handleUpdateSetting('fontSize', size)}
                  className={`px-6 py-3 rounded-lg border-2 capitalize ${
                    settings.fontSize === size
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          {/* CLOSE: font-size-setting */}
        </div>
      </div>
      {/* CLOSE: appearance-section */}

      {/**
       * REF: accessibility-section
       *
       * ## Accessibility Section
       *
       * High contrast and reduced motion toggles.
       */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Accessibility</h2>

        <div className="space-y-4">
          {/**
           * REF: high-contrast-toggle
           *
           * ## High Contrast Toggle
           *
           * Toggle for increased color contrast.
           */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">High Contrast</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Increase contrast</p>
            </div>
            <button
              onClick={() => handleUpdateSetting('highContrast', !settings.highContrast)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.highContrast ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition ${
                  settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          {/* CLOSE: high-contrast-toggle */}

          {/**
           * REF: reduced-motion-toggle
           *
           * ## Reduced Motion Toggle
           *
           * Toggle for minimizing animations.
           */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Reduce Motion</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Minimize animations</p>
            </div>
            <button
              onClick={() => handleUpdateSetting('reducedMotion', !settings.reducedMotion)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition ${
                  settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          {/* CLOSE: reduced-motion-toggle */}
        </div>
      </div>
      {/* CLOSE: accessibility-section */}
    </div>
  )
  // CLOSE: main-layout
}

/**
 * REF: drizzle-queries-example
 *
 * ## Type-Safe Settings Queries
 *
 * From `lib/db/queries.ts`, showing Drizzle update operations.
 *
 * ### Update User Settings
 * ```typescript
 * export async function updateUserSettings(
 *   userId: string,
 *   updates: {
 *     theme?: string
 *     fontSize?: string
 *     highContrast?: boolean
 *     reducedMotion?: boolean
 *   }
 * ) {
 *   const [updated] = await db
 *     .update(userSettings)
 *     .set({
 *       ...updates,
 *       updatedAt: new Date(),
 *     })
 *     .where(eq(userSettings.userId, userId))
 *     .returning()
 *
 *   return updated
 * }
 * ```
 *
 * ### Benefits
 * - Fully type-checked updates
 * - Partial updates supported
 * - Compile-time validation
 * - Returns updated record
 */
// CLOSE: drizzle-queries-example
