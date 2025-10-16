# I DO Block 1: RDS and Drizzle ORM Setup - Detailed Guide

## Overview
Duration: 25 minutes  
Learning Target: Set up PostgreSQL/RDS in LocalStack and integrate Drizzle ORM for type-safe database queries

## Pre-Demo Setup
- LocalStack running from Week 7 (with S3)
- Next.js project ready
- Terminal with AWS CLI configured
- VS Code open with project

## Recap from Week 7 (2 minutes)

**Quick reminder:**
"Last week we set up LocalStack for S3 static hosting. Today we're adding databases to the same LocalStack instance."

```bash
# Check if LocalStack is running
docker ps | grep localstack

# If not, start it with new services
docker stop localstack
docker rm localstack

docker run -d \
  --name localstack \
  -p 4566:4566 \
  -e SERVICES=s3,rds,dynamodb,cognito-idp \
  -e DEBUG=1 \
  localstack/localstack
```

**Key Point:** "Same endpoint (localhost:4566), just more services!"

## Demo Flow

### Part 1: Install Drizzle ORM (3 minutes)

#### 1. Explain Why Drizzle
"We could write raw SQL queries, but Drizzle gives us:
- Full TypeScript type safety
- Autocomplete in your IDE
- Automatic migrations
- Protection against SQL injection"

#### 2. Install Dependencies
```bash
# Core dependencies
npm install drizzle-orm pg

# Dev dependencies
npm install -D drizzle-kit @types/pg

# Show package.json after install
cat package.json | grep -A 2 drizzle
```

**Think-aloud:**
- "drizzle-orm is the ORM itself"
- "pg is the PostgreSQL client"
- "drizzle-kit helps with migrations"

### Part 2: Create PostgreSQL Database in LocalStack (5 minutes)

#### 1. Create RDS Instance
```bash
# Create the database
aws --endpoint-url=http://localhost:4566 rds create-db-instance \
  --db-instance-identifier expense-tracker-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password password123 \
  --allocated-storage 20

# Wait a moment and check status
aws --endpoint-url=http://localhost:4566 rds describe-db-instances
```

**Explain:**
- "This creates a PostgreSQL database in LocalStack"
- "In real AWS, this would take 5-10 minutes. In LocalStack, it's instant!"
- "The credentials are simple for local dev - in production we'd use secrets management"

#### 2. Test Connection
```bash
# LocalStack creates a database we can connect to
# Connection details:
# Host: localhost
# Port: 4566
# Database: postgres
# User: admin
# Password: password123
```

### Part 3: Define Drizzle Schema (8 minutes)

#### 1. Create Schema File
```bash
mkdir -p lib/db
code lib/db/schema.ts
```

**Type this live:**
```typescript
// lib/db/schema.ts
import { pgTable, serial, varchar, decimal, timestamp, index } from 'drizzle-orm/pg-core'

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  category: varchar('category', { length: 50 }),
  date: timestamp('date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    userIdIdx: index('user_id_idx').on(table.userId),
    dateIdx: index('date_idx').on(table.date)
  }
})

// TypeScript types inferred from schema
export type Expense = typeof expenses.$inferSelect
export type NewExpense = typeof expenses.$inferInsert
```

**Key Teaching Moments:**
- "pgTable defines the table structure"
- "serial is auto-incrementing integer - perfect for IDs"
- "decimal for money - never use float for currency!"
- "Indexes on userId and date - these are fields we'll query often"
- "The types are inferred - no need to manually write them!"

#### 2. Create Database Connection
```bash
code lib/db/index.ts
```

```typescript
// lib/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '4566'),
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password123'
})

export const db = drizzle(pool, { schema })
```

**Explain:**
- "Pool manages database connections - more efficient than creating new connections"
- "We pass the schema to get autocomplete"
- "Environment variables for easy configuration"

#### 3. Create Drizzle Config
```bash
code drizzle.config.ts
```

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: 'localhost',
    port: 4566,
    user: 'admin',
    password: 'password123',
    database: 'postgres'
  }
} satisfies Config
```

#### 4. Add Environment Variables
```bash
code .env.local
```

```bash
# Database (LocalStack RDS)
DB_HOST=localhost
DB_PORT=4566
DB_NAME=postgres
DB_USER=admin
DB_PASSWORD=password123
```

### Part 4: Run Migrations (5 minutes)

#### 1. Generate Migration
```bash
# Generate migration from schema
npx drizzle-kit generate:pg

# Show the generated SQL
cat drizzle/0000_initial.sql
```

**Show students the SQL:**
```sql
CREATE TABLE IF NOT EXISTS "expenses" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" varchar(255) NOT NULL,
  "description" varchar(255) NOT NULL,
  ...
);

CREATE INDEX IF NOT EXISTS "user_id_idx" ON "expenses" ("user_id");
```

**Explain:**
- "Drizzle generated this SQL from our TypeScript schema"
- "This is version-controlled - tracks database changes over time"
- "Each migration is numbered - 0000, 0001, etc."

#### 2. Push to Database
```bash
# Push schema to LocalStack database
npx drizzle-kit push:pg

# Success! Table created
```

**Verify:**
```bash
# Check the table exists (if you have psql)
psql -h localhost -p 4566 -U admin -d postgres \
  -c "\dt" \
  -c "SELECT * FROM expenses;"
```

### Part 5: Create API Route with Drizzle (2 minutes preview)

**Quick preview (full implementation in Block 2):**

```typescript
// app/api/expenses/route.ts
import { db } from '@/lib/db'
import { expenses } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  const userExpenses = await db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId!))
    .orderBy(desc(expenses.date))

  return NextResponse.json(userExpenses)
}
```

**Show autocomplete:**
- Type `expenses.` and show IDE autocomplete
- Try typing wrong field name - TypeScript error!
- "This is the power of Drizzle - full type safety!"

## Common Issues & Solutions

### Issue: Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:4566
```
**Solution:**
```bash
# Make sure LocalStack is running
docker ps | grep localstack

# Restart if needed
docker restart localstack
```

### Issue: Migration Fails
```
Error: relation "expenses" already exists
```
**Solution:**
```bash
# Drop and recreate (LocalStack only!)
psql -h localhost -p 4566 -U admin -d postgres \
  -c "DROP TABLE IF EXISTS expenses CASCADE;"

# Re-run migration
npx drizzle-kit push:pg
```

### Issue: TypeScript Errors
```
Cannot find module '@/lib/db'
```
**Solution:**
```typescript
// Check tsconfig.json has paths configured
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Key Teaching Points

1. **ORMs Save Time:**
   - Type safety catches errors early
   - Autocomplete speeds development
   - Migrations track changes

2. **Schema is Source of Truth:**
   - Define once in TypeScript
   - Generate SQL automatically
   - Types inferred for free

3. **LocalStack = Real AWS:**
   - Same connection pattern
   - Same queries
   - Just different endpoint

## Think-Aloud Moments
- "Notice how the schema is just TypeScript - easy to read and maintain"
- "The migration file is pure SQL - you can review exactly what's changing"
- "If we misspell a field name, TypeScript will catch it immediately"
- "This same code will work with production AWS - just change the connection details"

## Wrap-up Questions
- "What advantages does Drizzle give us over raw SQL?"
- "Why do we need migrations instead of manually creating tables?"
- "How does TypeScript help us avoid database errors?"

## Transition to Block 2
"Now that we have our database set up and our schema defined, let's build complete CRUD API routes using Drizzle. You'll see how easy it is to query and manipulate data with full type safety!"
