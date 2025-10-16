import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
  },
  forcePathStyle: true // Required for LocalStack
})

/**
 * Upload a file to S3
 */
export async function uploadToS3(
  file: File,
  userId: string
): Promise<string> {
  const fileName = `${userId}/${Date.now()}-${file.name}`
  const bucketName = process.env.S3_BUCKET_NAME || 'profile-photos'
  
  const buffer = Buffer.from(await file.arrayBuffer())
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
    ACL: 'public-read'
  })
  
  await s3Client.send(command)
  
  // Return the public URL
  const s3Url = process.env.NEXT_PUBLIC_S3_URL || 'http://localhost:4566'
  return `${s3Url}/${bucketName}/${fileName}`
}
