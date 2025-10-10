# I DO Block 2: Next.js AWS SDK Integration Demo Details

## Demo Overview
Instructor demonstrates integrating AWS SDK with Next.js to connect to LocalStack S3 service.

## Duration: 20 minutes

## Materials Needed
- Next.js project (created with create-next-app)
- LocalStack running from previous demo
- Code editor
- Terminal

## Demo Steps

### Step 1: Project Setup (5 minutes)

1. **Create Next.js Project**
```bash
npx create-next-app@latest localstack-demo --typescript --tailwind --app
cd localstack-demo
```

2. **Install AWS SDK**
```bash
npm install @aws-sdk/client-s3
```

3. **Create Environment File**
```bash
# .env.local
AWS_ENDPOINT_URL=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_DEFAULT_REGION=us-east-1
S3_BUCKET_NAME=demo-uploads
```

### Step 2: AWS SDK Configuration (8 minutes)

1. **Create S3 Client Utility**
```typescript
// src/lib/s3.ts
import { S3Client } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION || 'us-east-1',
  endpoint: process.env.AWS_ENDPOINT_URL,
  forcePathStyle: true, // Required for LocalStack
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
  }
})

export { s3Client }
```

2. **Explain Configuration Options**
   - `endpoint`: Points to LocalStack instead of AWS
   - `forcePathStyle`: Required for LocalStack S3 compatibility
   - `credentials`: Test credentials for local development

3. **Environment Variable Access**
   - Show difference between `NEXT_PUBLIC_` and server-side env vars
   - Explain security implications

### Step 3: API Route Implementation (7 minutes)

1. **Create Upload API Route**
```typescript
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from '@/lib/s3'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `uploads/${Date.now()}-${file.name}`,
      Body: buffer,
      ContentType: file.type
    })

    await s3Client.send(command)

    return NextResponse.json({
      message: 'File uploaded successfully',
      filename: file.name
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
```

2. **Explain Key Concepts**
   - FormData handling in Next.js
   - File to Buffer conversion
   - S3 PutObjectCommand structure
   - Error handling best practices

## Key Teaching Points

- **SDK Configuration**
  - LocalStack requires specific endpoint configuration
  - forcePathStyle is crucial for LocalStack compatibility
  - Environment variables for different environments

- **Next.js API Routes**
  - Server-side only - SDK credentials are safe
  - Built-in FormData support
  - Proper error handling and status codes

- **File Handling**
  - Converting File to Buffer for S3
  - Adding timestamps to avoid naming conflicts
  - Preserving original file extensions

## Common Issues & Solutions

- **CORS Errors**
  - API routes run server-side, no CORS needed
  - If using client-side SDK, configure LocalStack CORS

- **Environment Variables Not Loading**
  - Restart Next.js dev server after .env changes
  - Check .env.local vs .env placement

- **S3 Connection Failed**
  - Verify LocalStack is running on port 4566
  - Check endpoint URL formatting

## Student Questions to Anticipate

**Q: "Why do we need forcePathStyle?"**
A: LocalStack uses path-style URLs (localhost:4566/bucket) instead of virtual-hosted style (bucket.localhost:4566) that AWS uses.

**Q: "Are these credentials secure?"**
A: These are dummy credentials for LocalStack. Real AWS credentials should never be committed to code.

**Q: "Can we use this same code with real AWS?"**
A: Yes, just change the environment variables to remove the endpoint and use real AWS credentials.

## Next Steps
- Demonstrate frontend file upload component
- Test the complete upload flow
- Show files in LocalStack dashboard