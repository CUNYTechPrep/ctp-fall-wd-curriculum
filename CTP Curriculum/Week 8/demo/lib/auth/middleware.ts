import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/cognito/auth'

/**
 * Middleware to require authentication
 * Returns userId if authenticated, or error response if not
 */
export async function requireAuth(
  request: NextRequest
): Promise<string | NextResponse> {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    )
  }
  
  try {
    const token = authHeader.substring(7)
    const result = await getUser(token)
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }
    
    return result.username!
  } catch (error) {
    console.error('Auth middleware error:', error)
    return NextResponse.json(
      { error: 'Unauthorized - Token validation failed' },
      { status: 401 }
    )
  }
}
