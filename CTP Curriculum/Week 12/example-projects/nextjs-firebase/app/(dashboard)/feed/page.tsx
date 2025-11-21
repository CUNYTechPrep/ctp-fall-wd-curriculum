/**
 * REF: feed-page
 *
 * # Public Feed Page - Community Todos
 *
 * Browse and search public todos from all users.
 *
 * ## Key Concepts
 *
 * 1. **Real-time subscriptions** - Live updates from all users
 * 2. **Client-side search** - Filter without server requests
 * 3. **Tag filtering** - Find todos by category
 * 4. **Public data** - Firestore rules control access
 *
 * ## Community Feed
 *
 * Users can:
 * - Mark todos as public
 * - See everyone's public todos
 * - Search across all public content
 * - Filter by tags
 *
 * ## Performance
 *
 * - Limit to 20 items initially
 * - Client-side filtering (fast for < 1000 items)
 * - Firestore indexes for efficient queries
 */

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { subscribeToPublicFeed } from '@/lib/firebase/firestore'
import { Todo } from '@/types'

/**
 * REF: feed-component
 *
 * ## FeedPage Component
 *
 * Public feed with search and filtering.
 */
export default function FeedPage() {
  const { user } = useAuth()

  /**
   * REF: feed-state
   *
   * ## State Management
   *
   * Track todos and UI state for the feed.
   *
   * ### State Variables
   *
   * - `todos`: All public todos (from subscription)
   * - `filteredTodos`: After search/filter applied
   * - `searchTerm`: Search query
   * - `selectedTag`: Active tag filter
   * - `loading`: Initial load status
   */
  const [todos, setTodos] = useState<Todo[]>([])
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  // CLOSE: feed-state

  /**
   * REF: realtime-public-subscription
   *
   * ## Real-Time Subscription to Public Todos
   *
   * Subscribe to all public todos with limit of 20.
   * This demonstrates a community feed where users see each other's content.
   *
   * ### Security
   *
   * - Firestore rules ensure only public todos are accessible
   * - Users can't access private todos even if they try
   *
   * ### Cleanup
   *
   * - Unsubscribe on component unmount
   * - Prevents memory leaks
   */
  useEffect(() => {
    const unsubscribe = subscribeToPublicFeed((publicTodos) => {
      setTodos(publicTodos)
      setFilteredTodos(publicTodos)
      setLoading(false)
    }, 20)

    return () => unsubscribe()
  }, [])
  // CLOSE: realtime-public-subscription

  /**
   * REF: search-filter-effect
   *
   * ## Search and Filter Effect
   *
   * Re-filter todos whenever search term or selected tag changes.
   *
   * ### Search Logic
   *
   * - Case-insensitive search across title and description
   * - Uses includes() for substring matching
   * - Could be enhanced with fuzzy search or full-text search
   *
   * ### Filter Logic
   *
   * - If tag selected, only show todos with that tag
   * - Uses array.includes() to check if tag exists in todo's tags
   *
   * ### Optimization
   *
   * - In production, consider debouncing search to reduce re-renders
   * - For large datasets, move search to backend with indexed queries
   */
  useEffect(() => {
    let results = todos

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        todo =>
          todo.title?.toLowerCase().includes(term) ||
          todo.description?.toLowerCase().includes(term)
      )
    }

    // Apply tag filter
    if (selectedTag) {
      results = results.filter(todo => todo.tags?.includes(selectedTag))
    }

    setFilteredTodos(results)
  }, [searchTerm, selectedTag, todos])
  // CLOSE: search-filter-effect

  /**
   * REF: tag-extraction
   *
   * ## Get All Unique Tags
   *
   * Extract all tags from all todos for the filter dropdown.
   *
   * ### Algorithm
   *
   * 1. Flatten all todo tags into single array
   * 2. Remove duplicates with Set
   * 3. Sort alphabetically
   *
   * ### Array Methods Used
   *
   * - flatMap(): Flattens nested arrays
   * - Set: Removes duplicates
   * - Array.from(): Converts Set back to array
   * - sort(): Alphabetical ordering
   */
  const allTags = Array.from(
    new Set(
      todos.flatMap(todo => todo.tags || [])
    )
  ).sort()
  // CLOSE: tag-extraction

  /**
   * REF: clear-filters-handler
   *
   * ## Clear Filters Handler
   *
   * Reset search and tag filters to show all todos.
   */
  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedTag(null)
  }
  // CLOSE: clear-filters-handler

  /**
   * REF: loading-state
   *
   * ## Loading State
   *
   * Display loading indicator while initial data fetches.
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl">Loading public feed...</div>
      </div>
    )
  }
  // CLOSE: loading-state

  /**
   * REF: main-render
   *
   * ## Main Render
   *
   * LAYOUT:
   * 1. Page header with description
   * 2. Search bar
   * 3. Tag filter chips
   * 4. Active filters display
   * 5. Todo cards grid
   *
   * UX FEATURES:
   * - Clear visual feedback for active filters
   * - Easy-to-click tag chips
   * - Responsive grid layout
   * - Empty state when no results
   */
  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Public Feed</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Discover what others are working on. {todos.length} public todos shared by the community.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search todos by title or description..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
        />
      </div>

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
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(searchTerm || selectedTag) && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Active filters:</span>
              {searchTerm && (
                <span className="ml-2 text-sm">
                  Search: "{searchTerm}"
                </span>
              )}
              {selectedTag && (
                <span className="ml-2 text-sm">
                  Tag: #{selectedTag}
                </span>
              )}
            </div>
            <button
              onClick={handleClearFilters}
              className="text-blue-600 dark:text-blue-300 hover:underline text-sm"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 text-gray-600 dark:text-gray-300">
        Showing {filteredTodos.length} of {todos.length} todos
      </div>

      {/* Todos Grid */}
      {filteredTodos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              {/* Todo Title */}
              <h3 className="text-lg font-bold mb-2">{todo.title}</h3>

              {/* Todo Description */}
              {todo.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {todo.description}
                </p>
              )}

              {/* Tags */}
              {todo.tags && todo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {todo.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Completion Status */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span
                  className={`text-sm ${
                    todo.completed
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500'
                  }`}
                >
                  {todo.completed ? '✓ Completed' : '○ In Progress'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No todos found matching your filters.
          </p>
          {(searchTerm || selectedTag) && (
            <button
              onClick={handleClearFilters}
              className="mt-4 text-blue-600 hover:underline"
            >
              Clear filters to see all public todos
            </button>
          )}
        </div>
      )}
    </div>
  )
  // CLOSE: main-render
}
// CLOSE: feed-component
// CLOSE: feed-page
