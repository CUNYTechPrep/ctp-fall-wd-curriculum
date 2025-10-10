'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface FileItem {
  name: string
  size: number
  lastModified: string
}

export default function Home() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFiles()
  }, [])

  async function fetchFiles() {
    try {
      setLoading(true)
      const res = await fetch('/api/files')
      const data = await res.json()

      if (res.ok) {
        setFiles(data.files)
      } else {
        setError(data.error || 'Failed to fetch files')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="container">
      <h1>Uploaded Files</h1>
      <p>Files stored in LocalStack S3</p>

      <div style={{ margin: '2rem 0' }}>
        <Link href="/upload">
          <button>Upload New File</button>
        </Link>
      </div>

      {error && <div className="message error">{error}</div>}

      {loading ? (
        <div className="loading">Loading files...</div>
      ) : files.length === 0 ? (
        <div className="empty-state">
          <p>No files uploaded yet</p>
          <p style={{ marginTop: '1rem' }}>
            <Link href="/upload">Upload your first file</Link>
          </p>
        </div>
      ) : (
        <ul className="file-list">
          {files.map((file) => (
            <li key={file.name} className="file-item">
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-meta">
                  {formatBytes(file.size)} • {formatDate(file.lastModified)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
