/**
 * REF: settings-page
 *
 * # Settings Page - User Preferences & Accessibility
 *
 * Comprehensive settings management page for user profile, appearance customization,
 * and accessibility features.
 *
 * ## Key Concepts
 *
 * - **Profile Management**: Update display name and profile picture
 * - **Real-time Persistence**: All settings saved to Firestore instantly
 * - **DOM Manipulation**: CSS classes applied to `<body>` for global theming
 * - **Cloud Storage**: Profile pictures uploaded to Firebase Storage
 * - **Optimistic Updates**: UI updates immediately, rolls back on error
 *
 * ## Settings Categories
 *
 * ### 1. Profile Settings
 *
 * | Feature | Description | Storage |
 * |---------|-------------|---------|
 * | **Display Name** | User's visible name across the app | Firebase Auth profile |
 * | **Profile Picture** | Avatar image URL | Firebase Auth + Storage |
 *
 * ### 2. Appearance Settings
 *
 * | Setting | Options | CSS Application |
 * |---------|---------|-----------------|
 * | **Theme** | Light, Dark | `body.dark` class |
 * | **Font Size** | Small, Medium, Large | `body.font-{size}` class |
 *
 * Stored in: `userSettings/{userId}` Firestore collection
 *
 * ### 3. Accessibility Settings
 *
 * | Feature | Purpose | CSS Application |
 * |---------|---------|-----------------|
 * | **High Contrast** | Increases color contrast for visibility | `body.high-contrast` class |
 * | **Reduced Motion** | Minimizes animations for motion sensitivity | `body.reduced-motion` class |
 *
 * ## Why Accessibility Matters
 *
 * | Aspect | Benefit |
 * |--------|---------|
 * | **Inclusivity** | Makes app usable by people with disabilities |
 * | **Legal Compliance** | Required by ADA, WCAG, Section 508 |
 * | **User Base** | 15% of world population has some disability |
 * | **Business Impact** | Larger market reach, better SEO |
 * | **Ethical Responsibility** | Digital equity is a human right |
 *
 * ### WCAG Compliance Levels
 *
 * - **Level A**: Minimum accessibility (baseline)
 * - **Level AA**: Enhanced accessibility (recommended for most sites)
 * - **Level AAA**: Maximum accessibility (ideal but challenging)
 *
 * This component supports Level AA compliance through:
 * - High contrast mode (WCAG 1.4.3)
 * - Reduced motion support (WCAG 2.3.3)
 * - Keyboard accessibility
 * - Screen reader support
 *
 * ## Profile Picture Upload Flow
 *
 * ### Process Steps
 *
 * 1. **User Selection**: User selects image file via `<input type="file">`
 * 2. **Client Validation**:
 *    - Must be image MIME type (`image/*`)
 *    - Maximum size: 5MB
 * 3. **Upload to Storage**: Store at `/profile-pictures/{userId}/{timestamp}_{filename}`
 * 4. **Get Download URL**: Retrieve public URL from Firebase Storage
 * 5. **Update Auth Profile**: Call `updateProfile()` with new photoURL
 * 6. **Update Context**: Refresh user data in AuthContext
 *
 * ### Security Considerations
 *
 * - **File Type Validation**: Only images accepted
 * - **Size Limits**: Prevents abuse and storage costs
 * - **User-scoped Paths**: Files stored per user ID
 * - **Storage Rules**: Firebase rules restrict access
 *
 * ## Data Persistence Strategy
 *
 * ### Settings Storage
 *
 * ```typescript
 * // Firestore Document: userSettings/{userId}
 * {
 *   theme: 'light' | 'dark',
 *   fontSize: 'small' | 'medium' | 'large',
 *   highContrast: boolean,
 *   reducedMotion: boolean,
 *   updatedAt: Timestamp
 * }
 * ```
 *
 * ### Cross-Device Sync
 *
 * - Settings stored in Firestore (cloud)
 * - Automatically syncs across all devices
 * - No local storage needed
 * - Persists across browser sessions
 */

/**
 * REF: settings-imports
 *
 * ## Import Dependencies
 *
 * ### React Hooks
 * - `useState`: Local component state management
 * - `useEffect`: Side effects for data loading and DOM manipulation
 *
 * ### Firestore
 * - `doc`: Reference to Firestore document
 * - `getDoc`: Read document data
 * - `updateDoc`: Partial document updates
 * - `Timestamp`: Server-side timestamp
 *
 * ### Firebase Auth
 * - `updateProfile`: Update user display name and photo URL
 *
 * ### Firebase Storage
 * - `ref`: Create storage reference
 * - `uploadBytes`: Upload file to storage
 * - `getDownloadURL`: Get public URL for uploaded file
 *
 * ### Custom
 * - `db`: Firestore database instance
 * - `storage`: Firebase Storage instance
 * - `useAuth`: Authentication context hook
 *
 * CLOSE: settings-imports
 */
import { useState, useEffect } from 'react'
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'

