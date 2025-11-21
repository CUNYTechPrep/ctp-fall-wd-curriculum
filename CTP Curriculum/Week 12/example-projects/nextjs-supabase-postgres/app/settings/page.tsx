/**
 * Settings Page - User Preferences with PostgreSQL
 *
 * This page manages user accessibility settings stored in PostgreSQL.
 *
 ## Key Concepts
 * - PostgreSQL for storing user preferences
 * - Optimistic UI updates
 * - UPSERT operations
 * - Profile picture upload to Supabase Storage
 *
 * ## PostgreSQL vs NoSQL for Settings
 * - PostgreSQL: Structured schema, type safety, relations
 * - NoSQL: Flexible schema, easier for nested objects
 * - For settings, both work well
 * - PostgreSQL better if you need to query across users
 *
 * ## Supabase Storage
 * - S3-compatible object storage
 * - Built-in image transformations
 * - CDN included
 * - RLS policies for access control
 */

'use client'

// REF: Import statement
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'
// CLOSE: Import statement

// REF: Type definition
type UserSettings = Database[\'public\'][\'Tables\'][\'user_settings\'][\'Row\']
// CLOSE: Type definition

// REF: Function: export
export default function SettingsPage() {
  const { user, updateProfile } = useAuth()
  const supabase = createClient()
// CLOSE: Function: export

// REF: Constant declaration
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
// CLOSE: Constant declaration

  /**
   * LOAD USER SETTINGS
   *
   * Fetch from PostgreSQL user_settings table
   *
   * UNIQUE CONSTRAINT:
   * - user_id is UNIQUE in user_settings
   * - Each user has exactly one settings row
   * - Use .single() to get object instead of array
   */
// REF: Function: useEffect
  useEffect(() => {
    if (!user) return
// CLOSE: Function: useEffect

// REF: Async function: const
    const loadSettings = async () => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()
// CLOSE: Async function: const

// REF: Control flow
      if (error) {
        console.error('Error loading settings:', error)
      } else {
        setSettings(data)
      }
// CLOSE: Control flow

      // Get display name from user_profiles
// REF: Constant declaration
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single()
// CLOSE: Constant declaration

      setDisplayName(profile?.display_name || '')
      setLoading(false)
    }

    loadSettings()
  }, [user, supabase])

  /**
   * UPDATE SETTING
   *
   * Updates a single setting field
   *
   * @param field - Setting field name
   * @param value - New value
   *
   * OPTIMISTIC UPDATE PATTERN:
   * 1. Update local state immediately (UI responds instantly)
   * 2. Send update to database
   * 3. On error, revert local state
   * 4. Show success/error message
   *
   * This provides the best UX - no waiting for server!
   */
// REF: Async function: const
  const handleUpdateSetting = async (field: string, value: any) => {
    if (!user || !settings) return
// CLOSE: Async function: const

// REF: Constant: previousSettings
    const previousSettings = { ...settings }
    setSettings({ ...settings, [field]: value })
// CLOSE: Constant: previousSettings

    try {
      const { error } = await supabase
        .from('user_settings')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)

// REF: Control flow
      if (error) throw error
// CLOSE: Control flow

      setMessage('Settings saved!')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setSettings(previousSettings)
      setMessage('Failed to save settings')
      console.error(error)
    }
  }

  /**
   * PROFILE PICTURE UPLOAD
   *
   * Upload to Supabase Storage
   *
   * @param e - File input change event
   *
   * SUPABASE STORAGE FLOW:
   * 1. User selects file
   * 2. Validate client-side
   * 3. Upload to Storage bucket
   * 4. Get public URL
   * 5. Update user_profiles table
   * 6. Update auth metadata
   *
   * STORAGE PATH:
   * profile-pictures/{userId}/{filename}
   * - Organized by user
   * - Easy to manage
   * - RLS can protect based on userId
   */
// REF: Async function: const
  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return
