# Week 9 Demo: PostgreSQL & Drizzle ORM Integration

## Overview
This demo extends Week 8's authentication system by adding PostgreSQL for relational data. We'll build a blog-like feature with posts, comments, and user profiles to demonstrate relational database concepts.

## Architecture
- **Frontend**: Next.js with TypeScript
- **Auth**: AWS Cognito (from Week 8)
- **NoSQL**: DynamoDB for user preferences (from Week 8)
- **SQL**: PostgreSQL/RDS for structured data (posts, comments, profiles)
- **ORM**: Drizzle ORM
- **Local Dev**: LocalStack + PostgreSQL container

## Why Both DynamoDB and PostgreSQL?
- **DynamoDB**: User preferences, settings, session data (key-value, simple queries)
- **PostgreSQL**: Posts, comments, relationships (complex queries, joins, transactions)

This demonstrates choosing the right database for each use case.

## PostgreSQL vs AWS RDS

### What's the Difference?

**PostgreSQL** = The database software (like MySQL, MongoDB, etc.)
**AWS RDS** = Amazon's managed service that runs PostgreSQL for you

**Think of it like:**
- PostgreSQL = The restaurant's kitchen and recipes
- RDS = A meal delivery service that uses the same kitchen/recipes but handles everything

### What RDS Provides

| Feature | Self-Managed PostgreSQL | AWS RDS PostgreSQL |
|---------|------------------------|-------------------|
| Database Software | PostgreSQL | PostgreSQL (same!) |
| Server Management | You manage | AWS manages |
| Backups | You configure | Automatic |
| OS Updates | You patch | AWS patches |
| High Availability | You configure | Multi-AZ option |
| Monitoring | You set up | CloudWatch built-in |
| Scaling | Manual | Push-button |
| Cost | Server + your time | Higher $ but saves time |

### Connection Comparison

```typescript
// Local PostgreSQL (Docker)
const local = 'postgresql://postgres:postgres@localhost:5432/ctpdb';

// AWS RDS PostgreSQL (same protocol, different host)
const rds = 'postgresql://admin:password@mydb.abc123.us-east-1.rds.amazonaws.com:5432/ctpdb';

// Your Drizzle code works with BOTH - no changes needed!
import { db } from '@/lib/db';
const posts = await db.select().from(postsTable); // Works locally and on RDS
```

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Services (LocalStack + PostgreSQL)
```bash
docker-compose up -d
```

This starts:
- **LocalStack**: Mock AWS services (Cognito, DynamoDB, S3)
- **PostgreSQL**: Real PostgreSQL database (same as RDS, just local)

### 3. Setup Local AWS Resources
```bash
./scripts/setup-localstack.sh
```

### 4. Run Database Migrations
```bash
npm run db:migrate
```

### 5. Seed Database (Optional)
```bash
npm run db:seed
```

### 6. Run Development Server
```bash
npm run dev
```

## Database Commands

- `npm run db:generate` - Generate migrations from schema changes
- `npm run db:migrate` - Apply migrations to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:push` - Push schema changes (dev only, skip migrations)

## Project Structure

```
demo/
├── src/
│   ├── db/
│   │   ├── schema.ts          # Drizzle schema definitions
│   │   ├── migrate.ts         # Migration runner
│   │   └── seed.ts            # Seed data
│   ├── app/
│   │   ├── api/
│   │   │   ├── posts/         # Post CRUD endpoints
│   │   │   └── comments/      # Comment endpoints
│   │   └── posts/             # Post pages
│   └── lib/
│       └── db.ts              # Database connection
├── drizzle/                   # Generated migrations
└── scripts/
    └── setup-postgres.sh      # PostgreSQL setup
```

## Database Schema

### Posts Table
- User-generated content
- Many-to-one relationship with users
- One-to-many relationship with comments

### Comments Table
- Belongs to posts and users
- Demonstrates foreign keys and joins

### User Profiles Table
- Extended user information
- One-to-one with Cognito users

## API Endpoints

- `GET /api/posts` - List all posts
- `GET /api/posts/[id]` - Get single post with comments
- `POST /api/posts` - Create post (authenticated)
- `PUT /api/posts/[id]` - Update post (owner only)
- `DELETE /api/posts/[id]` - Delete post (owner only)
- `POST /api/posts/[id]/comments` - Add comment (authenticated)

## Environment Variables
Copy `.env.example` to `.env.local` and update values.

## Testing
```bash
npm test                  # Run all tests
npm run test:integration  # Test database operations
```

## Deploying to AWS RDS

### Option 1: AWS Console (Week 9 Demo)
1. Go to RDS in AWS Console
2. Create Database → PostgreSQL
3. Choose instance size (db.t3.micro for free tier)
4. Set master username/password
5. Configure VPC and security groups
6. Copy endpoint hostname
7. Update `DATABASE_URL` in production environment

### Option 2: Infrastructure as Code (Week 12)
We'll automate this with AWS CDK in Week 12.

### Security Best Practices for RDS

```typescript
// ❌ DON'T: Hardcode credentials
const url = 'postgresql://admin:password123@...';

// ✅ DO: Use environment variables
const url = process.env.DATABASE_URL;

// ✅ BETTER: Use AWS IAM authentication (no passwords!)
import { Signer } from '@aws-sdk/rds-signer';
const token = await signer.getAuthToken();
```

### RDS Connection Pooling

RDS has connection limits. Use connection pooling:

```typescript
// filepath: src/lib/db.ts
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, {
  max: 10, // Maximum 10 connections
  idle_timeout: 20,
  connect_timeout: 10,
});
```
