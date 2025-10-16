# Week 7: AWS LocalStack with Next.js
## Local Cloud Development

---

## Agenda

1. What is LocalStack? (10 min)
2. LocalStack Setup with Docker (10 min)
3. S3 Integration with Next.js (15 min)
4. File Upload Demo (20 min)
5. Assignment & Next Steps (5 min)

---

## What is LocalStack?

**LocalStack is a fully functional local AWS cloud stack.**

Emulate AWS services on your local machine without connecting to the cloud.

---

## Why LocalStack?

**Problems LocalStack Solves:**
- ❌ AWS costs during development
- ❌ Need internet to test cloud features
- ❌ Slow iteration with real AWS
- ❌ Difficult to reset test data
- ❌ Team needs AWS accounts

**LocalStack provides:**
- ✅ Free local AWS services
- ✅ Offline development
- ✅ Instant feedback loop
- ✅ Easy data reset
- ✅ No AWS account needed

---

## LocalStack Services

**Core Services Available:**
- **S3**: Object storage (files, images, documents)
- **DynamoDB**: NoSQL database
- **Lambda**: Serverless functions
- **API Gateway**: REST APIs
- **SQS**: Message queues
- **SNS**: Notifications
- And 80+ more services!

**We'll focus on S3 for file uploads.**

---

## Who Uses LocalStack?

- Startups prototyping AWS applications
- Companies reducing cloud costs
- Developers testing offline
- CI/CD pipelines
- Education and training

**Over 50,000 developers use LocalStack!**

---

## LocalStack Architecture

```
Your Next.js App
     ↓
  localhost:4566
     ↓
LocalStack Container
     ↓
Emulated AWS Services
(S3, DynamoDB, etc.)
```

**Same AWS SDK, different endpoint!**

---

## Setting Up LocalStack

### Requirements
- Docker Desktop installed and running
- Terminal/Command line
- 2GB RAM available

### Quick Start
```bash
docker run -d -p 4566:4566 localstack/localstack
```

**That's it! AWS services running locally.**

---

## Docker Compose Setup

Better for development - use `docker-compose.yml`:

```yaml
services:
  localstack:
    image: localstack/localstack
    ports:
      - "4566:4566"
    environment:
      - SERVICES=s3
      - DEBUG=1
    volumes:
      - "./localstack:/tmp/localstack"
```

```bash
docker-compose up -d
```

---

## Verify LocalStack

```bash
# Check service health
curl http://localhost:4566/health

# Should return:
{
  "services": {
    "s3": "running"
  }
}
```

**LocalStack dashboard:** `http://localhost:4566/_localstack/health`

---

## Creating S3 Buckets

### Using AWS CLI

```bash
# Create bucket
aws --endpoint-url=http://localhost:4566 s3 mb s3://my-uploads

# List buckets
aws --endpoint-url=http://localhost:4566 s3 ls

# Upload test file
echo "Hello" > test.txt
aws --endpoint-url=http://localhost:4566 s3 cp test.txt s3://my-uploads/
```

**Note:** Use `--endpoint-url` to point to LocalStack

---

## LocalStack vs Real AWS

| Feature | LocalStack | Real AWS |
|---------|-----------|----------|
| Cost | Free | Pay per use |
| Internet | Not needed | Required |
| Setup | Docker only | AWS account |
| Speed | Instant | Network delay |
| Data | Local | Cloud storage |
| Production | No | Yes |

**LocalStack = Development, AWS = Production**

---

## Next.js + LocalStack Integration

**Goal:** Upload files to S3 from Next.js app

**Steps:**
1. Install AWS SDK
2. Configure S3 client for LocalStack
3. Create upload API route
4. Build frontend component

---

## Install AWS SDK

```bash
npm install @aws-sdk/client-s3
```

**AWS SDK v3:**
- Modern, modular design
- Tree-shakeable (smaller bundles)
- TypeScript support built-in
- Works with LocalStack

---

## Environment Variables

Create `.env.local`:

```bash
AWS_ENDPOINT_URL=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_DEFAULT_REGION=us-east-1
S3_BUCKET_NAME=my-uploads
```

**Important:**
- These are test credentials for LocalStack
- Real AWS uses actual credentials
- Never commit real credentials!

---

## Configure S3 Client

```typescript
// lib/s3.ts
import { S3Client } from '@aws-sdk/client-s3'

export const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL,
  forcePathStyle: true, // Required for LocalStack
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})
```

**Key setting:** `forcePathStyle: true` enables LocalStack compatibility

---

## Why forcePathStyle?

**Virtual-hosted style (AWS default):**
```
https://bucket-name.s3.amazonaws.com/file.jpg
```

**Path style (LocalStack):**
```
http://localhost:4566/bucket-name/file.jpg
```

**LocalStack uses path style URLs!**

---

## Create Upload API Route

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from '@/lib/s3'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json(
      { error: 'No file provided' },
      { status: 400 }
    )
  }

  // Convert file to buffer
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Upload to S3
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: file.name,
    Body: buffer,
    ContentType: file.type
  }))

  return NextResponse.json({
    message: 'Upload successful',
    filename: file.name
  })
}
```

---

## Upload API Breakdown

**Step 1:** Get file from form
```typescript
const formData = await request.formData()
const file = formData.get('file') as File
```

**Step 2:** Convert to Buffer
```typescript
const bytes = await file.arrayBuffer()
const buffer = Buffer.from(bytes)
```

**Step 3:** Upload to S3
```typescript
await s3Client.send(new PutObjectCommand({
  Bucket: process.env.S3_BUCKET_NAME,
  Key: file.name,
  Body: buffer
}))
```

---

## Frontend Upload Component

```tsx
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

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      setMessage(data.message)
    } catch (error) {
      setMessage('Upload failed')
    } finally {
      setUploading(false)
    }
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

