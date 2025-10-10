import { NextResponse } from 'next/server'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { s3Client, BUCKET_NAME } from '@/lib/s3'

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME
    })

    const response = await s3Client.send(command)

    const files = (response.Contents || []).map(obj => ({
      name: obj.Key || '',
      size: obj.Size || 0,
      lastModified: obj.LastModified?.toISOString() || new Date().toISOString()
    }))

    // Sort by last modified (newest first)
    files.sort((a, b) =>
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    )

    return NextResponse.json({ files })
  } catch (error) {
    console.error('List files error:', error)
    return NextResponse.json(
      {
        error: 'Failed to list files. Make sure LocalStack is running and the bucket exists.',
        files: []
      },
      { status: 500 }
    )
  }
}
