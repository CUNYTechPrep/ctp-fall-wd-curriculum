# Week 12 - Full-Stack React Example Projects with Groc Documentation

This week contains 5 complete example implementations of a full-stack todo application, each using different technology stacks. The code is heavily documented with inline comments that are compiled into beautiful HTML documentation using Groc.

## Documentation Approach

**Code IS the documentation.** Each file contains comprehensive inline comments explaining:
- What the code does
- Why architectural decisions were made
- How React concepts work (hooks, state, effects, etc.)
- How database queries are structured
- Security considerations
- Performance optimizations

**Groc** automatically generates beautiful HTML documentation from these comments and deploys it to GitHub Pages.

## Structure

```
Week 12/
├── example-projects/       # Complete example implementations
│   ├── nextjs-firebase/
│   ├── nextjs-supabase-postgres/
│   ├── nextjs-supabase-drizzle/
│   ├── react-vite-firebase/
│   └── react-vite-supabase/
├── videos/                 # Video explanations for each major file
└── docs/                   # Generated Groc documentation (auto-generated)
```

## Technology Stack Paths

5 different implementations of the same application:

1. **Next.js + Firebase** - Full-stack Next.js with Firebase Authentication, Firestore, and Storage
2. **Next.js + Supabase (Postgres)** - Next.js with Supabase's built-in PostgreSQL client
3. **Next.js + Supabase + Drizzle ORM** - Next.js with Supabase and Drizzle for type-safe database access
4. **React (Vite) + Firebase** - Client-side React application with Firebase backend
5. **React (Vite) + Supabase** - Client-side React application with Supabase backend

## Example Project Features

All 5 projects implement identical functionality:

- ✅ User authentication (sign up, sign in, sign out)
- ✅ Todo CRUD operations with real-time updates
- ✅ User accessibility settings (theme, font size, contrast, motion)
- ✅ Profile picture uploads
- ✅ Todo file attachments
- ✅ **Public feed** - searchable, filterable, paginated community todos
- ✅ **Real-time messaging** - chat between users with read receipts
- ✅ Tags for categorization
- ✅ Responsive design
- ✅ Real-time updates across all features

## Video Guides

Each major file has an accompanying video (≤1 minute) explaining:
- Overview of what the file does
- Key concepts demonstrated
- How to modify for your own use

Videos are stored in AWS S3 and automatically linked in the documentation. See `S3_SETUP.md` for configuration.

## Viewing Documentation

**Live Documentation:** https://[your-github-username].github.io/ctp-fall-wd-curriculum/

The documentation is automatically generated from code comments and deployed to GitHub Pages on every push to main.

## Local Documentation Generation

To generate documentation locally:

```bash
# Install Groc
npm install -g groc

# Generate docs for a specific project
cd "example-projects/nextjs-firebase"
groc "**/*.{ts,tsx}" --out ../../docs/nextjs-firebase

# Or generate for all projects (from Week 12 root)
npm run generate-docs
```

## Development

Each example project has its own README with setup instructions. All projects follow the same structure for easy comparison across stacks.

## Deployment

GitHub Actions automatically:
1. Generates Groc documentation from inline comments
2. Deploys to GitHub Pages
3. Runs on every push to main branch

See `.github/workflows/deploy-docs.yml` for the workflow configuration.
