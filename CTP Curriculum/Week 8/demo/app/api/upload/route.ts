import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { uploadToS3 } from '@/lib/s3/client'
import { UserSetting } from '@/lib/db/entities'

/**
 * POST /api/upload - Upload profile photo
 */
export async function POST(request: NextRequest) {
  const userIdOrError = await requireAuth(request)
  
  if (userIdOrError instanceof NextResponse) {
    return userIdOrError
  }
  
  const userId = userIdOrError
  
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }
    
    // Upload to S3
    const url = await uploadToS3(file, userId)
    
    // Save URL to DynamoDB
    await UserSetting.put({
      userId,
      settingKey: 'profilePhoto',
      value: url
    })
    
    return NextResponse.json({
      success: true,
      url
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
