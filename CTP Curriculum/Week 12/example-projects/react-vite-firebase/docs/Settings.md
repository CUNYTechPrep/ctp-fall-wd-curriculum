# Settings.tsx - User Preferences & Accessibility

## REF: Settings Page

Manages user profile information, appearance settings, and accessibility preferences.

---

## Overview

### Purpose

Allow users to:
- Update profile information
- Customize appearance
- Configure accessibility options
- Upload profile pictures

### Three Main Categories

| **Category** | **Settings** | **Storage** |
|-------------|-----------|-----------|
| **Profile** | Display name, profile picture | Firebase Auth + Firestore |
| **Appearance** | Theme, font size | Firestore userSettings |
| **Accessibility** | High contrast, reduced motion | Firestore userSettings |

---

## Settings Data Structure

### Firestore userSettings Collection

```typescript
// In Firestore: userSettings/{userId}
{
  userId: "user123abc",          // Link to user
  theme: "light" | "dark",       // Theme preference
  fontSize: "small" | "medium" | "large",
  highContrast: boolean,         // Accessibility
  reducedMotion: boolean,        // Accessibility
  updatedAt: Timestamp(...)      // Last update
}
```

### TypeScript Interface

```typescript
interface UserSettings {
  theme: 'light' | 'dark'
  fontSize: 'small' | 'medium' | 'large'
  highContrast: boolean
  reducedMotion: boolean
}
```

---

## Profile Settings

### Display Name Update

```typescript
const [displayName, setDisplayName] = useState('')

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
```

### Profile Picture Upload

```typescript
const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!user || !e.target.files?.[0]) return

  const file = e.target.files[0]

  // Validate file type
  if (!file.type.startsWith('image/')) {
    setMessage('Please select an image')
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    setMessage('Image must be less than 5MB')
    return
  }

  setUploading(true)

  try {
    // Create unique filename
    const filename = `${Date.now()}_${file.name}`
    const storageRef = ref(storage, `profile-pictures/${user.uid}/${filename}`)

    // Upload to Cloud Storage
    await uploadBytes(storageRef, file)

    // Get download URL
    const url = await getDownloadURL(storageRef)

    // Update profile
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
```

### Upload Process

```
1. User selects image file
        ↓
2. Validation
   ├─ Must be image format (JPEG, PNG, etc.)
   └─ Must be < 5MB
        ↓
3. Upload to Cloud Storage
   └─ Path: profile-pictures/{userId}/{timestamp}_{filename}
        ↓
4. Get download URL
        ↓
5. Update Firebase Auth profile
        ↓
6. Update Firestore user document
        ↓
7. Sync in AuthContext (if needed)
```

---

## Appearance Settings

### Theme Selection

```typescript
const [settings, setSettings] = useState<UserSettings>({
  theme: 'light',
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
})

// Handle theme change
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
    setSettings(previousSettings)  // Revert on error
    setMessage('Failed to save settings')
    console.error(error)
  }
}

// Usage:
<button onClick={() => handleUpdateSetting('theme', 'dark')}>
  Dark Theme
</button>
```

### Theme Implementation

```typescript
// Apply theme to DOM
useEffect(() => {
  const body = document.body

  // Toggle dark class
  body.classList.toggle('dark', settings.theme === 'dark')
}, [settings.theme])
```

### In CSS (Tailwind)

```css
/* Light theme (default) */
body {
  background-color: white;
  color: #000;
}

/* Dark theme */
body.dark {
  background-color: #1a1a1a;
  color: #fff;
}

/* Use in Tailwind */
.dark .component {
  background-color: #2d2d2d;
}
```

---

## Font Size Customization

### Three Size Options

```typescript
['small', 'medium', 'large'].map(size => (
  <button
    key={size}
    onClick={() => handleUpdateSetting('fontSize', size)}
    className={size === settings.fontSize ? 'selected' : ''}
  >
    {size}
  </button>
))
```

### Apply Font Size

```typescript
useEffect(() => {
  const body = document.body

  // Remove all size classes
  body.classList.remove('font-small', 'font-medium', 'font-large')

  // Add selected size
  body.classList.add(`font-${settings.fontSize}`)
}, [settings.fontSize])
```

### CSS Implementation

```css
/* Small font size */
body.font-small {
  font-size: 12px;
  line-height: 1.4;
}

/* Medium font size (default) */
body.font-medium {
  font-size: 14px;
  line-height: 1.5;
}

/* Large font size */
body.font-large {
  font-size: 16px;
  line-height: 1.6;
}

/* Scale everything */
body.font-small * {
  font-size: 0.9em;
}

body.font-large * {
  font-size: 1.2em;
}
```

