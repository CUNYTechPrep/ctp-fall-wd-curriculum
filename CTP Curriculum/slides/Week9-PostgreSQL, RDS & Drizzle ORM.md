---
marp: true
theme: default
paginate: true
---

# Week 9: PostgreSQL, RDS & Drizzle ORM

## Relational Databases for Web Applications

CTP Web Development Fellowship
Cohort 11

---

## Today's Agenda

1. **Review Week 8** - Authentication & DynamoDB recap
2. **SQL vs NoSQL** - When to use each
3. **PostgreSQL Fundamentals** - Relational database concepts
4. **AWS RDS** - Managed PostgreSQL service
5. **Drizzle ORM** - Type-safe database operations
6. **Database Design** - Schema, relationships, migrations
7. **Integration** - Connecting PostgreSQL to Next.js
8. **Hands-On Lab** - Building with Drizzle

---

## Learning Objectives

By the end of this week, you will be able to:

- ✅ Explain the difference between SQL and NoSQL databases
- ✅ Design relational database schemas with proper relationships
- ✅ Use Drizzle ORM to interact with PostgreSQL
- ✅ Write and run database migrations
- ✅ Understand AWS RDS as managed PostgreSQL
- ✅ Integrate PostgreSQL with Next.js API routes
- ✅ Choose appropriate database solutions for different use cases

---

## Week 8 Recap: What We Built

**Authentication System**
- ✅ Cognito user pools (sign up, sign in, sign out)
- ✅ JWT tokens and session management
- ✅ Protected routes and API endpoints

**DynamoDB Integration**
- ✅ User preferences and settings
- ✅ NoSQL data modeling
- ✅ Key-value storage patterns

**Question:** What type of data worked well in DynamoDB?

---

## The Database Landscape

```
┌─────────────────────────────────────────┐
│         Database Types                   │
├─────────────────┬───────────────────────┤
│   SQL (RDBMS)   │      NoSQL            │
├─────────────────┼───────────────────────┤
│ PostgreSQL      │ DynamoDB (Key-Value)  │
│ MySQL           │ MongoDB (Document)    │
│ Oracle          │ Cassandra (Column)    │
│ SQL Server      │ Neo4j (Graph)         │
└─────────────────┴───────────────────────┘
```

**This week:** Adding PostgreSQL to our stack!

---

## SQL vs NoSQL: Key Differences

| Aspect | SQL (PostgreSQL) | NoSQL (DynamoDB) |
|--------|------------------|------------------|
| **Schema** | Fixed, defined upfront | Flexible, dynamic |
| **Relationships** | Built-in (foreign keys) | Application-managed |
| **Queries** | Complex joins, aggregations | Simple key-based lookups |
| **Transactions** | ACID guarantees | Eventual consistency* |
| **Scaling** | Vertical (bigger server) | Horizontal (more servers) |
| **Best For** | Structured, related data | High-throughput, flexible |

*DynamoDB offers transactions but with limitations

---

## When to Use SQL vs NoSQL

### Use PostgreSQL When:
- 📊 Data has clear relationships (users → posts → comments)
- 🔍 You need complex queries and joins
- 💰 Financial data requiring ACID transactions
- 📈 Reporting and analytics
- 🎯 Data structure is well-defined

### Use DynamoDB When:
- ⚡ Need extremely high throughput
- 🔑 Simple key-value lookups
- 📱 Session storage, user preferences
- 🌍 Global distribution required
- 📊 Flexible schema needed

---

## Hybrid Approach: Best of Both Worlds

**Our Week 8 + Week 9 Stack:**

```typescript
// DynamoDB: User preferences (simple, fast)
await ddbClient.putItem({
  TableName: 'UserSettings',
  Item: { userId: '123', theme: 'dark', notifications: true }
});

// PostgreSQL: Complex relationships (structured, queryable)
await db.select({
  post: posts,
  author: users,
  comments: comments
})
  .from(posts)
  .leftJoin(users, eq(posts.userId, users.id))
  .leftJoin(comments, eq(comments.postId, posts.id));
```

**Use the right tool for each job!**

---

