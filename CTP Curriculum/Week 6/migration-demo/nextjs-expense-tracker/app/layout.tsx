import Link from 'next/link'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app">
          <nav className="navbar">
            <h1>Expense Tracker (Next.js)</h1>
            <div className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/expenses">Expenses</Link>
            </div>
          </nav>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
