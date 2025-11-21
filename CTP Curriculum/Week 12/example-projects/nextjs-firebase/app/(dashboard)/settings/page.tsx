/**
 * REF: settings-page
 *
 * # Settings Page
 *
 * User accessibility and profile customization page.
 *
 * ## Key Concepts
 *
 * - **Controlled inputs** - Form fields controlled by React state
 * - **Firestore persistence** - Settings saved to database
 * - **Dynamic CSS** - Apply settings via class names
 * - **Profile pictures** - File upload to Cloud Storage
 * - **Optimistic UI** - Update UI before confirmation
 *
 * ## Features
 *
 * | `Section` | `Settings` |
 * |---------|----------|
 * | `Profile` | Display name, profile picture, email |
 * | `Appearance` | Theme (light/dark), font size (small/med/large) |
 * | `Accessibility` | High contrast, reduce motion |
 *
 * ## Accessibility Matters
 *
 * ### Why Include?
 * - Makes app usable by people with visual impairments
 * - Follows WCAG (Web Content Accessibility Guidelines)
 * - Shows consideration for diverse user needs
 * - Often legally required for public-facing apps
 *
 * ### Features Implemented
 * - **Theme** - Light/Dark mode for eye strain reduction
 * - **Font Size** - Small/Medium/Large options
 * - **High Contrast** - Enhanced contrast for visibility
 * - **Reduced Motion** - Disables animations for motion sensitivity
 *
 * ## Data Persistence
 *
 * 1. **Profile data** - Firebase Auth (displayName, photoURL)
 * 2. **Settings** - Firestore (custom UserSettings document)
 * 3. **Files** - Cloud Storage (profile pictures)
 */
// CLOSE: settings-page

'use client'

/** REF: settings-imports
 * Required imports for React hooks, authentication, and Firebase operations.
 * Manages user settings and profile picture uploads.
 */
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserSettings, updateUserSettings } from '@/lib/firebase/firestore'
import { uploadProfilePicture, validateImageFile } from '@/lib/firebase/storage'
import { UserSettings } from '@/types'
// CLOSE: settings-imports