## PostgreSQL: The Elephant in the Room
**PostgreSQL** (aka "Postgres")
- Open source since 1996
- Most advanced open-source RDBMS
- ACID compliant
- Supports JSON, full-text search, geospatial data
- Used by Apple, Spotify, Instagram, Reddit

---

## PostgreSQL Core Concepts

### Tables
Structured data with rows and columns

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Rows
Individual records in a table

### Columns
Fields with specific data types (text, integer, boolean, timestamp, etc.)

---

## Primary Keys & Foreign Keys

### Primary Key
Uniquely identifies each row

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,  -- ← Primary key
  email VARCHAR(255)
);
```

### Foreign Key
Creates relationships between tables

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),  -- ← Foreign key
  title TEXT
);
```

---

## Relationships in SQL

### One-to-Many
One user can have many posts

```
users (1) ─────→ (many) posts
```

```sql
SELECT users.name, posts.title
FROM users
JOIN posts ON posts.user_id = users.id;
```

### Many-to-Many
Posts can have many tags, tags can have many posts

```
posts (many) ←──→ (many) tags
         ↓
   posts_tags (junction table)
```

---

## SQL Basics: CRUD Operations

### Create
```sql
INSERT INTO users (id, email, name)
VALUES ('uuid-here', 'alice@example.com', 'Alice');
```

### Read
```sql
SELECT * FROM users WHERE email = 'alice@example.com';
```

### Update
```sql
UPDATE users SET name = 'Alice Smith' WHERE id = 'uuid-here';
```

### Delete
```sql
DELETE FROM users WHERE id = 'uuid-here';
```

---

## SQL Joins: Combining Tables

### INNER JOIN
Only matching rows from both tables

```sql
SELECT users.name, posts.title
FROM users
INNER JOIN posts ON posts.user_id = users.id;
```

### LEFT JOIN
All users, even without posts

```sql
SELECT users.name, posts.title
FROM users
LEFT JOIN posts ON posts.user_id = users.id;
```

---

## AWS RDS: Managed PostgreSQL

### What is RDS?

**Amazon Relational Database Service**
- Managed database hosting service
- Runs PostgreSQL (and MySQL, MariaDB, Oracle, SQL Server)
- AWS handles operations, you handle queries

### Think of it as:
```
PostgreSQL = The database software
RDS = Managed hosting for PostgreSQL
```

Like: **WordPress** (software) vs **WordPress.com** (managed hosting)

---

## PostgreSQL vs RDS

| Feature | Self-Managed PostgreSQL | AWS RDS PostgreSQL |
|---------|------------------------|-------------------|
| Database Engine | PostgreSQL | PostgreSQL (same!) |
| Who Manages Server | You | AWS |
| Backups | You configure | Automatic |
| Updates/Patches | You apply | AWS applies |
| High Availability | You configure | Multi-AZ option |
| Monitoring | You set up | CloudWatch built-in |
| Your Code | Same | **Same!** |

**Your application code doesn't change between local and RDS!**

---

## RDS Benefits

### 🔄 Automated Backups
- Daily snapshots
- Point-in-time recovery (restore to any second!)
- Up to 35 days retention

### 📈 Easy Scaling
- Resize with a click
- Minimal downtime
- Read replicas for scaling reads

### 🛡️ Security
- Encryption at rest (data on disk)
- Encryption in transit (SSL/TLS)
- VPC isolation
- IAM authentication (no passwords!)

---

## RDS Cost Considerations

### Free Tier
- db.t3.micro instance
- 20 GB storage
- 12 months free
- **Perfect for learning!**

### Paid Instances
- db.t3.small: ~$25/month
- db.t3.medium: ~$60/month
- **Cheaper than managing yourself!**

```
Self-managed: Server ($30) + Your time (4 hrs × $50) = $230/month
RDS: $60/month + Your time (30 min × $50) = $85/month
```

---

## Local Development: PostgreSQL in Docker

### Why Docker?

✅ Same PostgreSQL as RDS, just local
✅ No installation needed
✅ Easy to reset and test
✅ Team consistency

