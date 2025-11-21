/**
 * REF: Feed Page - Public Todo Feed with Search & Filtering
 *
 * Displays public todos from all users with real-time search and tag filtering.
 *
 * ## Features
 * - **Real-time**: Instant updates when users share new todos
 * - **Search**: Client-side text search on title/description
 * - **Tag Filtering**: Filter by tags (single selection)
 * - **Responsive Grid**: 3-column layout on desktop, responsive
 * - **Public Sharing**: Only shows todos marked `isPublic: true`
 *
 * ## Search & Filter Strategy
 *
 * ### Why Client-Side Filtering?
 * - **Pros**: Instant results, no server latency, simpler
 * - **Cons**: Limited to data in memory, slower with large datasets
 * - **Best for**: Small-medium datasets (< 1000 items)
 *
 * ### When to Use Server-Side?
 * - Millions of items
 * - Complex queries (AND/OR combinations)
 * - Need pagination
 * - Bandwidth optimization
 * - Use: Algolia, Elasticsearch, or full-text search service
 *
 * ## Firestore Composite Index
 *
 * This query requires a composite index:
 * ```
 * Collection: todos
 * Fields:
 *   - isPublic (Ascending)
 *   - createdAt (Descending)
 * ```
 *
 * Firebase will prompt you with a link to create it automatically when needed.
 *
 * CLOSE
 */

import { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

interface Todo {
  id: string
  userId: string
  title: string
  description?: string
  completed: boolean
  isPublic: boolean
  tags?: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export default function Feed() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // REF: FETCH PUBLIC TODOS WITH REAL-TIME
/**
   * FETCH PUBLIC TODOS WITH REAL-TIME
   *
   * Subscribe to all public todos
   *
   * FIRESTORE QUERY:
   * - where('isPublic', '==', true): Only public todos
   * - orderBy('createdAt', 'desc'): Newest first
   * - limit(50): Performance optimization
   *
   * REAL-TIME:
   * - onSnapshot(): Live updates
   * - When anyone creates/updates/deletes public todo
   * - All clients see change instantly
   * - Community feed feels alive!
   *
   * FIRESTORE COMPOSITE INDEX:
   * Required for this query:
   * ```
   * Collection: todos
   * Fields: isPublic (Ascending), createdAt (Descending)
   * ```
   *
   * Firebase will prompt you to create this index
   * Click the link in the error message!
   */
// CLOSE
  useEffect(() => {
    const q = query(
      collection(db, 'todos'),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(50)
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const publicTodos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Todo))

        setTodos(publicTodos)
        setFilteredTodos(publicTodos)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching public todos:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // REF: CLIENT-SIDE SEARCH AND FILTER
/**
   * CLIENT-SIDE SEARCH AND FILTER
   *
   * Filter todos in the browser after fetching
   *
   * WHY CLIENT-SIDE?
   * - Instant results (no server delay)
   * - Good for moderate datasets (< 1000 items)
   * - Simpler implementation
   * - No backend needed
   *
   * WHEN TO USE SERVER-SIDE?
   * - Large datasets (> 1000 items)
   * - Complex queries
   * - Need to paginate results
   * - Want to reduce bandwidth
   *
   * FIRESTORE LIMITATIONS:
   * - No full-text search built-in
   * - Would need Algolia or similar for production
   * - OR use client-side for small datasets (this example)
   */
// CLOSE
  useEffect(() => {
    let results = todos

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        todo =>
          todo.title?.toLowerCase().includes(term) ||
          todo.description?.toLowerCase().includes(term)
      )
    }

    // Tag filter
    if (selectedTag) {
      results = results.filter(todo => todo.tags?.includes(selectedTag))
    }

    setFilteredTodos(results)
  }, [searchTerm, selectedTag, todos])

  // REF: GET ALL UNIQUE TAGS
/**
   * GET ALL UNIQUE TAGS
   *
   * Extract all tags for filter UI
   */
// CLOSE
  const allTags = Array.from(
    new Set(todos.flatMap(todo => todo.tags || []))
  ).sort()

  // REF: CLEAR FILTERS
/**
   * CLEAR FILTERS
   */
// CLOSE
  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedTag(null)
  }
  // CLOSE: CLEAR FILTERS

  /** REF: conditional-block
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading public feed...</div>
      </div>
    )
  }

  // REF: RENDER
/**
   * RENDER
   */
