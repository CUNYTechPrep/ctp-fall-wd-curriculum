#!/usr/bin/env node

/**
 * Extract and Bundle TypeScript Types
 *
 * Extracts type definitions from each example project and bundles them
 * for Monaco editor IntelliSense support.
 *
 * Output: public/types/{project}.d.ts for each project
 */

const fs = require('fs')
const path = require('path')

const projects = [
  'nextjs-firebase',
  'nextjs-supabase-postgres',
  'nextjs-supabase-drizzle',
  'react-vite-firebase',
  'react-vite-supabase',
]

const outputDir = path.join(__dirname, '..', 'public', 'types')

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

console.log('🔍 Extracting TypeScript definitions...\n')

projects.forEach(projectName => {
  console.log(`📦 Processing ${projectName}...`)

  const projectPath = path.join(__dirname, '..', '..', 'example-projects', projectName)

  if (!fs.existsSync(projectPath)) {
    console.log(`  ⚠️  Project not found, skipping\n`)
    return
  }

  // Collect type definitions
  const typeDefs = []

  // Add types from types/ directory
  const typesDir = path.join(projectPath, 'types')
  if (fs.existsSync(typesDir)) {
    const typeFiles = fs.readdirSync(typesDir).filter(f => f.endsWith('.ts'))
    typeFiles.forEach(file => {
      const content = fs.readFileSync(path.join(typesDir, file), 'utf-8')
      typeDefs.push(content)
    })
  }

  // Add common React and Next.js types
  typeDefs.push(`
// React types
declare module 'react' {
  export interface ReactNode {}
  export function useState<T>(initialValue: T): [T, (value: T) => void]
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void
  export function useContext<T>(context: any): T
  export function useRef<T>(initialValue: T): { current: T }
}

// Next.js types
declare module 'next/link' {
  export default function Link(props: { href: string; children: any; className?: string }): any
}

declare module 'next/navigation' {
  export function useRouter(): { push: (path: string) => void }
  export function useParams(): any
  export function redirect(path: string): never
}
`)

  // Add Firebase types if Firebase project
  if (projectName.includes('firebase')) {
    typeDefs.push(`
// Firebase types
declare module 'firebase/app' {
  export function initializeApp(config: any): any
  export function getApps(): any[]
}

declare module 'firebase/auth' {
  export interface User {
    uid: string
    email: string | null
    displayName: string | null
    photoURL: string | null
  }
  export function getAuth(app: any): any
  export function signInWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>
  export function createUserWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>
  export function signOut(auth: any): Promise<void>
}

declare module 'firebase/firestore' {
  export class Timestamp {
    static now(): Timestamp
    toDate(): Date
  }
  export function getFirestore(app: any): any
  export function collection(db: any, path: string): any
  export function doc(collection: any, id: string): any
  export function getDoc(ref: any): Promise<any>
  export function getDocs(query: any): Promise<any>
  export function addDoc(collection: any, data: any): Promise<any>
  export function updateDoc(ref: any, data: any): Promise<void>
  export function deleteDoc(ref: any): Promise<void>
  export function query(collection: any, ...constraints: any[]): any
  export function where(field: string, operator: string, value: any): any
  export function orderBy(field: string, direction?: string): any
  export function limit(count: number): any
  export function onSnapshot(query: any, callback: (snapshot: any) => void): () => void
}
`)
  }

  // Add Supabase types if Supabase project
  if (projectName.includes('supabase')) {
    typeDefs.push(`
// Supabase types
declare module '@supabase/supabase-js' {
  export function createClient(url: string, key: string): any
  export interface User {
    id: string
    email?: string
  }
}

declare module '@supabase/ssr' {
  export function createBrowserClient(url: string, key: string): any
  export function createServerClient(url: string, key: string, options: any): any
}
`)
  }

  // Combine all type definitions
  const bundled = typeDefs.join('\n\n')

  // Write to output
  const outputPath = path.join(outputDir, `${projectName}.d.ts`)
  fs.writeFileSync(outputPath, bundled)

  console.log(`  ✅ Generated ${outputPath}`)
  console.log(`     ${bundled.length} characters\n`)
})

console.log('✨ Type extraction complete!')
console.log(`📂 Output: ${outputDir}`)
