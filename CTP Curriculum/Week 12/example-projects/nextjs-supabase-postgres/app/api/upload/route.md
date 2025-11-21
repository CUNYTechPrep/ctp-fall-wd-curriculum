/**
 * REF: upload-api-header
 *
 * # File Upload API Route
 *
 * Server-side API endpoint for uploading files to Supabase Storage.
 *
 * ## Features
 *
 * - **Server-side validation** - Validate before storage
 * - **File type checking** - Accept only allowed file types
 * - **Size limits** - Prevent abuse with max file size
 * - **Unique filenames** - Prevent collisions with timestamps
 * - **Metadata storage** - Save file info to database
 * - **Public URL generation** - Get shareable file links
 *
 * ## Upload Strategy Comparison
 *
 * | Aspect | Server-Side | Direct Client |
 * |--------|-------------|---------------|
 * | Speed | Slower (one hop) | Faster (direct) |
 * | Validation | Full control | Limited |
 * | Processing | Can resize, scan | Not possible |
 * | Bandwidth | Server uses bandwidth | Client direct |
 * | Security | Full control | Depends on policies |
 * | Use case | Profile pics, attachments | Large files, public |
 *
 * This route uses server-side upload!
 *
 */
// CLOSE: upload-api-header

/**
 * REF: upload-post-handler
 *
 * ## POST - Upload File
 *
 * Upload a file and save to Supabase Storage.
 *
 * ### Request
 *
 * ```
 * POST /api/upload
 * Content-Type: multipart/form-data
 * Authorization: Bearer <session_token>
 *
 * file: <binary file data>
 * type: "profile" | "attachment"
 * todoId: "123" (optional, for attachments)
 * ```
 *
 * ### Form Data Fields
 *
 * | Field | Type | Required | Description |
 * |-------|------|----------|-------------|
 * | `file` | File | Yes | The file to upload |
 * | `type` | string | No | "profile" or "attachment" |
 * | `todoId` | string | No | Todo ID if attaching to todo |
 *
 * ### Response Success (200)
 *
 * ```json
 * {
 *   "success": true,
 *   "file": {
 *     "name": "photo.jpg",
 *     "url": "https://project.supabase.co/storage/v1/object/public/uploads/profile-pictures/user-456/1705331400000_photo.jpg",
 *     "size": 102400,
 *     "type": "image/jpeg",
 *     "path": "profile-pictures/user-456/1705331400000_photo.jpg"
 *   }
 * }
 * ```
 *
 * ### Response Errors
 *
 * | Status | Error | Meaning |
 * |--------|-------|---------|
 * | 400 | "No file provided" | Missing file in form data |
 * | 400 | "File too large (max 5MB)" | File exceeds 5MB limit |
 * | 400 | "Profile picture must be an image" | Wrong file type for profile |
 * | 401 | "Unauthorized" | User not authenticated |
 * | 500 | "Failed to upload file" | Storage upload error |
 * | 500 | "Internal server error" | Unexpected server error |
 *
 * ### Flow
 *
 * 1. Create server-side Supabase client
 * 2. Verify user is authenticated
 * 3. Parse FormData from request
 * 4. Validate file exists and meets size limit
 * 5. Validate file type based on upload type
 * 6. Generate unique filename with timestamp
 * 7. Determine storage path (organized by user/type)
 * 8. Upload to Supabase Storage
 * 9. Get public URL
 * 10. Save metadata to database (optional)
 * 11. Return file info
 *
 * ### File Validation
 *
 * **Size limits:**
 * - Maximum 5MB per file
 * - Adjust based on your needs
 * - Prevents storage abuse
 *
 * **Type validation:**
 * - Profile pictures: Images only
 * - Attachments: Any type allowed
 *
 * Note: MIME type can be faked by client!
 *
 * For production, validate using magic numbers:
 * ```typescript
 * import { fileTypeFromBuffer } from 'file-type'
 *
 * const fileBuffer = await file.arrayBuffer()
 * const type = await fileTypeFromBuffer(fileBuffer)
 *
 * if (type?.mime !== 'image/jpeg') {
 *   throw new Error('Invalid file type')
 * }
 * ```
 *
 * ### Filename Generation
 *
 * Pattern: `timestamp_originalname`
 *
 * **Alternatives:**
 * - UUID: `crypto.randomUUID()`
 * - Hash: MD5 of file content
 * - Sequential: User's file counter
 * - Current approach: Simple and human-readable
 *
 * **Benefits:**
 * - Prevents overwrites
 * - Avoids collisions
 * - Prevents directory traversal
 *
 * ### Storage Path Structure
 *
 * Organized by user and type:
 *
 * ```
 * uploads/
 *   ├── profile-pictures/
 *   │   └── user-456/
 *   │       └── 1705331400000_photo.jpg
 *   └── attachments/
 *       └── user-456/
 *           ├── 123/
 *           │   └── 1705331401000_document.pdf
 *           └── general/
 *               └── 1705331402000_note.txt
 * ```
 *
 * **Benefits:**
 * - Easy to find user's files
 * - Easy to delete user's data (GDPR)
 * - RLS can protect by path
 *
 */
