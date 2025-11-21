/**
 * REF: User Settings and Preferences Page
 *
 * Allows authenticated users to manage profile, appearance settings, and accessibility options.
 * Stores settings in PostgreSQL and uploads files to Supabase Storage.
 *
 * CLOSE: Protected page for managing user preferences and profile picture.
 * Settings are persisted in database and applied to the DOM.
 *
 * PAGE STRUCTURE:
 * | `Section` | Purpose |
 * |---------|---------|
 * | `Profile` | Upload profile picture |
 * | `Appearance` | Theme and font size selection |
 * | `Accessibility` | High contrast and reduced motion |
 *
 * SETTINGS SECTIONS:
 * | `Section` | `Settings` | `Storage` |
 * |---------|----------|---------|
 * | `Profile` | Avatar image | Supabase Storage |
 * | `Appearance` | theme, font_size | user_settings table |
 * | `Accessibility` | high_contrast, reduced_motion | user_settings table |
 *
 * ## Database Schema
 * ```sql
 * CREATE TABLE user_settings (
 *   id SERIAL PRIMARY KEY,
 *   user_id UUID REFERENCES auth.users,
 *   theme TEXT DEFAULT 'light',
 *   font_size TEXT DEFAULT 'medium',
 *   high_contrast BOOLEAN DEFAULT false,
 *   reduced_motion BOOLEAN DEFAULT false,
 *   updated_at TIMESTAMP DEFAULT NOW()
 * )
 * ```
 *
 * THEME OPTIONS:
 * | `Value` | Purpose |
 * |-------|---------|
 * | `light` | Standard light background |
 * | `dark` | Dark mode for reduced eye strain |
 *
 * FONT SIZES:
 * | `Value` | `Size` |
 * |-------|------|
 * | `small` | 12px |
 * | `medium` | 16px (default) |
 * | `large` | 20px |
 *
 * ## Accessibility Features
 * | Setting | Purpose |
 * |---------|---------|
 * | `high_contrast` | Increase color contrast for readability |
 * | `reduced_motion` | Disable animations for motion sensitivity |
 *
 * PROFILE PICTURE UPLOAD:
 * - Bucket: "avatars" in Supabase Storage
 * - Path: profile-pictures/{user_id}/{timestamp}_{filename}
 * - Validation: Image MIME type only
 * - Error handling: Shows message on failure
 * - Success: Displays success message for 2 seconds
 *
 * SETTINGS UPDATE FLOW:
 * 1. User clicks setting (button or toggle)
 * 2. handleUpdateSetting called
 * 3. Optimistic update (set state immediately)
 * 4. Call supabase.from('user_settings').update()
 * 5. If error, revert to previous state
 * 6. Show "Saved!" message for 2 seconds
 *
 * ## DOM Manipulation
 * ```typescript
 * // Apply theme
 * document.body.classList.toggle('dark', settings.theme === 'dark')
 *
 * // Apply font size
 * document.body.classList.remove('font-small', 'font-medium', 'font-large')
 * document.body.classList.add(`font-${settings.font_size}`)
 *
 * // Apply accessibility
 * document.body.classList.toggle('high-contrast', settings.high_contrast)
 * document.body.classList.toggle('reduced-motion', settings.reduced_motion)
 * ```
 *
 * STATE MANAGEMENT:
 * | `State` | Type | Purpose |
 * |-------|------|---------|
 * | `settings` | `object` | Current user settings |
 * | `loading` | `boolean` | Initial load |
 * | `uploading` | `boolean` | File upload in progress |
 * | `message` | `string` | Success/error message |
 *
 * SUPABASE OPERATIONS:
 * ```typescript
 * // Load settings
 * .from('user_settings')
 *   .select('*')
 *   .eq('user_id', user.id)
 *   .single()
 *
 * // Update setting
 * .from('user_settings')
 *   .update({ [field]: value })
 *   .eq('user_id', user.id)
 *
 * // Upload image
 * .storage
 *   .from('avatars')
 *   .upload(path, file)
 * ```
 *
 * FILE REFERENCES:
 * - ../lib/supabase.ts - Supabase client
 * - ../contexts/AuthContext.tsx - useAuth() hook
 * - ../App.tsx - Route definition
 *
 * ## Key Concepts
 * - Settings persistence in database
 * - File uploads to cloud storage
 * - DOM class manipulation for themes
 * - Optimistic updates (instant UI feedback)
 * - Error recovery (revert on failure)
 * - User preferences management
 * - Accessibility-first design
 */

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

