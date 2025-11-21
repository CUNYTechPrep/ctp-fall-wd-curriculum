
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
