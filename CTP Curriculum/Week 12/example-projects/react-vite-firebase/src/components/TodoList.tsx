/**
 * REF: TodoList Component - Display Todos in React SPA
 *
 * Renders a list of todos organized by completion status in a client-side application.
 *
 * ## Overview
 * This component displays todos organized into two sections:
 * - **Active Todos**: Not completed, displayed prominently
 * - **Completed Todos**: Marked complete, with reduced opacity
 *
 * ## Key Features
 * - Real-time todo updates via Firestore listeners
 * - Inline TodoItem sub-component for each todo
 * - Attachment support with upload/delete functionality
 * - Empty state message
 * - Completion toggle and delete actions
 *
 * CLOSE
 */

import { Todo, Attachment } from '../types'
import { useState } from 'react'
import { doc, updateDoc, arrayUnion, arrayRemove, Timestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import AttachmentUpload from './AttachmentUpload'
import AttachmentList from './AttachmentList'

interface TodoListProps {
  todos: Todo[]
  userId: string
  onToggle: (todoId: string, completed: boolean) => void
  onDelete: (todoId: string) => void
}

export default function TodoList({ todos, userId, onToggle, onDelete }: TodoListProps) {
  const activeTodos = todos.filter(t => !t.completed)
  const completedTodos = todos.filter(t => t.completed)

  return (
    <div className="space-y-6">
      {/* Active Todos */}
      {activeTodos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Active ({activeTodos.length})
          </h3>
          <div className="space-y-2">
            {activeTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                userId={userId}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-500">
            Completed ({completedTodos.length})
          </h3>
          <div className="space-y-2 opacity-75">
            {completedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                userId={userId}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {todos.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No todos yet. Create one above!
        </p>
      )}
    </div>
  )
}
// CLOSE: TodoList

// REF: TODO ITEM SUB-COMPONENT
/**
 * TODO ITEM SUB-COMPONENT
 */
// CLOSE
function TodoItem({ todo, userId, onToggle, onDelete }: {
  todo: Todo
  userId: string
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}) {
  const [showAttachments, setShowAttachments] = useState(false)

  const handleAttachmentUpload = async (attachment: Attachment) => {
    try {
      await updateDoc(doc(db, 'todos', todo.id), {
        attachments: arrayUnion({ ...attachment, uploadedAt: Timestamp.now() }),
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Failed to add attachment:', error)
      alert('Failed to add attachment')
    }
  }

  const handleAttachmentDelete = async (attachment: Attachment) => {
    try {
      await updateDoc(doc(db, 'todos', todo.id), {
        attachments: arrayRemove(attachment),
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Failed to remove attachment:', error)
      alert('Failed to remove attachment')
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, todo.completed)}
          className="mt-1 w-5 h-5 cursor-pointer"
        />

        <div className="flex-1">
          <h4 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
            {todo.title}
          </h4>
          {todo.description && (
            <p className={`text-sm text-gray-600 mt-1 ${todo.completed ? 'line-through' : ''}`}>
              {todo.description}
            </p>
          )}
          {todo.tags && todo.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {todo.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Attachments Section */}
          {(todo.attachments && todo.attachments.length > 0) || showAttachments ? (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <AttachmentList
                attachments={todo.attachments || []}
                onDelete={handleAttachmentDelete}
              />
              {showAttachments && (
                <div className="mt-3">
                  <AttachmentUpload
                    userId={userId}
                    todoId={todo.id}
                    onUploadComplete={handleAttachmentUpload}
                  />
                </div>
              )}
            </div>
          ) : null}

          {!showAttachments && (
            <button
              onClick={() => setShowAttachments(true)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700"
            >
              + Add Attachment
            </button>
          )}
        </div>

        <button
          onClick={() => onDelete(todo.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
// CLOSE: TODO ITEM SUB-COMPONENT

/**
 * REF: Component Composition Patterns
 *
 * ### Inline Components (This Example)
 * TodoItem is defined inline within TodoList.
 *
 * **Advantages:**
 * - Simpler for small, single-use components
 * - Keeps related logic together
 * - Easier to understand context
 * - Faster for prototyping
 *
 * **Disadvantages:**
 * - Cannot reuse in other files
 * - Larger parent component
 * - Harder to test independently
 *
 * ### Separate File Components
 * Extract to own file (e.g., `TodoItem.tsx`)
 *
 * **Advantages:**
 * - Reusable across components
 * - Independent testing
 * - Cleaner organization
 * - Better for team development
 *
 * **Disadvantages:**
 * - More files to manage
 * - Requires prop drilling
 * - Adds build overhead
 *
 * ### Decision Rule
 * - **Reused 2+ times**: Separate file
 * - **Used in 1 file**: Inline component
 * - **Complex logic**: Always separate
 * - **Simple display**: Can inline
 *
 * CLOSE
 */