```yaml
# docker-compose.yml
postgres:
  image: postgres:16-alpine
  ports:
    - "5432:5432"
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
    POSTGRES_DB: ctpdb
```

---

## Connection Strings: Local vs RDS

### Local Development
```
postgresql://postgres:postgres@localhost:5432/ctpdb
```

### Production (RDS)
```
postgresql://admin:pass@mydb.abc123.us-east-1.rds.amazonaws.com:5432/ctpdb
```

### The Pattern
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

**Your code stays the same - just change the connection string!**

---

## Introducing Drizzle ORM

### What is an ORM?

**Object-Relational Mapping**
- Write TypeScript instead of SQL
- Type-safe queries
- Autocompletion in VS Code
- Catch errors before runtime

### Why Drizzle?

- ⚡ Lightweight and fast
- 🎯 TypeScript-first
- 🔍 SQL-like syntax (easy to learn)
- 🛠️ Excellent migration system
- 📦 Small bundle size

---

## Drizzle vs Other ORMs

| Feature | Drizzle | Prisma | TypeORM |
|---------|---------|--------|---------|
| Type Safety | ✅ Excellent | ✅ Excellent | ⚠️ Good |
| Performance | ✅ Fast | ⚠️ Slower | ⚠️ Slower |
| SQL-like API | ✅ Yes | ❌ No | ⚠️ Partial |
| Bundle Size | ✅ Small | ❌ Large | ❌ Large |
| Learning Curve | ✅ Easy | ⚠️ Medium | ❌ Steep |

**Drizzle = Modern, fast, TypeScript-first**

---

## Drizzle Schema Definition

```typescript
// src/db/schema.ts
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  title: varchar('title', { length: 500 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

---

## Drizzle Relations

```typescript
import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));
```

**Now you can query with joins easily!**

---

## Database Connection

```typescript
// src/lib/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
```

**One connection, used throughout your app**

---

## Drizzle CRUD: Create

```typescript
import { db } from '@/lib/db';
import { users } from '@/db/schema';

// Insert a single user
const [newUser] = await db.insert(users)
  .values({
    email: 'alice@example.com',
    name: 'Alice',
  })
  .returning();

// Insert multiple users
await db.insert(users)
  .values([
    { email: 'bob@example.com', name: 'Bob' },
    { email: 'charlie@example.com', name: 'Charlie' },
  ]);
```

---

## Drizzle CRUD: Read

```typescript
import { eq } from 'drizzle-orm';

// Select all users
const allUsers = await db.select().from(users);

// Select with condition
const alice = await db.select()
  .from(users)
  .where(eq(users.email, 'alice@example.com'));

// Select specific columns
const names = await db.select({ name: users.name })
  .from(users);
```

---

## Drizzle CRUD: Update

```typescript
import { eq } from 'drizzle-orm';

// Update user
await db.update(users)
  .set({ name: 'Alice Smith' })
  .where(eq(users.id, userId));

// Update and return
const [updated] = await db.update(users)
  .set({ name: 'Alice Smith' })
  .where(eq(users.id, userId))
  .returning();
```

---

## Drizzle CRUD: Delete

```typescript
import { eq } from 'drizzle-orm';

// Delete user
await db.delete(users)
  .where(eq(users.id, userId));

// Delete and return
const [deleted] = await db.delete(users)
  .where(eq(users.id, userId))
  .returning();
```

---

## Drizzle Joins

```typescript
// Get posts with author information
const postsWithAuthors = await db.select({
  post: posts,
  author: users,
})
  .from(posts)
  .leftJoin(users, eq(posts.userId, users.id));

// Using relations (easier!)
const userWithPosts = await db.query.users.findFirst({
  where: eq(users.id, userId),
  with: {
    posts: true,
  },
});
```

---

## Database Migrations

### What are Migrations?

**Version control for your database schema**

- Track changes to database structure
- Apply changes consistently across environments
- Rollback if needed
- Team collaboration

```
Initial Schema → Add Posts Table → Add Comments → Add Indexes
   (v1)              (v2)              (v3)          (v4)
