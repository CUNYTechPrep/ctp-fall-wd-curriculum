import { S3Client, HeadBucketCommand, CreateBucketCommand, ErrorDetails } from '@aws-sdk/client-s3'

// Configure S3 client for LocalStack
export const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION || 'us-east-1',
  endpoint: process.env.AWS_ENDPOINT_URL,
  forcePathStyle: true, // Required for LocalStack compatibility
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
  }
})

export const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'demo-uploads'

export async function createBucketIfNotExists() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }))
  } catch (error: any) {
    if (error.name === 'NotFound') {
      await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }))
    } else {
      console.error('Error checking bucket existence:', error)
    }
  }
}