// CLOSE: Async function: const

// REF: Constant: file
    const file = e.target.files[0]
// CLOSE: Constant: file

    // Validate
// REF: Control flow
    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file')
      return
    }
// CLOSE: Control flow

// REF: Control flow
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image must be less than 5MB')
      return
    }
// CLOSE: Control flow

    setUploading(true)

    try {
      const filename = `${Date.now()}_${file.name}`
      const filePath = `profile-pictures/${user.id}/${filename}`

      // Upload to Storage
// REF: Constant declaration
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)
// CLOSE: Constant declaration

// REF: Control flow
      if (uploadError) throw uploadError
// CLOSE: Control flow

      // Get public URL
// REF: Constant declaration
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)
// CLOSE: Constant declaration

      // Update user profile
      await updateProfile({ avatarUrl: publicUrl })

      setMessage('Profile picture updated!')
      setTimeout(() => setMessage(''), 2000)
    } catch (error: any) {
      setMessage(error.message || 'Failed to upload')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

// REF: Control flow
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div>Loading...</div></div>
  }
// CLOSE: Control flow

// REF: Control flow
  if (!settings) {
    return <div className="flex items-center justify-center min-h-screen"><div>Settings not found</div></div>
  }
// CLOSE: Control flow

  /**
   * RENDER
   */
// REF: JSX return
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>
// CLOSE: JSX return

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success') || message.includes('saved') || message.includes('updated')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Profile Section */}
// REF: JSX element
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
// CLOSE: JSX element

// REF: JSX element
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
              />
            </div>
// CLOSE: JSX element

// REF: JSX element
            <div>
              <label className="block text-sm font-medium mb-2">Profile Picture</label>
              <input
                type="file"
// CLOSE: JSX element
  /** REF: code-block
   */
                accept="image/*"
                onChange={handleProfilePictureUpload}
                disabled={uploading}
                className="w-full"
  // CLOSE: code-block
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
// REF: JSX element
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Appearance</h2>
// CLOSE: JSX element

// REF: JSX element
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
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
// CLOSE: JSX element

// REF: JSX element
            <div>
              <label className="block text-sm font-medium mb-2">Font Size</label>
              <div className="flex gap-4">
                {['small', 'medium', 'large'].map(size => (
                  <button
                    key={size}
                    onClick={() => handleUpdateSetting('font_size', size)}
                    className={`px-6 py-3 rounded-lg border-2 capitalize ${
                      settings.font_size === size
                        ? 'border-blue-600 bg-blue-50'
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
// CLOSE: JSX element

        {/* Accessibility */}
// REF: JSX element
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Accessibility</h2>
// CLOSE: JSX element

// REF: JSX element
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">High Contrast</h3>
                <p className="text-sm text-gray-600">Increase contrast for better visibility</p>
              </div>
              <button
                onClick={() => handleUpdateSetting('high_contrast', !settings.high_contrast)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.high_contrast ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.high_contrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
// CLOSE: JSX element

// REF: JSX element
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Reduce Motion</h3>
                <p className="text-sm text-gray-600">Minimize animations</p>
              </div>
              <button
                onClick={() => handleUpdateSetting('reduced_motion', !settings.reduced_motion)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  settings.reduced_motion ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
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
// CLOSE: JSX element

/**
 * SUPABASE STORAGE POLICIES
 *
 * RLS for Storage bucket:
 *
 * ```sql
 * -- Allow users to upload their own profile pictures
 * CREATE POLICY "Users can upload own profile pictures"
 * ON storage.objects FOR INSERT
 * WITH CHECK (
 *   bucket_id = 'avatars' AND
 *   auth.uid()::text = (storage.foldername(name))[1]
 * );
 *
 * -- Allow anyone to view profile pictures
 * CREATE POLICY "Profile pictures are publicly accessible"
 * ON storage.objects FOR SELECT
 * USING (bucket_id = 'avatars');
 * ```
 */
