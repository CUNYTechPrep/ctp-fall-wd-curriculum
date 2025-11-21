#!/usr/bin/env node

/**
 * Generate Ambient Type Definitions
 *
 * Creates .d.ts files in the docs-viewer source that declare types
 * for all example projects. This allows Next.js to compile them and
 * Monaco to use them for IntelliSense.
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

const outputDir = path.join(__dirname, '..', 'types', 'projects')

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

console.log('🔍 Generating ambient type declarations...\n')

projects.forEach(projectName => {
  console.log(`📦 ${projectName}...`)

  const projectPath = path.join(__dirname, '..', '..', 'example-projects', projectName)

  if (!fs.existsSync(projectPath)) {
    console.log(`  ⚠️  Not found, skipping\n`)
    return
  }

  // Read types from project
  let typeDefinitions = `// Type definitions for ${projectName}\n\n`

  // Read types/index.ts if exists
  const typesFile = path.join(projectPath, 'types', 'index.ts')
  if (fs.existsSync(typesFile)) {
    let content = fs.readFileSync(typesFile, 'utf-8')

    // Remove imports
    content = content.replace(/^import .+$/gm, '')

    // Remove export keywords to make ambient
    content = content.replace(/export /g, 'declare ')

    // Remove REF/CLOSE markers
    content = content.replace(/\/\/ CLOSE:.+$/gm, '')

    // Wrap in declare module for the project
    typeDefinitions += `declare module '@/${projectName}/types' {\n`
    typeDefinitions += content
    typeDefinitions += `\n}\n\n`
  }

  // Add common framework types
  typeDefinitions += getFrameworkTypes(projectName)

  // Write ambient declaration file
  const outputPath = path.join(outputDir, `${projectName}.d.ts`)
  fs.writeFileSync(outputPath, typeDefinitions)

  console.log(`  ✅ ${outputPath}`)
  console.log(`     ${typeDefinitions.length} characters\n`)
})

// Create index that re-exports all
const indexContent = projects.map(p =>
  `/// <reference path="./${p}.d.ts" />`
).join('\n')

fs.writeFileSync(path.join(outputDir, 'index.d.ts'), indexContent)

console.log('✨ Type generation complete!')
console.log(`📂 Output: ${outputDir}`)

function getFrameworkTypes(projectName) {
  let types = `
// React types for ${projectName}
declare module 'react' {
  export type ReactNode = any
  export type FormEvent = any
  export function useState<T>(initial: T): [T, (value: T) => void]
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void
  export function useContext<T>(context: any): T
  export function useRef<T>(initial: T): { current: T }
  export function createContext<T>(defaultValue: T): any
}

// Next.js types
declare module 'next/link' {
  export default function Link(props: any): any
}

declare module 'next/navigation' {
  export function useRouter(): any
  export function useParams(): any
  export function redirect(path: string): never
}

declare module 'next/font/google' {
  export function Inter(config: any): any
}
`

  if (projectName.includes('firebase')) {
    types += `
// Firebase types for ${projectName}
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
}

declare module 'firebase/firestore' {
  export class Timestamp {
    static now(): Timestamp
    toDate(): Date
  }
}
`
  }

  if (projectName.includes('supabase')) {
    types += `
// Supabase types for ${projectName}
declare module '@supabase/supabase-js' {
  export function createClient(url: string, key: string): any
  export interface User {
    id: string
    email?: string
  }
}
`
  }

  return types
}
