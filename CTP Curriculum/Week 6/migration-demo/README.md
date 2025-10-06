# Migration Demo: Vite to Next.js

This demo shows the **same expense tracker application** built in both Vite and Next.js, making it easy to compare and understand the migration process.

## Overview

Both apps have identical functionality:
- List of expenses
- Add new expense
- View expense details
- Edit/delete expenses
- Filter by category

**Key Difference:** No backend - all data is stored in component state (localStorage).

## Project Structure

```
migration-demo/
├── vite-expense-tracker/     # Original Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── router.tsx
│   └── package.json
│
└── nextjs-expense-tracker/   # Migrated Next.js app
    ├── app/
    │   ├── components/
    │   ├── expenses/
    │   └── layout.tsx
    └── package.json
```

## Running the Demos

### Vite Version
```bash
cd vite-expense-tracker
npm install
npm run dev
# Open http://localhost:5173
```

### Next.js Version
```bash
cd nextjs-expense-tracker
npm install
npm run dev
# Open http://localhost:3000
```

## Key Differences

| Feature | Vite | Next.js |
|---------|------|---------|
| **Routing** | React Router | File-based routing |
| **Navigation** | `<Link to="/">` | `<Link href="/">` |
| **Programmatic Nav** | `useNavigate()` | `useRouter()` |
| **Import Source** | `react-router-dom` | `next/link`, `next/navigation` |
| **Entry Point** | `main.tsx` | `layout.tsx` |
| **Client Components** | All components | Add `'use client'` |
| **Dev Server** | Port 5173 | Port 3000 |
| **Environment Vars** | `VITE_*` | `NEXT_PUBLIC_*` |

## Migration Checklist

When migrating from Vite to Next.js:

- [ ] Create new Next.js project
- [ ] Copy components to `app/components/`
- [ ] Convert pages to Next.js routes
- [ ] Add `'use client'` to interactive components
- [ ] Update imports: `react-router-dom` → `next/link`, `next/navigation`
- [ ] Update `<Link to="">` → `<Link href="">`
- [ ] Update `useNavigate()` → `useRouter()`
- [ ] Update environment variables
- [ ] Move shared layout to `layout.tsx`
- [ ] Test all routes and functionality

## Learning Points

**What stays the same:**
- React component code
- useState, useEffect hooks
- Component structure
- CSS/styling
- TypeScript types

**What changes:**
- Routing configuration
- Navigation components
- Import statements
- Project structure
- Some configuration files

## Next Steps

1. Run both apps side-by-side
2. Compare the code files
3. Note the minimal changes needed
4. Try migrating your own Vite app!
