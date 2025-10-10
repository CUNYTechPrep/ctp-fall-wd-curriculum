# Week 7 - You Do: Build a File Manager with LocalStack

## Overview

Build a complete file management application using Next.js and LocalStack S3 for cloud storage.

## Assignment

**Create a File Manager Application**

Build a web application that allows users to upload, view, and delete files using LocalStack S3.

**Core Features Required:**

✅ **File Upload**
- Upload files to LocalStack S3
- Show upload progress/status
- Display success/error messages
- Accept multiple file types

✅ **File Listing**
- Display all uploaded files
- Show file metadata (name, size, upload date)
- Sort files by date (newest first)
- Format file sizes (KB, MB, GB)

✅ **File Management**
- Delete files from S3
- Confirmation before deletion
- Update list after deletion

✅ **User Interface**
- Clean, responsive design
- Navigation between pages
- Loading states
- Error handling

## Starter Checklist

### 1. Setup Project
```bash
npx create-next-app@latest file-manager --typescript
cd file-manager
npm install @aws-sdk/client-s3
```

### 2. LocalStack Setup
- [ ] Create `docker-compose.yml`
- [ ] Start LocalStack: `docker-compose up -d`
- [ ] Create S3 bucket: `aws --endpoint-url=http://localhost:4566 s3 mb s3://my-files`
- [ ] Verify bucket: `aws --endpoint-url=http://localhost:4566 s3 ls`

### 3. Configuration
- [ ] Create `.env.local` with LocalStack config
- [ ] Create `lib/s3.ts` with S3 client configuration
- [ ] Test connection to LocalStack

### 4. File Upload Feature
- [ ] Create `/upload` page
- [ ] Add file input form
- [ ] Create `/api/upload` route
- [ ] Implement `PutObjectCommand`
- [ ] Handle errors and success messages

### 5. File Listing Feature
- [ ] Create home page `/`
- [ ] Create `/api/files` route
- [ ] Implement `ListObjectsV2Command`
- [ ] Display files with metadata
- [ ] Format file sizes and dates

### 6. File Deletion Feature
- [ ] Create `/api/files/[key]` route
- [ ] Implement `DeleteObjectCommand`
- [ ] Add delete button to file list
- [ ] Add confirmation dialog
- [ ] Refresh list after deletion

### 7. Styling
- [ ] Add Tailwind CSS or CSS modules
- [ ] Make responsive for mobile
- [ ] Add loading spinners
- [ ] Style error/success messages

## Project Structure

```
file-manager/
├── app/
│   ├── layout.tsx              # Root layout with nav
│   ├── page.tsx                # Home - file list
│   ├── upload/
│   │   └── page.tsx           # Upload page
│   └── api/
│       ├── upload/
│       │   └── route.ts       # POST - upload file
│       ├── files/
│       │   └── route.ts       # GET - list files
│       └── files/[key]/
│           └── route.ts       # DELETE - delete file
├── lib/
│   └── s3.ts                  # S3 client config
├── docker-compose.yml         # LocalStack setup
├── .env.local                 # Environment variables
└── README.md                  # Your documentation
```

## Implementation Guide

### Step 1: S3 Client Configuration

Create `lib/s3.ts`:

```typescript
import { S3Client } from '@aws-sdk/client-s3'

export const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION || 'us-east-1',
  endpoint: process.env.AWS_ENDPOINT_URL,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
  }
})

export const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'my-files'
```

### Step 2: Upload API Route

Create `app/api/upload/route.ts`:

```typescript
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client, BUCKET_NAME } from '@/lib/s3'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  // Convert to buffer and upload
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: file.name,
    Body: buffer,
    ContentType: file.type
  }))

  return Response.json({ success: true })
}
```

### Step 3: List Files API Route

Create `app/api/files/route.ts`:

```typescript
import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { s3Client, BUCKET_NAME } from '@/lib/s3'

export async function GET() {
  const response = await s3Client.send(
    new ListObjectsV2Command({ Bucket: BUCKET_NAME })
  )

  const files = response.Contents?.map(obj => ({
    key: obj.Key,
    size: obj.Size,
    lastModified: obj.LastModified
  }))

  return Response.json({ files })
}
```

### Step 4: Delete File API Route

Create `app/api/files/[key]/route.ts`:

```typescript
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { s3Client, BUCKET_NAME } from '@/lib/s3'

export async function DELETE(
  request: Request,
  { params }: { params: { key: string } }
) {
  await s3Client.send(new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: params.key
  }))

  return Response.json({ success: true })
}
```

## Common Issues & Solutions

### LocalStack Connection Failed
**Solution:**
- Verify Docker is running
- Check LocalStack health: `curl http://localhost:4566/health`
- Restart LocalStack: `docker-compose restart`

