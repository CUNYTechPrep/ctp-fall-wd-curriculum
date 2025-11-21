/**
 * File Upload API Route
 *
 * This API route handles file uploads to Supabase Storage.
 *
 ## Key Concepts
 * - Server-side file processing
 * - Supabase Storage integration
 * - File validation
 * - FormData handling
 * - Secure file uploads
 *
 * ## Why Server-Side Upload?
 * - Validate file before storage
 * - Scan for malware (if needed)
 * - Resize images server-side
 * - Generate thumbnails
 * - Add watermarks
 * - Better control over uploads
 *
 * ## Alternative: Direct Client Upload
 * - Faster (no server hop)
 * - Less server bandwidth
 * - Relies on Storage policies
 * - Good for simple uploads
 *
 * ## This Route Demonstrates
 * - Server-side validation
 * - File type checking
 * - Size limits
 * - Saving metadata to database
 */

// REF: Import statement
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
// CLOSE: Import statement

/**
 * POST - Upload File
 *
 * Handles multipart/form-data file uploads
 *
 * @param request - NextRequest with FormData
 * @returns JSON with file URL and metadata
 *
 * ## Security
 * - Verify user authenticated
 * - Validate file type
 * - Check file size
 * - Scan for malicious content (production)
 * - Generate unique filename
 */

// REF: Async function: export
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
// CLOSE: Async function: export

    /**
     * AUTHENTICATION CHECK
     */
    const {
      data: { user },
    } = await supabase.auth.getUser()

// REF: Control flow
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
// CLOSE: Control flow

    /**
     * PARSE FORM DATA
     *
     * FormData contains:
     * - file: The uploaded file
     * - todoId: Optional todo this attaches to
     * - type: 'profile' or 'attachment'
     */
// REF: Constant: formData
    const formData = await request.formData()
    const file = formData.get('file') as File
    const todoId = formData.get('todoId') as string | null
    const type = formData.get('type') as 'profile' | 'attachment' || 'attachment'
// CLOSE: Constant: formData

// REF: Control flow
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
// CLOSE: Control flow

    /**
     * FILE VALIDATION
     *
     * Check type and size before uploading
     *
     * MIME TYPE VALIDATION:
     * - Client can fake MIME type
     * - In production, check magic numbers
     * - Or use library like file-type
     *
     * SIZE LIMITS:
     * - 5MB for this example
     * - Adjust based on needs
     * - Prevents storage abuse
     */
// REF: Constant: maxSize
    const maxSize = 5 * 1024 * 1024 // 5MB
// CLOSE: Constant: maxSize

// REF: Control flow
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large (max 5MB)' },
        { status: 400 }
      )
    }
// CLOSE: Control flow

    // Validate file type based on upload type
// REF: Control flow
    if (type === 'profile') {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Profile picture must be an image' },
          { status: 400 }
        )
      }
    }
// CLOSE: Control flow

    /**
     * GENERATE UNIQUE FILENAME
     *
     * Prevent overwrites and collisions
     *
     * PATTERN:
     * timestamp_originalname
     *
     * ## Alternatives
     * - UUID: crypto.randomUUID()
     * - Hash: MD5 of file content
     * - Sequential: user's file counter
     */
// REF: Constant: timestamp
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFilename = `${timestamp}_${sanitizedName}`
// CLOSE: Constant: timestamp

    /**
     * DETERMINE STORAGE PATH
     *
     * Organize files by user and type
     *
     * STRUCTURE:
     * - profile-pictures/{userId}/{filename}
     * - attachments/{userId}/{todoId}/{filename}
     *
     * Benefits:
     * - Easy to find user's files
     * - Easy to delete user's data
     * - RLS can protect by path
     */
// REF: Constant: storagePath
    const storagePath =
      type === 'profile'
        ? `profile-pictures/${user.id}/${uniqueFilename}`
        : `attachments/${user.id}/${todoId || 'general'}/${uniqueFilename}`
// CLOSE: Constant: storagePath

    /**
     * UPLOAD TO SUPABASE STORAGE
     *
     * Convert File to buffer for upload
     *
     * ### Options
     * - cacheControl: Browser caching (3600 = 1 hour)
     * - contentType: MIME type
     * - upsert: Overwrite if exists
     */
// REF: Constant: fileBuffer
    const fileBuffer = await file.arrayBuffer()
// CLOSE: Constant: fileBuffer

// REF: Constant declaration
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads') // Bucket name
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })
// CLOSE: Constant declaration

// REF: Control flow
    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }
