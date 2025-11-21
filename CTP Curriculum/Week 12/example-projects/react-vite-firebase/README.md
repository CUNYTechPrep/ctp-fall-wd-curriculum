# React + Vite + Firebase Todo Application

A client-side todo application built with React, Vite, and Firebase.

## Features

- User authentication (sign up, sign in, sign out)
- Todo CRUD operations with real-time updates
- User accessibility settings
- Profile picture uploads
- Todo file attachments
- Public feed (searchable, filterable, paginated)
- Real-time messaging
- Tags for categorization
- Single Page Application (SPA)

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Authentication:** Firebase Authentication
- **Database:** Cloud Firestore
- **Storage:** Firebase Storage
- **Real-time:** Firestore real-time listeners

## Why React + Vite?

**Benefits:**
- ✅ **Simpler** than Next.js (no SSR complexity)
- ✅ **Faster development** with Vite's HMR
- ✅ **Easier deployment** (just static files)
- ✅ **Cheaper hosting** (free tiers everywhere)
- ✅ **Great for learning** React fundamentals
- ✅ **Perfect for SPAs** and dashboards

**Use Cases:**
- Internal tools and dashboards
- Admin panels
- Authenticated web apps
- Projects where SEO doesn't matter
- Learning React/Firebase

**Trade-offs:**
- ❌ No SEO (content loads after JavaScript)
- ❌ Slower initial load than SSR
- ❌ No server-side data fetching

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project

### Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create `.env` file:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```
   Note: Must use `VITE_` prefix for Vite to expose vars

3. **Set Up Firebase:**
   - Create Firebase project
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Create Storage bucket
   - Apply security rules (see below)

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
react-vite-firebase/
├── src/
│   ├── components/       # React components
│   │   ├── todos/       # Todo-related components
│   │   ├── feed/        # Public feed components
│   │   ├── messages/    # Messaging components
│   │   └── ui/          # Shared UI components
│   ├── contexts/        # React contexts (Auth, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── lib/
│   │   └── firebase.ts  # Firebase configuration
│   ├── pages/           # Page components
│   │   ├── Landing.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Feed.tsx
│   │   └── Messages.tsx
│   ├── App.tsx          # Root component with routes
│   └── main.tsx         # Entry point
├── index.html           # HTML entry point
└── vite.config.ts       # Vite configuration
```

## Routing

Uses React Router DOM for client-side routing:

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
    <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
  </Routes>
</BrowserRouter>
```

## Firebase Security Rules

Same as Next.js + Firebase project - see that README for:
- Firestore security rules
- Storage security rules

## Building for Production

```bash
npm run build
```

Creates optimized static files in `dist/` directory.

## Deployment

### Vercel

```bash
npx vercel
```

### Netlify

```bash
npx netlify deploy --prod
```

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### GitHub Pages

1. Build the project
2. Push `dist/` to `gh-pages` branch
3. Enable GitHub Pages in repo settings

### Any Static Host

Just upload contents of `dist/` folder to:
- AWS S3 + CloudFront
- Cloudflare Pages
- Render
- Railway
- Any web server

## Vite Configuration

`vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

## Environment Variables

**Important:** Vite requires `VITE_` prefix:

```env
# ✅ Correct
VITE_FIREBASE_API_KEY=abc123

# ❌ Wrong (won't work)
FIREBASE_API_KEY=abc123
NEXT_PUBLIC_FIREBASE_API_KEY=abc123
```

Access in code:
```typescript
import.meta.env.VITE_FIREBASE_API_KEY
```

## Performance Optimization

### Code Splitting

```typescript
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))

<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

### Tree Shaking

Vite automatically removes unused code in production builds.

### Bundle Analysis

```bash
npm run build -- --mode analyze
```

## Development Experience

**Vite's Fast Refresh:**
- Instant HMR (Hot Module Replacement)
- Preserves component state
- Shows errors in browser overlay
- No full page reload

**Why Vite is Fast:**
- No bundling in development
- Uses native ES modules
- Only transforms changed files
- Optimized production builds with Rollup

## Comparison with Next.js

| Feature | React + Vite | Next.js |
|---------|-------------|---------|
| Rendering | Client-only (SPA) | SSR + SSG + CSR |
| SEO | Poor | Excellent |
| Initial Load | Slower | Faster |
| Routing | React Router | File-based |
| API Routes | No | Yes |
| Deployment | Static files | Node.js server |
| Learning Curve | Easier | Steeper |
| Hosting Cost | Free/Cheap | More expensive |

**Choose React + Vite when:**
- Building internal tools/dashboards
- SEO doesn't matter
- Want simpler architecture
- Learning React fundamentals

**Choose Next.js when:**
- SEO is important
- Need server-side rendering
- Building public-facing website
- Want API routes

## Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Firebase Documentation](https://firebase.google.com/docs)

## License

MIT