---

## Testing the Upload

1. **Start LocalStack**
```bash
docker-compose up -d
```

2. **Create S3 bucket**
```bash
aws --endpoint-url=http://localhost:4566 s3 mb s3://my-uploads
```

3. **Start Next.js**
```bash
npm run dev
```

4. **Upload a file at** `http://localhost:3000/upload`

---

## Verify Upload in LocalStack

**Using AWS CLI:**
```bash
aws --endpoint-url=http://localhost:4566 s3 ls s3://my-uploads/
```

**Using LocalStack Dashboard:**
- Navigate to `http://localhost:4566/_localstack/health`
- Browse S3 buckets
- View uploaded files

---

## List Uploaded Files

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

---

## Display Files

```tsx
// app/files/page.tsx
'use client'
import { useEffect, useState } from 'react'

export default function FilesPage() {
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

---

## Development Workflow

**Daily Development:**
1. Start LocalStack: `docker-compose up -d`
2. Start Next.js: `npm run dev`
3. Develop and test locally
4. Stop LocalStack: `docker-compose down`

**Switching to Production:**
1. Remove `AWS_ENDPOINT_URL` from `.env`
2. Add real AWS credentials
3. Deploy to Lambda/production
4. App automatically uses real AWS!

---

## Common Issues

**Port 4566 already in use:**
```bash
docker-compose down
# Or kill process using port 4566
```

**Connection refused:**
- Check Docker is running
- Verify LocalStack container: `docker ps`

**Files not appearing:**
- Check bucket exists: `aws --endpoint-url=... s3 ls`
- Verify environment variables loaded
- Restart Next.js dev server after env changes

---

## Best Practices

✅ **Use environment variables** for configuration
✅ **Create buckets before uploading** (via CLI or code)
✅ **Add unique prefixes** to file names (timestamps)
✅ **Validate file types and sizes** before upload
✅ **Handle errors gracefully** with try-catch
✅ **Show upload progress** for UX
✅ **Reset LocalStack data** between test runs

---

## Security Considerations

**LocalStack (Development):**
- Test credentials OK
- No real data exposure
- Safe to commit docker-compose.yml

**Real AWS (Production):**
- Never commit credentials
- Use environment variables
- Enable IAM roles
- Set S3 bucket policies
- Enable encryption

**Keep development and production configs separate!**

---

## Cost Comparison

**Without LocalStack:**
- AWS S3 requests: $0.005 per 1000 requests
- 10,000 test uploads/day = $0.50/day = $15/month
- Plus storage, bandwidth, etc.

**With LocalStack:**
- Unlimited local requests: Free
- Unlimited storage: Free
- No AWS account needed: Free

**LocalStack saves money and time!**

---

## Project Structure

```
file-manager/
├── app/
│   ├── page.tsx                # Home/file list
│   ├── upload/
│   │   └── page.tsx           # Upload page
│   └── api/
│       ├── upload/
│       │   └── route.ts       # POST upload
│       ├── files/
│       │   └── route.ts       # GET list files
│       └── files/[name]/
│           └── route.ts       # DELETE file
├── lib/
│   └── s3.ts                  # S3 client config
└── docker-compose.yml         # LocalStack config
```

---

## Starter Checklist

- [ ] Create Next.js project
- [ ] Install `@aws-sdk/client-s3`
- [ ] Create `docker-compose.yml`
- [ ] Start LocalStack
- [ ] Create S3 bucket
- [ ] Configure S3 client in `lib/s3.ts`
- [ ] Create upload API route
- [ ] Create upload page component
- [ ] Test file upload
- [ ] Implement file listing
- [ ] Add delete functionality

---

## Resources

- [LocalStack Docs](https://docs.localstack.cloud/)
- [AWS SDK v3 for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [S3 Client Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Docker Compose Guide](https://docs.docker.com/compose/)

---

## Advanced Features

**Try these after completing the basics:**
- Image thumbnails with S3
- File uploads with presigned URLs
- Multiple file uploads
- Folder organization in S3
- Search and filter files
- User authentication
- File sharing with temporary links

---

## Real-World Applications

**LocalStack + Next.js is perfect for:**
- Photo sharing apps
- Document management systems
- Cloud storage services
- Media upload platforms
- Backup solutions
- Content management systems

**Learn locally, deploy globally!**

---

## Next Week

**Week 8: Testing & Quality Assurance**
- Unit testing with Jest
- Integration testing
- End-to-end testing with Playwright
- Test-driven development (TDD)

---

## Questions?

**Today we covered:**
- ✅ What LocalStack is and why use it
- ✅ Setting up LocalStack with Docker
- ✅ Integrating S3 with Next.js
- ✅ Building file upload functionality
- ✅ Testing with LocalStack locally

**Start building your file manager this week!**

---

## Key Takeaways

1. **LocalStack emulates AWS services locally** - no costs, no internet needed
2. **Same AWS SDK code** works with LocalStack and real AWS
3. **Use `forcePathStyle: true`** for LocalStack S3 compatibility
4. **Environment variables** make switching between local/prod easy
5. **Develop locally, deploy to real AWS** when ready

**LocalStack = faster development, lower costs!** 🚀

---
