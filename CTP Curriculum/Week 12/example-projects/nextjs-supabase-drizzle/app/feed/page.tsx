/**
 * REF: file-header
 *
 * # Public Feed Page - Type-Safe Public Todos with Drizzle ORM
 *
 * This page displays public todos using Drizzle ORM's type-safe queries with client-side
 * filtering capabilities.
 *
 * ## Architecture Highlights
 * - Drizzle ORM for type-safe database queries
 * - Client-side filtering for search and tags
 * - Type inference from schema definitions
 * - Hybrid Supabase + Drizzle approach (optional real-time)
 *
 * ## Type Safety Benefits
 * - `InferSelectModel<typeof todos>` provides exact type from schema
 * - TypeScript autocomplete for all todo properties
 * - Compile-time validation of field access
 * - No manual type definitions needed
 *
 * ## Drizzle Query Pattern
 * ```typescript
 * const results = await db
 *   .select()
 *   .from(todos)
 *   .where(eq(todos.isPublic, true))
 * // results is fully typed as Todo[]
 * ```
 */
// CLOSE: file-header

/**
 * REF: use-client-directive
 *
 * # Client Component Directive
 *
 * ## Why 'use client'?
 * This page requires client-side interactivity for:
 * - State management (filtering, search)
 * - User interactions (tag filtering)
 * - Dynamic UI updates
 * - Real-time subscriptions (optional)
 */
'use client'
// CLOSE: use-client-directive

/**
 * REF: react-imports
 *
 * # React Hook Imports
 *
 * ## useState
 * Manages component state for:
 * - Public todos list
 * - Filtered todos list
 * - Search term
 * - Selected tag
 * - Loading state
 *
 * ## useEffect
 * Handles side effects for:
 * - Initial data fetch on mount
 * - Filter updates when dependencies change
 * - Optional real-time subscriptions
 */
import { useState, useEffect } from 'react'
// CLOSE: react-imports

/**
 * REF: drizzle-imports
 *
 * # Drizzle ORM Imports
 *
 * ## eq Operator
 * Used for WHERE clause equality comparisons in queries.
 *
 * ### Usage Example
 * ```typescript
 * .where(eq(todos.isPublic, true))
 * // Generates: WHERE is_public = true
 * ```
 *
 * ## Database Client (db)
 * Main Drizzle database connection for executing type-safe queries.
 *
 * ## Schema Definition (todos)
 * Table schema that provides structure and type information for queries.
 *
 * ## InferSelectModel
 * TypeScript utility that extracts the result type from a Drizzle table schema.
 */
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { todos } from '@/lib/db/schema'
import { InferSelectModel } from 'drizzle-orm'
// CLOSE: drizzle-imports

/**
 * REF: todo-type
 *
 * # Todo Type from Schema
 *
 * ## Type Inference
 * `InferSelectModel` automatically generates the TypeScript type from the todos schema.
 *
 * ### Generated Type Structure
 * ```typescript
 * {
 *   id: string
 *   userId: string
 *   title: string
 *   description: string | null
 *   completed: boolean
 *   isPublic: boolean
 *   tags: string[] | null
 *   createdAt: Date
 *   updatedAt: Date
 * }
 * ```
 *
 * ### Benefits
 * - Single source of truth (schema)
 * - Automatic updates when schema changes
 * - No manual type maintenance
 * - Perfect accuracy
 */
type Todo = InferSelectModel<typeof todos>
// CLOSE: todo-type

/**
 * REF: feed-page-component
 *
 * # FeedPage Component
 *
 * Main component for displaying and filtering public todos.
 *
 * ## Responsibilities
 * - Fetch public todos from database
 * - Provide search functionality
 * - Enable tag-based filtering
 * - Display filtered results
 * - Show loading states
 */
