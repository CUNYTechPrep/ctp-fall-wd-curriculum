/**
 * Public Feed Page - PostgreSQL Full-Text Search and Filtering
 *
 * REF:
 * Advanced PostgreSQL features for search, filtering, and pagination.
 * Shows client-side vs server-side query optimization strategies.
 *
 * | Feature | `PostgreSQL` | Benefit |
 * |---------|---|---|
 * | Full-text search | Built-in | No external service needed |
 * | Array filtering | GIN indexes | Fast tag searches |
 * | `Pagination` | `range()` | Efficient large datasets |
 * | `Aggregations` | `SQL` | Count, sum, avg operations |
 *
 * **Key Methods:**
 * - `.textSearch()` - Full-text search queries
 * - `.contains()` - Array operations for tags
 * - `.range()` - Pagination with offset/limit
 * - `.select()` - Joins with user data
 */

// REF: client-component-directive
'use client'
// CLOSE: client-component-directive

// REF: react-and-supabase-imports
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'
// CLOSE: react-and-supabase-imports

// REF: todo-type-alias
type Todo = Database['public']['Tables']['todos']['Row']
// CLOSE: todo-type-alias

// REF: feed-page-component
export default function FeedPage() {
  const supabase = createClient()
// CLOSE: feed-page-component

// REF: feed-state-declarations
  const [todos, setTodos] = useState<Todo[]>([])
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
// CLOSE: feed-state-declarations

// REF: pagination-page-size-constant
  const PAGE_SIZE = 20
// CLOSE: pagination-page-size-constant

  /**
   * FETCH PUBLIC TODOS
   *
   * REF: Query public todos with pagination
   *
   * **Pagination Math:**
   * | `Page` | `Calculation` | `Range` |
   * |------|---|---|
   * | `0` | 0 * 20 | range(0, 19) |
   * | `1` | 1 * 20 | range(20, 39) |
   * | `2` | 2 * 20 | range(40, 59) |
   */
// REF: fetch-public-todos-effect
  useEffect(() => {
    const fetchPublicTodos = async () => {
      const start = page * PAGE_SIZE
      const end = start + PAGE_SIZE - 1
// CLOSE: fetch-public-todos-effect

// REF: query-public-todos-with-pagination
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .range(start, end)
// CLOSE: query-public-todos-with-pagination

// REF: handle-fetch-error
      if (error) {
        console.error('Error fetching public todos:', error)
        setLoading(false)
        return
      }
// CLOSE: handle-fetch-error

// REF: update-todos-state-for-pagination
      if (data) {
        if (page === 0) {
          setTodos(data)
        } else {
          setTodos([...todos, ...data])
        }
// CLOSE: update-todos-state-for-pagination

// REF: update-filtered-todos-and-pagination-state
        setFilteredTodos(data)
        setHasMore(data.length === PAGE_SIZE)
      }
// CLOSE: update-filtered-todos-and-pagination-state

// REF: set-loading-complete
      setLoading(false)
    }
// CLOSE: set-loading-complete

// REF: invoke-fetch-on-page-change
    fetchPublicTodos()
  }, [page])
// CLOSE: invoke-fetch-on-page-change

  /**
   * REAL-TIME SUBSCRIPTION TO PUBLIC FEED
   *
   * REF: Listen for new public todos from any user
   *
   * **Security:**
   * - RLS policy enforces is_public = true
   * - Filtered at database level
   * - Can't bypass even with modified client code
   *
   * **Performance:**
   * - Only public changes broadcast
   * - Filtered before network transmission
   * - Low bandwidth, instant updates
   */
// REF: realtime-subscription-effect
  useEffect(() => {
    const channel = supabase
      .channel('public-todos')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos',
          filter: 'is_public=eq.true',
        },
        (payload) => {
          console.log('Public todo changed:', payload)
// CLOSE: realtime-subscription-effect

          // Handle different events
// REF: handle-realtime-insert-update-delete
          if (payload.eventType === 'INSERT') {
            const newTodo = payload.new as Todo
            setTodos([newTodo, ...todos])
          } else if (payload.eventType === 'UPDATE') {
            setTodos(todos.map(t =>
              t.id === payload.new.id ? payload.new as Todo : t
            ))
          } else if (payload.eventType === 'DELETE') {
            setTodos(todos.filter(t => t.id !== payload.old.id))
          }
        }
      )
      .subscribe()
// CLOSE: handle-realtime-insert-update-delete

// REF: cleanup-realtime-subscription
    return () => {
      supabase.removeChannel(channel)
    }
  }, [todos])