```

---

## Drizzle Migrations Workflow

### 1. Generate Migration
```bash
npm run db:generate
```

Creates migration file from schema changes:
```
drizzle/
  0000_initial_schema.sql
  0001_add_posts_table.sql
  0002_add_comments_table.sql
```

### 2. Apply Migration
```bash
npm run db:migrate
```

Runs SQL files against database

---

## Migration Example

### Step 1: Update Schema
```typescript
// Add new column to users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  bio: text('bio'), // ← New column
  createdAt: timestamp('created_at').defaultNow(),
});
```

### Step 2: Generate
```bash
npm run db:generate
# Creates: drizzle/0003_add_user_bio.sql
```

---

## Migration SQL (Generated)

```sql
-- drizzle/0003_add_user_bio.sql
ALTER TABLE "users" ADD COLUMN "bio" text;
```

### Step 3: Apply
```bash
npm run db:migrate
# Runs SQL against database
```

### Step 4: Commit
```bash
git add drizzle/
git commit -m "Add bio column to users"
```

**Everyone on your team can now run the same migration!**

---

## Database Design Best Practices

### 1. Use Meaningful Names
```typescript
// ❌ Bad
export const u = pgTable('u', { ... });

// ✅ Good
export const users = pgTable('users', { ... });
```

### 2. Always Use Primary Keys
```typescript
// ✅ Every table needs a primary key
id: uuid('id').primaryKey().defaultRandom(),
```

### 3. Use Foreign Keys for Relationships
```typescript
userId: uuid('user_id').references(() => users.id),
```

---

## Database Design Best Practices (cont.)

### 4. Add Timestamps
```typescript
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  // ...other columns...
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### 5. Use NOT NULL Appropriately
```typescript
email: varchar('email').notNull(),  // Must have value
bio: text('bio'),                   // Can be null
```

---

## Normalization: Avoiding Data Duplication

### ❌ Denormalized (Bad)
```typescript
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey(),
  title: text('title'),
  authorName: varchar('author_name'),      // ← Duplicated
  authorEmail: varchar('author_email'),    // ← Duplicated
});
```

### ✅ Normalized (Good)
```typescript
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey(),
  title: text('title'),
  userId: uuid('user_id').references(() => users.id), // ← Reference
});
```

---

## Indexes: Making Queries Fast

### Without Index
```
Query: Find user by email
Database: Scan ALL rows (slow!) 🐌
```

### With Index
```
Query: Find user by email
Database: Jump directly to row (fast!) ⚡
```

```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  // .unique() automatically creates an index!
}, (table) => ({
  emailIdx: index('email_idx').on(table.email), // Manual index
}));
```

---

## Next.js API Routes with Drizzle

### GET Route
```typescript
// app/api/posts/route.ts
import { db } from '@/lib/db';
import { posts, users } from '@/db/schema';

export async function GET() {
  const allPosts = await db.select({
    post: posts,
    author: users,
  })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id));

  return Response.json(allPosts);
}
```

---

## Next.js API Routes: POST

```typescript
// app/api/posts/route.ts
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const { title, content } = createPostSchema.parse(body);
  
  const [post] = await db.insert(posts)
    .values({ title, content, userId })
    .returning();
    
  return Response.json(post, { status: 201 });
}
```

---

## Authentication + Database Integration

### Connecting Cognito to PostgreSQL

```typescript
// app/api/profile/route.ts
import { getCurrentUser } from '@/lib/auth'; // From Week 8

export async function GET(request: Request) {
  // Get Cognito user
  const cognitoUser = await getCurrentUser(request);
  
  // Find in PostgreSQL
  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.cognitoUserId, cognitoUser.sub),
  });
  
  return Response.json(profile);
}
```

**Cognito = Authentication, PostgreSQL = User data**

---

## Transactions: All or Nothing

### Problem
```typescript
// ❌ What if second insert fails?
await db.insert(accounts).values({ userId, balance: 1000 });
await db.insert(transactions).values({ accountId, amount: 100 }); // Error!
// Account created but no transaction! 😱
```

### Solution: Transaction
```typescript
// ✅ Either both succeed or both fail
await db.transaction(async (tx) => {
  const [account] = await tx.insert(accounts)
    .values({ userId, balance: 1000 }).returning();
  await tx.insert(transactions)
    .values({ accountId: account.id, amount: 100 });
});
```

