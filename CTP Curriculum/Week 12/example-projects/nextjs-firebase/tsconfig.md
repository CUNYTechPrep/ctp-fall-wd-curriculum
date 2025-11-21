# TypeScript Configuration - tsconfig.json

**Note:** JSON files don't support comments, so this documentation is in a separate file.

## Overview

The `tsconfig.json` file configures TypeScript for this Next.js project.

## Key Settings Explained

### Compiler Options

**lib: ["dom", "dom.iterable", "esnext"]**
- Includes type definitions for browser APIs and modern JavaScript

**strict: true**
- Enables all strict type checking options
- Catches more errors at compile time

**noEmit: true**
- TypeScript doesn't output files (Next.js handles that)

**jsx: "preserve"**
- Keeps JSX as-is for Next.js to transform

**paths: { "@/*": ["./*"] }**
- Allows `import from '@/types'` instead of `'../../../types'`

### Benefits

- Catches errors before runtime
- Better autocomplete in IDEs
- Safer refactoring
- Self-documenting code

**Audio Guide:** `audio/nextjs-firebase/tsconfig.mp3`
