#!/usr/bin/env node

/**
 * Generate Source File Bundles for Monaco
 *
 * Creates JSON bundles of all source files for each project.
 * Monaco loads these to enable go-to-definition across files.
 *
 * Output: public/sources/{project}.json
 */

const fs = require('fs')
const path = require('path')

const projects = [
  'nextjs-firebase',
  'nextjs-supabase-postgres',
  'nextjs-supabase-drizzle',
  'react-vite-firebase',
  'react-vite-supabase',
]

const outputDir = path.join(__dirname, '..', 'public', 'sources')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

console.log('📦 Bundling source files for Monaco...\n')

projects.forEach(projectName => {
  console.log(`[${projectName}]`)

  const projectPath = path.join(__dirname, '..', '..', 'example-projects', projectName)

  if (!fs.existsSync(projectPath)) {
    console.log('  ⚠️  Not found\n')
    return
  }

  const sourceFiles = []

  // Find all TypeScript files
  function findFiles(dir, basePath = '') {
    const items = fs.readdirSync(dir)

    items.forEach(item => {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        // Skip certain directories
        if (!item.match(/(node_modules|\.next|dist|build|drizzle|coverage)/)) {
          findFiles(fullPath, basePath ? `${basePath}/${item}` : item)
        }
      } else if (item.match(/\.(ts|tsx|md|json|js)$/)) {
        const relativePath = basePath ? `${basePath}/${item}` : item
        const content = fs.readFileSync(fullPath, 'utf-8')

        // Determine language for Monaco
        let language = 'typescript'
        if (item.endsWith('.md')) language = 'markdown'
        else if (item.endsWith('.json')) language = 'json'
        else if (item.endsWith('.js')) language = 'javascript'

        sourceFiles.push({
          path: relativePath,
          content: content,
          language: language
        })
      }
    })
  }

  findFiles(projectPath)

  // Create bundle
  const bundle = {
    project: projectName,
    fileCount: sourceFiles.length,
    files: sourceFiles
  }

  // Write JSON bundle
  const outputPath = path.join(outputDir, `${projectName}.json`)
  fs.writeFileSync(outputPath, JSON.stringify(bundle, null, 2))

  console.log(`  ✅ ${sourceFiles.length} files`)
  console.log(`     ${(JSON.stringify(bundle).length / 1024).toFixed(1)} KB\n`)
})

console.log('✨ Source bundling complete!')
console.log(`📂 Output: ${outputDir}`)
