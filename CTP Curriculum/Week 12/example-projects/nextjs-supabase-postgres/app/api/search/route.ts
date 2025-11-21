/**
 * # Search API Route - PostgreSQL Full-Text Search
 *
 * REF: search-api-route
 * This API route demonstrates PostgreSQL's powerful full-text search capabilities.
 *
 * ## Key Concepts
 * - **PostgreSQL full-text search**
 * - **GIN indexes** for performance
 * - **Text search ranking**
 * - **Fuzzy matching**
 *
 * ## PostgreSQL Full-Text Search
 * - Built into PostgreSQL (no external service needed!)
 * - Supports **stemming** ("running" matches "run")
 * - **Relevance ranking**
 * - Multiple languages
 * - MUCH faster than `LIKE` queries
 *
 * ## Why Use This vs Client-Side Filtering?
 *
 * | Feature | Server-Side (PostgreSQL) | Client-Side (JavaScript) |
 * |---------|--------------------------|--------------------------|
 * | **Dataset Size** | Millions of records | Thousands max |
 * | **Performance** | Instant with indexes | Slow with large data |
 * | **Network** | Only results sent | All data sent |
 * | **Features** | Stemming, ranking, fuzzy | Basic string matching |
 *
 * CLOSE: search-api-route
 */

// REF: Import statement
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
// CLOSE: Import statement

/**
 * ## GET - Search Todos
 *
 * REF: get-search-handler
 *
 * ### Query Parameters
 * - `q`: Search query string
 * - `limit`: Max results (default `20`)
 * - `publicOnly`: Only search public todos
 *
 * ### Example Usage
 * ```
 * /api/search?q=groceries&limit=10&publicOnly=true
 * ```
 *
 * ### Full-Text Search Query
 * Uses PostgreSQL's `to_tsvector` and `plainto_tsquery`
 * Much more powerful than `LIKE '%term%'`
 *
 * CLOSE: get-search-handler
 */

// REF: Async function: export
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
// CLOSE: Async function: export

    /**
     * ### AUTHENTICATION (optional for public search)
     *
     * REF: auth-check
     * CLOSE: auth-check
     */
    const {
      data: { user },
    } = await supabase.auth.getUser()

    /**
     * ### PARSE QUERY PARAMETERS
     *
     * REF: parse-params
     * `URLSearchParams` from Next.js request
     * CLOSE: parse-params
     */
// REF: Constant: searchParams
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get('q') || ''
    const limitParam = searchParams.get('limit') || '20'
    const publicOnly = searchParams.get('publicOnly') === 'true'
// CLOSE: Constant: searchParams

// REF: Control flow
    if (!searchTerm.trim()) {
      return NextResponse.json(
        { error: 'Search query required' },
        { status: 400 }
      )
    }
// CLOSE: Control flow

// REF: Constant: limit
    const limit = Math.min(parseInt(limitParam), 100) // Max 100 results
// CLOSE: Constant: limit

    /**
     * ### FULL-TEXT SEARCH QUERY
     *
     * REF: fts-query
     * Uses `.textSearch()` method from Supabase
     *
     * #### How It Works
     * 1. `to_tsvector('english', text)`: Converts text to searchable format
     * 2. `plainto_tsquery('english', query)`: Converts search to query
     * 3. `@@` operator: Matches vector against query
     *
     * #### Stemming
     * - "running" finds "run", "runs", "ran"
     * - "better" finds "good", "best"
     * - Language-specific rules
     *
     * #### Required Index
     * ```sql
     * CREATE INDEX idx_todos_fts
     * ON todos
     * USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')))
     * WHERE is_public = true;
     * ```
     *
     * CLOSE: fts-query
     */
    let query = supabase
      .from('todos')
      .select('*')
      .textSearch('fts', searchTerm, {
        type: 'websearch',
        config: 'english',
      })
      .limit(limit)

    /**
     * ### FILTER BY PUBLIC/PRIVATE
     *
     * REF: filter-public
     * If `publicOnly` or user not authenticated, only search public
     * CLOSE: filter-public
     */
// REF: Control flow
    if (publicOnly || !user) {
      query = query.eq('is_public', true)
    } else {
// CLOSE: Control flow
      // Search user's private todos AND public todos
      query = query.or(`user_id.eq.${user.id},is_public.eq.true`)
    }

// REF: Constant declaration
    const { data: todos, error } = await query
// CLOSE: Constant declaration

// REF: Control flow
    if (error) {
      console.error('Search error:', error)
      return NextResponse.json(
        { error: 'Search failed' },
        { status: 500 }
      )
    }
// CLOSE: Control flow

    /**
     * ### RETURN RESULTS
     *
     * REF: return-results
     * Could add **ranking score**, **highlighting**, etc.
     * CLOSE: return-results
     */
// REF: JSX return
    return NextResponse.json({
      results: todos,
      count: todos?.length || 0,
      query: searchTerm,
    })
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
// CLOSE: JSX return