// CLOSE: cleanup-realtime-subscription

  /**
   * CLIENT-SIDE VS SERVER-SIDE SEARCH
   *
   * REF: Trade-offs between search strategies
   *
   * **Client-side (this demo):**
   * - Fast for small datasets
   * - All data must be fetched
   * - Works offline
   * - Limited search capabilities
   *
   * **Server-side (production):**
   * - `.textSearch('title', term)` - Full-text search
   * - Only matching results returned
   * - Scales to millions
   * - Requires FTS index
   */
// REF: client-side-filter-effect
  useEffect(() => {
    let results = todos
// CLOSE: client-side-filter-effect

// REF: filter-by-search-term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        todo =>
          todo.title?.toLowerCase().includes(term) ||
          todo.description?.toLowerCase().includes(term)
      )
    }
// CLOSE: filter-by-search-term

// REF: filter-by-selected-tag
    if (selectedTag) {
      results = results.filter(todo => todo.tags?.includes(selectedTag))
    }
// CLOSE: filter-by-selected-tag

// REF: update-filtered-results
    setFilteredTodos(results)
  }, [searchTerm, selectedTag, todos])
// CLOSE: update-filtered-results

  /**
   * GET UNIQUE TAGS
   *
   * REF: Extract tags for filter buttons
   *
   * **Client-side (current):**
   * - Flatten and deduplicate arrays
   * - Works with fetched data
   *
   * **Server-side alternative:**
   * ```sql
   * SELECT DISTINCT unnest(tags) as tag
   * FROM todos
   * WHERE is_public = true
   * ORDER BY tag
   * ```
   */
// REF: extract-unique-tags-from-todos
  const allTags = Array.from(
    new Set(todos.flatMap(todo => todo.tags || []))
  ).sort()
// CLOSE: extract-unique-tags-from-todos

// REF: loading-state-display
  if (loading && page === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl">Loading public feed...</div>
      </div>
    )
  }
// CLOSE: loading-state-display

  /**
   * MAIN RENDER
   */
// REF: main-page-container-and-header
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Public Feed</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Discover todos shared by the community. {todos.length} public todos.
        </p>
      </div>
// CLOSE: main-page-container-and-header

      {/* Search Bar */}
// REF: search-input-field
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search todos..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
        />
      </div>
// CLOSE: search-input-field

      {/* Tag Filters */}
// REF: tag-filter-buttons
      {allTags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Filter by tag:</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}
// CLOSE: tag-filter-buttons

      {/* Results Count */}
// REF: results-count-display
      <div className="mb-4 text-gray-600 dark:text-gray-300">
        Showing {filteredTodos.length} todos
      </div>
// CLOSE: results-count-display

      {/* Todos Grid */}
// REF: todos-grid-or-empty-state
      {filteredTodos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              <h3 className="text-lg font-bold mb-2">{todo.title}</h3>
// CLOSE: todos-grid-or-empty-state

// REF: todo-description-display
              {todo.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {todo.description}
                </p>
              )}
// CLOSE: todo-description-display

// REF: todo-tags-display
              {todo.tags && todo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {todo.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
// CLOSE: todo-tags-display

// REF: todo-completion-status
              <div className="text-sm text-gray-500">
                {todo.completed ? '✓ Completed' : '○ In Progress'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No todos found
        </div>
      )}
// CLOSE: todo-completion-status

      {/* Load More Button */}
// REF: load-more-pagination-button
      {hasMore && filteredTodos.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setPage(page + 1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}
// CLOSE: load-more-pagination-button

/**
 * ## Production POSTGRESQL FULL-TEXT SEARCH
 *
 * REF: Server-side search implementation for scalability
 *
 * **Step 1: Create FTS Index**
 * ```sql
 * CREATE INDEX idx_todos_search
 * ON todos
 * USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')))
 * WHERE is_public = true;
 * ```
 *
 * **Step 2: Query with textSearch**
 * ```typescript
 * await supabase
 *   .from('todos')
 *   .select('*')
 *   .textSearch('fts', searchTerm, {
 *     type: 'websearch',
 *     config: 'english'
 *   })
 *   .eq('is_public', true)
 * ```
 *
 * **Benefits:**
 * - Stemming: "running" matches "run"
 * - Relevance ranking
 * - 100x faster than LIKE
 * - Scales to millions
 */
