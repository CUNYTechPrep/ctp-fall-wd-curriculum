/**
 * REF: Public Todo Feed Page
 *
 * Displays public todos shared by all users. Features search, tag filtering,
 * and real-time updates. Accessible to authenticated users only.
 *
 * CLOSE: Protected page that shows all public todos with search and filtering.
 * Uses Supabase real-time to update feed when new public todos are created.
 *
 * PAGE STRUCTURE:
 * | `Component` | Purpose |
 * |-----------|---------|
 * | `Title` | "Public Feed" heading |
 * | `Count` | "N public todos shared by the community" |
 * | Search Input | Full-text search on title/description |
 * | Tag Filter | Buttons to filter by tag |
 * | Results Count | "Showing X of Y" |
 * | Todo Cards | Grid of public todos |
 * | Empty State | "No todos found" message |
 *
 * ## Data Sources
 * - Fetches todos WHERE is_public = true
 * - Orders by created_at descending (newest first)
 * - Limits to 50 results
 * - Includes user_id for attribution (optional)
 *
 * FILTERING FEATURES:
 * | Feature | Type | `Location` |
 * |---------|------|----------|
 * | `Search` | Text input | Top of page |
 * | `Tags` | Toggle buttons | Below search |
 * | `Combined` | Both filters | Applied simultaneously |
 *
 * SEARCH BEHAVIOR:
 * - Client-side filtering (all todos in memory)
 * - Matches title OR description
 * - Case-insensitive
 * - Filters after fetch (not server-side)
 *
 * TAG FILTERING:
 * - Extracts all unique tags from todos
 * - Creates toggle buttons for each tag
 * - Click to filter todos with that tag
 * - Click again to deselect tag
 * - Can only filter one tag at a time (current implementation)
 *
 * REAL-TIME UPDATES:
 * ```typescript
 * .channel('public-todos')
 *   .on('postgres_changes', {
 *     event: '*',
 *     schema: 'public',
 *     table: 'todos',
 *     filter: 'is_public=eq.true'
 *   }, (payload) => {
 *     // Refetch todos when public todos change
 *   })
 * ```
 * Updates happen instantly when:
 * - New public todo created
 * - Todo made public (is_public = true)
 * - Todo deleted
 *
 * STATE MANAGEMENT:
 * | `State` | Type | Purpose |
 * |-------|------|---------|
 * | `todos` | `Todo[]` | All fetched public todos |
 * | `filteredTodos` | `Todo[]` | After search/tag filter |
 * | `searchTerm` | `string` | Current search input |
 * | `selectedTag` | string \| `null` | Currently selected tag |
 * | `loading` | `boolean` | Initial fetch in progress |
 *
 * SUPABASE QUERY:
 * ```typescript
 * const { data } = await supabase
 *   .from('todos')
 *   .select('*')
 *   .eq('is_public', true)
 *   .order('created_at', { ascending: false })
 *   .limit(50)
 * ```
 *
 * TODO CARD DISPLAY:
 * | `Field` | `Display` |
 * |-------|---------|
 * | `Title` | Large bold text |
 * | Description | Gray text below title |
 * | `Tags` | Hashtag prefix in gray chips |
 * | `Completed` | Not shown (feed is public todos) |
 * | `User` | Not shown (anonymous) |
 *
 * ## Styling
 * - Responsive grid (1 col mobile, 2-3 cols desktop)
 * - White cards with shadow
 * - Gray background page
 * - Rounded corners and padding
 * - Hover effects on tag buttons
 * - Fixed spacing with Tailwind
 *
 * FILE REFERENCES:
 * - ../lib/supabase.ts - Supabase client
 * - ../contexts/AuthContext.tsx - useAuth() for protected access
 * - ../App.tsx - Route definition
 *
 * ## Key Concepts
 * - Client-side filtering reduces server load
 * - Real-time public feed
 * - RLS allows anyone to see public todos
 * - No user attribution (privacy)
 * - Hashtag search pattern
 * - Read-only feed (no create/edit/delete)
 */

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Todo {
  id: string
  user_id: string
  title: string
  description: string | null
  completed: boolean
  is_public: boolean
  tags: string[] | null
  created_at: string
}

/**
 * REF: feed-page-component
 */
export default function Feed() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  /**
   * FETCH PUBLIC TODOS
   *
   * Query PostgreSQL from browser via Supabase
   */
  useEffect(() => {
    const fetchPublicTodos = async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error:', error)
      } else {
        setTodos(data || [])
        setFilteredTodos(data || [])
      }

      setLoading(false)
    }

    fetchPublicTodos()

    /**
     * REAL-TIME SUBSCRIPTION
     *
     * Listen for new public todos
     */
    const channel = supabase
      .channel('public-todos')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'todos',
        filter: 'is_public=eq.true'
      }, (payload) => {
        console.log('Change:', payload)
        fetchPublicTodos()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  /**
   * CLIENT-SIDE FILTERING
   */
  useEffect(() => {
    let results = todos

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        t => t.title?.toLowerCase().includes(term) ||
             t.description?.toLowerCase().includes(term)
      )
    }

    if (selectedTag) {
      results = results.filter(t => t.tags?.includes(selectedTag))
    }

    setFilteredTodos(results)
  }, [searchTerm, selectedTag, todos])

  const allTags = Array.from(
    new Set(todos.flatMap(t => t.tags || []))
  ).sort()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-2">Public Feed</h1>
        <p className="text-gray-600 mb-8">
          {todos.length} public todos shared by the community
        </p>

        {/* Search */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search todos..."
          className="w-full px-4 py-3 mb-6 border rounded-lg focus:ring-2 focus:ring-purple-500"
        />

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Filter by tag:</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    selectedTag === tag
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mb-4 text-gray-600">
          Showing {filteredTodos.length} of {todos.length}
        </div>

        {/* Grid */}
        {filteredTodos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTodos.map(todo => (
              <div key={todo.id} className="p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-2">{todo.title}</h3>
                {todo.description && (
                  <p className="text-gray-600 mb-4">{todo.description}</p>
                )}
                {todo.tags && todo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {todo.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">No todos found</div>
        )}
      </div>
    </div>
  )
}
// CLOSE: feed-page-component
