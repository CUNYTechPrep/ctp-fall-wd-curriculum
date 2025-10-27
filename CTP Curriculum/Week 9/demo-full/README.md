# Week 9 Full Demo: Blog Platform with PostgreSQL

A complete Next.js application demonstrating PostgreSQL, Drizzle ORM, and AWS RDS integration with authentication from Week 8.

## Features

- ✅ User authentication with AWS Cognito (from Week 8)
- ✅ User preferences in DynamoDB (from Week 8)
- ✅ Blog posts stored in PostgreSQL
- ✅ Comments with relationships
- ✅ User profiles extending Cognito
- ✅ Protected routes and API endpoints
- ✅ Type-safe database operations with Drizzle ORM
- ✅ Database migrations
- ✅ Local development with Docker

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: AWS Cognito
- **NoSQL**: DynamoDB (user preferences)
- **SQL**: PostgreSQL (posts, comments, profiles)
- **ORM**: Drizzle ORM
- **Local Dev**: LocalStack + Docker PostgreSQL

## Quick Start

### Prerequisites

- Docker Desktop running
- Node.js 18+
- AWS CLI (for LocalStack)

### Installation

```bash
# Install dependencies
npm install

# Start services (LocalStack + PostgreSQL)
docker-compose up -d

# Setup AWS resources (Cognito, DynamoDB, S3)
./scripts/setup-localstack.sh

# Run database migrations
npm run db:migrate

# Seed database with sample data (optional)
npm run db:seed

# Start development server
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
demo-full/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (protected)/
│   │   │   ├── dashboard/
│   │   │   ├── posts/
│   │   │   └── profile/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── posts/
│   │   │   ├── comments/
│   │   │   └── profile/
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   ├── posts/
│   │   └── ui/
│   ├── db/
│   │   ├── schema.ts          # Drizzle schema
│   │   ├── migrate.ts         # Migration runner
│   │   └── seed.ts            # Seed data
│   ├── lib/
│   │   ├── auth.ts            # Cognito utilities
│   │   ├── db.ts              # Database connection
│   │   └── dynamodb.ts        # DynamoDB client
│   └── types/
├── drizzle/                   # Generated migrations
├── scripts/
│   ├── setup-localstack.sh
│   └── setup-postgres.sh
├── docker-compose.yml
├── drizzle.config.ts
└── .env.example
```

## Database Schema

### PostgreSQL Tables

#### user_profiles
- Links to Cognito user ID
- Stores display name, bio, avatar URL
- One-to-many with posts and comments

#### posts
- Blog post content
- Belongs to user
- One-to-many with comments

#### comments
- Comment content
- Belongs to user and post

### DynamoDB Tables

#### UserSettings
- Theme preferences
- Notification settings
- User-specific configuration

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Sign in user
- `POST /api/auth/logout` - Sign out user
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - List all posts (paginated)
- `GET /api/posts/[id]` - Get single post with comments
- `POST /api/posts` - Create post (authenticated)
- `PUT /api/posts/[id]` - Update post (owner only)
- `DELETE /api/posts/[id]` - Delete post (owner only)

### Comments
- `POST /api/posts/[id]/comments` - Add comment (authenticated)
- `DELETE /api/comments/[id]` - Delete comment (owner only)

### Profile
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile
- `GET /api/profile/[userId]` - Get user profile by ID

### Settings
- `GET /api/settings` - Get user settings (DynamoDB)
- `PUT /api/settings` - Update settings

## Scripts

```bash
# Database
npm run db:generate      # Generate migration from schema
npm run db:migrate       # Apply migrations
npm run db:push          # Push schema (dev only)
npm run db:studio        # Open Drizzle Studio
npm run db:seed          # Seed with sample data

# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Lint code

# Docker
npm run localstack:start # Start LocalStack + PostgreSQL
npm run localstack:stop  # Stop services
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Cognito (from setup script)
NEXT_PUBLIC_COGNITO_USER_POOL_ID=
NEXT_PUBLIC_COGNITO_CLIENT_ID=
COGNITO_ENDPOINT=http://localhost:4566

# PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ctpdb

# DynamoDB
DYNAMODB_ENDPOINT=http://localhost:4566
DYNAMODB_TABLE_NAME=UserSettings

# S3
S3_ENDPOINT=http://localhost:4566
S3_BUCKET_NAME=profile-photos
NEXT_PUBLIC_S3_URL=http://localhost:4566
```

## Development Workflow

### 1. Create a New Feature

```bash
# Make schema changes
# Edit src/db/schema.ts

# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate

# Test in Drizzle Studio
npm run db:studio
```

### 2. Build API Route

```typescript
// Example: Create post endpoint
import { db } from '@/lib/db';
import { posts } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  const user = await getCurrentUser(request);
  const body = await request.json();
  
  const [post] = await db.insert(posts)
    .values({ ...body, userId: user.id })
    .returning();
    
  return Response.json(post);
}
```

### 3. Test Locally

```bash
# Start services
docker-compose up -d

# Run migrations
npm run db:migrate

# Start app
npm run dev

# Test with browser or curl
curl http://localhost:3000/api/posts
```

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- posts.test.ts

# Watch mode
npm test -- --watch
```

## Deployment

### Local → RDS Migration

1. Create RDS PostgreSQL instance in AWS Console
2. Update `DATABASE_URL` in production environment
3. Run migrations against RDS:
   ```bash
   DATABASE_URL=<rds-url> npm run db:migrate
   ```
4. Deploy Next.js app to Vercel/AWS

### Production Checklist

- [ ] RDS instance created and configured
- [ ] Security groups allow application access
- [ ] Environment variables set in deployment platform
- [ ] Migrations applied to production database
- [ ] SSL/TLS enabled for database connections
- [ ] Secrets stored in AWS Secrets Manager
- [ ] Monitoring and logging configured

## Troubleshooting

### Migrations Not Applying

```bash
# Reset database
docker-compose down -v
docker-compose up -d
npm run db:migrate
```

### LocalStack Issues

```bash
# Check services are running
docker-compose ps

# View logs
docker-compose logs localstack
docker-compose logs postgres

# Restart services
docker-compose restart
```

### Connection Issues

```bash
# Test PostgreSQL connection
psql postgresql://postgres:postgres@localhost:5432/ctpdb

# Test LocalStack
aws --endpoint-url=http://localhost:4566 dynamodb list-tables
```

## Learning Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [AWS Cognito Docs](https://docs.aws.amazon.com/cognito/)

## License

MIT - Educational purposes for CTP Fellowship
