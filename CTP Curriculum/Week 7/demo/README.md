# Week 7 Demo: LocalStack S3 with Next.js

This demo showcases how to integrate AWS S3 with Next.js using LocalStack for local development.

## Features

- File upload to LocalStack S3
- List uploaded files
- Next.js App Router
- AWS SDK v3
- TypeScript
- Docker Compose for LocalStack

## Prerequisites

- Node.js 18+ installed
- Docker Desktop installed and running
- AWS CLI installed (optional, for manual testing)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

The `.env.local` file should contain:

```bash
AWS_ENDPOINT_URL=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_DEFAULT_REGION=us-east-1
S3_BUCKET_NAME=demo-uploads
```

### 3. Start LocalStack

```bash
docker-compose up -d
```

Wait a few seconds for LocalStack to start, then verify it's running:

```bash
curl http://localhost:4566/health
```

### 4. Create S3 Bucket

```bash
npm run localstack:setup
```

Or manually using AWS CLI:

```bash
aws --endpoint-url=http://localhost:4566 s3 mb s3://demo-uploads
```

### 5. Start Next.js Dev Server

```bash
npm run dev
```

### 6. Open the App

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
.
├── app/
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Home page (file list)
│   ├── upload/
│   │   └── page.tsx           # Upload page
│   ├── api/
│   │   ├── upload/
│   │   │   └── route.ts       # POST /api/upload
│   │   └── files/
│   │       └── route.ts       # GET /api/files
│   └── globals.css             # Global styles
├── lib/
│   └── s3.ts                   # S3 client configuration
├── docker-compose.yml          # LocalStack configuration
├── package.json
└── README.md
```

## How It Works

### LocalStack Setup

LocalStack runs as a Docker container and emulates AWS S3 on `localhost:4566`. The `docker-compose.yml` file configures:

- Port mapping: `4566:4566`
- Service: S3
- Volume for data persistence

### S3 Client Configuration

The `lib/s3.ts` file configures the AWS SDK to point to LocalStack:

- `endpoint`: Points to localhost:4566 instead of AWS
- `forcePathStyle`: Required for LocalStack S3 compatibility
- `credentials`: Test credentials (not real AWS credentials)

### File Upload Flow

1. User selects file on `/upload` page
2. Form submits to `/api/upload` API route
3. API route converts file to buffer
4. AWS SDK uploads file to LocalStack S3
5. User redirected to home page showing all files

### File Listing Flow

1. Home page fetches from `/api/files` API route
2. API route uses AWS SDK to list S3 objects
3. Files displayed with metadata (name, size, date)

## Testing with AWS CLI

List buckets:
```bash
aws --endpoint-url=http://localhost:4566 s3 ls
```

List files in bucket:
```bash
aws --endpoint-url=http://localhost:4566 s3 ls s3://demo-uploads/
```

Upload file manually:
```bash
aws --endpoint-url=http://localhost:4566 s3 cp test.txt s3://demo-uploads/
```

## Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run localstack:start` - Start LocalStack
- `npm run localstack:stop` - Stop LocalStack
- `npm run localstack:setup` - Create S3 bucket

## Troubleshooting

### Port 4566 Already in Use

```bash
docker-compose down
# Or find and kill the process using port 4566
```

### LocalStack Not Starting

- Check Docker Desktop is running
- Try `docker-compose logs` to see error messages
- Restart Docker Desktop

### Files Not Appearing

- Verify LocalStack is running: `curl http://localhost:4566/health`
- Check bucket exists: `aws --endpoint-url=http://localhost:4566 s3 ls`
- Restart Next.js dev server after environment variable changes

### Upload Fails

- Make sure `.env.local` file exists and has correct values
- Verify bucket was created: `npm run localstack:setup`
- Check LocalStack logs: `docker-compose logs localstack`

## Switching to Real AWS

To use real AWS S3 instead of LocalStack:

1. Remove `AWS_ENDPOINT_URL` from `.env.local`
2. Set real AWS credentials:
   ```bash
   AWS_ACCESS_KEY_ID=your_real_key
   AWS_SECRET_ACCESS_KEY=your_real_secret
   ```
3. Create real S3 bucket in AWS Console
4. Update `S3_BUCKET_NAME` to your real bucket name
5. Deploy to Vercel or other hosting

The code works with both LocalStack and real AWS!

## Learning Objectives

By completing this demo, you'll understand:

- ✅ How to run AWS services locally with LocalStack
- ✅ How to configure AWS SDK for LocalStack
- ✅ How to upload files to S3 from Next.js
- ✅ How to list S3 objects
- ✅ How to handle file uploads in API routes
- ✅ How to switch between local and production AWS

## Next Steps

Try adding these features:

- Delete file functionality
- Download file from S3
- File type validation
- File size limits
- Image preview for uploaded images
- Progress bar during upload
- Drag-and-drop upload
- Multiple file upload

## Resources

- [LocalStack Documentation](https://docs.localstack.cloud/)
- [AWS SDK v3 for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [S3 Client Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
