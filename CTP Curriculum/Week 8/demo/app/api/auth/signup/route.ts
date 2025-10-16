import { NextRequest, NextResponse } from 'next/server'
import { signUp } from '@/lib/cognito/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    const result = await signUp(email, password)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      userSub: result.userSub,
      message: result.message
    })
  } catch (error: any) {
    console.error('Signup API error:', error)
    return NextResponse.json(
      { error: 'Sign up failed' },
      { status: 500 }
    )
  }
}
