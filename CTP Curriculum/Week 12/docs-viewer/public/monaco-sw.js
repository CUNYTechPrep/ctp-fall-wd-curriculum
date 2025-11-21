/**
 * Service Worker for Monaco Type Resolution
 *
 * Intercepts Monaco's type requests and serves from our bundled sources.
 * This enables full IntelliSense without 404 errors.
 */

// Cache name
const CACHE_NAME = 'monaco-sources-v1'

// Store the source bundles in memory when loaded
let sourceBundles = {}

self.addEventListener('install', (event) => {
  console.log('Monaco Service Worker installed')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Monaco Service Worker activated')
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Log all fetch requests for debugging
  if (url.pathname.startsWith('/types/')) {
    console.log('SW fetch intercepted:', url.pathname)
  }

  // Intercept requests to /types/*.d.ts
  if (url.pathname.startsWith('/types/') && url.pathname.endsWith('.d.ts')) {
    console.log('  → Handling type request')
    event.respondWith(handleTypeRequest(url, event.request))
  }
  // Let all other requests pass through normally (default fetch behavior)
})

async function handleTypeRequest(url, request) {
  // Extract the path being requested
  const requestedPath = url.pathname.replace('/types/', '').replace('.d.ts', '')

  console.log('Intercepted type request:', requestedPath)

  // Try to find this file in our source bundles
  // The path might be like "app" or "contexts" which maps to actual files

  // Get the current project from the referrer or cache
  const project = await getCurrentProject()

  if (!project) {
    console.log('No project context, returning 404')
    return new Response('Not Found', { status: 404 })
  }

  // Load source bundle if not already loaded
  if (!sourceBundles[project]) {
    try {
      const bundleResponse = await fetch(`/sources/${project}.json`)
      if (bundleResponse.ok) {
        sourceBundles[project] = await bundleResponse.json()
      }
    } catch (err) {
      console.log('Failed to load source bundle:', err)
      return new Response('Not Found', { status: 404 })
    }
  }

  const bundle = sourceBundles[project]

  console.log(`  Searching for: "${requestedPath}"`)
  console.log(`  Bundle has ${bundle.files.length} files`)

  // Monaco might request "lib/db/schema" and we need to find "lib/db/schema.ts"
  // Try multiple strategies

  let file = null

  // Strategy 1: Direct match with .ts extension
  file = bundle.files.find(f => f.path === requestedPath + '.ts')
  if (file) console.log(`  ✓ Found: ${file.path} (exact .ts)`)

  // Strategy 2: Direct match with .tsx extension
  if (!file) {
    file = bundle.files.find(f => f.path === requestedPath + '.tsx')
    if (file) console.log(`  ✓ Found: ${file.path} (exact .tsx)`)
  }

  // Strategy 3: Path without extension matches
  if (!file) {
    file = bundle.files.find(f => {
      const pathWithoutExt = f.path.replace(/\.(tsx?|js)$/, '')
      return pathWithoutExt === requestedPath
    })
    if (file) console.log(`  ✓ Found: ${file.path} (path match)`)
  }

  // Strategy 4: Index file in directory
  if (!file) {
    file = bundle.files.find(f =>
      f.path === `${requestedPath}/index.ts` ||
      f.path === `${requestedPath}/index.tsx`
    )
    if (file) console.log(`  ✓ Found: ${file.path} (index file)`)
  }

  // Strategy 5: First file starting with path
  if (!file) {
    file = bundle.files.find(f => f.path.startsWith(requestedPath + '/'))
    if (file) console.log(`  ✓ Found: ${file.path} (prefix match)`)
  }

  if (!file) {
    console.log(`  ✗ No match found`)
    console.log(`  Available files:`, bundle.files.slice(0, 5).map(f => f.path))
  }

  if (file) {
    console.log(`  ✅ Serving ${file.path} for ${requestedPath}`)

    // Convert .ts/.tsx to .d.ts format (strip implementation, keep types)
    let content = file.content

    // Simple conversion: just serve the source as-is
    // Monaco's TypeScript service can work with .ts files even when requesting .d.ts
    // The key is the Content-Type header

    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/typescript; charset=utf-8',  // TypeScript content type
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'X-TypeScript-Types': file.path,  // Hint for Monaco
      }
    })
  }

  console.log('  → File not found in bundle')
  return new Response('Not Found', { status: 404 })
}

async function getCurrentProject() {
  // Try to get from clients
  const clients = await self.clients.matchAll()

  for (const client of clients) {
    const clientUrl = new URL(client.url)
    const match = clientUrl.pathname.match(/\/docs\/([^\/]+)/)
    if (match) {
      return match[1]
    }
  }

  return null
}