export default function SettingsPage() {
  const { user, updateUserProfile } = useAuth()

  /**
   * SETTINGS STATE
   *
   * Local state mirrors database values
   * Updated immediately for better UX, then saved to database
   */
  /** REF: state-variables
   */
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [profilePicture, setProfilePicture] = useState(user?.photoURL || '')
  // CLOSE: state-variables

  /** REF: state-variables
   */
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  // CLOSE: state-variables

  /**
   * LOAD USER SETTINGS EFFECT
   *
   * Fetches user's saved settings from Firestore on mount
   * Settings are stored separately from user profile for better organization
   */
  useEffect(() => {
    if (!user) return

    const loadSettings = async () => {
      try {
  /** REF: state-variables
   */
        const userSettings = await getUserSettings(user.uid)
        if (userSettings) {
          setSettings(userSettings)
  // CLOSE: state-variables
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [user])

  /**
   * APPLY SETTINGS TO DOM
   *
   * Dynamically applies CSS classes to body element based on settings
   * This demonstrates how to apply settings app-wide
   *
   * ALTERNATIVE APPROACHES:
   * - CSS variables (--font-size: 16px)
   * - Context API to provide settings to all components
   * - Tailwind dark mode with class strategy
   */
  useEffect(() => {
    if (!settings) return

    const body = document.body

    // Apply theme
    if (settings.theme === 'dark') {
      body.classList.add('dark')
    } else {
      body.classList.remove('dark')
    }

    // Apply font size
    body.classList.remove('font-small', 'font-medium', 'font-large')
    body.classList.add(`font-${settings.fontSize}`)

    // Apply high contrast
    if (settings.highContrast) {
      body.classList.add('high-contrast')
    } else {
      body.classList.remove('high-contrast')
    }

    // Apply reduced motion
    if (settings.reducedMotion) {
      body.classList.add('reduced-motion')
    } else {
      body.classList.remove('reduced-motion')
    }
  }, [settings])

  /**
   * UPDATE SETTING HANDLER
   *
   * Updates a single setting field
   *
   * @param field - The setting field to update
   * @param value - The new value
   *
   * OPTIMISTIC UPDATE:
   * 1. Update local state immediately (user sees change instantly)
   * 2. Save to database in background
   * 3. If error, revert and show message
   */
  const handleUpdateSetting = async (
    field: keyof Omit<UserSettings, 'id' | 'userId' | 'updatedAt'>,
    value: any
  ) => {
    if (!user || !settings) return

    // Optimistically update local state
    const previousSettings = { ...settings }
    setSettings({ ...settings, [field]: value })

    try {
      await updateUserSettings(user.uid, { [field]: value })
      setMessage('Settings saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      // Revert on error
      setSettings(previousSettings)
      setMessage('Failed to save settings')
      console.error('Error updating settings:', error)
    }
  }

  /**
   * PROFILE UPDATE HANDLER
   *
   * Updates display name and/or profile picture
   */
  const handleUpdateProfile = async () => {
    if (!user) return

    setSaving(true)
    setMessage('')

    try {
      await updateUserProfile(displayName, profilePicture)
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      setMessage(error.message || 'Failed to update profile')
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  /**
   * PROFILE PICTURE UPLOAD HANDLER
   *
   * Handles file selection, validation, and upload
   *
   * @param e - File input change event
   *
 * ### Flow
   * 1. User selects file
   * 2. Validate file type and size
   * 3. Upload to Firebase Storage
   * 4. Get download URL
   * 5. Update profile picture state
   * 6. Auto-save to user profile
   *
   * SECURITY:
   * - Client-side validation (type, size)
   * - Server-side validation (Storage rules)
   * - Unique filenames prevent overwrites
   */
  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || !e.target.files[0]) return

    const file = e.target.files[0]

    // Validate file
  /** REF: state-variables
   */
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setMessage(validation.error || 'Invalid file')
  // CLOSE: state-variables
      return
    }

    setUploading(true)
    setMessage('Uploading...')

    try {
      // Upload to Storage
      const result = await uploadProfilePicture(user.uid, file)

      // Update state and profile
      setProfilePicture(result.fileUrl)
      await updateUserProfile(displayName, result.fileUrl)

      setMessage('Profile picture updated!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      setMessage(error.message || 'Failed to upload image')
      console.error('Error uploading profile picture:', error)
    } finally {
      setUploading(false)
    }
  }

  /**
   * LOADING STATE
   */
  /** REF: conditional-block
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl">Loading settings...</div>
      </div>
    )
  }

  /** REF: conditional-block
   */
  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl">Settings not found</div>
      </div>
    )
  }

  /**
   * REF: settings-page-render
   *
   * # Settings Page Render
   *
   * Three-section layout for profile, appearance, and accessibility settings.
   *
   * ## Sections
   *
   * 1. **Profile Section**
   *    - Display name input
   *    - Profile picture upload
   *    - Email (read-only)
   *    - Update button
   *
   * 2. **Appearance Section**
   *    - Theme selector (Light/Dark)
   *    - Font size buttons (Small/Medium/Large)
   *    - High contrast toggle
   *
   * 3. **Accessibility Section**
   *    - Reduce motion toggle
   *
   * ## Form Pattern
   *
   * - **No form submission** - Each setting saves independently
   * - **Instant feedback** - Changes applied immediately
   * - **Optimistic UI** - State updates before database
   * - **Error handling** - Shows message if save fails
   *
   * ## UI Components
   *
   * | `Component` | Purpose |
   * |-----------|---------|
   * | Message banner | Shows success/error feedback |
   * | Text inputs | For editable fields |
   * | File input | For picture upload (hidden) |
   * | `Buttons` | For theme/size/toggle selections |
   * | Toggle switches | For on/off settings |
   *
   * ## Visual Design
   *
   * - **Cards** - White backgrounds with shadows
   * - **Spacing** - mb-6 between sections
   * - **Dark mode** - dark: variants throughout
   * - **Disabled states** - Opacity and cursor changes
   */
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>

      {/* Message Banner */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('success') || message.includes('updated')
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>

        <div className="space-y-4">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-2xl">
                  {displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
                </div>
              )}

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  disabled={uploading}
                  className="hidden"
                  id="profile-picture-upload"
                />
                <label
                  htmlFor="profile-picture-upload"
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition inline-block ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? 'Uploading...' : 'Change Picture'}
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Max 5MB, PNG/JPG/GIF
                </p>
              </div>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium mb-2">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 cursor-not-allowed"
            />
          </div>

          <button
            onClick={handleUpdateProfile}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Appearance</h2>

        <div className="space-y-4">
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Theme
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => handleUpdateSetting('theme', 'light')}
                className={`px-6 py-3 rounded-lg border-2 transition ${
                  settings.theme === 'light'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => handleUpdateSetting('theme', 'dark')}
                className={`px-6 py-3 rounded-lg border-2 transition ${
                  settings.theme === 'dark'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                🌙 Dark
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Font Size
            </label>
            <div className="flex gap-4">
              {['small', 'medium', 'large'].map(size => (
                <button
                  key={size}
                  onClick={() => handleUpdateSetting('fontSize', size)}
                  className={`px-6 py-3 rounded-lg border-2 transition capitalize ${
                    settings.fontSize === size
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
            <div>
              <h3 className="font-medium">High Contrast</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Increases contrast for better visibility
              </p>
            </div>
            <button
              onClick={() => handleUpdateSetting('highContrast', !settings.highContrast)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.highContrast ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Accessibility</h2>

        <div className="space-y-4">
          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
            <div>
              <h3 className="font-medium">Reduce Motion</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Minimizes animations and transitions
              </p>
            </div>
            <button
              onClick={() => handleUpdateSetting('reducedMotion', !settings.reducedMotion)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
  // CLOSE: settings-page-render
}
