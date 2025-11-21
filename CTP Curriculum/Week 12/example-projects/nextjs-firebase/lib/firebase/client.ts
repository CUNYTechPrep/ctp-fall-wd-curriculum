/**
 * REF: firebase-client-setup
 *
 * # Firebase Client Configuration
 *
 * This file initializes the Firebase SDK for client-side operations.
 *
 * ## Key Concepts
 *
 * - **Firebase SDK:** Library for Firebase services
 * - **Client-side:** Runs in user's browser (not server)
 * - **Environment Variables:** Secure config storage
 *
 * ## Why NEXT_PUBLIC_ Prefix?
 *
 * In Next.js, only env vars with `NEXT_PUBLIC_` are accessible in browser:
 * - Without prefix → server-side only
 * - With prefix → browser accessible
 * - Safe to expose (Firebase has security rules)
 *
 * ## Singleton Pattern
 *
 * Check if Firebase already initialized:
 * - Prevents "Firebase app already exists" errors
 * - Important in Next.js due to hot reloading
 *
 * **Audio Guide:** `audio/nextjs-firebase/firebase-client.mp3`
 */

import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

/**
 * REF: firebase-config-object
 *
 * ## Firebase Configuration Object
 *
 * These values come from your Firebase project settings.
 *
 * ### How to Get These Values
 *
 * 1. Go to [Firebase Console](https://console.firebase.google.com)
 * 2. Select your project
 * 3. Project Settings → General
 * 4. Scroll to "Your apps"
 * 5. Copy config values
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}
// CLOSE: firebase-config-object

/**
 * REF: firebase-init
 *
 * ## Initialize Firebase App (Singleton Pattern)
 *
 * `getApps()` returns array of initialized Firebase apps:
 * - If array is empty → initialize new app
 * - Otherwise → use existing app at index 0
 *
 * ### Why Singleton?
 *
 * Prevents multiple initializations which cause errors:
 * - Next.js hot reloading could re-run this file
 * - Without check → "Firebase app already exists" error
 * - With check → Safe to run multiple times
 */
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
// CLOSE: firebase-init

/**
 * REF: firebase-services
 *
 * ## Initialize Firebase Services
 *
 * Get instances of Firebase services from the app.
 *
 * ### AUTH Service
 *
 * Handles user authentication:
 * - Sign up, sign in, sign out
 * - Manages user sessions and tokens
 * - Works with Firebase Authentication rules
 *
 * ### DB Service (Firestore)
 *
 * NoSQL document database:
 * - Stores todos, messages, user data
 * - Real-time listeners for live updates
 * - Works with Firestore Security Rules
 *
 * ### STORAGE Service
 *
 * File storage service:
 * - Stores profile pictures and attachments
 * - Works with Firebase Storage Rules
 */
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
// CLOSE: firebase-services

/**
 * REF: app-export
 *
 * ## Export App Instance
 *
 * Export the Firebase app instance.
 *
 * **Rarely needed directly** - usually use the services (auth, db, storage).
 *
 * ### When to Use
 *
 * - Firebase Admin SDK initialization
 * - Advanced Firebase features
 * - Testing/debugging
 */
export default app
// CLOSE: app-export
// CLOSE: firebase-client-setup
