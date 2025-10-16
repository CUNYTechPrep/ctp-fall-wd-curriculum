import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'

export async function GET(request: NextRequest) {
  const userIdOrError = await requireAuth(request)
  
  if (userIdOrError instanceof NextResponse) {
    return userIdOrError
  }
  
  const userId = userIdOrError
  
  return NextResponse.json({
    success: true,
    userId
  })
}
