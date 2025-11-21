# Feed Page - PostgreSQL Full-Text Search and Filtering

## Overview

**REF:**
The Feed page demonstrates advanced PostgreSQL features for search, filtering, and pagination in a real-time public feed application. This component showcases both client-side and server-side query optimization strategies for handling large datasets.

**CLOSE:**

## Key Features Table

| Feature | PostgreSQL | Benefit |
|---------|-----------|---------|
| **Full-text search** | Built-in FTS indexes | No external service needed |
| **Array filtering** | GIN indexes | Fast tag searches |
| **Pagination** | `.range()` method | Efficient for large datasets |
| **Aggregations** | SQL operations | Count, sum, avg operations |
| **Real-time updates** | Supabase Realtime | Instant data synchronization |
| **RLS enforcement** | Database policies | Security at storage layer |

## Component Architecture

### Client Component Type
```typescript
'use client'
```
Uses client-side rendering for interactive features like search and filtering.

### Dependencies
- `useState`, `useEffect` - React state management
- `createClient` - Supabase client instance
- `Database` type - Type-safe database schema

### Type Definitions

| Type | Source | Purpose |
|------|--------|---------|
| `Todo` | `Database['public']['Tables']['todos']['Row']` | Type-safe todo objects |

## State Management

### Core State Variables

| State | Type | Purpose |
|-------|------|---------|
| `todos` | `Todo[]` | All loaded todos from database |
| `filteredTodos` | `Todo[]` | Filtered results based on search/tags |
| `searchTerm` | `string` | Current search input |
| `selectedTag` | `string \| null` | Currently selected tag filter |
| `loading` | `boolean` | Loading state indicator |
| `page` | `number` | Current pagination page |
| `hasMore` | `boolean` | Whether more data available |

### Constants

```typescript
const PAGE_SIZE = 20  // Items per page for pagination
```

## Functional Methods

### 1. FETCH PUBLIC TODOS

**REF:**
Fetches public todos from the database with pagination using efficient `.range()` method instead of `offset/limit`. This pattern scales better for large datasets.

**Pagination Mathematics:**

| Page | Calculation | Range |
|------|---|---|
| 0 | 0 * 20 | range(0, 19) |
| 1 | 1 * 20 | range(20, 39) |
| 2 | 2 * 20 | range(40, 59) |

**Query Details:**
```typescript
// Query structure
await supabase
  .from('todos')
  .select('*')
  .eq('is_public', true)
  .order('created_at', { ascending: false })
  .range(start, end)
```

**Process:**
1. Calculate start/end range based on page number
2. Query public todos from database
3. Order by creation time (newest first)
4. Determine if more data available
5. Update local state with new data

**CLOSE:** `.range()` is more efficient than `offset/limit` for large datasets

---

### 2. REAL-TIME SUBSCRIPTION TO PUBLIC FEED

**REF:**
Listens for real-time changes to the public feed using Supabase Realtime with PostgreSQL LISTEN/NOTIFY. This ensures all users see updates instantly when other users create, update, or delete public todos.

**Security Features:**

| Aspect | Implementation |
|--------|---|
| **RLS Policy** | `is_public = true` enforced at database |
| **Filtering Level** | Database level before broadcast |
| **Bypass Protection** | Can't circumvent with modified client |

**Performance Characteristics:**

| Metric | Value |
|--------|-------|
| **Broadcast Scope** | Only public changes |
| **Filtering** | Before network transmission |
| **Bandwidth** | Low, targeted updates |
| **Updates** | Instant delivery |

**Event Handling:**
- **INSERT**: New public todo added to top of feed
- **UPDATE**: Existing todo modified in-place
- **DELETE**: Todo removed from feed

**CLOSE:** Real-time sync + database security combined for optimal UX

---

### 3. CLIENT-SIDE VS SERVER-SIDE SEARCH

**REF:**
Demonstrates the trade-offs between client-side filtering (current demo) and server-side full-text search (production). Client-side works well for demos; server-side required for scalability.

**Search Strategy Comparison:**

| Aspect | Client-side | Server-side |
|--------|---|---|
| **Query Method** | JavaScript `.filter()` | `.textSearch('title', term)` |
| **Data Fetching** | All data must load | Only matching results |
| **Performance** | Fast for small sets | Scales to millions |
| **Offline Support** | Yes | No |
| **Search Capabilities** | Basic substring | Full-text features |
| **Ideal Use Case** | Demo, <1000 items | Production, >10k items |

