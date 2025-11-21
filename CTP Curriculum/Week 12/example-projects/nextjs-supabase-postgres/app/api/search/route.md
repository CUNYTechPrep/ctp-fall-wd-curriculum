/**
 * REF: search-api-header
 *
 * # Search API Route - PostgreSQL Full-Text Search
 *
 * Server-side API endpoint for PostgreSQL full-text search on todos.
 *
 * ## Features
 *
 * - **Full-text search** - PostgreSQL's powerful search capabilities
 * - **GIN indexes** - Fast search performance on large datasets
 * - **Stemming** - Matches related word forms ("running" finds "run", "runs")
 * - **Public/private filtering** - Search public todos or user's private todos
 *
 * ## Full-Text Search vs LIKE Queries
 *
 * | Aspect | Full-Text Search | LIKE Query |
 * |--------|------------------|-----------|
 * | Performance | Fast (with GIN index) | Slow (full table scan) |
 * | Stemming | Supported ("running" finds "run") | Not supported |
 * | Relevance | Ranked by relevance | No ranking |
 * | Scale | Efficient with millions of records | Degrades with size |
 * | Complexity | Setup index once | Simple but limited |
 *
 */
// CLOSE: search-api-header

/**
 * REF: search-get-handler
 *
 * ## GET - Search Todos
 *
 * Search todos using PostgreSQL full-text search.
 *
 * ### Request
 *
 * ```
 * GET /api/search?q=groceries&limit=10&publicOnly=true
 * ```
 *
 * ### Query Parameters
 *
 * | Parameter | Type | Default | Description |
 * |-----------|------|---------|-------------|
 * | `q` | string | Required | Search query term |
 * | `limit` | number | 20 | Maximum results (max 100) |
 * | `publicOnly` | boolean | false | Only search public todos |
 *
 * ### Response Success (200)
 *
 * ```json
 * {
 *   "results": [
 *     {
 *       "id": "123",
 *       "title": "Buy groceries",
 *       "description": "Milk, eggs, bread",
 *       "completed": false,
 *       "is_public": true,
 *       "user_id": "user-456",
 *       "created_at": "2024-01-15T10:30:00Z"
 *     }
 *   ],
 *   "count": 1,
 *   "query": "groceries"
 * }
 * ```
 *
 * ### Response Errors
 *
 * | Status | Error | Meaning |
 * |--------|-------|---------|
 * | 400 | "Search query required" | Missing or empty `q` parameter |
 * | 500 | "Search failed" | Database query error |
 * | 500 | "Internal server error" | Unexpected server error |
 *
 * ### Flow
 *
 * 1. Create server-side Supabase client
 * 2. Get authenticated user (optional for public search)
 * 3. Parse query parameters (q, limit, publicOnly)
 * 4. Validate search term is not empty
 * 5. Build full-text search query using `textSearch()`
 * 6. Filter by public/private based on authentication
 * 7. Return results or error
 *
 * ### Authentication
 *
 * - Optional: Works with or without user session
 * - If user authenticated: Can search their private todos
 * - If not authenticated: Only searches public todos
 * - RLS (Row Level Security) enforced at database level
 *
 */
// CLOSE: search-get-handler

/**
 * REF: search-fts-details
 *
 * ## Full-Text Search Details
 *
 * ### How PostgreSQL Full-Text Search Works
 *
 * 1. **Text Vector** - `to_tsvector()` converts text to searchable format
 *    - "The quick brown fox" → `'brown':3 'fox':4 'quick':2`
 *    - Language-specific stemming applied
 *
 * 2. **Search Query** - `plainto_tsquery()` converts search term
 *    - "running" → `'run'` (stemmed)
 *    - Matches similar words
 *
 * 3. **Matching** - `@@` operator matches vector against query
 *    - Fast lookup with GIN index
 *
 * ### Supported Languages
 *
 * - English, Spanish, French, German, Italian
 * - Portuguese, Russian, Chinese, Japanese
 * - And many more (20+ languages)
 *
 * ### Creating the Index
 *
 * For optimal performance, create a GIN index:
 *
 * ```sql
 * CREATE INDEX idx_todos_fts
 * ON todos
 * USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')))
 * WHERE is_public = true;
 * ```
 *
 * Without index: Full table scan (slow on large datasets)
 * With GIN index: Instant results even with millions of rows
 *
 */