---

## Error Handling with Drizzle

```typescript
import { db } from '@/lib/db';
import { users } from '@/db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const [user] = await db.insert(users)
      .values(body)
      .returning();
      
    return Response.json(user, { status: 201 });
  } catch (error) {
    if (error.code === '23505') { // Postgres unique violation
      return Response.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
```

---

## Drizzle Studio: Visual Database Tool

```bash
npm run db:studio
```

Opens browser-based database GUI:

- 📊 View all tables and data
- ✏️ Edit data directly
- 🔍 Run queries
- 📈 Visualize relationships

**Great for debugging and exploration!**

---

## Testing with Drizzle

```typescript
// tests/db/users.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '@/lib/db';
import { users } from '@/db/schema';

describe('Users', () => {
  beforeEach(async () => {
    await db.delete(users); // Clean slate
  });

  it('creates a user', async () => {
    const [user] = await db.insert(users)
      .values({ email: 'test@example.com', name: 'Test' })
      .returning();

    expect(user.email).toBe('test@example.com');
  });
});
```

---

## Environment Setup Checklist

### ✅ Prerequisites
- [ ] Docker Desktop running
- [ ] Node.js 18+ installed
- [ ] Week 8 code working (Cognito + DynamoDB)

### ✅ Week 9 Setup
- [ ] Clone Week 9 demo repository
- [ ] Run `npm install`
- [ ] Start services: `docker-compose up -d`
- [ ] Run migrations: `npm run db:migrate`
- [ ] Start dev server: `npm run dev`

---

## Project Structure

```
demo/
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── posts/              # Post endpoints
│   │       └── comments/           # Comment endpoints
│   ├── db/
│   │   ├── schema.ts               # Drizzle schema
│   │   ├── migrate.ts              # Migration runner
│   │   └── seed.ts                 # Sample data
│   └── lib/
│       └── db.ts                   # Database connection
├── drizzle/                        # Generated migrations
│   ├── 0000_initial.sql
│   └── 0001_add_posts.sql
├── docker-compose.yml              # LocalStack + Postgres
├── drizzle.config.ts               # Drizzle configuration
└── .env.example                    # Environment template
```

---

## This Week's Demo Project

**Building a Blog Platform**

### Features
- 👤 User profiles (extending Cognito users)
- 📝 Create, read, update, delete posts
- 💬 Comments on posts
- 🔗 Relationships between users, posts, and comments
- 🔐 Authentication from Week 8
- 📊 Both DynamoDB (preferences) and PostgreSQL (posts)

### Learning Goals
- Design relational schema
- Implement CRUD with Drizzle
- Use migrations
- Join tables for complex queries

---

## Lab 1: Setup & First Migration

### Tasks (30 minutes)
1. Clone Week 9 demo repository
2. Start Docker services
3. Examine schema definitions
4. Generate and apply first migration
5. Open Drizzle Studio and explore

### Success Criteria
- ✅ PostgreSQL running in Docker
- ✅ Migrations applied successfully
- ✅ Can view tables in Drizzle Studio

---

## Lab 2: CRUD Operations

### Tasks (45 minutes)
1. Create API route to create a post
2. Create API route to fetch all posts
3. Create API route to update a post
4. Create API route to delete a post
5. Test with Postman or Thunder Client

### Success Criteria
- ✅ All CRUD operations working
- ✅ Data persists in database
- ✅ Proper error handling
- ✅ TypeScript types are correct

---

## Lab 3: Relationships & Joins

### Tasks (45 minutes)
1. Add comments table to schema
2. Generate and apply migration
3. Create API route to add comment to post
4. Fetch post with all comments (using join)
5. Fetch user with all their posts and comments

### Success Criteria
- ✅ Foreign keys working
- ✅ Can join tables
- ✅ Cascading deletes configured
- ✅ Data integrity maintained

---

## Lab 4: Integration with Week 8