---

## Accessibility Features

### Why Accessibility Matters

| **Aspect** | **Benefit** |
|-----------|-----------|
| **Inclusivity** | Makes app usable by everyone |
| **Legal** | Often required by law (ADA, WCAG) |
| **Users** | Benefits millions with disabilities |
| **Business** | Larger potential user base |
| **Ethics** | Right thing to do |

### High Contrast Mode

```typescript
// Toggle high contrast
const handleUpdateSetting = async (field: keyof UserSettings, value: any) => {
  await updateDoc(doc(db, 'userSettings', user.uid), {
    highContrast: value,
    updatedAt: Timestamp.now(),
  })
}

// Apply to DOM
useEffect(() => {
  document.body.classList.toggle('high-contrast', settings.highContrast)
}, [settings.highContrast])
```

### High Contrast CSS

```css
/* High contrast colors */
body.high-contrast {
  background-color: #000;
  color: #fff;
}

body.high-contrast .button {
  background-color: #fff;
  color: #000;
  border: 2px solid #000;
}

body.high-contrast a {
  color: #0066ff;
  text-decoration: underline;
}

/* Increase border contrast */
body.high-contrast .input,
body.high-contrast .card {
  border: 2px solid #000;
}
```

### Reduced Motion

```typescript
// Toggle reduced motion
const handleUpdateSetting = async (field: keyof UserSettings, value: any) => {
  await updateDoc(doc(db, 'userSettings', user.uid), {
    reducedMotion: value,
    updatedAt: Timestamp.now(),
  })
}

// Apply to DOM
useEffect(() => {
  document.body.classList.toggle('reduced-motion', settings.reducedMotion)
}, [settings.reducedMotion])
```

### Reduced Motion CSS

```css
/* Disable animations when reduced motion enabled */
body.reduced-motion * {
  animation: none !important;
  transition: none !important;
}

/* Or less strict: slower animations */
body.reduced-motion * {
  animation-duration: 2s !important;  /* Slower */
  transition-duration: 2s !important;
}

/* Specific to Tailwind animations */
@media (prefers-reduced-motion: reduce) {
  .animate-spin,
  .animate-pulse,
  .animate-bounce {
    animation: none;
  }
}
```

---

## WCAG Accessibility Levels

### Standard Levels

| **Level** | **Requirements** | **Effort** |
|----------|-----------------|-----------|
| **A** | Minimum accessibility | Easy |
| **AA** | Enhanced (recommended) | Moderate |
| **AAA** | Maximum accessibility | Hard |

### Common WCAG Requirements

```typescript
// 1. Color contrast (AA: 4.5:1 for text)
// Background: #fff (white)
// Text: #666 (gray)
// Ratio: 4.54:1 ✓ Passes AA

// 2. Focus indicators
button:focus {
  outline: 2px solid #0066ff;
  outline-offset: 2px;
}

// 3. Alternative text for images
<img src="icon.svg" alt="Settings icon" />

// 4. Keyboard navigation
// All interactive elements accessible via Tab

// 5. Skip links
<a href="#main-content" className="sr-only">
  Skip to main content
</a>
```

---

## Loading Settings

### Fetch from Firestore

```typescript
useEffect(() => {
  if (!user) return

  const loadSettings = async () => {
    // Get user settings document
    const settingsDoc = await getDoc(doc(db, 'userSettings', user.uid))

    if (settingsDoc.exists()) {
      setSettings(settingsDoc.data() as UserSettings)
    }

    // Get display name from auth
    setDisplayName(user.displayName || '')
    setLoading(false)
  }

  loadSettings()
}, [user])
```

### Default Settings

If user settings document doesn't exist, defaults are used:

```typescript
const [settings, setSettings] = useState<UserSettings>({
  theme: 'light',
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
})
```

---

## Persisting Settings

### Advantages of Firestore Storage

```typescript
// Settings persist across:
// - Page reloads
// - Different devices
// - Sessions
// - Browser cache clears

// User benefits:
// - Change setting once
// - Applies everywhere
// - Remembered forever
// - Syncs across devices
```

### Cross-Device Sync

```typescript
// On device 1:
// User changes theme to dark
// Firestore updated immediately

// On device 2:
// App loads and fetches settings
// Sees dark theme preference
// Applies it automatically
```

---

## UI Components

