# Settings Page - User Preferences with PostgreSQL

## Overview

**REF:**
The Settings page manages user preferences and accessibility options stored in PostgreSQL. This demonstrates optimistic UI updates, UPSERT operations, and file uploads to Supabase Storage with proper RLS protection.

**CLOSE:**

## Key Concepts

### Database Choice: PostgreSQL vs NoSQL

| Aspect | PostgreSQL | NoSQL |
|--------|---|---|
| **Schema** | Structured, typed | Flexible, schemaless |
| **Type safety** | Built-in with types | Runtime validation needed |
| **Relations** | Built-in relationships | Manual denormalization |
| **Queries** | ACID transactions | Eventually consistent |
| **Scaling** | Vertical | Horizontal |
| **For settings** | Excellent | Good |
| **Cross-user queries** | Efficient | Complex |

**Choice Rationale:** PostgreSQL provides schema safety and type validation ideal for structured user preferences.

### Supabase Storage Features

| Feature | Benefit |
|---------|---------|
| **S3-compatible** | Works like AWS S3 |
| **CDN included** | Fast global delivery |
| **Image transforms** | Automatic resize/crop |
| **RLS policies** | Access control at storage level |
| **Public URLs** | Direct file access |

## Component Architecture

### Client Component Type
```typescript
'use client'
```
Uses client-side rendering for interactive settings modifications.

### Dependencies
- `useState`, `useEffect` - React state management
- `useAuth` - Custom authentication context with `updateProfile`
- `createClient` - Supabase client instance
- `Database` type - Type-safe schema definitions

### Type Definitions

| Type | Source | Purpose |
|------|--------|---------|
| `UserSettings` | `Database['public']['Tables']['user_settings']['Row']` | Type-safe settings object |

## State Management

### Core State Variables

| State | Type | Purpose |
|-------|------|---------|
| `settings` | `UserSettings \| null` | Current settings from database |
| `displayName` | `string` | User's display name from profiles |
| `loading` | `boolean` | Initial data fetch state |
| `saving` | `boolean` | Settings update in progress |
| `uploading` | `boolean` | Profile picture upload state |
| `message` | `string` | Success/error feedback message |

## Functional Methods

### 1. LOAD USER SETTINGS

**REF:**
Fetches user settings from the PostgreSQL `user_settings` table. Uses `.single()` to expect exactly one row per user.

**Database Design:**

| Constraint | Purpose |
|-----------|---------|
| **UNIQUE user_id** | Each user has exactly one settings row |
| **.single()** | Return object instead of array |
| **No error** | Settings always exist (created on signup) |

**Query Pattern:**
```typescript
const { data, error } = await supabase
  .from('user_settings')
  .select('*')
  .eq('user_id', user.id)
  .single()
```

**Dual Data Fetch:**
```typescript
// Settings from user_settings table
const { data } = await supabase
  .from('user_settings')
  .select('*')
  .eq('user_id', user.id)
  .single()

// Display name from user_profiles table
const { data: profile } = await supabase
  .from('user_profiles')
  .select('display_name')
  .eq('user_id', user.id)
  .single()
```

**CLOSE:**

---

### 2. UPDATE SETTING (Optimistic Update Pattern)

**REF:**
Updates a single setting field with optimistic UI pattern. The local state updates immediately for responsive UX, then syncs with database.

**Optimistic Update Flow:**

| Step | Action | User Experience |
|------|--------|-----------------|
| 1 | User changes setting | UI updates instantly |
| 2 | Save previous state | Can revert if needed |
| 3 | Update local state | No delay perceived |
| 4 | Send to database | Background sync |
| 5 | Success response | Show confirmation |
| 6 | Error response | Revert to previous |

**Implementation:**
```typescript
const handleUpdateSetting = async (field: string, value: any) => {
  // Step 1: Save current state for rollback
  const previousSettings = { ...settings }

  // Step 2: Update UI immediately (optimistic)
  setSettings({ ...settings, [field]: value })

  try {
    // Step 3: Sync with database
    const { error } = await supabase
      .from('user_settings')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)

    if (error) throw error

    // Step 4: Show success message
    setMessage('Settings saved!')
    setTimeout(() => setMessage(''), 2000)
  } catch (error) {
    // Step 5: Revert on failure
    setSettings(previousSettings)
    setMessage('Failed to save settings')
  }
}
```

**Benefits:**
- No waiting for server round-trip
- Better perceived performance
- Rollback on error
- User always sees current state

**Database Updates:**
```sql
UPDATE user_settings
SET field = value, updated_at = NOW()
WHERE user_id = user_id
```

**CLOSE:** Best UX - updates appear instant

---

### 3. PROFILE PICTURE UPLOAD

**REF:**
Uploads profile pictures to Supabase Storage, generates public URLs, and updates user profile. Includes validation and error handling.

**Supabase Storage Flow:**

| Step | Action | Purpose |
|------|--------|---------|
| 1 | User selects file | File input change |
| 2 | Validate client-side | Check type/size |
| 3 | Upload to Storage | POST to S3-compatible API |
| 4 | Get public URL | Retrieve CDN link |
| 5 | Update user_profiles | Store URL in database |
| 6 | Update auth metadata | Sync with Auth service |

**Validation Rules:**

| Check | Requirement | Reasoning |
|-------|---|---|
| **File type** | `image/*` | Must be image |
| **File size** | < 5MB | Performance/bandwidth |
| **Required** | File must exist | Can't upload nothing |

