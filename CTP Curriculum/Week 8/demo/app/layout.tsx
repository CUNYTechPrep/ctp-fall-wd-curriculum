import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { SettingsProvider } from '@/contexts/SettingsContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Week 8 Demo - Auth & Settings',
  description: 'Cognito Authentication with DynamoDB User Settings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SettingsProvider>
            {children}
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