// CLOSE: upload-post-handler

/**
 * REF: upload-client-usage
 *
 * ## Client-Side Usage
 *
 * ### Basic File Upload
 *
 * ```typescript
 * async function handleUpload(file: File) {
 *   const formData = new FormData()
 *   formData.append('file', file)
 *   formData.append('type', 'profile')
 *
 *   const response = await fetch('/api/upload', {
 *     method: 'POST',
 *     body: formData
 *     // Don't set Content-Type header!
 *     // Browser automatically sets it with boundary
 *   })
 *
 *   if (!response.ok) {
 *     const { error } = await response.json()
 *     throw new Error(error)
 *   }
 *
 *   const { file: uploadedFile } = await response.json()
 *   return uploadedFile
 * }
 * ```
 *
 * ### Upload Attachment to Todo
 *
 * ```typescript
 * async function attachFileToTodo(todoId: string, file: File) {
 *   const formData = new FormData()
 *   formData.append('file', file)
 *   formData.append('type', 'attachment')
 *   formData.append('todoId', todoId)
 *
 *   const response = await fetch('/api/upload', {
 *     method: 'POST',
 *     body: formData
 *   })
 *
 *   if (!response.ok) {
 *     const { error } = await response.json()
 *     throw new Error(error)
 *   }
 *
 *   const data = await response.json()
 *   console.log('Uploaded:', data.file.url)
 *   return data.file
 * }
 * ```
 *
 * ### File Input Handler
 *
 * ```typescript
 * function FileUploadInput() {
 *   const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *     const file = e.target.files?.[0]
 *     if (!file) return
 *
 *     try {
 *       const uploaded = await handleUpload(file)
 *       console.log('Success:', uploaded.url)
 *     } catch (error) {
 *       console.error('Upload failed:', error)
 *     }
 *   }
 *
 *   return (
 *     <input
 *       type="file"
 *       onChange={handleChange}
 *       accept="image/*"
 *     />
 *   )
 * }
 * ```
 *
 * ### Upload Progress (Advanced)
 *
 * Using XMLHttpRequest for progress:
 *
 * ```typescript
 * async function uploadWithProgress(file: File, onProgress: (percent: number) => void) {
 *   return new Promise((resolve, reject) => {
 *     const xhr = new XMLHttpRequest()
 *
 *     xhr.upload.addEventListener('progress', (e) => {
 *       const percent = (e.loaded / e.total) * 100
 *       onProgress(percent)
 *     })
 *
 *     xhr.addEventListener('load', () => {
 *       const data = JSON.parse(xhr.responseText)
 *       resolve(data)
 *     })
 *
 *     xhr.addEventListener('error', () => reject(xhr.statusText))
 *
 *     const formData = new FormData()
 *     formData.append('file', file)
 *     formData.append('type', 'attachment')
 *
 *     xhr.open('POST', '/api/upload')
 *     xhr.send(formData)
 *   })
 * }
 * ```
 *
 */
// CLOSE: upload-client-usage

/**
 * REF: storage-setup
 *
 * ## Supabase Storage Setup
 *
 * ### Create Storage Bucket
 *
 * In Supabase Dashboard → Storage:
 *
 * 1. Click "New bucket"
 * 2. Name: `uploads`
 * 3. Set to Public or Private
 *    - Public: URLs work without auth
 *    - Private: Only authenticated users with RLS policy
 * 4. Click "Create bucket"
 *
 * ### Configure RLS Policies
 *
 * Add policies to control access:
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
 *
 * ### Storage Path Explanation
 *
 * `(storage.foldername(name))[1]`
 * - `foldername()` splits path by `/`
 * - `[1]` gets first segment (user ID)
 * - `auth.uid()` gets current user's ID
 * - Ensures users can only upload to their folder
 *
 */
// CLOSE: storage-setup

/**
 * REF: upload-advanced
 *
 * ## Advanced File Processing
 *
 * ### Image Resizing
 *
 * Automatically resize images:
 *
 * ```typescript
 * import sharp from 'sharp'
 *
 * const buffer = await file.arrayBuffer()
 * const resized = await sharp(Buffer.from(buffer))
 *   .resize(800, 800, {
 *     fit: 'inside',
 *     withoutEnlargement: true
 *   })
 *   .jpeg({ quality: 80 })
 *   .toBuffer()
 *
 * await supabase.storage
 *   .from('uploads')
 *   .upload(storagePath, resized)
 * ```
 *
 * ### Generate Thumbnail
 *
 * Create small preview images:
 *
 * ```typescript
 * const thumbnail = await sharp(buffer)
 *   .resize(200, 200, { fit: 'cover' })
 *   .toBuffer()
 *
 * await supabase.storage
 *   .from('uploads')
 *   .upload(`${path}_thumb`, thumbnail)
 * ```
 *
 * ### Virus Scanning
 *
 * Scan for malicious files:
 *
 * ```typescript
 * import ClamScan from 'clamscan'
 *
 * const scanner = await new ClamScan().init()
 * const fileBuffer = await file.arrayBuffer()
 * const { isInfected } = await scanner.scanStream(
 *   Buffer.from(fileBuffer)
 * )
 *
 * if (isInfected) {
 *   return NextResponse.json(
 *     { error: 'File rejected - malware detected' },
 *     { status: 400 }
 *   )
 * }
 * ```
 *
 * ### Extract File Metadata
 *
 * Get image dimensions, EXIF, etc:
 *
 * ```typescript
 * import ExifParser from 'exif-parser'
 *
 * const buffer = await file.arrayBuffer()
 * const parser = ExifParser.create(Buffer.from(buffer))
 * const result = parser.parse()
 *
 * console.log(result.tags.GPSLatitude) // GPS location
 * console.log(result.tags.DateTime) // Photo date
 * ```
 *
 */
