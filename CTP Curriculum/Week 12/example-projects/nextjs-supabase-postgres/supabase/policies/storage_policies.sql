/**
 * Supabase Storage Policies
 *
 * Row Level Security for Supabase Storage buckets.
 *
 * KEY CONCEPTS:
 * - Storage RLS similar to table RLS
 * - Protects files in storage buckets
 * - Uses storage.foldername() helper
 * - Path-based access control
 *
 * STORAGE TABLES:
 * - storage.objects: File metadata
 * - storage.buckets: Bucket configuration
 *
 * APPLY THESE POLICIES:
 * Supabase Dashboard → Storage → Policies → New Policy → Custom → Paste
 *
 * VIDEO GUIDE: supabase-storage-policies.mp4
 */

/**
 * CREATE STORAGE BUCKETS FIRST
 *
 * In Supabase Dashboard → Storage → Create bucket:
 * - Name: 'avatars' (for profile pictures)
 * - Name: 'attachments' (for todo files)
 * - Public: Yes (if want public URLs)
 * - File size limit: 5MB
 * - Allowed MIME types: (optional restriction)
 */

/**
 * AVATAR UPLOADS POLICY
 *
 * Users can upload profile pictures to their own folder
 *
 * STORAGE PATH STRUCTURE:
 * avatars/{userId}/{filename}
 *
 * storage.foldername(name):
 * - Splits path by '/'
 * - Returns array of folder names
 * - [1] is first folder (userId)
 * - [2] is second folder (if any)
 *
 * SECURITY:
 * - User can only upload to their own folder
 * - Prevents path traversal attacks
 * - Validates file type
 * - Enforces size limits
 */

-- Allow users to upload to their own avatar folder
CREATE POLICY "Users can upload own avatars"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1] AND
  (storage.extension(name) = 'jpg' OR
   storage.extension(name) = 'jpeg' OR
   storage.extension(name) = 'png' OR
   storage.extension(name) = 'gif' OR
   storage.extension(name) = 'webp')
);

/**
 * AVATAR READ POLICY
 *
 * Anyone authenticated can view profile pictures
 * Needed for:
 * - Public feed (show user attribution)
 * - Messages (show who you're chatting with)
 * - User lists
 */

-- Allow authenticated users to view all avatars
CREATE POLICY "Avatars are publicly viewable"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated'
);

/**
 * AVATAR DELETE POLICY
 *
 * Users can delete their own avatars
 */
CREATE POLICY "Users can delete own avatars"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

/**
 * AVATAR UPDATE POLICY
 *
 * Users can update (replace) their own avatars
 */
CREATE POLICY "Users can update own avatars"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

/**
 * ATTACHMENT UPLOADS POLICY
 *
 * Path structure: attachments/{userId}/{todoId}/{filename}
 *
 * Users can upload attachments to their todos
 * Organized by user and todo for easy management
 */
CREATE POLICY "Users can upload attachments to own todos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

/**
 * ATTACHMENT READ POLICY
 *
 * LIMITATION:
 * Storage policies can't check Firestore/Postgres data
 * Can't verify if todo is public
 *
 * SOLUTIONS:
 * 1. Make all attachments readable (check in app)
 * 2. Use signed URLs (generate with service role)
 * 3. Proxy through API route (check todo ownership)
 *
 * This example: Make readable, app enforces
 */
CREATE POLICY "Authenticated users can view attachments"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'attachments' AND
  auth.role() = 'authenticated'
);

/**
 * ATTACHMENT DELETE POLICY
 *
 * Users can delete attachments from their folder
 */
CREATE POLICY "Users can delete own attachments"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

/**
 * STORAGE HELPER FUNCTIONS
 *
 * Available in policies:
 *
 * storage.foldername(name):
 * - Splits path by '/'
 * - Returns array
 * - Example: 'avatars/user123/pic.jpg' → ['avatars', 'user123', 'pic.jpg']
 *
 * storage.filename(name):
 * - Returns just the filename
 * - Example: 'avatars/user123/pic.jpg' → 'pic.jpg'
 *
 * storage.extension(name):
 * - Returns file extension
 * - Example: 'pic.jpg' → 'jpg'
 */

/**
 * ADVANCED POLICIES
 *
 * File size limit:
 * ```sql
 * CREATE POLICY "Limit file size"
 * ON storage.objects
 * FOR INSERT
 * WITH CHECK (
 *   (octet_length(decode(metadata->>'size', 'escape'))) < 5242880 -- 5MB
 * );
 * ```
 *
 * Specific MIME types only:
 * ```sql
 * CREATE POLICY "Only images allowed"
 * ON storage.objects
 * FOR INSERT
 * WITH CHECK (
 *   (metadata->>'mimetype')::text LIKE 'image/%'
 * );
 * ```
 *
 * Admin access:
 * ```sql
 * CREATE POLICY "Admins can manage all files"
 * ON storage.objects
 * FOR ALL
 * USING (
 *   auth.jwt() ->> 'role' = 'admin'
 * );
 * ```
 *
 * Quota per user:
 * ```sql
 * CREATE POLICY "Max 100 files per user"
 * ON storage.objects
 * FOR INSERT
 * WITH CHECK (
 *   (
 *     SELECT COUNT(*)
 *     FROM storage.objects
 *     WHERE bucket_id = 'attachments'
 *     AND (storage.foldername(name))[1] = auth.uid()::text
 *   ) < 100
 * );
 * ```
 */

/**
 * SIGNED URLS
 *
 * For private files, use signed URLs:
 *
 * ```typescript
 * const { data, error } = await supabase.storage
 *   .from('private-bucket')
 *   .createSignedUrl('path/to/file.pdf', 60) // Expires in 60 seconds
 *
 * console.log(data.signedUrl) // Time-limited access URL
 * ```
 *
 * Signed URLs:
 * - Bypass policies
 * - Time-limited access
 * - Generated server-side
 * - Perfect for private files
 */

/**
 * TESTING STORAGE POLICIES
 *
 * Test in your app:
 * 1. Try uploading to your folder: Should succeed
 * 2. Try uploading to other's folder: Should fail
 * 3. Try uploading wrong file type: Should fail
 * 4. Try uploading huge file: Should fail
 * 5. Try viewing someone's file: Should succeed/fail based on policy
 */

/**
 * POLICY TROUBLESHOOTING
 *
 * "new row violates row-level security policy":
 * - Policy denied the operation
 * - Check WITH CHECK condition
 * - Verify auth.uid() is correct
 * - Check path structure matches policy
 *
 * "permission denied for table storage.objects":
 * - RLS enabled but no policies
 * - Add SELECT policy at minimum
 *
 * Files upload but can't download:
 * - Missing SELECT policy
 * - Bucket not public
 * - Add read policy
 */

/**
 * BUCKET CONFIGURATION
 *
 * In Supabase Dashboard → Storage → Bucket Settings:
 *
 * - Public: Allow public access URLs
 * - File size limit: Enforce at bucket level
 * - Allowed MIME types: Whitelist file types
 *
 * These are in addition to RLS policies!
 */

/**
 * CLEANUP POLICIES
 *
 * Allow cleanup functions to delete old files:
 *
 * ```sql
 * CREATE POLICY "Service role can delete old files"
 * ON storage.objects
 * FOR DELETE
 * USING (
 *   auth.jwt() ->> 'role' = 'service_role' AND
 *   created_at < NOW() - INTERVAL '30 days'
 * );
 * ```
 *
 * Use with Edge Functions or cron jobs
 */