// CLOSE: Control flow

    /**
     * GET PUBLIC URL
     *
     * Generate public URL for the uploaded file
     */
    const {
      data: { publicUrl },
    } = supabase.storage.from('uploads').getPublicUrl(storagePath)

    /**
     * SAVE METADATA TO DATABASE
     *
     * Store file information for later retrieval
     *
     * WHY SAVE METADATA?
     * - Track file ownership
     * - Enable search by filename
     * - Calculate storage usage
     * - List user's files
     * - Enable cascade delete
     */
// REF: Control flow
    if (todoId && type === 'attachment') {
      const { error: dbError } = await supabase
        .from('todo_attachments')
        .insert({
          todo_id: todoId,
          file_name: file.name,
          file_url: publicUrl,
          file_size: file.size,
          mime_type: file.type,
        })
// CLOSE: Control flow

// REF: Control flow
      if (dbError) {
// CLOSE: Control flow
        // Upload succeeded but metadata save failed
        // Could delete file from storage here
        console.error('Metadata error:', dbError)
      }
    }

    /**
     * RETURN SUCCESS RESPONSE
     *
     * Includes all file information
     */
// REF: JSX return
    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        url: publicUrl,
        size: file.size,
        type: file.type,
        path: storagePath,
      },
    })
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
// CLOSE: JSX return

/**
 * STORAGE BUCKET SETUP
 *
 * In Supabase Dashboard → Storage:
 *
 * 1. Create bucket: 'uploads'
 * 2. Set to public or private
 * 3. Add RLS policies:
 *
 * ```sql
 * -- Allow authenticated users to upload to their folder
 * CREATE POLICY "Users can upload own files"
 * ON storage.objects FOR INSERT
 * WITH CHECK (
 *   bucket_id = 'uploads' AND
 *   (storage.foldername(name))[1] = auth.uid()::text
 * );
 *
 * -- Allow users to read their own files
 * CREATE POLICY "Users can read own files"
 * ON storage.objects FOR SELECT
 * USING (
 *   bucket_id = 'uploads' AND
 *   (storage.foldername(name))[1] = auth.uid()::text
 * );
 *
 * -- Allow users to delete their own files
 * CREATE POLICY "Users can delete own files"
 * ON storage.objects FOR DELETE
 * USING (
 *   bucket_id = 'uploads' AND
 *   (storage.foldername(name))[1] = auth.uid()::text
 * );
 * ```
 */

/**
 * CLIENT-SIDE USAGE
 *
 * ```typescript
 * async function handleUpload(file: File, todoId?: string) {
 *   const formData = new FormData()
 *   formData.append('file', file)
 *   if (todoId) formData.append('todoId', todoId)
 *   formData.append('type', 'attachment')
 *
 *   const response = await fetch('/api/upload', {
 *     method: 'POST',
 *     body: formData, // Don't set Content-Type, browser sets it
 *   })
 *
 *   const data = await response.json()
 *
 *   if (!response.ok) {
 *     throw new Error(data.error)
 *   }
 *
 *   console.log('Uploaded:', data.file.url)
 * }
 * ```
 */

/**
 * ADVANCED FEATURES
 *
 * Image resizing:
 * ```typescript
 * import sharp from 'sharp'
 *
 * const buffer = await file.arrayBuffer()
 * const resized = await sharp(Buffer.from(buffer))
 *   .resize(800, 800, { fit: 'inside' })
 *   .jpeg({ quality: 80 })
 *   .toBuffer()
 *
 * await supabase.storage.from('uploads').upload(path, resized)
 * ```
 *
 * Virus scanning:
 * ```typescript
 * import ClamScan from 'clamscan'
 *
 * const scanner = await new ClamScan().init()
 * const { isInfected } = await scanner.scanStream(buffer)
 *
 * if (isInfected) {
 *   return NextResponse.json({ error: 'File rejected' }, { status: 400 })
 * }
 * ```
 *
 * Generate thumbnail:
 * ```typescript
 * const thumbnail = await sharp(buffer)
 *   .resize(200, 200)
 *   .toBuffer()
 *
 * await supabase.storage
 *   .from('uploads')
 *   .upload(`${path}_thumb`, thumbnail)
 * ```
 */

/**
 * ERROR HANDLING
 *
 * Handle storage errors gracefully:
 * - "Bucket not found": Check bucket name
 * - "Object already exists": Use unique filenames
 * - "File too large": Check file size
 * - "Invalid mime type": Validate before upload
 */

/**
 * CLEANUP ON ERROR
 *
 * If database save fails after upload:
 *
 * ```typescript
 * const { error: dbError } = await supabase
 *   .from('todo_attachments')
 *   .insert(metadata)
 *
 * if (dbError) {
 *   // Delete file since metadata save failed
 *   await supabase.storage
 *     .from('uploads')
 *     .remove([storagePath])
 *
 *   return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
 * }
 * ```
 *
 * This ensures consistency between Storage and database!
 */
