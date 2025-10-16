import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/lib/cognito/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    const result = await signIn(email, password)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      success: true,
      accessToken: result.accessToken,
      idToken: result.idToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn
    })
  } catch (error: any) {
    console.error('Signin API error:', error)
    return NextResponse.json(
      { error: 'Sign in failed' },
      { status: 500 }
    )
  }
}
