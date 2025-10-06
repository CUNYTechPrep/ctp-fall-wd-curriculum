# Week 6 Demo: Next.js App Router

This is a minimal demo project for Week 6, showcasing the Next.js App Router (latest stable).

## Features

- Uses the `app` directory (App Router)
- Home page (server component)
- About page (client component with state)
- Shared layout and navigation

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  layout.tsx      # Shared layout
  page.tsx        # Home page (server component)
  about/
    page.tsx      # About page (client component)
  globals.css     # Global styles
```

## Static Assets

Place static files (images, etc.) in the `public/` directory. For example, `public/vercel.svg`.

## Try It Out

- Edit `app/page.tsx` or `app/about/page.tsx` and see hot reload in action.
- Click between Home and About to see routing.
