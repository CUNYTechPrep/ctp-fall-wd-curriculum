import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'LocalStack S3 Demo',
  description: 'File upload demo with LocalStack and Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="nav-container">
            <h1 className="nav-title">LocalStack S3 Demo</h1>
            <div className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/upload">Upload</Link>
            </div>
          </div>
        </nav>
        <main className="main">
          {children}
        </main>
      </body>
    </html>
  )
}