### Tasks (45 minutes)
1. Create user profile when Cognito user signs up
2. Link posts to Cognito user ID
3. Implement "My Posts" endpoint (user-specific)
4. Add authorization (only author can edit/delete)
5. Combine DynamoDB preferences with PostgreSQL posts

### Success Criteria
- ✅ Cognito ↔ PostgreSQL integration working
- ✅ User can only modify their own posts
- ✅ Profile created automatically on signup
- ✅ Hybrid database approach functional

---

## Common Pitfalls & Solutions

### ❌ Migration Out of Sync
```bash
# Error: "migration already applied"
# Solution: Reset database
docker-compose down -v
docker-compose up -d
npm run db:migrate
```

### ❌ Foreign Key Violations
```typescript
// Make sure parent record exists before inserting child
const [user] = await db.insert(users).values(...).returning();
await db.insert(posts).values({ userId: user.id, ... });
```

---

## Common Pitfalls & Solutions (cont.)

### ❌ Connection Pool Exhausted
```typescript
// ❌ Don't create new connection each time
function getDb() {
  return drizzle(postgres(connectionString));
}

// ✅ Reuse single connection
export const db = drizzle(postgres(connectionString));
```

### ❌ N+1 Query Problem
```typescript
// ❌ Fetches users, then posts for each user (N+1 queries)
const users = await db.select().from(users);
for (const user of users) {
  user.posts = await db.select().from(posts).where(eq(posts.userId, user.id));
}

// ✅ Single query with join
const usersWithPosts = await db.query.users.findMany({ with: { posts: true } });
```

---

## SQL Injection Prevention

### ❌ Dangerous (SQL Injection)
```typescript
// NEVER DO THIS!
const email = request.url.searchParams.get('email');
await db.execute(`SELECT * FROM users WHERE email = '${email}'`);
// Input: '; DROP TABLE users; --
```

### ✅ Safe (Parameterized)
```typescript
// Drizzle handles this automatically
const email = request.url.searchParams.get('email');
await db.select().from(users).where(eq(users.email, email));
// Input is escaped automatically ✅
```

**Drizzle protects you from SQL injection by default!**

---

## Performance Tips

### 1. Use Indexes
```typescript
export const posts = pgTable('posts', {
  // ...columns...
}, (table) => ({
  userIdx: index('user_idx').on(table.userId),
  createdIdx: index('created_idx').on(table.createdAt),
}));
```

### 2. Limit Results
```typescript
// ❌ Returns entire table
const posts = await db.select().from(posts);

// ✅ Paginate
const posts = await db.select().from(posts).limit(10).offset(page * 10);
```

---

## Performance Tips (cont.)

### 3. Select Only Needed Columns
```typescript
// ❌ Fetches everything
const users = await db.select().from(users);

// ✅ Only needed fields
const emails = await db.select({ email: users.email }).from(users);
```

### 4. Use Transactions for Multiple Operations
```typescript
await db.transaction(async (tx) => {
  await tx.insert(users).values(userData);
  await tx.insert(profiles).values(profileData);
  await tx.insert(settings).values(settingsData);
});
```

---

## Debugging Drizzle Queries

### Enable Query Logging
```typescript
// src/lib/db.ts
export const db = drizzle(client, {
  schema,
  logger: true, // ← Logs all SQL queries to console
});
```

### Manual SQL Inspection
```typescript
const query = db.select().from(users).where(eq(users.id, userId));

// See the SQL that will be executed
console.log(query.toSQL());
// { sql: 'SELECT * FROM users WHERE id = $1', params: ['uuid'] }
```

---

## Seeding the Database

```typescript
// src/db/seed.ts
import { db } from '@/lib/db';
import { users, posts } from './schema';

async function seed() {
  // Create users
  const [alice, bob] = await db.insert(users).values([
    { email: 'alice@example.com', name: 'Alice' },
    { email: 'bob@example.com', name: 'Bob' },
  ]).returning();

  // Create posts
  await db.insert(posts).values([
    { userId: alice.id, title: 'Hello World', content: '...' },
    { userId: bob.id, title: 'PostgreSQL Rocks', content: '...' },
  ]);
  
  console.log('✅ Database seeded!');
}

seed();
```