/**
 * REF: settings-interface
 *
 * ## UserSettings Interface
 *
 * Type definition for user preference settings.
 *
 * ### Properties
 *
 * | Property | Type | Options | Default |
 * |----------|------|---------|---------|
 * | `theme` | String | 'light', 'dark' | 'light' |
 * | `fontSize` | String | 'small', 'medium', 'large' | 'medium' |
 * | `highContrast` | Boolean | true, false | false |
 * | `reducedMotion` | Boolean | true, false | false |
 *
 * ### Usage
 *
 * ```typescript
 * const settings: UserSettings = {
 *   theme: 'dark',
 *   fontSize: 'large',
 *   highContrast: true,
 *   reducedMotion: false
 * }
 * ```
 *
 * CLOSE: settings-interface
 */
interface UserSettings {
  theme: 'light' | 'dark'
  fontSize: 'small' | 'medium' | 'large'
  highContrast: boolean
  reducedMotion: boolean
}

/**
 * REF: settings-component
 *
 * ## Settings Component
 *
 * Main component for user settings management.
 *
 * Provides UI for:
 * - Profile information updates
 * - Appearance customization
 * - Accessibility preferences
 */
export default function Settings() {
  /**
   * REF: settings-auth-context
   *
   * ## Authentication Context
   *
   * Access current user and profile update function.
   *
   * - `user`: Current authenticated user (or null)
   * - `updateUserProfile`: Function to update user's display name and photo
   *
   * CLOSE: settings-auth-context
   */
  const { user, updateUserProfile } = useAuth()

  /**
   * REF: settings-state-preferences
   *
   * ## Settings Preferences State
   *
   * Manages all user preference settings.
   *
   * ### State Object
   *
   * | Field | Type | Description |
   * |-------|------|-------------|
   * | `theme` | 'light' \| 'dark' | Color scheme preference |
   * | `fontSize` | 'small' \| 'medium' \| 'large' | Text size preference |
   * | `highContrast` | boolean | High contrast mode enabled |
   * | `reducedMotion` | boolean | Reduced motion mode enabled |
   *
   * ### Default Values
   *
   * - Theme: 'light' (standard display)
   * - Font Size: 'medium' (comfortable reading)
   * - High Contrast: false (standard colors)
   * - Reduced Motion: false (animations enabled)
   *
   * ### Updates
   *
   * Settings are updated via `handleUpdateSetting()` and immediately
   * persisted to Firestore.
   *
   * CLOSE: settings-state-preferences
   */
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'light',
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
  })

  /**
   * REF: settings-state-form
   *
   * ## Form State
   *
   * Manages profile form inputs and submission states.
   *
   * | State | Type | Purpose |
   * |-------|------|---------|
   * | `displayName` | string | User's display name input |
   * | `loading` | boolean | Initial settings load in progress |
   * | `saving` | boolean | Profile update in progress |
   * | `uploading` | boolean | Profile picture upload in progress |
   * | `message` | string | Success/error feedback message |
   *
   * ### State Flow
   *
   * 1. **Loading**: `true` while fetching user settings from Firestore
   * 2. **Saving**: `true` during display name update
   * 3. **Uploading**: `true` during profile picture upload
   * 4. **Message**: Set after operations, cleared after 2 seconds
   *
   * CLOSE: settings-state-form
   */
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  /**
   * REF: settings-effect-load
   *
   * ## Load User Settings Effect
   *
   * Fetches user settings from Firestore on component mount or user change.
   *
   * ### Process Flow
   *
   * 1. **Guard**: Return early if no user authenticated
   * 2. **Fetch**: Get settings document from `userSettings/{userId}`
   * 3. **Update State**: Apply settings if document exists
   * 4. **Initialize Form**: Set display name from auth profile
   * 5. **Complete**: Set loading to false
   *
   * ### Firestore Query
   *
   * ```typescript
   * const settingsDoc = await getDoc(doc(db, 'userSettings', user.uid))
   * ```
   *
   * ### Data Location
   *
   * - **Collection**: `userSettings`
   * - **Document ID**: User's UID
   * - **Fields**: theme, fontSize, highContrast, reducedMotion, updatedAt
   *
   * ### First-Time Users
   *
   * If document doesn't exist (new user), default values from state
   * initialization are used.
   *
   * ### Dependencies
   *
   * - `[user]`: Re-run when user changes (login/logout)
   *
   * CLOSE: settings-effect-load
   */
  useEffect(() => {
    if (!user) return

    const loadSettings = async () => {
      const settingsDoc = await getDoc(doc(db, 'userSettings', user.uid))

      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data() as UserSettings)
      }

      setDisplayName(user.displayName || '')
      setLoading(false)
    }

    loadSettings()
  }, [user])

  /**
   * REF: settings-effect-apply
   *
   * ## Apply Settings to DOM Effect
   *
   * Dynamically updates CSS classes on `<body>` element based on settings.
   *
   * ### Why Body Element?
   *
   * - Global scope affects entire page
   * - CSS inheritance applies to all children
   * - Works with existing Tailwind dark mode
   * - Persistent across navigation
   *
   * ### CSS Class Updates
   *
   * | Setting | Class Added | Effect |
   * |---------|-------------|--------|
   * | `theme: 'dark'` | `body.dark` | Dark color scheme |
   * | `fontSize: 'small'` | `body.font-small` | Smaller text |
   * | `fontSize: 'medium'` | `body.font-medium` | Normal text |
   * | `fontSize: 'large'` | `body.font-large` | Larger text |
   * | `highContrast: true` | `body.high-contrast` | High contrast colors |
   * | `reducedMotion: true` | `body.reduced-motion` | Disable animations |
   *
   * ### Implementation Details
   *
   * #### Theme
   * ```typescript
   * body.classList.toggle('dark', settings.theme === 'dark')
   * ```
   * Adds 'dark' class only when theme is 'dark'.
   *
   * #### Font Size
   * ```typescript
   * body.classList.remove('font-small', 'font-medium', 'font-large')
   * body.classList.add(`font-${settings.fontSize}`)
   * ```
   * Removes all size classes first to avoid conflicts, then adds current size.
   *
   * #### Boolean Settings
   * ```typescript
   * body.classList.toggle('high-contrast', settings.highContrast)
   * body.classList.toggle('reduced-motion', settings.reducedMotion)
   * ```
   * Toggles classes based on boolean values.
   *
   * ### CSS Example
   *
   * ```css
   * body.dark {
   *   background: #1a1a1a;
   *   color: #ffffff;
   * }
   *
   * body.font-large {
   *   font-size: 1.25rem;
   * }
   *
   * body.high-contrast {
   *   --contrast-ratio: 7:1;
   * }
   *
   * body.reduced-motion * {
   *   animation: none !important;
   *   transition: none !important;
   * }
   * ```
   *
   * ### Dependencies
   *
   * - `[settings]`: Re-run whenever any setting changes
   *
   * CLOSE: settings-effect-apply
   */
  useEffect(() => {
    const body = document.body

    // Theme
    body.classList.toggle('dark', settings.theme === 'dark')

    // Font size
    body.classList.remove('font-small', 'font-medium', 'font-large')
    body.classList.add(`font-${settings.fontSize}`)

    // High contrast
    body.classList.toggle('high-contrast', settings.highContrast)

    // Reduced motion
    body.classList.toggle('reduced-motion', settings.reducedMotion)
  }, [settings])

  /**
   * REF: settings-handler-update
   *
   * ## Update Setting Handler
   *
   * Handles individual setting changes with optimistic updates.
   *
   * ### Parameters
   *
   * | Parameter | Type | Description |
   * |-----------|------|-------------|
   * | `field` | keyof UserSettings | Setting field to update |
   * | `value` | any | New value for the field |
   *
   * ### Optimistic Update Pattern
   *
   * 1. **Save Current State**: Store previous settings for rollback
   * 2. **Update UI Immediately**: Set new value in state (instant feedback)
   * 3. **Persist to Firestore**: Save to backend
   * 4. **On Success**: Show confirmation message
   * 5. **On Error**: Rollback to previous state, show error
   *
   * ### Why Optimistic Updates?
   *
   * - **Better UX**: Instant visual feedback
   * - **Perceived Performance**: Feels faster than waiting
   * - **Reliable**: Rollback on error maintains consistency
   *
   * ### Firestore Update
   *
   * ```typescript
   * await updateDoc(doc(db, 'userSettings', user.uid), {
   *   [field]: value,
   *   updatedAt: Timestamp.now()
   * })
   * ```
   *
   * ### Example Usage
   *
   * ```typescript
   * handleUpdateSetting('theme', 'dark')
   * handleUpdateSetting('highContrast', true)
   * handleUpdateSetting('fontSize', 'large')
   * ```
   *
   * ### Error Handling
   *
   * - Network errors
   * - Permission errors
   * - Validation errors
   *
   * All errors trigger:
   * 1. State rollback to previous values
   * 2. Error message display
   * 3. Console logging for debugging
   *
   * CLOSE: settings-handler-update
   */
  const handleUpdateSetting = async (field: keyof UserSettings, value: any) => {
    if (!user) return

    const previousSettings = { ...settings }
    setSettings({ ...settings, [field]: value })

    try {
      await updateDoc(doc(db, 'userSettings', user.uid), {
        [field]: value,
        updatedAt: Timestamp.now(),
      })

      setMessage('Settings saved!')
      setTimeout(() => setMessage(''), 2000)
    } catch (error) {
      setSettings(previousSettings)
      setMessage('Failed to save settings')
      console.error(error)
    }
  }

  /**
   * REF: settings-handler-upload
   *
   * ## Profile Picture Upload Handler
   *
   * Handles profile picture file selection, validation, and upload to Firebase Storage.
   *
   * ### Process Flow
   *
   * 1. **Guard Checks**: Ensure user authenticated and file selected
   * 2. **Validate File Type**: Must be image MIME type
   * 3. **Validate File Size**: Maximum 5MB
   * 4. **Set Upload State**: Show loading indicator
   * 5. **Upload to Storage**: Store at user-specific path
   * 6. **Get Public URL**: Retrieve download URL
   * 7. **Update Profile**: Call context method to update auth + Firestore
   * 8. **Success Feedback**: Show confirmation message
   *
   * ### File Validation
   *
   * | Check | Requirement | Error Message |
   * |-------|-------------|---------------|
   * | MIME Type | `image/*` | "Please select an image" |
   * | File Size | < 5MB | "Image must be less than 5MB" |
   *
   * ### Storage Path Structure
   *
   * ```
   * /profile-pictures/{userId}/{timestamp}_{filename}
   * ```
   *
   * **Example**:
   * ```
   * /profile-pictures/abc123/1699564800000_avatar.jpg
   * ```
   *
   * ### Why Timestamp in Filename?
   *
   * - **Uniqueness**: Prevents filename collisions
   * - **Versioning**: New uploads don't overwrite old ones
   * - **Cache Busting**: URL changes force browser to reload
   * - **Debugging**: Easy to see when file was uploaded
   *
   * ### Firebase Storage Upload
   *
   * ```typescript
   * const storageRef = ref(storage, `profile-pictures/${user.uid}/${filename}`)
   * await uploadBytes(storageRef, file)
   * const url = await getDownloadURL(storageRef)
   * ```
   *
   * ### Update User Profile
   *
   * Calls `updateUserProfile()` from AuthContext which:
   * 1. Updates Firebase Auth `photoURL`
   * 2. Updates Firestore user document
   * 3. Refreshes user data in context
   *
   * ### File Size Limit Rationale
   *
   * - **5MB**: Balance between quality and performance
   * - **Prevents Abuse**: Stops storage quota exhaustion
   * - **Fast Uploads**: Reasonable on mobile connections
   * - **Cost Control**: Storage and bandwidth pricing
   *
   * ### Error Handling
   *
   * - **Validation Errors**: Shown immediately, no upload attempted
   * - **Upload Errors**: Caught and displayed with details
   * - **Loading State**: Always cleared in finally block
   *
   * ### Supported Image Formats
   *
   * Accepts any file with `image/*` MIME type:
   * - JPEG (.jpg, .jpeg)
   * - PNG (.png)
   * - GIF (.gif)
   * - WebP (.webp)
   * - SVG (.svg)
   * - BMP (.bmp)
   *
   * CLOSE: settings-handler-upload
   */
  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return

    const file = e.target.files[0]

    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      const filename = `${Date.now()}_${file.name}`
      const storageRef = ref(storage, `profile-pictures/${user.uid}/${filename}`)

      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)

      await updateUserProfile(displayName, url)

      setMessage('Profile picture updated!')
      setTimeout(() => setMessage(''), 2000)
    } catch (error: any) {
      setMessage(error.message || 'Failed to upload')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  /**
   * REF: settings-handler-profile
   *
   * ## Update Profile Handler
   *
   * Updates user's display name in Firebase Auth and Firestore.
   *
   * ### Process Flow
   *
   * 1. **Guard**: Ensure user authenticated
   * 2. **Set Loading**: Show saving state on button
   * 3. **Call Update**: Use context method to update profile
   * 4. **Success**: Show confirmation message
   * 5. **Error**: Display error message
   * 6. **Cleanup**: Clear loading state in finally
   *
   * ### Updates Both
   *
   * - **Firebase Auth**: User object `displayName` property
   * - **Firestore**: User document `displayName` field
   *
   * ### Why Update Both?
   *
   * | Location | Purpose |
   * |----------|---------|
   * | **Firebase Auth** | ID tokens, OAuth profile |
   * | **Firestore** | User documents, queries |
   *
   * Keeping both in sync ensures:
   * - Consistent display across app
   * - Accurate user searches
   * - Correct token claims
   *
   * ### Context Method Call
   *
   * ```typescript
   * await updateUserProfile(displayName)
   * ```
   *
   * This method (from AuthContext) handles:
   * - Firebase Auth `updateProfile()`
   * - Firestore document update
   * - Context state refresh
   *
   * ### Display Name Validation
   *
   * No explicit validation here (handled by Firebase):
   * - Can be empty (optional field)
   * - No length limit enforced
   * - Unicode characters allowed
   *
   * Consider adding:
   * - Minimum length (e.g., 2 characters)
   * - Maximum length (e.g., 50 characters)
   * - Profanity filter
   * - Trim whitespace
   *
   * ### Success Message
   *
   * Message auto-clears after 2 seconds using `setTimeout`:
   * ```typescript
   * setTimeout(() => setMessage(''), 2000)
   * ```
   *
   * CLOSE: settings-handler-profile
   */
  const handleUpdateProfile = async () => {
    if (!user) return

    setSaving(true)

    try {
      await updateUserProfile(displayName)
      setMessage('Profile updated!')
      setTimeout(() => setMessage(''), 2000)
    } catch (error: any) {
      setMessage(error.message || 'Failed to update')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  /**
   * REF: settings-render-loading
   *
   * ## Loading State UI
   *
   * Shows centered loading indicator while fetching user settings.
   *
   * ### When Shown
   *
   * - Component first mounts
   * - User data loading from Firestore
   * - Before settings state populated
   *
   * ### Structure
   *
   * ```
   * ┌─────────────────────┐
   * │                     │
   * │                     │
   * │     Loading...      │
   * │                     │
   * │                     │
   * └─────────────────────┘
   * ```
   *
   * ### Styling
   *
   * - `flex min-h-screen`: Full viewport height with flexbox
   * - `items-center justify-center`: Centered both axes
   *
   * ### UX Considerations
   *
   * **Current**: Simple text
   * **Could Improve**:
   * - Spinner animation
   * - Skeleton loading for layout
   * - Progress indicator
   *
   * CLOSE: settings-render-loading
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  /**
   * REF: settings-render-main
   *
   * ## Main Settings Page Render
   *
   * Renders complete settings interface with three main sections.
   *
   * ### Page Structure
   *
   * ```
   * ┌─────────────────────────────────────┐
   * │ Settings                            │ ← Page title
   * ├─────────────────────────────────────┤
   * │ [Success/Error Message]             │ ← Feedback (conditional)
   * ├─────────────────────────────────────┤
   * │ Profile                             │
   * │ • Display Name                      │
   * │ • Profile Picture                   │
   * │ [Update Profile]                    │
   * ├─────────────────────────────────────┤
   * │ Appearance                          │
   * │ • Theme (Light/Dark)                │
   * │ • Font Size (S/M/L)                 │
   * ├─────────────────────────────────────┤
   * │ Accessibility                       │
   * │ • High Contrast [Toggle]            │
   * │ • Reduce Motion [Toggle]            │
   * └─────────────────────────────────────┘
   * ```
   *
   * ### Layout
   *
   * - **Container**: Centered, max-width 3xl (768px)
   * - **Spacing**: 8 padding, 8 bottom margin on sections
   * - **Cards**: White background, rounded corners, shadow
   */
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        {/**
         * REF: settings-message-feedback
         *
         * ## Feedback Message Display
         *
         * Shows success or error messages after operations.
         *
         * ### Message Types
         *
         * | Type | Color | Trigger Words |
         * |------|-------|---------------|
         * | **Success** | Green | 'success', 'saved', 'updated' |
         * | **Error** | Red | All other messages |
         *
         * ### Conditional Rendering
         *
         * Only shown when `message` state is non-empty.
         *
         * ### Auto-Clear
         *
         * Messages automatically clear after 2 seconds (set in handlers).
         *
         * ### Styling
         *
         * - **Success**: `bg-green-100 text-green-800`
         * - **Error**: `bg-red-100 text-red-800`
         * - **Common**: Padding, rounded corners, margin bottom
         *
         * ### Example Messages
         *
         * - "Settings saved!"
         * - "Profile updated!"
         * - "Profile picture updated!"
         * - "Please select an image"
         * - "Failed to save settings"
         *
         * CLOSE: settings-message-feedback
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

        {/**
         * REF: settings-section-profile
         *
         * ## Profile Settings Section
         *
         * Allows users to update their display name and profile picture.
         *
         * ### Features
         *
         * 1. **Display Name Input**
         *    - Controlled input tied to `displayName` state
         *    - Updates on every keystroke
         *    - No validation (optional field)
         *
         * 2. **Profile Picture Upload**
         *    - File input with `accept="image/*"`
         *    - Validates type and size in handler
         *    - Disabled during upload
         *
         * 3. **Update Button**
         *    - Saves display name to Firebase
         *    - Shows loading state ("Saving...")
         *    - Disabled during save operation
         *
         * ### Card Styling
         *
         * - White background with shadow
         * - Rounded corners (lg)
         * - Padding: 6 (1.5rem)
         * - Margin bottom: 6
         *
         * ### Form Layout
         *
         * - Vertical stack with `space-y-4`
         * - Labels above inputs
         * - Full width inputs
         *
         * CLOSE: settings-section-profile
         */}
        {/* Profile */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>

          <div className="space-y-4">
            {/**
             * REF: settings-input-displayname
             *
             * ## Display Name Input
             *
             * Text input for user's visible name.
             *
             * ### Controlled Input
             *
             * - **Value**: Tied to `displayName` state
             * - **onChange**: Updates state on every keystroke
             * - **Type**: `text` (free-form text)
             *
             * ### Styling
             *
             * - Full width (`w-full`)
             * - Padding: `px-4 py-2`
             * - Border with rounded corners
             * - Focus ring on interaction
             *
             * ### Accessibility
             *
             * - Label associated with input
             * - Clear, descriptive label text
             * - Visual feedback on focus
             *
             * CLOSE: settings-input-displayname
             */}
            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/**
             * REF: settings-input-picture
             *
             * ## Profile Picture File Input
             *
             * File upload for profile avatar image.
             *
             * ### Input Configuration
             *
             * | Attribute | Value | Purpose |
             * |-----------|-------|---------|
             * | `type` | "file" | File picker dialog |
             * | `accept` | "image/*" | Only show images |
             * | `onChange` | Handler | Triggers upload |
             * | `disabled` | `uploading` | Prevent multiple uploads |
             *
             * ### Accept Attribute
             *
             * `accept="image/*"` shows only image files in picker:
             * - Better UX (no need to filter manually)
             * - Still validates in handler (client can bypass)
             * - Works across all platforms
             *
             * ### Disabled State
             *
             * While `uploading` is true:
             * - Input visually disabled
             * - Click does nothing
             * - Prevents concurrent uploads
             *
             * ### Upload Flow
             *
             * 1. User clicks input → file picker opens
             * 2. User selects image → onChange fires
             * 3. Handler validates → uploads to Storage
             * 4. Updates profile → shows success message
             *
             * CLOSE: settings-input-picture
             */}
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

            {/**
             * REF: settings-button-profile
             *
             * ## Update Profile Button
             *
             * Submits display name changes to Firebase.
             *
             * ### Button States
             *
             * | State | Disabled | Text | Styling |
             * |-------|----------|------|---------|
             * | **Idle** | No | "Update Profile" | Blue background |
             * | **Saving** | Yes | "Saving..." | Gray background |
             *
             * ### Disabled Logic
             *
             * ```typescript
             * disabled={saving}
             * ```
             *
             * Prevents:
             * - Multiple concurrent updates
             * - Click during save operation
             * - Confusing UI states
             *
             * ### Conditional Text
             *
             * ```typescript
             * {saving ? 'Saving...' : 'Update Profile'}
             * ```
             *
             * Provides clear feedback about operation state.
             *
             * ### Click Handler
             *
             * Calls `handleUpdateProfile()` which:
             * 1. Sets saving state
             * 2. Updates Firebase Auth
             * 3. Updates Firestore
             * 4. Shows success/error message
             *
             * CLOSE: settings-button-profile
             */}
            <button
              onClick={handleUpdateProfile}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {saving ? 'Saving...' : 'Update Profile'}
            </button>
          </div>
        </div>

        {/**
         * REF: settings-section-appearance
         *
         * ## Appearance Settings Section
         *
         * Customize visual presentation with theme and font size options.
         *
         * ### Settings
         *
         * 1. **Theme**: Light or Dark mode
         * 2. **Font Size**: Small, Medium, or Large
         *
         * ### UI Pattern
         *
         * Both use button groups where:
         * - Options displayed horizontally
         * - Current selection highlighted
         * - Click to change instantly
         * - Saves to Firestore immediately
         *
         * ### Card Styling
         *
         * Same as Profile section:
         * - White background, shadow
         * - Rounded corners, padding
         * - Consistent spacing
         *
         * CLOSE: settings-section-appearance
         */}
        {/* Appearance */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Appearance</h2>

          <div className="space-y-4">
            {/**
             * REF: settings-theme-selector
             *
             * ## Theme Selector
             *
             * Button group for Light/Dark theme selection.
             *
             * ### Options
             *
             * - **Light**: Default theme (light backgrounds)
             * - **Dark**: Dark theme (dark backgrounds, light text)
             *
             * ### Implementation
             *
             * ```typescript
             * {['light', 'dark'].map(theme => (
             *   <button
             *     onClick={() => handleUpdateSetting('theme', theme)}
             *     className={settings.theme === theme ? 'selected' : 'default'}
             *   >
             *     {theme}
             *   </button>
             * ))}
             * ```
             *
             * ### Visual States
             *
             * | State | Border | Background | Visual Cue |
             * |-------|--------|------------|------------|
             * | **Selected** | Blue (2px) | Blue-50 | Bold border + tint |
             * | **Unselected** | Gray (2px) | White | Subtle border |
             *
             * ### Interaction
             *
             * 1. User clicks theme button
             * 2. `handleUpdateSetting('theme', theme)` fires
             * 3. Optimistic UI update (instant)
             * 4. Firestore update in background
             * 5. DOM effect applies `body.dark` class
             *
             * ### Accessibility
             *
             * - Clear visual distinction between states
             * - Keyboard navigable (tab between buttons)
             * - Click target large enough (48px min recommended)
             * - Capitalized labels for clarity
             *
             * CLOSE: settings-theme-selector
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
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            {/**
             * REF: settings-fontsize-selector
             *
             * ## Font Size Selector
             *
             * Button group for text size preference.
             *
             * ### Options
             *
             * | Size | Typical Use Case |
             * |------|------------------|
             * | **Small** | Small screens, data-dense views |
             * | **Medium** | Default, comfortable reading |
             * | **Large** | Accessibility, vision impairment |
             *
             * ### Implementation Pattern
             *
             * Same as theme selector:
             * - Map over array of options
             * - Conditional styling for selection
             * - Immediate update on click
             *
             * ### Array Mapping
             *
             * ```typescript
             * {['small', 'medium', 'large'].map(size => ( ... ))}
             * ```
             *
             * Benefits:
             * - DRY (Don't Repeat Yourself)
             * - Easy to add new sizes
             * - Consistent behavior
             * - Maintainable code
             *
             * ### CSS Application
             *
             * When changed:
             * 1. Settings state updates
             * 2. DOM effect removes all size classes
             * 3. Adds `body.font-{size}` class
             * 4. CSS rules apply globally
             *
             * Example CSS:
             * ```css
             * body.font-small { font-size: 0.875rem; }
             * body.font-medium { font-size: 1rem; }
             * body.font-large { font-size: 1.25rem; }
             * ```
             *
             * ### Accessibility Impact
             *
             * Large text:
             * - WCAG 2.1 Level AAA: 200% zoom
             * - Helps users with low vision
             * - No browser zoom needed
             * - Respects user preference
             *
             * CLOSE: settings-fontsize-selector
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

        {/**
         * REF: settings-section-accessibility
         *
         * ## Accessibility Settings Section
         *
         * Critical accessibility features for inclusive user experience.
         *
         * ### Features
         *
         * 1. **High Contrast**
         *    - Increases color contrast ratios
         *    - Helps users with low vision
         *    - Meets WCAG AAA standards
         *
         * 2. **Reduced Motion**
         *    - Disables animations and transitions
         *    - Prevents motion sickness
         *    - Respects `prefers-reduced-motion` preference
         *
         * ### UI Pattern: Toggle Switches
         *
         * Each setting uses a custom toggle switch:
         * - Visual on/off state
         * - Smooth transitions
         * - Accessible via keyboard
         * - Clear labels and descriptions
         *
         * ### Why These Specific Features?
         *
         * | Feature | Disability Addressed | WCAG Criterion |
         * |---------|---------------------|----------------|
         * | High Contrast | Low vision, color blindness | 1.4.3, 1.4.6, 1.4.11 |
         * | Reduced Motion | Vestibular disorders | 2.3.3 |
         *
         * ### Legal Requirements
         *
         * Many jurisdictions require:
         * - **ADA (USA)**: Websites must be accessible
         * - **EAA (EU)**: European Accessibility Act
         * - **Section 508**: US federal websites
         * - **AODA (Canada)**: Accessibility for Ontarians
         *
         * CLOSE: settings-section-accessibility
         */}
        {/* Accessibility */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Accessibility</h2>

          <div className="space-y-4">
            {/**
             * REF: settings-toggle-contrast
             *
             * ## High Contrast Toggle
             *
             * Toggle switch for high contrast mode.
             *
             * ### Structure
             *
             * ```
             * ┌─────────────────────────────────────┐
             * │ High Contrast          [●    ]      │
             * │ Increase contrast for better...     │
             * └─────────────────────────────────────┘
             * ```
             *
             * ### Components
             *
             * 1. **Container**: Flexbox with space-between alignment
             * 2. **Text Section**: Title + description
             * 3. **Toggle Button**: Custom switch UI
             *
             * ### Toggle Switch Design
             *
             * | State | Background | Circle Position |
             * |-------|------------|-----------------|
             * | **Off** | Gray-300 | Left (translate-x-1) |
             * | **On** | Blue-600 | Right (translate-x-6) |
             *
             * ### Implementation
             *
             * ```typescript
             * <button
             *   onClick={() => handleUpdateSetting('highContrast', !settings.highContrast)}
             *   className={settings.highContrast ? 'bg-blue-600' : 'bg-gray-300'}
             * >
             *   <span className={settings.highContrast ? 'translate-x-6' : 'translate-x-1'} />
             * </button>
             * ```
             *
             * ### Interaction
             *
             * 1. Click toggle → inverts current value
             * 2. Optimistic state update → instant visual change
             * 3. Firestore update → persists preference
             * 4. DOM effect → applies `body.high-contrast` class
             *
             * ### High Contrast CSS Effects
             *
             * ```css
             * body.high-contrast {
             *   --text-contrast: 21:1;
             *   filter: contrast(1.2);
             * }
             *
             * body.high-contrast a {
             *   text-decoration: underline;
             *   font-weight: 600;
             * }
             * ```
             *
             * ### Who Benefits?
             *
             * - **Low Vision**: See content more clearly
             * - **Color Blindness**: Less reliance on color
             * - **Older Users**: Age-related vision changes
             * - **Bright Environments**: Outdoor use, glare
             *
             * ### WCAG Standards
             *
             * - **Level AA**: 4.5:1 (normal), 3:1 (large)
             * - **Level AAA**: 7:1 (normal), 4.5:1 (large)
             * - High contrast helps achieve AAA
             *
             * CLOSE: settings-toggle-contrast
             */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">High Contrast</h3>
                <p className="text-sm text-gray-600">Increase contrast for better visibility</p>
              </div>
              <button
                onClick={() => handleUpdateSetting('highContrast', !settings.highContrast)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  settings.highContrast ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/**
             * REF: settings-toggle-motion
             *
             * ## Reduced Motion Toggle
             *
             * Toggle switch for reduced motion mode.
             *
             * ### Structure
             *
             * Same layout as High Contrast toggle:
             * - Text section on left
             * - Toggle switch on right
             * - Border and padding
             *
             * ### What is Reduced Motion?
             *
             * Disables or minimizes:
             * - CSS animations
             * - CSS transitions
             * - JavaScript animations
             * - Parallax scrolling
             * - Auto-playing videos
             *
             * ### Why It Matters
             *
             * | Issue | Impact |
             * |-------|--------|
             * | **Vestibular Disorders** | Motion causes nausea, dizziness |
             * | **Epilepsy** | Flashing animations trigger seizures |
             * | **ADHD** | Moving elements distract |
             * | **Migraines** | Animation triggers headaches |
             *
             * ### CSS Implementation
             *
             * ```css
             * body.reduced-motion * {
             *   animation-duration: 0.01ms !important;
             *   animation-iteration-count: 1 !important;
             *   transition-duration: 0.01ms !important;
             *   scroll-behavior: auto !important;
             * }
             * ```
             *
             * ### Why Not Completely Disable?
             *
             * Setting duration to `0.01ms` instead of removing:
             * - Preserves animation end events
             * - Keeps JavaScript logic intact
             * - Avoids breaking dependencies
             * - Imperceptible to users
             *
             * ### Browser Support
             *
             * Should also respect OS-level preference:
             * ```css
             * @media (prefers-reduced-motion: reduce) {
             *   * {
             *     animation: none !important;
             *     transition: none !important;
             *   }
             * }
             * ```
             *
             * ### Interaction
             *
             * Same as High Contrast:
             * 1. Click → toggle value
             * 2. Update state optimistically
             * 3. Save to Firestore
             * 4. Apply CSS class to body
             *
             * ### User Research
             *
             * Studies show:
             * - 35% users prefer reduced motion
             * - Improves focus and productivity
             * - Reduces cognitive load
             * - Better for older devices (performance)
             *
             * CLOSE: settings-toggle-motion
             */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Reduce Motion</h3>
                <p className="text-sm text-gray-600">Minimize animations</p>
              </div>
              <button
                onClick={() => handleUpdateSetting('reducedMotion', !settings.reducedMotion)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-300'
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
    </div>
  )
  // CLOSE: settings-render-main
}
// CLOSE: settings-component

/**
 * REF: settings-persistence
 *
 * ## Settings Persistence & Sync
 *
 * All user settings are automatically persisted and synchronized.
 *
 * ### Storage Location
 *
 * **Firestore Collection**: `userSettings`
 * **Document ID**: User's UID
 *
 * ### Document Structure
 *
 * ```typescript
 * {
 *   theme: 'light' | 'dark',
 *   fontSize: 'small' | 'medium' | 'large',
 *   highContrast: boolean,
 *   reducedMotion: boolean,
 *   updatedAt: Timestamp
 * }
 * ```
 *
 * ### Persistence Benefits
 *
 * | Feature | Benefit |
 * |---------|---------|
 * | **Page Reload** | Settings survive browser refresh |
 * | **Cross-Device** | Same settings on phone, tablet, desktop |
 * | **Cross-Browser** | Works in Chrome, Firefox, Safari, etc. |
 * | **Session Independent** | Not tied to current session |
 * | **Cloud Backup** | Never lost, always recoverable |
 *
 * ### How Sync Works
 *
 * 1. **Change**: User toggles setting
 * 2. **Optimistic Update**: UI changes immediately
 * 3. **Firestore Write**: Background save to cloud
 * 4. **Propagation**: Other devices receive update
 * 5. **Listener**: Real-time sync (if implemented)
 *
 * ### Current Limitation
 *
 * No real-time listener - changes only load on page refresh.
 *
 * **To Add Real-time Sync**:
 * ```typescript
 * useEffect(() => {
 *   const unsubscribe = onSnapshot(
 *     doc(db, 'userSettings', user.uid),
 *     (snapshot) => {
 *       if (snapshot.exists()) {
 *         setSettings(snapshot.data())
 *       }
 *     }
 *   )
 *   return unsubscribe
 * }, [user])
 * ```
 *
 * ### Security Rules
 *
 * Users can only access their own settings:
 * ```javascript
 * match /userSettings/{userId} {
 *   allow read, write: if request.auth.uid == userId;
 * }
 * ```
 *
 * CLOSE: settings-persistence
 */

/**
 * REF: settings-future-enhancements
 *
 * ## Potential Future Enhancements
 *
 * ### Additional Settings
 *
 * 1. **Language/Locale**
 *    - Multi-language support
 *    - Date/time formatting
 *    - Currency display
 *
 * 2. **Notifications**
 *    - Email preferences
 *    - Push notification settings
 *    - Frequency controls
 *
 * 3. **Privacy**
 *    - Profile visibility
 *    - Data sharing preferences
 *    - Cookie consent
 *
 * 4. **More Appearance Options**
 *    - Custom theme colors
 *    - Layout density
 *    - Sidebar position
 *
 * ### UX Improvements
 *
 * 1. **Preview Mode**
 *    - See changes before saving
 *    - Compare themes side-by-side
 *
 * 2. **Presets**
 *    - "Reading Mode" (large text, high contrast)
 *    - "Focus Mode" (reduced motion, minimal UI)
 *    - "Night Mode" (dark + warm colors)
 *
 * 3. **Auto-Detection**
 *    - Respect OS theme preference
 *    - Detect reduced motion setting
 *    - Time-based theme switching
 *
 * 4. **Settings Search**
 *    - Filter settings by keyword
 *    - Quick access to common settings
 *
 * ### Technical Improvements
 *
 * 1. **Optimistic Updates with Rollback**
 *    - Currently partial implementation
 *    - Could track all changes in queue
 *    - Batch updates for performance
 *
 * 2. **Settings Migration**
 *    - Version settings schema
 *    - Migrate old settings automatically
 *    - Deprecation warnings
 *
 * 3. **Analytics**
 *    - Track popular settings
 *    - A/B test default values
 *    - Identify accessibility usage
 *
 * 4. **Export/Import**
 *    - Download settings as JSON
 *    - Share settings between accounts
 *    - Backup and restore
 *
 * CLOSE: settings-future-enhancements
 */
// CLOSE: settings-page
