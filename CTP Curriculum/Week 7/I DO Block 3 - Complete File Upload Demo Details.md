# I DO Block 3: Complete File Upload Demo Details

## Demo Overview
Instructor demonstrates building a complete file upload and listing application with LocalStack S3.

## Duration: 20 minutes

## Materials Needed
- Completed demo from I DO Blocks 1 & 2
- Browser
- Terminal
- LocalStack running

## Demo Steps

### Step 1: Create Upload Page Component (5 minutes)

1. **Create Upload Page**
```typescript
// app/upload/page.tsx
'use client'
import { useState, FormEvent } from 'react'

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUploading(true)

    const formData = new FormData(e.currentTarget)
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const data = await res.json()
    setMessage(data.message)
    setUploading(false)
  }

  return (
    <div>
      <h1>Upload File</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" required />
        <button disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
```

2. **Explain Key Concepts**
   - Client component for interactivity
   - FormData API for file handling
   - Loading states for UX
   - Disabled button during upload

### Step 2: Test File Upload (3 minutes)

1. **Start Application**
```bash
npm run dev
```

2. **Navigate to Upload Page**
   - Go to `http://localhost:3000/upload`
   - Select a test file
   - Click upload button

3. **Verify Upload**
```bash
aws --endpoint-url=http://localhost:4566 s3 ls s3://demo-uploads/
```

4. **Show LocalStack Dashboard**
   - Open `http://localhost:4566/_localstack/health`
   - Navigate to S3 section
   - Show uploaded file

### Step 3: Create File Listing API (5 minutes)

1. **Create Files API Route**
```typescript
// app/api/files/route.ts
import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { s3Client } from '@/lib/s3'

export async function GET() {
  const command = new ListObjectsV2Command({
    Bucket: process.env.S3_BUCKET_NAME
  })

  const response = await s3Client.send(command)
  const files = response.Contents?.map(obj => ({
    name: obj.Key,
    size: obj.Size,
    lastModified: obj.LastModified
  })) || []

  return Response.json({ files })
}
```

2. **Explain ListObjectsV2Command**
   - Lists all objects in bucket
   - Returns metadata (size, date, etc.)
   - Can filter with prefix
   - Paginated for large buckets

### Step 4: Create File List Page (5 minutes)

1. **Create Home Page with File List**
```typescript
// app/page.tsx
'use client'
import { useEffect, useState } from 'react'

export default function Home() {
  const [files, setFiles] = useState([])

  useEffect(() => {
    fetch('/api/files')
      .then(r => r.json())
      .then(data => setFiles(data.files))
  }, [])

  return (
    <div>
      <h1>Uploaded Files</h1>
      <ul>
        {files.map(file => (
          <li key={file.name}>
            {file.name} - {file.size} bytes
          </li>
        ))}
      </ul>
    </div>
  )
}
```

2. **Test Complete Flow**
   - Navigate to home page
   - Show uploaded files list
   - Upload new file
   - Refresh to see new file appear

### Step 5: Demo Complete Workflow (2 minutes)

1. **Complete User Journey**
   - Start at home page (empty state or files)
   - Navigate to upload page
   - Select and upload file
   - Return to home page
   - See newly uploaded file in list

2. **Show Data Persistence**
   - Refresh page - files still there
   - Stop and restart app - files still there
   - LocalStack volumes persist data

## Key Teaching Points

- **Complete CRUD Flow**
  - Create: Upload file
  - Read: List files
  - (Delete and Update can be added later)

- **Client vs Server Components**
  - Upload page: Client (form handling)
  - API routes: Server (S3 operations)
  - Home page: Client (data fetching with useEffect)

- **Error Handling**
  - Check for file existence
  - Handle S3 errors gracefully
  - Show user-friendly error messages

- **UX Best Practices**
  - Loading states during upload
  - Success/error messages
  - Disabled buttons during operations
  - Redirect after successful upload

## Common Issues & Solutions

- **Files Not Appearing After Upload**
  - Refresh the page (no auto-refresh implemented)
  - Check browser console for errors
  - Verify LocalStack is still running

- **Upload Fails Silently**
  - Check browser Network tab
  - Verify API route is being called
  - Check server console for errors

- **Bucket Not Found Error**
  - Run `npm run localstack:setup` again
  - Verify bucket name in .env.local matches

## Student Questions to Anticipate

**Q: "How do we automatically refresh the file list after upload?"**
A: Several options:
- Redirect to home page (shown in demo)
- Use React state management to refetch
- WebSockets for real-time updates
- Server-Sent Events

**Q: "Can we upload multiple files at once?"**
A: Yes! Change input to `<input type="file" multiple />` and loop through files in the API route.

**Q: "How do we download files?"**
A: Use `GetObjectCommand` from AWS SDK or generate presigned URLs for direct download links.

**Q: "What about file size limits?"**
A: Next.js has a default 4MB limit. Configure in `next.config.js`:
```javascript
module.exports = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}
```

## Extensions to Demonstrate (Time Permitting)

- **Add file metadata display**
  - Format bytes to KB/MB
  - Format dates to readable strings

- **Add basic styling**
  - CSS for better UI
  - Grid/list view for files

- **Add file type icons**
  - Detect file extension
  - Show appropriate icon

## Next Steps
- Students will implement delete functionality
- Add file download feature
- Enhance UI with Tailwind CSS
- Deploy with real AWS (optional)