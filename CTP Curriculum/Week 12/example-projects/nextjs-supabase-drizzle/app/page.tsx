/**
 * REF: landing-page-file
 *
 * # Landing Page - Drizzle ORM Project
 *
 * Home page showcasing the Drizzle + Supabase combination.
 *
 * ## Purpose
 *
 * - Marketing/landing page for the todo application
 * - Showcases the tech stack (Next.js, Supabase, Drizzle ORM)
 * - Provides navigation to authentication pages
 * - Displays feature highlights
 *
 * ## Architecture Decision
 *
 * This page is a **Server Component** (Next.js 15 default):
 * - No client-side JavaScript needed
 * - Rendered at build time (Static Generation)
 * - Optimal performance and SEO
 * - Perfect for landing pages with no interactivity
 *
 * ## Tech Stack
 *
 * | `Technology` | Purpose | `Why` |
 * |------------|---------|-----|
 * | Next.js 15 | `Framework` | App Router, Server Components |
 * | `Supabase` | `Backend` | Auth, Storage, Real-time |
 * | Drizzle ORM | `Database` | Type-safe queries |
 * | `PostgreSQL` | `Database` | Production-ready SQL |
 * | `TypeScript` | `Language` | Type safety |
 */

import Link from 'next/link'
// CLOSE: landing-page-file

/**
 * REF: home-component
 *
 * ## Home Component
 *
 * Server Component for landing page.
 *
 * ### Component Type
 *
 * - **Server Component** - No 'use client' directive
 * - **Static Generation** - Rendered at build time
 * - **Zero JavaScript** - No client-side interactivity
 */
export default function Home() {
  /**
   * REF: landing-page-layout
   *
   * ## Landing Page Layout
   *
   * Centered full-height layout with hero section.
   *
   * ### Layout Classes
   *
   * - `flex min-h-screen` - Full viewport height flexbox
   * - `flex-col items-center justify-center` - Vertical centering
   * - `p-24` - Large padding
   */
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* CLOSE: landing-page-layout */}

      {/**
       * REF: hero-section
       *
       * ## Hero Section
       *
       * Main content container with constrained width.
       */}
      <div className="max-w-2xl text-center">
        {/* CLOSE: hero-section */}

        {/**
         * REF: hero-title
         *
         * ## Hero Title
         *
         * Large, bold heading to grab attention.
         */}
        <h1 className="text-5xl font-bold mb-6">
          Welcome to Todo App
        </h1>
        {/* CLOSE: hero-title */}

        {/**
         * REF: hero-subtitle
         *
         * ## Hero Subtitle
         *
         * Explains the tech stack and value proposition.
         */}
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          A type-safe todo application built with Next.js, Supabase, and Drizzle ORM
          featuring perfect TypeScript inference and SQL-like queries.
        </p>
        {/* CLOSE: hero-subtitle */}

        {/**
         * REF: cta-buttons
         *
         * ## Call-to-Action Buttons
         *
         * Sign In and Sign Up navigation links.
         *
         * ### Button Styling
         *
         * | `Button` | `Color` | Purpose |
         * |--------|-------|---------|
         * | Sign In | `Blue` | Primary action |
         * | Sign Up | `Gray` | Secondary action |
         */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/signin"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Sign Up
          </Link>
        </div>
        {/* CLOSE: cta-buttons */}

        {/**
         * REF: features-grid
         *
         * ## Features Grid
         *
         * Highlights key features of the application.
         *
         * ### Grid Layout
         *
         * - **Mobile**: 1 column (stacked)
         * - **Desktop**: 2 columns (2x2 grid)
         * - **Gap**: 1.5rem spacing
         */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/**
           * REF: feature-card-1
           *
           * ### Feature: Type-Safe Queries
           *
           * Drizzle ORM provides TypeScript inference.
           */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Type-Safe Queries</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Drizzle ORM provides perfect TypeScript inference for all database operations.
            </p>
          </div>
          {/* CLOSE: feature-card-1 */}

          {/**
           * REF: feature-card-2
           *
           * ### Feature: SQL-Like Syntax
           *
           * Familiar SQL patterns with type safety.
           */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">SQL-Like Syntax</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Write queries that look like SQL but with full type safety.
            </p>
          </div>
          {/* CLOSE: feature-card-2 */}

          {/**
           * REF: feature-card-3
           *
           * ### Feature: Supabase Auth
           *
           * Best-in-class authentication.
           */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Supabase Auth</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Best-in-class authentication and storage from Supabase.
            </p>
          </div>
          {/* CLOSE: feature-card-3 */}

          {/**
           * REF: feature-card-4
           *
           * ### Feature: Migration System
           *
           * Built-in database migrations with Drizzle Kit.
           */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Migration System</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Built-in database migrations with Drizzle Kit.
            </p>
          </div>
          {/* CLOSE: feature-card-4 */}
        </div>
        {/* CLOSE: features-grid */}

        {/**
         * REF: tech-stack-footer
         *
         * ## Tech Stack Display
         *
         * Lists all technologies used.
         */}
        <div className="mt-12 text-sm text-gray-500">
          <p>Built with Next.js 15 • Supabase • Drizzle ORM • PostgreSQL • TypeScript</p>
        </div>
        {/* CLOSE: tech-stack-footer */}
      </div>
    </main>
  )
}
// CLOSE: home-component