// CLOSE: search-fts-details

/**
 * REF: search-examples
 *
 * ## Usage Examples
 *
 * ### Basic Search
 *
 * ```typescript
 * const response = await fetch('/api/search?q=groceries')
 * const { results } = await response.json()
 * console.log(`Found ${results.length} todos`)
 * ```
 *
 * ### Search with Limit
 *
 * ```typescript
 * const response = await fetch('/api/search?q=work&limit=5')
 * const { results, count } = await response.json()
 * ```
 *
 * ### Public Search Only
 *
 * ```typescript
 * const response = await fetch('/api/search?q=tips&publicOnly=true')
 * const { results } = await response.json()
 * // Returns only public todos, ignoring auth status
 * ```
 *
 * ### Encoded Special Characters
 *
 * ```typescript
 * const query = "tips & tricks"
 * const url = `/api/search?q=${encodeURIComponent(query)}`
 * const response = await fetch(url)
 * ```
 *
 */
// CLOSE: search-examples

/**
 * REF: search-advanced
 *
 * ## Advanced Search Features
 *
 * ### Add Search Rankings
 *
 * Rank results by relevance:
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
 * ### Highlight Matched Terms
 *
 * Show user what matched:
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
 * ### Multi-Language Search
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
 * ### Fuzzy Search (for Typos)
 *
 * Match similar words:
 *
 * ```typescript
 * const { data } = await supabase
 *   .rpc('fuzzy_search_todos', {
 *     search_term: searchTerm,
 *     similarity_threshold: 0.3
 *   })
 * ```
 *
 * Create the function:
 *
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
 * ### Search Suggestions/Autocomplete
 *
 * Show matching titles as user types:
 *
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   const prefix = searchParams.get('q') || ''
 *
 *   const { data } = await supabase
 *     .from('todos')
 *     .select('title')
 *     .ilike('title', `${prefix}%`)
 *     .limit(5)
 *
 *   return NextResponse.json({
 *     suggestions: data?.map(t => t.title) || []
 *   })
 * }
 * ```
 *
 */
// CLOSE: search-advanced

/**
 * REF: search-performance
 *
 * ## Performance Optimization
 *
 * ### Caching Search Results
 *
 * Cache popular searches:
 *
 * ```typescript
 * export const revalidate = 60 // Cache for 60 seconds
 *
 * // Or use Redis for custom caching
 * import { redis } from '@/lib/redis'
 *
 * const cached = await redis.get(`search:${searchTerm}`)
 * if (cached) return NextResponse.json(JSON.parse(cached))
 *
 * // Perform search...
 * const results = await supabase.from('todos').textSearch(...)
 *
 * await redis.setex(`search:${searchTerm}`, 300, JSON.stringify(results))
 * ```
 *
 * ### Pagination for Large Results
 *
 * Limit results returned:
 *
 * ```typescript
 * const limit = Math.min(parseInt(limitParam), 100) // Max 100
 * const offset = Math.min(parseInt(offsetParam) || 0, 10000)
 *
 * const query = supabase
 *   .from('todos')
 *   .select('*')
 *   .textSearch('fts', searchTerm)
 *   .range(offset, offset + limit - 1)
 * ```
 *
 */
// CLOSE: search-performance

/**
 * REF: search-security
 *
 * ## Security Considerations
 *
 * ### SQL Injection Prevention
 *
 * Using Supabase client methods prevents SQL injection:
 * - `textSearch()` safely parameterizes the query
 * - Direct string interpolation: VULNERABLE (don't do this!)
 *
 * ```typescript
 * // UNSAFE - Don't do this!
 * const { data } = await supabase.rpc('raw_search', {
 *   query: `SELECT * FROM todos WHERE title LIKE '%${searchTerm}%'` // BAD!
 * })
 *
 * // SAFE - Use Supabase methods
 * const { data } = await supabase
 *   .from('todos')
 *   .select('*')
 *   .textSearch('fts', searchTerm) // Parameterized!
 * ```
 *
 * ### Public/Private Filtering
 *
 * Respects authentication status:
 * - Unauthenticated users see public todos only
 * - Authenticated users see their private todos + public todos
 * - RLS enforces at database level
 *
 */
// CLOSE: search-security