### Toggle Switch

```typescript
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
```

### Button Group

```typescript
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
```

### Message Display

```typescript
{message && (
  <div className={`mb-6 p-4 rounded-lg ${
    message.includes('success') || message.includes('saved') || message.includes('updated')
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }`}>
    {message}
  </div>
)}
```

---

## Security Considerations

### Profile Picture Validation

```typescript
// 1. Check file type
if (!file.type.startsWith('image/')) {
  alert('Please select an image')
  return
}

// 2. Check file size
if (file.size > 5 * 1024 * 1024) {
  alert('Image must be less than 5MB')
  return
}

// 3. Generate unique filename (prevent overwrites)
const filename = `${Date.now()}_${file.name}`

// 4. Store in user-specific directory
const storageRef = ref(storage, `profile-pictures/${user.uid}/${filename}`)
```

### Cloud Storage Rules

```javascript
match /profile-pictures/{userId}/{allPaths=**} {
  // Only user can upload to their directory
  allow write: if request.auth.uid == userId;

  // Anyone can read public profiles
  allow read: if true;
}
```

---

## Error Handling

### Graceful Degradation

```typescript
const handleUpdateProfile = async () => {
  // Save current state
  const previousSettings = { ...settings }

  try {
    // Attempt update
    setSettings({ ...settings, [field]: value })
    await updateDoc(doc(db, 'userSettings', user.uid), {
      [field]: value,
      updatedAt: Timestamp.now(),
    })

    setMessage('Settings saved!')
  } catch (error) {
    // Revert on error
    setSettings(previousSettings)
    setMessage('Failed to save settings')
    console.error(error)
  }
}
```

### Network Errors

```typescript
// Handle common errors
if (error.code === 'permission-denied') {
  setMessage('You do not have permission to update settings')
} else if (error.code === 'network-request-failed') {
  setMessage('Network error. Please check your connection')
} else {
  setMessage(error.message || 'An error occurred')
}
```

---

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Settings from './Settings'
import { useAuth } from './contexts/AuthContext'

jest.mock('./contexts/AuthContext')

test('updates display name', async () => {
  useAuth.mockReturnValue({
    user: { uid: '123', displayName: 'John' },
    updateUserProfile: jest.fn().mockResolvedValue(undefined),
  })

  render(<Settings />)

  // Change display name
  const input = screen.getByDisplayValue('John')
  fireEvent.change(input, { target: { value: 'Jane' } })

  // Click update
  const button = screen.getByText('Update Profile')
  fireEvent.click(button)

  // Check success message
  await waitFor(() => {
    expect(screen.getByText('Profile updated!')).toBeInTheDocument()
  })
})

test('uploads profile picture', async () => {
  const mockFile = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' })

  render(<Settings />)

  const input = screen.getByLabelText('Profile Picture')
  fireEvent.change(input, { target: { files: [mockFile] } })

  await waitFor(() => {
    expect(screen.getByText(/uploaded/i)).toBeInTheDocument()
  })
})

test('shows error for invalid image type', async () => {
  const mockFile = new File(['doc'], 'document.pdf', { type: 'application/pdf' })

  render(<Settings />)

  const input = screen.getByLabelText('Profile Picture')
  fireEvent.change(input, { target: { files: [mockFile] } })

  expect(screen.getByText('Please select an image')).toBeInTheDocument()
})
```

---

## Accessibility of Settings Page

### Keyboard Navigation

```typescript
// All buttons/inputs accessible via Tab
<button onClick={...}>Update Profile</button>  // Focusable

// Form inputs
<input
  type="text"
  onChange={...}
  aria-label="Display Name"  // Label for screen readers
/>
```

### Screen Reader Support

```typescript
// Clear labels
<label htmlFor="displayName">Display Name</label>
<input id="displayName" {...} />

// Toggle switch descriptions
<div>
  <h3>High Contrast</h3>
  <p>Increase contrast for better visibility</p>
</div>
```

---

## Future Improvements

### Planned Features

- [ ] Email notification preferences
- [ ] Language selection
- [ ] Two-factor authentication
- [ ] Account deletion
- [ ] Data export
- [ ] Connected apps/devices
- [ ] Security audit log
- [ ] Backup codes

---

## CLOSE

Settings page provides:
- **Profile management** with picture uploads
- **Appearance customization** (theme, font size)
- **Accessibility features** (contrast, motion)
- **Persistent storage** across devices
- **Graceful error handling** with rollback

Respects user preferences and makes the app accessible to everyone!
