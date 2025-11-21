/**
 * Documentation Viewer - Home Page
 *
 * Landing page with all 5 projects
 */

import Link from 'next/link'

const projects = [
  {
    id: 'nextjs-firebase',
    title: 'Next.js + Firebase',
    description: 'Full-stack with Firestore, real-time, and Firebase Auth',
    features: ['Client-side rendering', 'Firestore NoSQL', 'Real-time listeners', 'Firebase Storage']
  },
  {
    id: 'nextjs-supabase-postgres',
    title: 'Next.js + Supabase (Postgres)',
    description: 'SSR + CSR with PostgreSQL, API Routes, Server Actions, Middleware',
    features: ['Server Components', 'Row Level Security', 'API Routes', 'Server Actions', 'Middleware']
  },
  {
    id: 'nextjs-supabase-drizzle',
    title: 'Next.js + Supabase + Drizzle',
    description: 'Type-safe ORM with perfect TypeScript inference',
    features: ['Drizzle ORM', 'Type inference', 'SQL-like queries', 'Migrations']
  },
  {
    id: 'react-vite-firebase',
    title: 'React (Vite) + Firebase',
    description: 'Simple SPA with fast Vite build tool',
    features: ['SPA architecture', 'Vite HMR', 'React Router', 'Code splitting']
  },
  {
    id: 'react-vite-supabase',
    title: 'React (Vite) + Supabase',
    description: 'PostgreSQL in browser with RLS',
    features: ['PostgreSQL SPA', 'RLS from client', 'Type generation', 'Open-source']
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-4">Week 12 Documentation</h1>
          <p className="text-xl opacity-90 mb-2">
            Interactive Side-by-Side Code Documentation
          </p>
          <p className="text-lg opacity-75">
            Comments on LEFT • Code on RIGHT • Full TSX Syntax Highlighting
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Link
              key={project.id}
              href={`/docs/${project.id}`}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {project.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {project.description}
              </p>
              <div className="space-y-1">
                {project.features.map(feature => (
                  <div key={feature} className="text-sm text-gray-500">
                    ✓ {feature}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-blue-600 font-medium">
                Explore Documentation →
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center text-white opacity-75">
          <p>Built with Next.js • Monaco Editor • Interactive Navigation</p>
        </div>
      </div>
    </div>
  )
}