---

## Deploying to Production

### Local Development
```
PostgreSQL in Docker → Your app
```

### Production
```
AWS RDS PostgreSQL → Your app on Vercel/AWS
```

### Migration Process
1. Create RDS instance in AWS Console
2. Update `DATABASE_URL` environment variable
3. Run migrations: `npm run db:migrate`
4. Deploy application
5. **Database connection string is the only change!**

---

## Week 9 Deliverables

### Due Next Week

1. **Database Schema**
   - At least 3 related tables
   - Proper foreign keys and relationships
   - Migration files committed

2. **API Routes**
   - CRUD operations for main resources
   - Join queries for related data
   - Proper error handling

3. **Documentation**
   - ERD (Entity Relationship Diagram)
   - API endpoint documentation
   - Setup instructions

---

## Team Project Integration

### This Week's PR Requirements

**Minimum Requirements:**
- [ ] Database schema defined with Drizzle
- [ ] Migrations created and applied
- [ ] At least 2 API routes using PostgreSQL
- [ ] Integration with Week 8 authentication
- [ ] Tests for database operations
- [ ] Documentation updated

**Recommended:**
- Seed script for development data
- Drizzle Studio screenshots in PR
- Performance considerations documented

---

## Resources

### Documentation
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [AWS RDS Guide](https://docs.aws.amazon.com/rds/)

### Tools
- [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview)
- [pgAdmin](https://www.pgadmin.org/) - Advanced PostgreSQL GUI
- [DbDiagram.io](https://dbdiagram.io/) - ERD design tool

### Learning
- [SQL Zoo](https://sqlzoo.net/) - Interactive SQL tutorial
- [PostgreSQL Exercises](https://pgexercises.com/)

---

## SQL vs NoSQL Decision Tree

```
Need complex queries & joins? ──────────→ PostgreSQL
         │
         ↓ No
High throughput key-value? ─────────────→ DynamoDB
         │
         ↓ No
Clear relational structure? ────────────→ PostgreSQL
         │
         ↓ No
Need ACID transactions? ────────────────→ PostgreSQL
         │
         ↓ No
Flexible schema important? ─────────────→ DynamoDB
```

**Remember: You can use both!**

---

## Week 8 + Week 9 Architecture

```
┌─────────────────────────────────────────┐
│          Your Next.js App               │
├─────────────────────────────────────────┤
│  Authentication (Cognito)               │ ← Week 8
│  User Preferences (DynamoDB)            │ ← Week 8
│  Posts & Comments (PostgreSQL)          │ ← Week 9
│  File Uploads (S3)                      │ ← Week 7
└─────────────────────────────────────────┘

Each service excels at different tasks!
```

---

## Looking Ahead: Week 10

### Final Integrations & Testing
- End-to-end testing with Playwright
- Performance optimization
- Security best practices (OWASP Top 10)
- Production deployment preparation
- Load testing and monitoring

**Building on:** Authentication (W8) + Databases (W9)

---

## Key Takeaways

### Remember These Concepts

1. **PostgreSQL is for structured, related data**
2. **RDS is managed PostgreSQL - same database, less work**
3. **Drizzle provides type-safe database operations**
4. **Migrations are version control for your schema**
5. **Use the right database for each use case**
6. **Your code doesn't change between local and RDS**
7. **Foreign keys maintain data integrity**
8. **Indexes make queries fast**

---

## Let's Build! 🚀

### Next Steps
1. Clone the demo repository
2. Start Docker services
3. Run migrations
4. Open Drizzle Studio
5. Start coding!

### Remember
- 💪 PostgreSQL is powerful but approachable
- 🎯 Drizzle makes it type-safe and fun
- 🔗 Relationships are the superpower of SQL
- 📈 Start simple, add complexity as needed

**Questions before we dive into the labs?**

---

## Thank You!

### Week 9: PostgreSQL, RDS & Drizzle ORM

**Coming up:**
- Hands-on labs with Drizzle
- Building a blog with relationships
- Integrating with Week 8 authentication
- Deploying to AWS RDS

**Let's make databases awesome! 🐘⚡**
