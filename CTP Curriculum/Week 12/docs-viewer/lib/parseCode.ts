/**
 * Code Parser - Extract and Position Comments
 *
 * Parses source files to:
 * 1. Extract comments with their line positions
 * 2. Remove comments from code
 * 3. Map comments to code sections
 */

export interface CodeSection {
  startLine: number          // Line in original file (with comments)
  endLine: number            // Line in original file (with comments)
  startLineInCleanCode: number  // Line in code without comments
  endLineInCleanCode: number    // Line in code without comments
  comment: string
  code: string
  refId?: string             // Optional REF marker for precise linking
}

/**
 * Parse source file into sections
 *
 * Each section has:
 * - Comment block
 * - Associated code
 * - Line numbers for both
 */
export function parseSourceFile(source: string): {
  sections: CodeSection[]
  codeWithoutComments: string
  originalCode: string
  refMap: Map<string, number> // Map REF IDs to section indices
} {
  const lines = source.split('\n')
  const sections: CodeSection[] = []
  const refMap = new Map<string, number>()

  let currentComment: string[] = []
  let currentCode: string[] = []
  let commentStartLine = 0
  let codeStartLine = 0
  let inBlockComment = false
  let currentRefId: string | undefined

  const codeLines: string[] = [] // Code without comments
  let cleanCodeLineNumber = 0  // Track line number in clean code
  const closeMarkers = new Map<string, number>() // Track CLOSE markers

  lines.forEach((line, idx) => {
    const lineNumber = idx + 1

    // Detect CLOSE marker (single-line or JSX style)
    const closeMatch = line.match(/\/\/\s*CLOSE:\s*([\w-]+)/) || line.match(/\{\s*\/\*\s*CLOSE:\s*([\w-]+)\s*\*\/\s*\}/)
    if (closeMatch) {
      const refId = closeMatch[1]
      closeMarkers.set(refId, lineNumber)
      // Don't add CLOSE marker to code output
      return
    }

    // Detect block comment start (regular or JSX style)
    const isRegularComment = line.trim().startsWith('/**') || line.trim().startsWith('/*')
    const isJSXComment = line.trim().startsWith('{/**') || line.trim().startsWith('{/*')

    if (isRegularComment || isJSXComment) {
      // Flush any pending code without comment
      if (currentCode.length > 0 && currentComment.length === 0) {
        sections.push({
          startLine: codeStartLine,
          endLine: lineNumber - 1,
          startLineInCleanCode: 0,
          endLineInCleanCode: 0,
          comment: '',
          code: currentCode.join('\n'),
        })
        currentCode = []
      }

      inBlockComment = true
      commentStartLine = lineNumber

      // Extract comment text and check for REF marker
      let commentText = line.replace(/^\s*\/\*\*?\s?/, '').replace(/\*\/.*$/, '')

      // Check for REF: marker (e.g., "REF: firebase-init" or "REF: my-section-name")
      const refMatch = commentText.match(/^REF:\s*([\w-]+)/)
      if (refMatch) {
        currentRefId = refMatch[1]
        // Don't add the REF line to comment - it's just metadata
        // Continue to next line
      } else if (commentText.trim() && !commentText.includes('*/')) {
        // Only add non-REF lines to comment
        currentComment.push(commentText)
      }

      // Check if single-line comment
      if (line.includes('*/')) {
        inBlockComment = false
        codeStartLine = lineNumber + 1
      }
      return // Don't add to code
    }

    // Detect block comment end (regular or JSX)
    const isCommentEnd = (line.includes('*/') || line.includes('**/}')) && inBlockComment
    if (isCommentEnd) {
      inBlockComment = false
      // Extract any text before */ or **/}
      let commentText = line.replace(/\s*\*\*?\/\}?.*/, '').replace(/^\s*\*\s?/, '')
      if (commentText.trim()) {
        currentComment.push(commentText)
      }

      codeStartLine = lineNumber + 1
      return // Don't add to code
    }

    // Inside block comment
    if (inBlockComment) {
      // Remove leading * and spaces, handle JSX comment format
      let commentText = line.replace(/^\s*\*\s?/, '')

      // Check if this line contains a REF marker - if so, don't add to comment display
      const refMatch = commentText.match(/^REF:\s*([\w-]+)/)
      if (refMatch) {
        currentRefId = refMatch[1]
        // Don't add REF line to comment text
        return
      }

      currentComment.push(commentText)
      return // Don't add to code
    }

    // Single-line comment
    if (line.trim().startsWith('//')) {
      // Check if this is a CLOSE marker or REF marker
      const isCloseOrRef = line.includes('CLOSE:') || line.includes('REF:')

      // If we're currently in code (have accumulated code), keep inline comments in the code
      if (currentCode.length > 0 && !isCloseOrRef) {
        // This is an inline comment within code - keep it
        currentCode.push(line)
        codeLines.push(line)
        cleanCodeLineNumber++
        return
      }

      // Standalone comment line (not in code block) - treat as documentation
      // Flush pending code without comment
      if (currentCode.length > 0 && currentComment.length === 0) {
        sections.push({
          startLine: codeStartLine,
          endLine: lineNumber - 1,
          startLineInCleanCode: 0,
          endLineInCleanCode: 0,
          comment: '',
          code: currentCode.join('\n'),
        })
        currentCode = []
      }

      const commentText = line.replace(/^\s*\/\/\s?/, '')

      // Check if this is a REF marker line - don't add to comment display
      const refMatch = commentText.match(/^REF:\s*([\w-]+)/)
      if (refMatch) {
        currentRefId = refMatch[1]
        codeStartLine = lineNumber + 1
        return // Skip REF line, don't add to comment
      }

      currentComment.push(commentText)
      codeStartLine = lineNumber + 1
      return // Don't add to code
    }

    // Regular code line
    // If we have accumulated comment, associate it with upcoming code
    if (currentComment.length > 0 && currentCode.length === 0) {
      codeStartLine = lineNumber
    }

    // Check if we should close this section (blank line or have REF ID with CLOSE marker)
    const shouldCloseSection = currentComment.length > 0 && currentCode.length > 0 && (
      line.trim() === '' ||
      (currentRefId && closeMarkers.has(currentRefId) && lineNumber >= closeMarkers.get(currentRefId)!)
    )

    if (shouldCloseSection) {
      // Determine end line (use CLOSE marker if available)
      const endLine = currentRefId && closeMarkers.has(currentRefId)
        ? closeMarkers.get(currentRefId)! - 1  // Line before CLOSE
        : lineNumber - 1

      // Save section
      const sectionIndex = sections.length
      sections.push({
        startLine: codeStartLine,
        endLine: endLine,
        startLineInCleanCode: 0, // Will calculate later
        endLineInCleanCode: 0,   // Will calculate later
        comment: currentComment.join('\n'),
        code: currentCode.join('\n'),
        refId: currentRefId,
      })

      // Store REF mapping
      if (currentRefId) {
        refMap.set(currentRefId, sectionIndex)
      }

      currentComment = []
      currentCode = []
      currentRefId = undefined
      codeLines.push(line) // Keep blank line in code
      return
    }

    // Add to current code
    currentCode.push(line)
    codeLines.push(line) // Build code without comments
  })

  // Flush remaining content
  if (currentComment.length > 0 || currentCode.length > 0) {
    const cleanStart = cleanCodeLineNumber + 1
    const cleanEnd = cleanCodeLineNumber + currentCode.length

    sections.push({
      startLine: codeStartLine || 1,
      endLine: lines.length,
      startLineInCleanCode: cleanStart,
      endLineInCleanCode: cleanEnd,
      comment: currentComment.join('\n'),
      code: currentCode.join('\n'),
    })
  }

  // Calculate clean code line numbers by finding where each section's code appears in codeLines
  const fullCleanCode = codeLines.join('\n')
  const cleanCodeLines = fullCleanCode.split('\n')

  sections.forEach(section => {
    if (!section.code.trim()) {
      section.startLineInCleanCode = 1
      section.endLineInCleanCode = 1
      return
    }

    // Find this section's code in the clean code
    const sectionFirstLine = section.code.split('\n')[0]
    const sectionLineCount = section.code.split('\n').length

    // Find where this code starts in cleanCodeLines
    let foundAt = -1
    for (let i = 0; i < cleanCodeLines.length; i++) {
      if (cleanCodeLines[i].trim() === sectionFirstLine.trim()) {
        foundAt = i
        break
      }
    }

    if (foundAt !== -1) {
      section.startLineInCleanCode = foundAt + 1 // Convert to 1-based
      section.endLineInCleanCode = foundAt + sectionLineCount
    } else {
      // Fallback
      section.startLineInCleanCode = 1
      section.endLineInCleanCode = sectionLineCount
    }
  })

  return {
    sections,
    codeWithoutComments: codeLines.join('\n'),
    originalCode: source,
    refMap,
  }
}