/**
 * REF: settings-page-component
 */
export default function Settings() {
  const { user } = useAuth()

  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  /**
   * LOAD SETTINGS FROM POSTGRESQL
   */
  useEffect(() => {
    if (!user) return

    const loadSettings = async () => {
      const { data } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setSettings(data || {
        theme: 'light',
        font_size: 'medium',
        high_contrast: false,
        reduced_motion: false
      })
      setLoading(false)
    }

    loadSettings()
  }, [user])

  /**
   * APPLY SETTINGS
   */
  useEffect(() => {
    if (!settings) return

    const body = document.body

    body.classList.toggle('dark', settings.theme === 'dark')
    body.classList.remove('font-small', 'font-medium', 'font-large')
    body.classList.add(`font-${settings.font_size}`)
    body.classList.toggle('high-contrast', settings.high_contrast)
    body.classList.toggle('reduced-motion', settings.reduced_motion)
  }, [settings])

  /**
   * UPDATE SETTING
   */
  const handleUpdateSetting = async (field: string, value: any) => {
    if (!user || !settings) return

    const prev = { ...settings }
    setSettings({ ...settings, [field]: value })

    try {
      const { error } = await supabase
        .from('user_settings')
        .update({ [field]: value })
        .eq('user_id', user.id)

      if (error) throw error

      setMessage('Saved!')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setSettings(prev)
      setMessage('Failed to save')
      console.error(error)
    }
  }

  /**
   * UPLOAD PROFILE PICTURE
   */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return

    const file = e.target.files[0]

    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image')
      return
    }

    setUploading(true)

    try {
      const path = `profile-pictures/${user.id}/${Date.now()}_${file.name}`

      await supabase.storage.from('avatars').upload(path, file)

      setMessage('Profile picture updated!')
      setTimeout(() => setMessage(''), 2000)
    } catch (error: any) {
      setMessage(error.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div>Loading...</div></div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Saved') || message.includes('updated')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Profile */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <div>
            <label className="block text-sm font-medium mb-2">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="w-full"
            />
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Appearance</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <div className="flex gap-4">
                {['light', 'dark'].map(theme => (
                  <button
                    key={theme}
                    onClick={() => handleUpdateSetting('theme', theme)}
                    className={`px-6 py-3 rounded-lg border-2 capitalize ${
                      settings.theme === theme
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-300'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Font Size</label>
              <div className="flex gap-4">
                {['small', 'medium', 'large'].map(size => (
                  <button
                    key={size}
                    onClick={() => handleUpdateSetting('font_size', size)}
                    className={`px-6 py-3 rounded-lg border-2 capitalize ${
                      settings.font_size === size
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Accessibility</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">High Contrast</h3>
                <p className="text-sm text-gray-600">Increase contrast</p>
              </div>
              <button
                onClick={() => handleUpdateSetting('high_contrast', !settings.high_contrast)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.high_contrast ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition ${
                    settings.high_contrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Reduce Motion</h3>
                <p className="text-sm text-gray-600">Minimize animations</p>
              </div>
              <button
                onClick={() => handleUpdateSetting('reduced_motion', !settings.reduced_motion)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.reduced_motion ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition ${
                    settings.reduced_motion ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
// CLOSE: settings-page-component