export default function FeedPage() {
  // CLOSE: feed-page-component

  /**
   * REF: component-state
   *
   * # Component State Management
   *
   * ## State Variables
   *
   * ### publicTodos (Todo[])
   * - Complete list of all public todos from database
   * - Source of truth for filtering operations
   * - Updated on initial fetch
   *
   * ### filteredTodos (Todo[])
   * - Subset of publicTodos after applying filters
   * - Updated when search or tag filters change
   * - Displayed in UI
   *
   * ### searchTerm (string)
   * - Current search query
   * - Filters by title and description
   * - Case-insensitive matching
   *
   * ### selectedTag (string | null)
   * - Currently active tag filter
   * - null means no tag filter applied
   * - Single tag selection at a time
   *
   * ### loading (boolean)
   * - Indicates data fetching state
   * - Prevents premature rendering
   * - Shows loading indicator
   */
  const [publicTodos, setPublicTodos] = useState<Todo[]>([])
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  // CLOSE: component-state

  /**
   * REF: fetch-public-todos-effect
   *
   * # Fetch Public Todos Effect
   *
   * ## Purpose
   * Load public todos from database on component mount.
   *
   * ## Drizzle Query Breakdown
   * ```typescript
   * const results = await db
   *   .select()              // SELECT *
   *   .from(todos)           // FROM todos
   *   .where(eq(todos.isPublic, true))  // WHERE is_public = true
   * ```
   *
   * ## Type Safety
   * - results is automatically typed as Todo[]
   * - No type assertions needed
   * - IntelliSense shows all todo properties
   *
   * ## Error Handling
   * - Try-catch for async errors
   * - Log errors for debugging
   * - Set loading false even on error
   *
   * ## Optional Real-Time Pattern
   * Can add Supabase real-time subscriptions to refetch when data changes:
   * ```typescript
   * const supabase = createClient()
   * const channel = supabase
   *   .channel('public-todos')
   *   .on('postgres_changes', {
   *     event: '*',
   *     schema: 'public',
   *     table: 'todos',
   *     filter: 'is_public=eq.true'
   *   }, () => {
   *     fetchPublicTodos() // Refetch with Drizzle
   *   })
   *   .subscribe()
   * return () => supabase.removeChannel(channel)
   * ```
   *
   * ## Dependencies
   * Empty array [] means run once on mount only.
   */
  useEffect(() => {
    const fetchPublicTodos = async () => {
      try {
        const results = await db
          .select()
          .from(todos)
          .where(eq(todos.isPublic, true))

        setPublicTodos(results)
        setFilteredTodos(results)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching public todos:', error)
        setLoading(false)
      }
    }

    fetchPublicTodos()
  }, [])
  // CLOSE: fetch-public-todos-effect

  /**
   * REF: filtering-effect
   *
   * # Client-Side Filtering Effect
   *
   * ## Purpose
   * Apply search and tag filters to public todos whenever filters change.
   *
   * ## Filter Logic Flow
   * 1. Start with all publicTodos
   * 2. Apply search term filter (if exists)
   * 3. Apply tag filter (if exists)
   * 4. Update filteredTodos state
   *
   * ## Search Filter
   * - Trim and lowercase search term
   * - Check title and description
   * - Case-insensitive matching
   * - Partial match supported
   *
   * ## Tag Filter
   * - Check if todo.tags array includes selectedTag
   * - Works with tags as string[]
   *
   * ## Type Safety
   * TypeScript knows:
   * - todo.title is string
   * - todo.description is string | null
   * - todo.tags is string[] | null
   *
   * ## Dependencies
   * Re-run when: searchTerm, selectedTag, or publicTodos changes
   */
  useEffect(() => {
    let results = publicTodos

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        todo =>
          todo.title?.toLowerCase().includes(term) ||
          todo.description?.toLowerCase().includes(term)
      )
    }

    if (selectedTag) {
      results = results.filter(todo => todo.tags?.includes(selectedTag))
    }

    setFilteredTodos(results)
  }, [searchTerm, selectedTag, publicTodos])
  // CLOSE: filtering-effect

  /**
   * REF: tag-extraction
   *
   * # Extract Unique Tags
   *
   * ## Purpose
   * Get all unique tags from public todos for filter UI.
   *
   * ## Process
   * 1. flatMap extracts all tags from all todos
   * 2. Set removes duplicates
   * 3. Array.from converts Set to array
   * 4. sort alphabetically orders tags
   *
   * ## Type Safety
   * - publicTodos is Todo[]
   * - todo.tags is string[] | null
   * - flatMap with || [] handles null values
   * - Result is string[]
   */
  const allTags = Array.from(
    new Set(publicTodos.flatMap(todo => todo.tags || []))
  ).sort()
  // CLOSE: tag-extraction

  /**
   * REF: clear-filters-handler
   *
   * # Clear All Filters Handler
   *
   * ## Purpose
   * Reset both search and tag filters to show all public todos.
   *
   * ## Actions
   * - Clear search term
   * - Clear selected tag
   * - Triggers filtering effect automatically
   */
  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedTag(null)
  }
  // CLOSE: clear-filters-handler

  /**
   * REF: loading-state-render
   *
   * # Loading State UI
   *
   * ## Purpose
   * Show loading indicator while fetching initial data.
   *
   * ## Display
   * - Centered container
   * - Min height ensures visibility
   * - Simple text message
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl">Loading public feed...</div>
      </div>
    )
  }
  // CLOSE: loading-state-render

  /**
   * REF: main-render
   *
   * # Main Feed Render
   *
   * ## Layout Structure
   * - Container with max width
   * - Page header with title and description
   * - Search input
   * - Tag filter buttons
   * - Active filters display
   * - Results count
   * - Todos grid
   */
  return (
    <div className="max-w-6xl mx-auto">
      {/* CLOSE: main-render */}

      {/**
       * REF: page-header
       *
       * # Page Header
       *
       * ## Elements
       * - Main title
       * - Description with todo count
       */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Public Feed</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Discover todos shared by the community. {publicTodos.length} public todos.
        </p>
      </div>
      {/* CLOSE: page-header */}

      {/**
       * REF: search-input
       *
       * # Search Input Field
       *
       * ## Features
       * - Full width text input
       * - Controlled component (value={searchTerm})
       * - Updates on every keystroke
       * - Placeholder text for UX
       * - Dark mode support
       * - Focus ring for accessibility
       */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search todos..."
        className="w-full px-4 py-3 mb-6 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
      />
      {/* CLOSE: search-input */}

      {/**
       * REF: tag-filters
       *
       * # Tag Filter Buttons
       *
       * ## Conditional Rendering
       * Only shows if tags exist in the dataset.
       *
       * ## Tag Button Behavior
       * - Click to select tag
       * - Click again to deselect
       * - Visual indication of selection (blue background)
       * - Flex wrap for responsive layout
       */}
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
      {/* CLOSE: tag-filters */}

      {/**
       * REF: active-filters-display
       *
       * # Active Filters Display
       *
       * ## Purpose
       * Show which filters are currently applied with option to clear.
       *
       * ## Conditional Rendering
       * Only shows when at least one filter is active.
       *
       * ## Display
       * - Blue background box
       * - Shows active search term
       * - Shows active tag
       * - Clear all button
       */}
      {(searchTerm || selectedTag) && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg flex justify-between">
          <div>
            <span className="font-medium">Active filters:</span>
            {searchTerm && <span className="ml-2 text-sm">Search: "{searchTerm}"</span>}
            {selectedTag && <span className="ml-2 text-sm">Tag: #{selectedTag}</span>}
          </div>
          <button
            onClick={handleClearFilters}
            className="text-blue-600 dark:text-blue-300 hover:underline text-sm"
          >
            Clear all
          </button>
        </div>
      )}
      {/* CLOSE: active-filters-display */}

      {/**
       * REF: results-count
       *
       * # Results Count Display
       *
       * Shows how many todos are currently displayed out of total.
       */}
      <div className="mb-4 text-gray-600 dark:text-gray-300">
        Showing {filteredTodos.length} of {publicTodos.length} todos
      </div>
      {/* CLOSE: results-count */}

      {/**
       * REF: todos-grid
       *
       * # Todos Grid Display
       *
       * ## Conditional Rendering
       * - Shows grid if filteredTodos has items
       * - Shows empty state if no results
       *
       * ## Grid Layout
       * - 1 column on mobile
       * - 2 columns on tablet (md)
       * - 3 columns on desktop (lg)
       * - Gap between cards
       *
       * ## Todo Card
       * Each card displays:
       * - Title
       * - Description (if exists)
       * - Tags (if exist)
       * - Completion status
       *
       * ## Type Safety
       * TypeScript knows exact structure of each todo from schema inference.
       */}
      {filteredTodos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTodos.map(todo => (
            <div key={todo.id} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-2">{todo.title}</h3>

              {todo.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {todo.description}
                </p>
              )}

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
      {/* CLOSE: todos-grid */}
    </div>
  )
}

/**
 * REF: drizzle-query-patterns
 *
 * # Drizzle ORM Query Patterns
 *
 * ## Basic Public Query
 * ```typescript
 * const publicTodos = await db
 *   .select()
 *   .from(todos)
 *   .where(eq(todos.isPublic, true))
 *   .orderBy(desc(todos.createdAt))
 * ```
 *
 * ## With Multiple Conditions
 * ```typescript
 * import { and, eq } from 'drizzle-orm'
 *
 * const results = await db
 *   .select()
 *   .from(todos)
 *   .where(
 *     and(
 *       eq(todos.isPublic, true),
 *       eq(todos.completed, false)
 *     )
 *   )
 * ```
 *
 * ## With Ordering
 * ```typescript
 * import { desc } from 'drizzle-orm'
 *
 * const results = await db
 *   .select()
 *   .from(todos)
 *   .where(eq(todos.isPublic, true))
 *   .orderBy(desc(todos.createdAt))
 * ```
 *
 * ## With Limit
 * ```typescript
 * const results = await db
 *   .select()
 *   .from(todos)
 *   .where(eq(todos.isPublic, true))
 *   .limit(10)
 * ```
 */
// CLOSE: drizzle-query-patterns

/**
 * REF: advanced-filtering
 *
 * # Advanced Filtering with Drizzle
 *
 * ## Full-Text Search (Server-Side)
 * For production apps, move search to server for better performance:
 *
 * ```typescript
 * import { sql } from 'drizzle-orm'
 *
 * const results = await db
 *   .select()
 *   .from(todos)
 *   .where(
 *     sql`to_tsvector('english', ${todos.title} || ' ' || COALESCE(${todos.description}, ''))
 *         @@ plainto_tsquery('english', ${searchTerm})`
 *   )
 * ```
 *
 * ## Array Contains Filter
 * ```typescript
 * import { sql } from 'drizzle-orm'
 *
 * const results = await db
 *   .select()
 *   .from(todos)
 *   .where(sql`${todos.tags} @> ARRAY[${tag}]::text[]`)
 * ```
 *
 * ## Case-Insensitive Search
 * ```typescript
 * import { ilike } from 'drizzle-orm'
 *
 * const results = await db
 *   .select()
 *   .from(todos)
 *   .where(ilike(todos.title, `%${searchTerm}%`))
 * ```
 */
// CLOSE: advanced-filtering

/**
 * REF: type-safety-showcase
 *
 * # Type Safety in Action
 *
 * ## IntelliSense Benefits
 * When you type `todo.`, your IDE shows:
 * - id (string)
 * - userId (string)
 * - title (string)
 * - description (string | null)
 * - completed (boolean)
 * - isPublic (boolean)
 * - tags (string[] | null)
 * - createdAt (Date)
 * - updatedAt (Date)
 *
 * ## Compile-Time Errors
 * ```typescript
 * // ❌ TypeScript catches this:
 * todo.nonExistentField
 * // Error: Property 'nonExistentField' does not exist
 *
 * // ❌ TypeScript catches this:
 * const completed: string = todo.completed
 * // Error: Type 'boolean' is not assignable to type 'string'
 *
 * // ✅ This works perfectly:
 * const title: string = todo.title
 * const tags: string[] | null = todo.tags
 * ```
 *
 * ## No Runtime Surprises
 * Because types match database exactly:
 * - No unexpected null values
 * - No type mismatches
 * - No undefined properties
 * - Perfect autocomplete
 */
// CLOSE: type-safety-showcase
