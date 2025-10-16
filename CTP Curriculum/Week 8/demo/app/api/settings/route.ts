import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/middleware'
import { UserSetting } from '@/lib/dynamodb/entities'

/**
 * GET /api/settings - Get all user settings
 */
export async function GET(request: NextRequest) {
  const userIdOrError = await requireAuth(request)
  
  if (userIdOrError instanceof NextResponse) {
    return userIdOrError
  }
  
  const userId = userIdOrError
  
  try {
    // Query all settings for the user
    const { Items } = await UserSetting.query(userId)
    
    // Convert array of settings to object
    const settings = (Items || []).reduce((acc: any, item: any) => {
      acc[item.settingKey] = item.value
      return acc
    }, {})
    
    // Return with defaults if not set
    return NextResponse.json({
      userId,
      settings: {
        theme: settings.theme || 'light',
        fontSize: settings.fontSize || 'medium',
        highContrast: settings.highContrast || false,
        reducedMotion: settings.reducedMotion || false,
        profilePhoto: settings.profilePhoto || null
      }
    })
  } catch (error: any) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { error: 'Failed to get settings' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/settings - Update user settings
 */
export async function POST(request: NextRequest) {
  const userIdOrError = await requireAuth(request)
  
  if (userIdOrError instanceof NextResponse) {
    return userIdOrError
  }
  
  const userId = userIdOrError
  
  try {
    const body = await request.json()
    
    // Update each setting
    const updates = Object.entries(body).map(([key, value]) => 
      UserSetting.put({
        userId,
        settingKey: key,
        value
      })
    )
    
    await Promise.all(updates)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
