/**
 * API Route: Serve Source Files
 *
 * Returns source file content for Monaco to load dynamically.
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const project = searchParams.get('project')
  const filePath = searchParams.get('file')

  if (!project || !filePath) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  try {
    // Get file from example projects
    const fullPath = path.join(
      process.cwd(),
      '..',
      'example-projects',
      project,
      filePath
    )

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const content = fs.readFileSync(fullPath, 'utf-8')

    // Return as text with proper content type
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 })
  }
}
