
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
