'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUploading(true)
    setMessage('')
    setError('')

    const formData = new FormData(e.currentTarget)
    const file = formData.get('file') as File

    if (!file || file.size === 0) {
      setError('Please select a file')
      setUploading(false)
      return
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(`File "${data.filename}" uploaded successfully!`)
        // Reset form
        e.currentTarget.reset()
        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (err) {
      setError('Failed to upload file. Make sure LocalStack is running.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container">
      <h1>Upload File</h1>
      <p>Upload a file to LocalStack S3</p>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="file">Select File</label>
          <input
            type="file"
            id="file"
            name="file"
            required
            disabled={uploading}
          />
        </div>

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </form>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <div style={{ marginTop: '2rem' }}>
        <Link href="/">← Back to Files</Link>
      </div>

      <div style={{ marginTop: '3rem', padding: '1rem', background: '#f9f9f9', borderRadius: '4px' }}>
        <h3 style={{ marginBottom: '1rem' }}>Setup Instructions</h3>
        <ol style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
          <li>Start LocalStack: <code style={{ background: '#fff', padding: '0.25rem 0.5rem', borderRadius: '3px' }}>docker-compose up -d</code></li>
          <li>Create S3 bucket: <code style={{ background: '#fff', padding: '0.25rem 0.5rem', borderRadius: '3px' }}>npm run localstack:setup</code></li>
          <li>Upload files using this form</li>
        </ol>
      </div>
    </div>
  )
}
