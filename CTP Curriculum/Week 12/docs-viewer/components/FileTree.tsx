/**
 * FileTree Component - Project File Navigation
 *
 * Displays hierarchical file tree for navigation
 */

'use client'

import Link from 'next/link'
import { useState } from 'react'

interface FileTreeProps {
  files: string[]
  currentFile: string
  project: string
}

export default function FileTree({ files, currentFile, project }: FileTreeProps) {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set())

  // Build tree structure
  const tree = buildTree(files)

  function toggleDir(dirPath: string) {
    const newExpanded = new Set(expandedDirs)
    if (newExpanded.has(dirPath)) {
      newExpanded.delete(dirPath)
    } else {
      newExpanded.add(dirPath)
    }
    setExpandedDirs(newExpanded)
  }

  function renderTree(node: TreeNode, depth = 0): React.ReactNode {
    if (node.type === 'file') {
      const isActive = node.path === currentFile
      const paddingLeft = `${depth * 12 + 12}px`
      return (
        <div style={{ paddingLeft }}>
          <Link
            href={`/docs/${project}/${node.path}`}
            className={`block py-1.5 px-3 text-sm hover:bg-blue-50 rounded transition ${
              isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'
            }`}
          >
            <span className="mr-2">📄</span>
            {node.name}
          </Link>
        </div>
      )
    }

    const isExpanded = expandedDirs.has(node.path)

    return (
      <div key={node.path}>
        <button
          onClick={() => toggleDir(node.path)}
          className="w-full text-left py-1.5 px-3 text-sm hover:bg-gray-100 rounded transition flex items-center gap-2"
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
        >
          <span>{isExpanded ? '📂' : '📁'}</span>
          <span className="font-medium text-gray-700">{node.name}</span>
        </button>
        {isExpanded && (
          <div>
            {node.children?.map(child => (
              <div key={child.path}>
                {renderTree(child, depth + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <nav className="py-2">
      {tree.children?.map(node => (
        <div key={node.path}>
          {renderTree(node)}
        </div>
      ))}
    </nav>
  )
}

// Tree building logic
interface TreeNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: TreeNode[]
}

function buildTree(files: string[]): TreeNode {
  const root: TreeNode = { name: '', path: '', type: 'directory', children: [] }

  files.forEach(file => {
    const parts = file.split('/')
    let current = root

    parts.forEach((part, idx) => {
      const isLastPart = idx === parts.length - 1
      const pathSoFar = parts.slice(0, idx + 1).join('/')

      if (!current.children) {
        current.children = []
      }

      let existing = current.children.find(child => child.name === part)

      if (!existing) {
        existing = {
          name: part,
          path: isLastPart ? file : pathSoFar,
          type: isLastPart ? 'file' : 'directory',
          children: isLastPart ? undefined : [],
        }
        current.children.push(existing)
      }

      if (!isLastPart) {
        current = existing
      }
    })
  })

  return root
}
