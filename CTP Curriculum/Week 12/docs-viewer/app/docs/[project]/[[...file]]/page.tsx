/**
 * Documentation Viewer - Dynamic File Route
 *
 * Displays source files with side-by-side documentation
 * Uses Monaco editor for syntax highlighting and navigation
 */

import { redirect } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import FileTree from '@/components/FileTree'
import SideBySideViewer from '@/components/SideBySideViewer'
import { parseSourceFile } from '@/lib/parseCode'

interface PageProps {
  params: Promise<{
    project: string
    file?: string[]
  }>
  searchParams: Promise<{
    line?: string
    lineEnd?: string
  }>
}

const PROJECTS = [
  'nextjs-firebase',
  'nextjs-supabase-postgres',
  'nextjs-supabase-drizzle',
  'react-vite-firebase',
  'react-vite-supabase',
]

// Get all files for a project
function getProjectFiles(projectName: string): string[] {
  const projectPath = path.join(process.cwd(), '..', 'example-projects', projectName)

  if (!fs.existsSync(projectPath)) {
    return []
  }

  const files: string[] = []

  function walk(dir: string, baseDir: string = dir) {
    const items = fs.readdirSync(dir)

    items.forEach(item => {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        // Skip certain directories
        if (!item.match(/(node_modules|\.next|dist|build|drizzle|coverage)/)) {
          walk(fullPath, baseDir)
        }
      } else if (item.match(/\.(ts|tsx|js|jsx|json|css|md|sql|rules)$/)) {
        const relativePath = path.relative(baseDir, fullPath)
        files.push(relativePath)
      }
    })
  }

  walk(projectPath)
  return files.sort()
}

// Read file content
function getFileContent(projectName: string, filePath: string): string | null {
  const fullPath = path.join(
    process.cwd(),
    '..',
    'example-projects',
    projectName,
    filePath
  )

  if (!fs.existsSync(fullPath)) {
    return null
  }

  return fs.readFileSync(fullPath, 'utf-8')
}

export default async function DocumentationPage({
  params,
  searchParams
}: PageProps) {
  const { project, file } = await params
  const searchParamsData = await searchParams

  // Validate project
  if (!PROJECTS.includes(project)) {
    redirect('/')
  }

  // Get all files for sidebar
  const allFiles = getProjectFiles(project)

  // Determine which file to show
  const currentFile = file ? file.join('/') : allFiles[0] || null

  if (!currentFile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">No files found in this project</div>
      </div>
    )
  }

  // Get file content
  const content = currentFile ? getFileContent(project, currentFile) : null

  if (!content) {
    redirect(`/docs/${project}`)
  }

  // Parse source file to extract comments and remove them from code
  const { sections, codeWithoutComments } = parseSourceFile(content)

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="hover:opacity-80">
              ← Projects
            </a>
            <div className="border-l border-white/30 pl-4">
              <h1 className="text-xl font-bold">{getProjectTitle(project)}</h1>
              <p className="text-sm opacity-75">{currentFile}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-700">Files</h2>
            <p className="text-xs text-gray-500 mt-1">{allFiles.length} files</p>
          </div>
          <FileTree
            files={allFiles}
            currentFile={currentFile}
            project={project}
          />
        </div>

        {/* Side-by-Side Viewer with Synchronized Scrolling */}
        <div className="flex-1">
          <SideBySideViewer
            sections={sections}
            codeWithoutComments={codeWithoutComments}
            filename={currentFile}
            language={currentFile.endsWith('.tsx') ? 'typescript' : 'typescript'}
            project={project}
          />
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getProjectTitle(projectId: string): string {
  const titles: Record<string, string> = {
    'nextjs-firebase': 'Next.js + Firebase',
    'nextjs-supabase-postgres': 'Next.js + Supabase',
    'nextjs-supabase-drizzle': 'Next.js + Drizzle',
    'react-vite-firebase': 'React + Vite + Firebase',
    'react-vite-supabase': 'React + Vite + Supabase',
  }
  return titles[projectId] || projectId
}


// Generate static paths for all projects and files
export function generateStaticParams() {
  const params: { project: string; file: string[] }[] = []

  PROJECTS.forEach(project => {
    const files = getProjectFiles(project)

    // Add each file (required with [[...file]] catch-all)
    files.forEach(file => {
      params.push({
        project,
        file: file.split('/'),
      })
    })

    // Add project root (empty file array)
    if (files.length > 0) {
      params.push({
        project,
        file: [],
      })
    }
  })

  return params
}

// Make this page dynamic to handle different line number queries
export const dynamic = 'force-static'
export const dynamicParams = false