### Bucket Does Not Exist
**Solution:**
```bash
aws --endpoint-url=http://localhost:4566 s3 mb s3://my-files
```

### Environment Variables Not Loading
**Solution:**
- Use `.env.local` (not `.env`)
- Restart Next.js dev server
- Check spelling and formatting

### Upload Fails with Large Files
**Solution:** Increase body size limit in `next.config.js`:
```javascript
module.exports = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}
```

### CORS Errors
**Solution:** API routes run server-side, no CORS needed. If using client-side SDK, configure LocalStack CORS.

## Required Features

- [ ] Upload files (any type)
- [ ] List all files
- [ ] Delete files with confirmation
- [ ] Show file size in human-readable format
- [ ] Show upload date/time
- [ ] Navigation between pages
- [ ] Loading states during operations
- [ ] Error messages for failures
- [ ] Success messages for operations
- [ ] Responsive design

## Bonus Challenges

🌟 **Download Files** - Add download button for each file
🌟 **File Preview** - Show image previews for image files
🌟 **Search/Filter** - Search files by name
🌟 **File Categories** - Organize by file type (images, documents, etc.)
🌟 **Multiple Upload** - Upload multiple files at once
🌟 **Drag & Drop** - Drag and drop files to upload
🌟 **Progress Bar** - Show upload progress percentage
🌟 **File Folders** - Create folders to organize files
🌟 **Real AWS Deploy** - Deploy with real AWS S3

## Testing Your Application

### Manual Testing Steps

1. **Start LocalStack**
```bash
docker-compose up -d
```

2. **Verify Services**
```bash
curl http://localhost:4566/health
```

3. **Create Bucket**
```bash
aws --endpoint-url=http://localhost:4566 s3 mb s3://my-files
```

4. **Start Next.js**
```bash
npm run dev
```

5. **Test Features**
   - Upload a file
   - View file list
   - Delete a file
   - Verify in LocalStack dashboard

### Verification with AWS CLI

```bash
# List all files
aws --endpoint-url=http://localhost:4566 s3 ls s3://my-files/

# Upload file manually
aws --endpoint-url=http://localhost:4566 s3 cp test.txt s3://my-files/

# Delete file manually
aws --endpoint-url=http://localhost:4566 s3 rm s3://my-files/test.txt
```

## Submission Requirements

1. **GitHub Repository**
   - Push your code to GitHub
   - Include complete README with setup instructions
   - Include docker-compose.yml
   - Include .env.local.example (not .env.local!)

2. **Documentation**
   - Setup instructions
   - Features implemented
   - Screenshots of working app
   - Challenges faced and solutions

3. **Demo Video or Screenshots**
   - Upload functionality
   - File list display
   - Delete functionality
   - Error handling

**Submit:**
- GitHub repository URL
- README with setup instructions
- Screenshots or demo video

**Due:** Before Week 8

## Evaluation Criteria

| Feature | Points |
|---------|--------|
| LocalStack setup works | 10 |
| File upload works | 20 |
| File list displays correctly | 20 |
| Delete functionality works | 20 |
| Error handling implemented | 10 |
| UI is clean and responsive | 10 |
| Code is well-organized | 10 |
| **Total** | **100** |

## Resources

- [LocalStack Documentation](https://docs.localstack.cloud/)
- [AWS SDK S3 Client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Week 7 Demo Code](../demo)
- [Week 7 Slides](../../slides/Week%207%20-%20LocalStack%20with%20Next.js.md)

## Tips for Success

1. **Start with Demo** - Reference the week 7 demo code
2. **Test Incrementally** - Test each feature before moving to next
3. **Use Console Logs** - Debug API routes with console.log
4. **Check Network Tab** - Use browser DevTools to debug API calls
5. **Read Error Messages** - They usually tell you what's wrong
6. **Use AWS CLI** - Verify operations in LocalStack directly
7. **Commit Often** - Git commit after each working feature

## Helper Functions

### Format File Size
```typescript
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
```

### Format Date
```typescript
function formatDate(date: Date | string): string {
  return new Date(date).toLocaleString()
}
```

## Need Help?

- Review the lecture slides and demo
- Check LocalStack logs: `docker-compose logs localstack`
- Use the demo code as reference
- Ask questions in class or office hours
- Check Next.js and LocalStack documentation

## Stretch Goals (After Completing Core Features)

- Deploy to Vercel with real AWS S3
- Add user authentication
- Implement file sharing with links
- Add file versioning
- Create admin dashboard
- Add analytics (storage used, file counts)
- Implement search functionality
- Add file tagging system

Good luck building your file manager! 🚀

## Example Screenshots

Your submission should include screenshots showing:
1. Upload page with file selected
2. File list with multiple files
3. Delete confirmation dialog
4. Success message after operation
5. Error handling (disconnect LocalStack and show error)
6. LocalStack dashboard showing your files
