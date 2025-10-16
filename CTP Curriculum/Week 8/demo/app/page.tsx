'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="loading"></div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="page-header" style={{ textAlign: 'center', padding: '3rem 0' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Week 8 Demo
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
          Authentication & User Settings with Cognito + DynamoDB
        </p>

        {user ? (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/settings" className="button">
              Go to Settings
            </Link>
            <Link href="/profile" className="button button-secondary">
              View Profile
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/login" className="button">
              Sign In
            </Link>
            <Link href="/signup" className="button button-secondary">
              Sign Up
            </Link>
          </div>
        )}
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>Features</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0' }}>🔐 Authentication with AWS Cognito</li>
            <li style={{ padding: '0.5rem 0' }}>🌓 Dark/Light Mode</li>
            <li style={{ padding: '0.5rem 0' }}>🔤 Adjustable Font Size</li>
            <li style={{ padding: '0.5rem 0' }}>🎨 High Contrast Mode</li>
            <li style={{ padding: '0.5rem 0' }}>🎞️ Reduced Motion Option</li>
            <li style={{ padding: '0.5rem 0' }}>🖼️ Profile Photo Upload to S3</li>
            <li style={{ padding: '0.5rem 0' }}>💾 Settings Stored in DynamoDB</li>
          </ul>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>Technologies</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0' }}><strong>Next.js 14</strong> - App Router</li>
            <li style={{ padding: '0.5rem 0' }}><strong>AWS Cognito</strong> - User authentication</li>
            <li style={{ padding: '0.5rem 0' }}><strong>DynamoDB</strong> - User preferences storage</li>
            <li style={{ padding: '0.5rem 0' }}><strong>S3</strong> - Profile photo storage</li>
            <li style={{ padding: '0.5rem 0' }}><strong>LocalStack</strong> - Local AWS development</li>
            <li style={{ padding: '0.5rem 0' }}><strong>TypeScript</strong> - Type safety</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