**Current Implementation:**
```typescript
let results = todos

// Search filtering
if (searchTerm.trim()) {
  const term = searchTerm.toLowerCase()
  results = results.filter(
    todo =>
      todo.title?.toLowerCase().includes(term) ||
      todo.description?.toLowerCase().includes(term)
  )
}

// Tag filtering
if (selectedTag) {
  results = results.filter(todo => todo.tags?.includes(selectedTag))
}
```

**CLOSE:** Use server-side for large datasets; create FTS index for performance

---

### 4. GET UNIQUE TAGS

**REF:**
Extracts unique tags from all loaded todos for filter button display. Shows both current client-side approach and optimal server-side SQL alternative.

**Tag Processing:**
```typescript
const allTags = Array.from(
  new Set(todos.flatMap(todo => todo.tags || []))
).sort()
```

**Server-side Alternative (SQL):**
```sql
SELECT DISTINCT unnest(tags) as tag
FROM todos
WHERE is_public = true
ORDER BY tag
```

| Approach | Complexity | Scalability |
|----------|---|---|
| Client-side flattening | O(n) | Limited to loaded data |
| Server-side DISTINCT | O(n log n) | Works with full dataset |

**CLOSE:** Server-side better for large datasets; allows pagination of tags themselves

---

## UI Components

### Search Bar
```typescript
<input
  type="text"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search todos..."
  className="w-full px-4 py-3 border border-gray-300 rounded-lg..."
/>
```

### Tag Filter Buttons
- Dynamic buttons from `allTags` array
- Toggle selected tag on/off
- Visual indicator (blue background when selected)
- Hashtag prefix styling

### Todo Grid
- Responsive layout: 1 column mobile, 2 tablet, 3 desktop
- Card display with title, description, tags
- Completion status indicator
- Gray color scheme with dark mode support

### Load More Button
- Appears when `hasMore === true`
- Increments page counter on click
- Appends new data to existing list
- Centered placement

## Performance Optimizations

### Current Implementation
- Efficient pagination with `.range()`
- Client-side filtering for instant UX
- Real-time subscription for live updates
- Tag deduplication with Set

### Production Optimizations
- Full-text search indexes on PostgreSQL
- Server-side filtering reduces data transfer
- Aggregate functions for tag lists
- Database-level RLS prevents unauthorized access

## Edge Cases Handled

| Scenario | Handling |
|----------|----------|
| **Loading state** | Shows "Loading public feed..." message |
| **No results** | Displays "No todos found" message |
| **Empty tag list** | Hides tag filter section |
| **Search + tag filter** | Combines both filters (AND logic) |
| **Network error** | Logs error, stops loading |

## Production Full-Text Search Implementation

### Step 1: Create FTS Index

**REF:**
Creates a PostgreSQL full-text search index for optimal search performance. The GIN index enables fast searching across title and description fields.

```sql
CREATE INDEX idx_todos_search
ON todos
USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')))
WHERE is_public = true;
```

**Benefits:**
- Indexes both title and description
- Language-specific (English) stemming
- Filtered to public todos only
- Reduces index size and maintenance

**CLOSE:** Essential for production search performance

---

### Step 2: Query with textSearch

```typescript
await supabase
  .from('todos')
  .select('*')
  .textSearch('fts', searchTerm, {
    type: 'websearch',
    config: 'english'
  })
  .eq('is_public', true)
```

### FTS Capabilities

| Feature | Benefit |
|---------|---------|
| **Stemming** | "running" matches "run" |
| **Relevance ranking** | Order by relevance score |
| **Performance** | 100x faster than LIKE |
| **Scalability** | Handles millions of records |

## File References

| Section | Reference ID | Topic |
|---------|---|---|
| Component Overview | `REF:` | Advanced PostgreSQL features |
| Pagination Logic | `REF: FETCH PUBLIC TODOS` | Range-based pagination |
| Real-time Sync | `REF: REAL-TIME SUBSCRIPTION` | Supabase Realtime |
| Search Strategy | `REF: CLIENT-SIDE VS SERVER-SIDE SEARCH` | Query optimization |
| Tag Extraction | `REF: GET UNIQUE TAGS` | Array deduplication |
| FTS Implementation | `## Production POSTGRESQL FULL-TEXT SEARCH` | Production optimization |

## Summary

The Feed page demonstrates a production-ready approach to displaying large public datasets with real-time updates, search, and filtering. It shows the progression from simple client-side filtering (suitable for demos) to advanced PostgreSQL features (required for scale). The use of `.range()` pagination, RLS policies, and Supabase Realtime ensures both performance and security.

**Key Takeaways:**
- PostgreSQL has built-in full-text search capabilities
- Real-time subscriptions provide instant data sync
- RLS at database level is more secure than client-side checks
- Server-side search required for datasets >10k records
- Pagination with `.range()` more efficient than offset/limit