// CLOSE
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Public Feed</h1>
          <p className="text-gray-600">
            Discover what others are working on. {todos.length} public todos shared.
          </p>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search todos..."
          className="w-full px-4 py-3 mb-6 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        {/* Tag Filters */}
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
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(searchTerm || selectedTag) && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg flex justify-between items-center">
            <div>
              <span className="font-medium">Active filters:</span>
              {searchTerm && <span className="ml-2 text-sm">Search: "{searchTerm}"</span>}
              {selectedTag && <span className="ml-2 text-sm">Tag: #{selectedTag}</span>}
            </div>
            <button
              onClick={handleClearFilters}
              className="text-blue-600 hover:underline text-sm"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-gray-600">
          Showing {filteredTodos.length} of {todos.length} todos
        </div>

        {/* Todos Grid */}
        {filteredTodos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTodos.map(todo => (
              <div key={todo.id} className="p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-2">{todo.title}</h3>

                {todo.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {todo.description}
                  </p>
                )}

                {todo.tags && todo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {todo.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  {todo.completed ? '✓ Completed' : '○ In Progress'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No todos found</p>
            {(searchTerm || selectedTag) && (
              <button
                onClick={handleClearFilters}
                className="mt-4 text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
// CLOSE: Feed

// REF: FIRESTORE SECURITY RULES FOR PUBLIC FEED
/**
 * FIRESTORE SECURITY RULES FOR PUBLIC FEED
 *
 * In Firebase Console → Firestore → Rules:
 *
 * ```javascript
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /todos/{todoId} {
 *       // Allow reading if public OR user owns it
 *       allow read: if resource.data.isPublic == true ||
 *                      request.auth.uid == resource.data.userId;
 *
 *       // Only owner can create/update/delete
 *       allow create: if request.auth.uid == request.resource.data.userId;
 *       allow update, delete: if request.auth.uid == resource.data.userId;
 *     }
 *   }
 * }
 * ```
 *
 * This allows anyone authenticated to see public todos!
 */
// CLOSE

// REF: PAGINATION FOR LARGE DATASETS
/**
 * PAGINATION FOR LARGE DATASETS
 *
 * For production with many public todos:
 *
 * ```typescript
 * import { startAfter, limitToLast } from 'firebase/firestore'
 *
 * const [lastDoc, setLastDoc] = useState(null)
 *
 * // Initial query
 * const q = query(
 *   collection(db, 'todos'),
 *   where('isPublic', '==', true),
 *   orderBy('createdAt', 'desc'),
 *   limit(20)
 * )
 *
 * // Load more
 * const loadMore = async () => {
 *   const q = query(
 *     collection(db, 'todos'),
 *     where('isPublic', '==', true),
 *     orderBy('createdAt', 'desc'),
 *     startAfter(lastDoc),
 *     limit(20)
 *   )
 *
 *   const snapshot = await getDocs(q)
 *   setLastDoc(snapshot.docs[snapshot.docs.length - 1])
 * }
 * ```
 */
// CLOSE

// REF: PERFORMANCE OPTIMIZATION
/**
 * PERFORMANCE OPTIMIZATION
 *
 * For better performance:
 *
 * 1. **Limit results:**
 * Already doing with limit(50)
 *
 * 2. **Debounce search:**
 * ```typescript
 * import { useDebounce } from '../hooks/useDebounce'
 *
 * const debouncedSearch = useDebounce(searchTerm, 300)
 * ```
 *
 * 3. **Virtual scrolling:**
 * For thousands of items, use react-window
 *
 * 4. **Memoize filtered results:**
 * ```typescript
 * import { useMemo } from 'react'
 *
 * const filteredTodos = useMemo(() => {
 *   return todos.filter(...)
 * }, [todos, searchTerm, selectedTag])
 * ```
 */
// CLOSE
