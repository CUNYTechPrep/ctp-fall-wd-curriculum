# Documentation Viewer - Interactive Side-by-Side Docs

A Next.js application that provides interactive, side-by-side documentation for all 5 example projects.

## 🎯 Features

**Side-by-Side Layout:**
- **Left:** Extracted comments with markdown formatting
- **Right:** Monaco editor with full TypeScript/TSX syntax highlighting

**Interactive Code:**
- Monaco editor (VS Code's editor)
- Full IntelliSense and syntax highlighting
- Go-to-definition support
- Line number linking (#L10 or #L10-L20)
- Multiple themes (Dark, Light, High Contrast)

**Navigation:**
- File tree sidebar
- Jump to specific lines
- Link from learning guides to exact code
- Theme synchronization across page and editor

**Static Generation:**
- Builds to static HTML/JS
- Deploy to GitHub Pages
- No server needed
- Fast loading

## 🚀 Development

### Install

```bash
cd docs-viewer
npm install
```

### Run Dev Server

```bash
npm run dev
```

Open http://localhost:3001

### Build for Production

```bash
npm run build
```

Output: `out/` folder with static files

### Deploy to GitHub Pages

The built static site goes to GitHub Pages automatically via GitHub Actions.

**Live URL:**
`https://cunytechprep.github.io/ctp-fall-wd-curriculum/week12/`

## 📖 How It Works

### File Structure

```
docs-viewer/
├── app/
│   ├── page.tsx                    # Landing page (all projects)
│   ├── docs/
│   │   └── [project]/
│   │       └── [[...file]]/
│   │           └── page.tsx        # Dynamic file viewer
│   └── layout.tsx
├── components/
│   ├── CodeViewer.tsx              # Monaco editor wrapper
│   ├── FileTree.tsx                # File navigation
│   └── ThemeProvider.tsx           # Theme management
└── next.config.js                  # Static export config
```

### Routing

**Landing:** `/` → All 5 projects
**Project:** `/docs/nextjs-firebase` → First file
**Specific File:** `/docs/nextjs-firebase/lib/firebase/client.ts`
**With Lines:** `/docs/nextjs-firebase/lib/firebase/client.ts#L25-L40`

### Static Generation

Next.js generates all possible routes at build time:

```typescript
export async function generateStaticParams() {
  // For each project
  // For each file in project
  // Generate static HTML page
}
```

**Result:** Fully static site, no server needed!

## 🎨 Theme System

**4 Monaco Themes:**
1. `vs-dark` - Dark (default)
2. `vs` - Light
3. `hc-black` - High Contrast Dark
4. `hc-light` - High Contrast Light

**Page Theme Sync:**
- Dark Monaco themes → dark page background
- Light Monaco themes → light page background
- Saved in localStorage
- Persists across sessions

## 🔗 Line Number Linking

**URL Format:**
```
/docs/nextjs-firebase/lib/firebase/client.ts#L25
/docs/nextjs-firebase/lib/firebase/client.ts#L25-L40
```

**In Learning Guides:**
```markdown
1. **Start:** lib/firebase/client.ts#L25-L40
   - See Firebase SDK initialization
```

**Monaco will:**
- Scroll to line 25
- Highlight lines 25-40
- Focus attention on relevant code

## 💡 Benefits

**vs Static Generators (Groc/Docco):**
- ✅ Full Monaco editor (not just syntax highlighting)
- ✅ Go-to-definition works
- ✅ Better TypeScript support
- ✅ No TSX parsing issues
- ✅ Interactive navigation
- ✅ Theme switching
- ✅ Line highlighting

**vs Server-Side:**
- ✅ Static export (GitHub Pages)
- ✅ No server costs
- ✅ Fast loading
- ✅ Works offline after first load

## 🎓 For Students

**Navigate:**
1. Browse projects at /
2. Click project to see files
3. Click file to see side-by-side view
4. Switch themes as needed
5. Click line numbers to get shareable links

**Learn:**
- Read comments on left
- See code on right
- Use Monaco features (go-to-definition, etc.)
- Follow learning guide flows
- Jump to specific lines from guides

## 🚀 Deployment

### GitHub Actions

Workflow builds and deploys automatically:

```yaml
- name: Build docs-viewer
  working-directory: docs-viewer
  run: npm ci && npm run build

- name: Deploy to GitHub Pages
  uses: actions/deploy-pages@v4
  with:
    artifact_name: docs-viewer/out
```

### Manual Deploy

```bash
npm run build
# Upload 'out/' folder to GitHub Pages
```

## 📊 Size Estimate

**Monaco Editor:** ~3MB (CDN cached)
**App Bundle:** ~200KB
**Static Files:** ~100KB per project × 5 = 500KB
**Total:** ~3.7MB initial load, then cached

**Much smaller than video/audio alternatives!**

## ✨ Summary

**Interactive documentation viewer with:**
- ✅ Side-by-side layout (comments LEFT, code RIGHT)
- ✅ Monaco editor with full TypeScript/TSX support
- ✅ Theme switching (4 themes)
- ✅ Line number linking
- ✅ File tree navigation
- ✅ Static export for GitHub Pages
- ✅ $0 hosting cost
- ✅ No TSX parsing issues

---

**This is the perfect solution for Week 12 documentation!** 🎉

**Students get VS Code-quality code viewing with side-by-side explanations!**