/**
 * Format comment as HTML with full Markdown support
 *
 * Supports:
 * - Headers (# ## ###)
 * - Bold (**text**)
 * - Italic (*text*)
 * - Code blocks (```)
 * - Inline code (`code`)
 * - Links ([text](url))
 * - Lists (- or 1.)
 * - Blockquotes (>)
 * - Horizontal rules (---)
 *
 * Also removes REF: markers (already parsed, don't show in output)
 */
export function formatCommentAsHTML(comment: string): string {
  // Remove REF: line if present (first line) - supports hyphens in IDs
  let html = comment.replace(/^REF:\s*[\w-]+\s*\n?/, '')

  // Remove any stray CLOSE: markers (shouldn't be in comments, but just in case)
  html = html.replace(/CLOSE:\s*[\w-]+/g, '')

  // Remove audio guide references (will add later as needed)
  html = html.replace(/\*\*Audio Guide:\*\*\s*`audio\/[^`]+`\s*\n?/g, '')
  html = html.replace(/Audio Guide:\s*`audio\/[^`]+`\s*\n?/g, '')

  // Tables (process before other formatting)
  html = processMarkdownTables(html)

  // Code blocks (must be processed after tables)
  // Add data-language attribute for client-side syntax highlighting
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || 'typescript'
    return `<pre class="bg-gray-800 dark:bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm border border-gray-700 dark:border-gray-600"><code class="language-${language}" data-language="${language}">${escapeHtml(code.trim())}</code></pre>`
  })

  // Headers (H1-H6)
  html = html.replace(/^#### (.+)$/gm, '<h5 class="text-base font-bold text-gray-800 dark:text-gray-100 mt-3 mb-2">$1</h5>')
  html = html.replace(/^### (.+)$/gm, '<h4 class="text-lg font-bold text-gray-800 dark:text-gray-100 mt-4 mb-2">$1</h4>')
  html = html.replace(/^## (.+)$/gm, '<h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">$1</h3>')
  html = html.replace(/^# (.+)$/gm, '<h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-8 mb-4">$1</h2>')

  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr class="my-6 border-gray-300 dark:border-gray-600" />')

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600 dark:text-gray-400">$1</blockquote>')

  // Lists - unordered
  html = html.replace(/^- (.+)$/gm, '<li class="ml-6 mb-1 list-disc text-gray-700 dark:text-gray-300">$1</li>')

  // Lists - ordered
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-6 mb-1 list-decimal text-gray-700 dark:text-gray-300">$2</li>')

  // Inline code (before bold/italic to prevent conflicts)
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-sm font-mono text-purple-600 dark:text-purple-400">$1</code>')

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')

  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">$1</a>')

  // Paragraphs (double line break)
  html = html.replace(/\n\n+/g, '</p><p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">')

  // Wrap in paragraph if not already HTML
  html = html.split('\n').map(line => {
    if (line.trim() && !line.startsWith('<')) {
      return `<p class="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">${line}</p>`
    }
    return line
  }).join('\n')

  return html
}

/**
 * Process Markdown tables
 */
function processMarkdownTables(text: string): string {
  // Match Markdown table pattern
  const tableRegex = /(\|.+\|[\r\n]+\|[-:\s|]+\|[\r\n]+(?:\|.+\|[\r\n]+)*)/g

  return text.replace(tableRegex, (table) => {
    const lines = table.trim().split('\n')
    if (lines.length < 2) return table

    const headers = lines[0].split('|').filter(cell => cell.trim()).map(h => h.trim())
    const rows = lines.slice(2).map(row =>
      row.split('|').filter(cell => cell.trim()).map(c => c.trim())
    )

    let html = '<table class="min-w-full my-6 border-collapse border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">'
    html += '<thead class="bg-gray-200 dark:bg-gray-800"><tr>'

    headers.forEach(header => {
      html += `<th class="px-6 py-3 text-left font-bold text-gray-800 dark:text-gray-100 border-b-2 border-gray-400 dark:border-gray-600">${header}</th>`
    })

    html += '</tr></thead><tbody>'

    rows.forEach((row, idx) => {
      html += `<tr class="${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-850'}">`
      row.forEach(cell => {
        html += `<td class="px-6 py-4 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">${cell}</td>`
      })
      html += '</tr>'
    })

    html += '</tbody></table>'
    return html
  })
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}
