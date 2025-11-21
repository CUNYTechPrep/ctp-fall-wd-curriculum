/**
 * REF: firebase-admin-setup
 *
 * # Firebase Admin SDK Configuration
 *
 * Server-side Firebase SDK for privileged operations.
 *
 * ## Client SDK vs Admin SDK
 *
 * | Feature | Client SDK | Admin SDK |
 * |---------|------------|-----------|
 * | **Where** | `Browser` | Server only |
 * | **Auth** | User tokens | Service account |
 * | **Security** | Rules enforced | **Bypasses rules** |
 * | **Use for** | User operations | Admin operations |
 *
 * ### When to Use Admin SDK
 *
 * - Server-side operations (API routes, Server Actions)
 * - Bulk operations
 * - Admin tasks
 * - Bypassing security rules (carefully!)
 *
 * ### Security Warning
 *
 * ⚠️ Admin SDK bypasses all security rules!
 * - Never expose credentials to client
 * - Only use in server-side code
 * - Add your own authorization checks
 *
 * **Audio Guide:** `audio/nextjs-firebase/firebase-admin.mp3`
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

/**
 * REF: admin-initialization
 *
 * ## Initialize Firebase Admin SDK
 *
 * Uses singleton pattern like client SDK.
 *
 * ### Service Account Credentials
 *
 * Requires three environment variables:
 * - `FIREBASE_ADMIN_PROJECT_ID`: Your Firebase project ID
 * - `FIREBASE_ADMIN_CLIENT_EMAIL`: Service account email
 * - `FIREBASE_ADMIN_PRIVATE_KEY`: Private key (with `\n` replaced)
 *
 * ### Getting Credentials
 *
 * 1. Firebase Console → Project Settings
 * 2. Service Accounts tab
 * 3. Generate new private key
 * 4. Download JSON file
 * 5. Extract values to `.env.local`
 *
 * ### Private Key Handling
 *
 * `.replace(/\\n/g, '\n')` converts escaped newlines:
 * - Environment variables escape newlines as `\\n`
 * - Need actual newlines for the key to work
 * - This replacement fixes that
 */
const apps = getApps()
const adminApp =
  apps.length === 0
    ? initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      })
    : apps[0]
// CLOSE: admin-initialization

/**
 * REF: admin-services
 *
 * ## Export Admin Services
 *
 * Prefix with `admin` to distinguish from client SDK.
 *
 * ### Usage Example
 *
 * ```typescript
 * import { adminDb } from '@/lib/firebase/admin'
 *
 * // In API route or Server Action
 * const snapshot = await adminDb.collection('users').get()
 * // Gets ALL users (bypasses security rules!)
 * ```
 *
 * ### Naming Convention
 *
 * - `adminAuth` vs `auth` (client)
 * - `adminDb` vs `db` (client)
 * - `adminStorage` vs `storage` (client)
 *
 * Clear distinction prevents mixing them up!
 */
export const adminAuth = getAuth(adminApp)
export const adminDb = getFirestore(adminApp)
export const adminStorage = getStorage(adminApp)
export default adminApp
// CLOSE: admin-services
// CLOSE: firebase-admin-setup