// CLOSE: upload-advanced

/**
 * REF: upload-error-handling
 *
 * ## Error Handling
 *
 * ### Common Storage Errors
 *
 * | Error | Cause | Solution |
 * |-------|-------|----------|
 * | "Bucket not found" | Typo in bucket name | Check bucket name |
 * | "Object already exists" | Same filename uploaded | Use unique filenames |
 * | "File too large" | Exceeds size limit | Increase limit or compress |
 * | "Invalid mime type" | Unsupported type | Check validation |
 *
 * ### Handling Upload Failures
 *
 * ```typescript
 * if (uploadError) {
 *   console.error('Upload error:', uploadError)
 *   return NextResponse.json(
 *     { error: 'Failed to upload file' },
 *     { status: 500 }
 *   )
 * }
 * ```
 *
 * ### Cleanup on Database Error
 *
 * If uploading succeeds but database save fails:
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
 *   return NextResponse.json(
 *     { error: 'Upload failed' },
 *     { status: 500 }
 *   )
 * }
 * ```
 *
 * This ensures consistency between Storage and database!
 *
 */
// CLOSE: upload-error-handling

/**
 * REF: metadata-storage
 *
 * ## Saving File Metadata
 *
 * ### Why Store Metadata?
 *
 * Storing file info in database enables:
 * - Track file ownership
 * - Enable search by filename
 * - Calculate storage usage
 * - List user's files
 * - Enable cascade delete
 * - Generate file reports
 *
 * ### Metadata Schema
 *
 * ```sql
 * CREATE TABLE todo_attachments (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   todo_id UUID NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
 *   file_name TEXT NOT NULL,
 *   file_url TEXT NOT NULL,
 *   file_size INTEGER NOT NULL,
 *   mime_type TEXT NOT NULL,
 *   created_at TIMESTAMP DEFAULT NOW()
 * );
 * ```
 *
 * ### Inserting Metadata
 *
 * ```typescript
 * const { error: dbError } = await supabase
 *   .from('todo_attachments')
 *   .insert({
 *     todo_id: todoId,
 *     file_name: file.name,
 *     file_url: publicUrl,
 *     file_size: file.size,
 *     mime_type: file.type,
 *   })
 * ```
 *
 * ### Listing Files
 *
 * ```typescript
 * const { data: attachments } = await supabase
 *   .from('todo_attachments')
 *   .select('*')
 *   .eq('todo_id', todoId)
 * ```
 *
 * ### Storage Usage
 *
 * ```typescript
 * const { data } = await supabase
 *   .from('todo_attachments')
 *   .select('file_size')
 *   .eq('todo_id', todoId)
 *
 * const totalBytes = data?.reduce((sum, f) => sum + f.file_size, 0) || 0
 * const totalMB = totalBytes / (1024 * 1024)
 * console.log(`Total storage: ${totalMB.toFixed(2)} MB`)
 * ```
 *
 */
// CLOSE: metadata-storage

/**
 * REF: direct-upload
 *
 * ## Direct Client Upload (Alternative)
 *
 * For simpler setups, upload directly from client to Storage:
 *
 * ```typescript
 * import { createClient } from '@supabase/supabase-js'
 *
 * const supabase = createClient(
 *   import.meta.env.VITE_SUPABASE_URL,
 *   import.meta.env.VITE_SUPABASE_ANON_KEY
 * )
 *
 * async function uploadDirectly(file: File) {
 *   const timestamp = Date.now()
 *   const filename = `${timestamp}_${file.name}`
 *
 *   const { data, error } = await supabase.storage
 *     .from('uploads')
 *     .upload(`attachments/general/${filename}`, file)
 *
 *   if (error) throw error
 *
 *   const { data: { publicUrl } } = supabase.storage
 *     .from('uploads')
 *     .getPublicUrl(data.path)
 *
 *   return publicUrl
 * }
 * ```
 *
 * ### Pros vs Server-Side
 *
 * **Pros:**
 * - Faster (no server hop)
 * - Less server bandwidth
 * - User sees progress
 *
 * **Cons:**
 * - No validation possible
 * - No processing (resize, scan)
 * - Relies on RLS policies
 * - Can't refuse uploads
 *
 */
// CLOSE: direct-upload