**Storage Path Structure:**
```
profile-pictures/{userId}/{filename}
  ├── Organized by user
  ├── Easy to delete
  └── RLS can filter by userId
```

**Implementation:**
```typescript
const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!user || !e.target.files?.[0]) return

  const file = e.target.files[0]

  // Validation
  if (!file.type.startsWith('image/')) {
    setMessage('Please select an image file')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    setMessage('Image must be less than 5MB')
    return
  }

  setUploading(true)

  try {
    // Generate unique filename
    const filename = `${Date.now()}_${file.name}`
    const filePath = `profile-pictures/${user.id}/${filename}`

    // Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    // Update user profile
    await updateProfile({ avatarUrl: publicUrl })

    setMessage('Profile picture updated!')
  } catch (error: any) {
    setMessage(error.message || 'Failed to upload')
  } finally {
    setUploading(false)
  }
}
```

**Key Implementation Details:**

| Aspect | Implementation |
|--------|---|
| **Unique naming** | `${Date.now()}_${file.name}` prevents conflicts |
| **User folder** | `profile-pictures/{user.id}/` enables RLS filtering |
| **Error handling** | Try/catch with user-friendly messages |
| **State management** | Loading states prevent double-submit |
| **CDN URL** | `.getPublicUrl()` returns CDN link |

**CLOSE:** S3-compatible API makes storage simple and scalable

---

## UI Sections

### Profile Section
- Display Name input field
- Profile Picture file upload
- Image validation feedback

### Appearance Section

#### Theme Selection
- Light/Dark button group
- Selected indicator (blue border + background)
- Persists to database

#### Font Size Selection
- Small/Medium/Large button group
- Selected state highlighting
- Responsive text adjustment

### Accessibility Section

#### High Contrast Toggle
- Toggle switch button
- Increased contrast colors
- Accessibility benefit

#### Reduce Motion Toggle
- Toggle switch button
- Minimizes animations
- Accessibility benefit

### Toggle Switch Component
```typescript
<button
  onClick={() => handleUpdateSetting(field, !settings[field])}
  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
    settings[field] ? 'bg-blue-600' : 'bg-gray-300'
  }`}
>
  <span
    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
      settings[field] ? 'translate-x-6' : 'translate-x-1'
    }`}
  />
</button>
```

## Loading and Error States

### Loading State
```typescript
if (loading) {
  return <div className="flex items-center justify-center min-h-screen"><div>Loading...</div></div>
}
```

### Missing Settings
```typescript
if (!settings) {
  return <div className="flex items-center justify-center min-h-screen"><div>Settings not found</div></div>
}
```

### Feedback Messages

| Message Pattern | Type | Auto-hide |
|---|---|---|
| Contains "saved" or "updated" | Success (green) | 2 seconds |
| All others | Error (red) | 2 seconds |

## User Settings Table Schema

### Required Columns

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to auth.users |
| `theme` | TEXT | 'light' or 'dark' |
| `font_size` | TEXT | 'small', 'medium', 'large' |
| `high_contrast` | BOOLEAN | Contrast accessibility |
| `reduced_motion` | BOOLEAN | Motion preference |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### Constraints

```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light',
  font_size TEXT DEFAULT 'medium',
  high_contrast BOOLEAN DEFAULT false,
  reduced_motion BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)
```

## Production Storage Policies

### Step 1: Upload Permission Policy

**REF:**
Allows users to upload their own profile pictures to a user-specific folder.

```sql
CREATE POLICY "Users can upload own profile pictures"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Security Logic:**
- Bucket must be 'avatars'
- User ID from path must match authenticated user
- `storage.foldername(name)` extracts folder from path
- Prevents uploading to other users' folders

**CLOSE:**

### Step 2: View Permission Policy

```sql
CREATE POLICY "Profile pictures are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

**Benefits:**
- No authentication required for viewing
- Profile pictures work in public shares
- CDN can cache efficiently

**CLOSE:**

---

## Production Considerations

### Data Validation
- Name length limits
- Theme values from enum
- Font size from predefined set
- Checkbox boolean values

### Performance
- Cache user settings in AuthContext
- Batch updates when possible
- Lazy load profile picture

### Security
- RLS on user_settings table
- Storage policies for file access
- Validate file type/size server-side
- Rate limit uploads

### Accessibility
- Dark mode CSS variables
- Font size applied to document
- High contrast CSS class
- Reduce motion CSS media query

## File References

| Section | Reference ID | Topic |
|---------|---|---|
| Component Overview | `REF:` | User preferences storage |
| Settings Loading | `REF: LOAD USER SETTINGS` | Database queries |
| Update Pattern | `REF: UPDATE SETTING` | Optimistic updates |
| File Upload | `REF: PROFILE PICTURE UPLOAD` | Storage operations |
| Render Section | `REF: settings-render` | UI rendering |
| Storage Policies | `SUPABASE STORAGE POLICIES` | RLS rules |

## Summary

The Settings page demonstrates a complete user preferences management system with profile picture uploads. The optimistic update pattern provides responsive UX without waiting for server responses. PostgreSQL's structured schema ensures type safety for settings, while Supabase Storage handles file management with built-in CDN. RLS policies protect user data at both database and storage levels.

**Key Takeaways:**
- Optimistic updates improve perceived performance
- PostgreSQL schema validates settings structure
- Supabase Storage simplifies file management
- RLS policies protect sensitive operations
- Unique constraints ensure one settings row per user
- Toggle switches implement accessibility settings
- File validation prevents abuse/errors