/**
 * ## ADVANCED SEARCH FEATURES
 *
 * REF: advanced-features
 *
 * ### Add Search Rankings
 *
 * ```typescript
 * const { data } = await supabase
 *   .from('todos')
 *   .select(`
 *     *,
 *     rank: ts_rank(
 *       to_tsvector('english', title || ' ' || COALESCE(description, '')),
 *       plainto_tsquery('english', '${searchTerm}')
 *     )
 *   `)
 *   .textSearch('fts', searchTerm)
 *   .order('rank', { ascending: false })
 * ```
 *
 * Now results are sorted by **relevance**!
 *
 * CLOSE: advanced-features
 */

/**
 * ## HIGHLIGHTING SEARCH MATCHES
 *
 * REF: highlighting
 *
 * Highlight matched terms in results:
 *
 * ```typescript
 * const { data } = await supabase
 *   .from('todos')
 *   .select(`
 *     *,
 *     headline: ts_headline(
 *       'english',
 *       title || ' ' || COALESCE(description, ''),
 *       plainto_tsquery('english', '${searchTerm}')
 *     )
 *   `)
 *   .textSearch('fts', searchTerm)
 * ```
 *
 * Returns text with `<b>matched terms</b>` highlighted!
 *
 * CLOSE: highlighting
 */

/**
 * ## MULTI-LANGUAGE SEARCH
 *
 * REF: multi-language
 *
 * Support multiple languages:
 *
 * ```typescript
 * const language = request.headers.get('Accept-Language')?.startsWith('es')
 *   ? 'spanish'
 *   : 'english'
 *
 * const { data } = await supabase
 *   .from('todos')
 *   .select('*')
 *   .textSearch('fts', searchTerm, {
 *     config: language
 *   })
 * ```
 *
 * ### Supported Languages
 * - `english`, `spanish`, `french`, `german`, `italian`
 * - `portuguese`, `russian`, `chinese`, `japanese`
 * - And many more!
 *
 * CLOSE: multi-language
 */

/**
 * ## FUZZY SEARCH
 *
 * REF: fuzzy-search
 *
 * Match similar words:
 *
 * ```typescript
 * // Using PostgreSQL similarity
 * const { data } = await supabase
 *   .rpc('fuzzy_search_todos', {
 *     search_term: searchTerm,
 *     similarity_threshold: 0.3
 *   })
 * ```
 *
 * ### Create Function
 * ```sql
 * CREATE EXTENSION IF NOT EXISTS pg_trgm;
 *
 * CREATE FUNCTION fuzzy_search_todos(
 *   search_term TEXT,
 *   similarity_threshold FLOAT DEFAULT 0.3
 * )
 * RETURNS SETOF todos AS $$
 *   SELECT *
 *   FROM todos
 *   WHERE similarity(title, search_term) > similarity_threshold
 *   ORDER BY similarity(title, search_term) DESC;
 * $$ LANGUAGE sql;
 * ```
 *
 * Finds **typos** and **similar words**!
 *
 * CLOSE: fuzzy-search
 */

/**
 * ## SEARCH SUGGESTIONS
 *
 * REF: search-suggestions
 *
 * Autocomplete as user types:
 *
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   const prefix = searchParams.get('q') || ''
 *
 *   // Get matching titles
 *   const { data } = await supabase
 *     .from('todos')
 *     .select('title')
 *     .ilike('title', `${prefix}%`)
 *     .limit(5)
 *
 *   const suggestions = data?.map(t => t.title) || []
 *
 *   return NextResponse.json({ suggestions })
 * }
 * ```
 *
 * Show dropdown of suggestions as user types!
 *
 * CLOSE: search-suggestions
 */

/**
 * ## PERFORMANCE OPTIMIZATION
 *
 * REF: performance
 *
 * Create proper index:
 * ```sql
 * CREATE INDEX idx_todos_fts
 * ON todos
 * USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
 * ```
 *
 * | Without Index | With GIN Index |
 * |---------------|----------------|
 * | Full table scan (slow) | Instant results |
 * | Degrades with size | Scales to millions |
 *
 * CLOSE: performance
 */

/**
 * ## USAGE FROM CLIENT
 *
 * REF: client-usage
 *
 * ```typescript
 * async function searchTodos(query: string) {
 *   const response = await fetch(
 *     `/api/search?q=${encodeURIComponent(query)}&publicOnly=true`
 *   )
 *
 *   const data = await response.json()
 *
 *   if (!response.ok) {
 *     throw new Error(data.error)
 *   }
 *
 *   return data.results
 * }
 * ```
 *
 * CLOSE: client-usage
 */

/**
 * ## CACHING SEARCH RESULTS
 *
 * REF: caching
 *
 * Add caching for popular searches:
 *
 * ```typescript
 * export const revalidate = 60 // Cache for 60 seconds
 *
 * // Or use external cache (Redis)
 * import { redis } from '@/lib/redis'
 *
 * const cached = await redis.get(`search:${searchTerm}`)
 * if (cached) return NextResponse.json(JSON.parse(cached))
 *
 * // Perform search
 * const results = await supabase.from('todos').textSearch(...)
 *
 * await redis.setex(`search:${searchTerm}`, 300, JSON.stringify(results))
 * ```
 *
 * CLOSE: caching
 */
