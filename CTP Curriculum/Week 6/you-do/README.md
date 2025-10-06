# Week 6 - You Do: Migrate Your App to Next.js

## Overview

Migrate your existing project from Vite/React application to Next.js using the App Router.

## Assignment

**Migrate Your Expense Tracker to Next.js**

Take your existing expense tracker (or similar Vite app) and migrate it to Next.js.

**Required Migration Steps:**

✅ **Convert to Next.js project structure**
- Create new Next.js app
- Move components to appropriate locations
- Update imports and paths

✅ **File-based routing**
- Convert React Router routes to Next.js pages
- Create layouts for shared UI
- Implement dynamic routes where needed

✅ **Server vs Client Components**
- Identify which components need `'use client'`
- Keep static components as Server Components
- Move data fetching to appropriate locations

✅ **API Routes**
- Create API routes for data operations
- Move backend logic from Vite to Next.js API routes
- Update fetch calls to use new endpoints

✅ **Environment Variables**
- Convert `import.meta.env` to `process.env`
- Use `.env.local` for local development
- Prefix public variables with `NEXT_PUBLIC_`

## Migration Checklist

### 1. Setup New Next.js Project
```bash
npx create-next-app@latest expense-tracker-nextjs
cd expense-tracker-nextjs
```

### 2. Component Migration
- [ ] Copy components from Vite `src/` to Next.js `app/`
- [ ] Add `'use client'` to interactive components
- [ ] Update import paths
- [ ] Replace React Router with Next.js routing

### 3. Routing Migration
| Vite (React Router) | Next.js (App Router) |
|---------------------|----------------------|
| `<Route path="/" />` | `app/page.tsx` |
| `<Route path="/expenses" />` | `app/expenses/page.tsx` |
| `<Route path="/expenses/:id" />` | `app/expenses/[id]/page.tsx` |
| `<Link to="/expenses">` | `<Link href="/expenses">` |
| `useNavigate()` | `useRouter()` from `next/navigation` |

### 4. API Migration
- [ ] Create `app/api/expenses/route.ts`
- [ ] Create `app/api/expenses/[id]/route.ts`
- [ ] Implement GET, POST, PUT, DELETE handlers
- [ ] Update frontend fetch calls

### 5. Style Migration
- [ ] Copy CSS files
- [ ] Convert to CSS Modules if needed
- [ ] Update import statements
- [ ] Test responsive design

## Common Migration Issues

### Issue: "You're importing a component that needs useState..."
**Solution:** Add `'use client'` to the top of the file

### Issue: "window is not defined"
**Solution:** Use `useEffect` or check `typeof window !== 'undefined'`

### Issue: Environment variables not working
**Solution:** 
- Use `.env.local` (not `.env`)
- Prefix with `NEXT_PUBLIC_` for client-side access
- Restart dev server after changes

### Issue: CSS not loading
**Solution:** Import CSS in the component or layout that uses it

## Bonus Challenges

🌟 Add a dashboard page with expense statistics  
🌟 Implement server-side data fetching  
🌟 Add loading and error states  
🌟 Create a shared layout with navigation  

## Submission

1. Push your migrated code to GitHub
2. Submit:
   - GitHub repository link
   - Brief summary of migration challenges
   - Screenshots of working app

**Due:** Before Week 7

## Resources

- [Migrating from Vite](https://nextjs.org/docs/app/building-your-application/upgrading/from-vite)
- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Demo Code](../week06-nextjs-demo)

## Migration Tips

1. **Start Small**: Migrate one page at a time
2. **Test Frequently**: Run `npm run dev` after each change
3. **Use DevTools**: Check Network tab for API calls
4. **Read Errors**: Next.js error messages are helpful
5. **Reference Demo**: Look at the todo app example

## Need Help?

- Review the lesson slides
- Check the demo repository
- Ask questions in class or office hours
- Reference Next.js migration documentation

Good luck with the migration! 🚀
