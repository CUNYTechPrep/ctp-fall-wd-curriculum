# Week 8: Authentication & NoSQL with DynamoDB
## Building User Systems with Cognito and DynamoDB

---

## Today's Journey

**From Static to Dynamic:**
- Week 7: File uploads with S3 + LocalStack
- **Week 8: Authentication + User Data (NoSQL)**
- Week 9: Complex Data + Relationships (SQL)

**What we're building:**
- User authentication with Cognito
- User preferences with DynamoDB
- Protected routes and user-specific data

---

## Agenda (90 minutes)

1. Recap: LocalStack from Week 7 (5 min)
2. Authentication with Cognito (25 min)
3. Authorization & Protected Routes (15 min)
4. **SQL vs NoSQL: When to Use Each** (15 min)
5. DynamoDB with DynamoDB Toolbox (25 min)
6. Building Complete User Features (10 min)
7. Q&A (5 min)

---

## Quick Recap: Week 7

**What we learned:**

✅ LocalStack runs AWS services locally  
✅ Docker command to start LocalStack  
✅ AWS CLI with `--endpoint-url`  
✅ S3 for file/image uploads  
✅ Handling file uploads in Next.js API routes  
✅ Generating presigned URLs for uploads  

**Connection pattern:**
```bash
aws --endpoint-url=http://localhost:4566 s3 ls
```

**Same pattern works for all AWS services!**

---

## Week 8: Adding User Services

```bash
# Week 7: Just S3
docker run -e SERVICES=s3 localstack/localstack

# Week 8: S3 + Auth + NoSQL
docker run -e SERVICES=s3,cognito-idp,dynamodb \
  localstack/localstack
```

**New services:**
- **Cognito**: User authentication
- **DynamoDB**: Fast user data storage

**S3 from Week 7 still available for file uploads!**

---

## Week 8 vs Week 9

### This Week: User-Centric Features
- ✅ User sign up and sign in (Cognito)
- ✅ User preferences (DynamoDB)
- ✅ Fast key-value lookups
- ✅ Flexible schema

### Next Week: Complex Data
- ✅ Expenses with categories (PostgreSQL)
- ✅ Relationships between data
- ✅ Complex queries and filtering
- ✅ Reports and analytics

**Both are important! Different tools for different jobs.**

---

## Part 1: Amazon Cognito

**What is Amazon Cognito?**

Managed authentication service:
- User sign up and sign in
- Password policies
- Email verification
- Multi-factor authentication (MFA)
- OAuth/Social login
- JWT token generation

**Why use Cognito?**
Security is hard - let AWS handle it!

---

## Why Not Roll Your Own Auth?

**Building auth yourself requires:**
❌ Secure password hashing  
❌ Salt generation  
❌ Token management  
❌ Session handling  
❌ Email verification  
❌ Password reset  
❌ Rate limiting  
❌ Security updates  

**With Cognito:**
✅ All of this is handled  
✅ Tested by millions  
✅ Compliant with standards  
✅ Free tier: 50,000 users  

---

## Cognito Concepts

### User Pool
- Directory of users
- Handles authentication
- Manages user attributes
- Issues JWT tokens

### App Client
- Your app's credentials
- Has a Client ID
- Can have a Client Secret

### Tokens
- **ID Token**: User information
- **Access Token**: API access (what we'll use)
- **Refresh Token**: Get new tokens

---

## Authentication Flow

```
1. User enters email + password
         ↓
2. Frontend sends to /api/auth/signin
         ↓
3. API calls Cognito
         ↓
4. Cognito validates credentials
         ↓
5. Cognito returns JWT tokens
         ↓
6. Frontend stores access token
         ↓
7. Frontend includes token in API requests
         ↓
8. Backend validates token with Cognito
```

---

## JWT Tokens Explained

**JWT = JSON Web Token**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Three parts (separated by dots):**
1. **Header**: Algorithm info
2. **Payload**: User data
3. **Signature**: Verification

**Key properties:**
- Stateless (server doesn't store sessions)
- Self-contained (has all info needed)
- Expiration time built-in

---

## Creating Cognito User Pool

```bash
# Create user pool
USER_POOL_ID=$(aws --endpoint-url=http://localhost:4566 \
  cognito-idp create-user-pool \
  --pool-name ExpenseTrackerUserPool \
  --policies "PasswordPolicy={MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true}" \
  --auto-verified-attributes email \
  --query 'UserPool.Id' --output text)

# Create app client
CLIENT_ID=$(aws --endpoint-url=http://localhost:4566 \
  cognito-idp create-user-pool-client \
  --user-pool-id $USER_POOL_ID \
  --client-name ExpenseTrackerClient \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH \
  --query 'UserPoolClient.ClientId' --output text)
```

---

## Installing Cognito SDK

```bash
npm install @aws-sdk/client-cognito-identity-provider
```

**Why this package?**
- Official AWS SDK v3
- TypeScript support
- Works with LocalStack
- Production-ready

---

## Cognito Client Setup

```typescript
// lib/cognito/client.ts
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'

export const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.COGNITO_ENDPOINT || 'http://localhost:4566',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
  }
})
```

---

## Sign Up Function

```typescript
// lib/cognito/auth.ts
import { SignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
import { cognitoClient } from './client'

export async function signUp(email: string, password: string) {
  const command = new SignUpCommand({
    ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: 'email', Value: email }
    ]
  })
  
  return await cognitoClient.send(command)
}
```

**Cognito validates:**
- Password strength
- Email format
- Unique username

---

## Sign In Function

```typescript
import { InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider'

export async function signIn(email: string, password: string) {
  const command = new InitiateAuthCommand({
    ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    }
  })
  
  const result = await cognitoClient.send(command)
  
  return {
    accessToken: result.AuthenticationResult?.AccessToken,
    idToken: result.AuthenticationResult?.IdToken,
    refreshToken: result.AuthenticationResult?.RefreshToken
  }
}
```

---

## Get User Info

```typescript
import { GetUserCommand } from '@aws-sdk/client-cognito-identity-provider'

export async function getUser(accessToken: string) {
  const command = new GetUserCommand({
    AccessToken: accessToken
  })
  
  const result = await cognitoClient.send(command)
  
  return {
    username: result.Username,
    attributes: result.UserAttributes?.reduce((acc, attr) => {
      if (attr.Name && attr.Value) {
        acc[attr.Name] = attr.Value
      }
      return acc
    }, {} as Record<string, string>)
  }
}
```

---

## Sign Up API Route

```typescript
// app/api/auth/signup/route.ts
import { signUp } from '@/lib/cognito/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    const result = await signUp(email, password)
    
    return NextResponse.json({ 
      success: true,
      userSub: result.UserSub
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 400 })
  }
}
```

---

## Sign In API Route

```typescript
// app/api/auth/signin/route.ts
import { signIn } from '@/lib/cognito/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    const tokens = await signIn(email, password)
    
    return NextResponse.json(tokens)
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 401 })
  }
}
```

---

## Authorization vs Authentication

**Authentication:** "Who are you?"
- Sign in with email/password
- Cognito verifies credentials
- Returns JWT token

**Authorization:** "What can you access?"
- Check JWT token on each request
- Ensure user owns the resource
- Prevent unauthorized access

**Example:**
```typescript
// Authentication: Sign in
const token = await signIn(email, password)

// Authorization: Access expenses
const expenses = await fetch('/api/expenses', {
  headers: { Authorization: `Bearer ${token}` }
})
// API checks: Does this token belong to a valid user?
// API checks: Are these the user's expenses?
```

---

## Protected API Routes

```typescript
// lib/auth/middleware.ts
export async function requireAuth(request: Request): Promise<string | Response> {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const token = authHeader.substring(7)
    const user = await getUser(token)
    return user.username // Return userId
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
```

**Always validate tokens on the server!**

---

## Using Auth Middleware

```typescript
// app/api/profile/route.ts
import { requireAuth } from '@/lib/auth/middleware'

export async function GET(request: Request) {
  const userIdOrError = await requireAuth(request)
  
  if (userIdOrError instanceof Response) {
    return userIdOrError // Return 401 error
  }
  
  const userId = userIdOrError // It's the userId string
  
  // Now safely fetch user's data
  return NextResponse.json({ userId, message: 'Protected data' })
}
```

**Pattern:** Check auth first, then proceed

---

## The Database Question

**Now users can sign in. Where do we store their data?**

Two options:
1. **SQL (PostgreSQL)** - Week 9
2. **NoSQL (DynamoDB)** - This Week

**Spoiler: We'll use BOTH!**

Let's understand when to use each.

---

## What is SQL?

**SQL = Structured Query Language**

Traditional relational databases:
- Fixed tables with columns
- Relationships between tables (JOINs)
- Complex queries
- Data integrity enforced

**Popular SQL Databases:**
- PostgreSQL ← Week 9
- MySQL
- SQLite

**Perfect for:** Expenses, orders, inventory, complex data

---

## What is NoSQL?

**NoSQL = "Not Only SQL"**

Different from traditional databases:
- Flexible schema (no fixed columns)
- Key-value or document storage
- Fast lookups by key
- Designed for specific access patterns

**Popular NoSQL Databases:**
- DynamoDB ← This Week
- MongoDB
- Redis

**Perfect for:** User preferences, settings, caching

---

## SQL vs NoSQL: Data Structure

### SQL (PostgreSQL - Week 9):
```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  description VARCHAR(255),
  amount DECIMAL(10,2),
  category VARCHAR(50),
  date TIMESTAMP
);
```
✅ Enforced structure  
✅ Relationships  
❌ Less flexible  

### NoSQL (DynamoDB - This Week):
```json
{
  "userId": "user123",
  "preferenceKey": "theme",
  "value": {
    "mode": "dark",
    "color": "blue",
    "fontSize": 16
  }
}
```
✅ Flexible structure  
✅ Easy to change  
❌ No relationships  

---

## SQL vs NoSQL: Querying

### SQL (Week 9):
```typescript
// Get food expenses over $10 from last month
const expenses = await db
  .select()
  .from(expenses)
  .where(
    and(
      eq(expenses.userId, 'user123'),
      eq(expenses.category, 'Food'),
      gt(expenses.amount, 10),
      gte(expenses.date, lastMonth)
    )
  )
  .orderBy(desc(expenses.date))
```
✅ Complex filters  
✅ Multiple conditions  
✅ Flexible queries  

### NoSQL (This Week):
```typescript
// Get user's theme preference
const { Item } = await Preference.get({
  userId: 'user123',
  preferenceKey: 'theme'
})
```
✅ Extremely fast (1-5ms)  
❌ Limited to key lookups  
❌ Can't easily filter  

---

## When to Use SQL (Week 9)

✅ **Complex Relationships**
```
Expenses → Categories → Budgets
Users → Orders → Line Items
```

✅ **Complex Queries**
```sql
SELECT category, SUM(amount), COUNT(*) 
FROM expenses 
WHERE user_id = 'user123' 
  AND date > '2024-01-01'
GROUP BY category
ORDER BY SUM(amount) DESC
```

✅ **Data Integrity**
- Foreign key constraints
- Transactions (all-or-nothing)
- Referential integrity

✅ **You Already Know SQL**

---

## When to Use NoSQL (This Week)

✅ **User-Specific Data**
```json
{
  "userId": "user123",
  "theme": "dark",
  "language": "en",
  "currency": "USD"
}
```

✅ **Fast Lookups by Key**
- "Give me user123's preferences"
- "Get session data for session456"
- No complex filtering needed

✅ **Flexible Schema**
- Different users have different preferences
- Easy to add new fields
- No migrations needed

✅ **High Speed Required**
- Session data
- Shopping carts
- Real-time features

---

## Real-World Example: E-Commerce

### Use SQL (PostgreSQL - Week 9) for:
```
✅ Products Catalog
   id | name | price | category_id

✅ Orders
   id | user_id | total | status | created_at

✅ Order Items
   id | order_id | product_id | quantity | price

✅ Inventory
   product_id | warehouse_id | quantity
```

### Use NoSQL (DynamoDB - This Week) for:
```
✅ Shopping Cart (temporary, fast)
✅ User Preferences (theme, language)
✅ Recently Viewed (fast access)
✅ Session Data (user is logged in)
```

**Different data, different needs!**

---

## Our Architecture (Week 8 + 9)

```
┌─────────────────────────────────┐
│      Next.js Application        │
└────┬──────────────┬─────────────┘
     │              │
  ┌───▼────┐    ┌───▼──────┐
  │Cognito│    │DynamoDB  │ ← Week 8
  │       │    │          │
  │Users  │    │User Prefs│  Fast lookups
  │Auth   │    │Settings  │  Flexible schema
  └───────┘    └──────────┘
                    │
               ┌────▼─────┐
               │PostgreSQL│ ← Week 9
               │          │
               │Expenses  │  Complex queries
               │Categories│  Relationships
               └──────────┘
```

**Best of both worlds!**

---

## This Week vs Next Week Data

### Week 8 (DynamoDB):
```typescript
// User preferences
{
  userId: "user123",
  preferenceKey: "theme",
  value: "dark"
}

{
  userId: "user123",
  preferenceKey: "currency",
  value: "USD"
}

// Fast: Get all preferences for user123
await Preference.query('user123')
```

### Week 9 (PostgreSQL):
```sql
-- Expenses with categories
SELECT e.*, c.name as category_name
FROM expenses e
JOIN categories c ON e.category_id = c.id
WHERE e.user_id = 'user123'
  AND e.date >= '2024-01-01'
  AND e.amount > 10
ORDER BY e.date DESC
```

**Different access patterns!**

---

## Why Not Just Use One?

**Why not just SQL for everything?**
❌ Slower for simple key lookups  
❌ Less flexible schema  
❌ Overkill for user preferences  

**Why not just NoSQL for everything?**
❌ Can't do complex queries  
❌ No JOINs or relationships  
❌ Hard to change access patterns  

**Solution: Use both!**
- SQL for business logic (expenses, orders)
- NoSQL for user data (preferences, sessions)

---

## Access Patterns Matter

### DynamoDB (This Week):
```
Design Question: "How will I access this data?"

Access Pattern 1: Get all user's preferences
Query: userId = "user123"

Access Pattern 2: Get specific preference
Query: userId = "user123" AND preferenceKey = "theme"

✅ Design around queries
✅ Optimize for known patterns
```

### PostgreSQL (Next Week):
```
Design Question: "What is my data structure?"

Structure: Expenses belong to categories
Relationships: One-to-many

✅ Design around relationships
✅ Query flexibility comes later
```

**Different mindsets for different databases!**

---

## Performance Comparison

| Operation | DynamoDB (Week 8) | PostgreSQL (Week 9) |
|-----------|-------------------|---------------------|
| Get by ID | 1-5ms | 10-50ms |
| Complex filter | Not possible | 50-200ms |
| Aggregation | Manual | 50-200ms (built-in) |
| JOIN tables | Not possible | 100-500ms |
| Scan all data | 1000ms+ (bad!) | 500-2000ms |

**Both are fast when used correctly!**

---

## Preview: Week 9

**What we'll add next week:**

```typescript
// PostgreSQL with Drizzle ORM

// Define schema with relationships
export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id').notNull(),
  description: varchar('description').notNull(),
  amount: decimal('amount').notNull(),
  categoryId: integer('category_id').references(() => categories.id)
})

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  budget: decimal('budget')
})

// Complex query with JOIN
const expensesByCategory = await db
  .select({
    category: categories.name,
    total: sum(expenses.amount),
    count: count(expenses.id)
  })
  .from(expenses)
  .leftJoin(categories, eq(expenses.categoryId, categories.id))
  .where(eq(expenses.userId, userId))
  .groupBy(categories.name)
```

**Can't do this in DynamoDB!**

---

## Making the Choice: Decision Tree

```
Is this user-specific data with simple lookups?
  └─ Yes → DynamoDB (This Week)
       Examples: preferences, settings, session

  └─ No → Does it need complex queries or relationships?
       └─ Yes → PostgreSQL (Week 9)
            Examples: expenses, orders, inventory
       
       └─ No → Could use either
            Consider: speed, flexibility, familiarity
```

---

## Key Takeaways So Far

1. **Authentication ≠ Authorization**
   - Auth: Who are you? (Cognito)
   - Authz: What can you access? (Token validation)

2. **SQL ≠ Better/Worse than NoSQL**
   - Different tools for different jobs
   - Use both!

3. **This Week: NoSQL (DynamoDB)**
   - User preferences and settings
   - Fast key-value lookups
   - Flexible schema

4. **Next Week: SQL (PostgreSQL)**
   - Business data (expenses)
   - Complex queries
   - Relationships

---

## Now: DynamoDB Deep Dive

Let's build with DynamoDB:
- Understand key concepts (partition key, sort key)
- Set up DynamoDB in LocalStack
- Use DynamoDB Toolbox for TypeScript
- Store user preferences
- Build user-specific features

**Next slide: What is DynamoDB?**

---

## Part 2: DynamoDB with DynamoDB Toolbox

**What is DynamoDB?**

- NoSQL database by AWS
- Key-value and document store
- Single-digit millisecond latency (1-5ms!)
- Automatically scales
- Serverless (no servers to manage)
- Pay per request

**Perfect for:**
- User preferences
- Session data
- Shopping carts
- Real-time data

---

## DynamoDB vs PostgreSQL

### PostgreSQL (RDS):
```sql
SELECT * FROM expenses 
WHERE user_id = 'user123' 
  AND category = 'Food' 
  AND amount > 10
ORDER BY date DESC;
```
✅ Complex queries  
✅ Multiple conditions  
❌ Slower at scale  

### DynamoDB:
```
Get item where:
  userId = 'user123'
  AND preferenceKey = 'theme'
```
✅ Extremely fast  
✅ Auto-scaling  
❌ Limited query flexibility  

---

## DynamoDB Key Concepts

### Primary Key
Every item must have a unique primary key

**Two types:**

1. **Partition Key only** (simple)
   - Example: `userId`
   
2. **Partition Key + Sort Key** (composite)
   - Example: `userId` + `preferenceKey`

**We'll use composite keys for flexibility**

---

## Partition Key Explained

**Partition Key determines data distribution**

```
User "user123" → Server A
User "user456" → Server B
User "user789" → Server A
```

**Why it matters:**
- DynamoDB distributes data across servers
- Same partition key = same server
- Fast lookups within a partition

**Rule:** Partition key should have many unique values

---

## Sort Key Explained

**Sort Key allows range queries within a partition**

```
Partition: userId = "user123"
├─ Sort: preferenceKey = "language" → "en"
├─ Sort: preferenceKey = "theme" → "dark"
└─ Sort: preferenceKey = "timezone" → "PST"
```

**Benefits:**
- Query all preferences for a user
- Order results by sort key
- Range queries (begins_with, between)

---

## DynamoDB Table Design

**Our UserPreferences table:**

```
Primary Key:
  Partition Key: userId (string)
  Sort Key: preferenceKey (string)

Attributes:
  value (map/object)
  updatedAt (string)
```

**Example items:**
```json
{
  "userId": "user123",
  "preferenceKey": "theme",
  "value": { "mode": "dark", "color": "blue" },
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

## Creating DynamoDB Table

```bash
aws --endpoint-url=http://localhost:4566 \
  dynamodb create-table \
  --table-name UserPreferences \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=preferenceKey,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=preferenceKey,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

**Key points:**
- `AttributeType=S` means String
- `KeyType=HASH` = Partition Key
- `KeyType=RANGE` = Sort Key
- `PAY_PER_REQUEST` = No capacity planning

---

## DynamoDB Toolbox: Why?

**Without Toolbox (raw AWS SDK):**
```typescript
await client.send(new PutItemCommand({
  TableName: 'UserPreferences',
  Item: {
    userId: { S: 'user123' },
    preferenceKey: { S: 'theme' },
    value: { M: { mode: { S: 'dark' } } }
  }
}))
// Verbose, error-prone, no types
```

**With Toolbox:**
```typescript
await Preference.put({
  userId: 'user123',
  preferenceKey: 'theme',
  value: { mode: 'dark' }
})
// Clean, typed, simple
```

---

## Installing DynamoDB Toolbox

```bash
# AWS SDK v3
npm install @aws-sdk/client-dynamodb
npm install @aws-sdk/lib-dynamodb

# DynamoDB Toolbox
npm install dynamodb-toolbox
```

**Three parts:**
1. **client-dynamodb** - Low-level client
2. **lib-dynamodb** - Document client (easier)
3. **dynamodb-toolbox** - TypeScript wrapper

---

## DynamoDB Client Setup

```typescript
// lib/dynamodb/client.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:4566',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
  }
})

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true
  }
})
```

---

## Defining Entities with Toolbox

```typescript
// lib/dynamodb/entities.ts
import { Entity, Table } from 'dynamodb-toolbox'
import { docClient } from './client'

export const PreferencesTable = new Table({
  name: 'UserPreferences',
  partitionKey: 'userId',
  sortKey: 'preferenceKey',
  DocumentClient: docClient
})

export const Preference = new Entity({
  name: 'Preference',
  attributes: {
    userId: { partitionKey: true, type: 'string' },
    preferenceKey: { sortKey: true, type: 'string' },
    value: { type: 'map' },
    updatedAt: { 
      type: 'string', 
      default: () => new Date().toISOString() 
    }
  },
  table: PreferencesTable
})
```

---

## DynamoDB Toolbox Operations

### Put (Create/Update)
```typescript
await Preference.put({
  userId: 'user123',
  preferenceKey: 'theme',
  value: { mode: 'dark', color: 'blue' }
})
```

### Get (Read)
```typescript
const { Item } = await Preference.get({
  userId: 'user123',
  preferenceKey: 'theme'
})
```

### Query (Multiple items)
```typescript
const { Items } = await Preference.query('user123')
```

### Delete
```typescript
await Preference.delete({
  userId: 'user123',
  preferenceKey: 'theme'
})
```

---

## Integrating Auth + DynamoDB

**Complete User Flow:**

```
1. User signs up with Cognito
         ↓
2. User signs in → Gets JWT token
         ↓
3. User changes theme preference
         ↓
4. Frontend sends token + preference to API
         ↓
5. API validates token → gets userId
         ↓
6. API stores in DynamoDB: { userId, preferenceKey: "theme", value: "dark" }
         ↓
7. On next load, API fetches preference from DynamoDB
         ↓
8. Frontend applies theme
```

**User-specific, fast, and secure!**

---

## Week 8 Complete Architecture

```
┌──────────────────────────────────┐
│      Next.js Application         │
│  ┌──────────┐  ┌─────────────┐  │
│  │  Pages   │  │ API Routes  │  │
│  │          │  │             │  │
│  │ Sign Up  │  │ Auth APIs   │  │
│  │ Sign In  │  │ Pref APIs   │  │
│  │Dashboard │  │             │  │
│  └──────────┘  └─────────────┘  │
└───────┬──────────────┬───────────┘
        │              │
    ┌───▼────┐    ┌───▼──────┐
    │Cognito │    │DynamoDB  │
    │        │    │          │
    │Users   │    │User Prefs│
    │Tokens  │    │Settings  │
    └────────┘    └──────────┘
         └──────────┴──────────┘
             LocalStack
```

---

## What We Built This Week

✅ User authentication with Cognito  
✅ Sign up and sign in flows  
✅ JWT token management  
✅ Protected API routes  
✅ Authorization middleware  
✅ DynamoDB for user preferences  
✅ Type-safe NoSQL operations  
✅ Complete user preference system  

**Next week: Add PostgreSQL for expense data!**

---

## Homework Assignment

**Add Authentication & User Preferences:**

**Required:**
1. Implement Cognito authentication
2. Create sign up and sign in pages
3. Set up DynamoDB for preferences
4. Store at least 3 preferences (theme, currency, defaultCategory)
5. Protect all API routes with auth
6. Create user-specific dashboard

**Bonus:**
- Email verification
- Password reset flow
- Multiple preference categories
- Preference history/audit

**Due:** Before Week 9

---

## Next Week: PostgreSQL

**What's coming:**

✅ Relational database concepts  
✅ PostgreSQL with Drizzle ORM  
✅ Schema design and migrations  
✅ Complex queries and JOINs  
✅ Aggregations and reports  
✅ Combining SQL and NoSQL  

**Your Cognito + DynamoDB work carries forward!**

---

## Comparing Week 8 & 9

### Week 8 (Today):
```typescript
// Fast, simple lookups
const theme = await Preference.get({
  userId: 'user123',
  preferenceKey: 'theme'
})
```

### Week 9 (Next):
```typescript
// Complex queries
const report = await db
  .select({
    category: categories.name,
    total: sum(expenses.amount)
  })
  .from(expenses)
  .leftJoin(categories, eq(expenses.categoryId, categories.id))
  .where(
    and(
      eq(expenses.userId, 'user123'),
      gte(expenses.date, startDate)
    )
  )
  .groupBy(categories.name)
```

**Different databases, different superpowers!**

---

## Key Takeaways

1. **Authentication is crucial**
   - Use managed services (Cognito)
   - Don't roll your own
   - Always validate on server

2. **Authorization protects resources**
   - Check tokens on every request
   - Extract userId from token
   - Never trust client

3. **NoSQL for user data**
   - DynamoDB for preferences
   - Fast key-value lookups
   - Flexible schema

4. **SQL for business data (next week)**
   - PostgreSQL for expenses
   - Complex queries
   - Relationships

5. **Use both together**
   - Right tool for right job
   - Common in production

---

## Resources

### Documentation:
- [AWS Cognito](https://docs.aws.amazon.com/cognito/)
- [DynamoDB Toolbox](https://dynamodb-toolbox.com/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [LocalStack](https://docs.localstack.cloud/)

### Tutorials:
- [Cognito Auth Flow](https://www.youtube.com/watch?v=oFSU6rhUkrA)
- [DynamoDB Modeling](https://www.youtube.com/watch?v=HaEPXoXVf2k)
- [JWT Tokens Explained](https://www.youtube.com/watch?v=7Q17ubqLfaM)

---

## Questions?

**Topics we covered:**
- Cognito user authentication
- JWT tokens and sessions
- Protected API routes
- Authorization vs authentication
- **SQL vs NoSQL decision making**
- DynamoDB with DynamoDB Toolbox
- User preferences system

**Ready for Week 9: PostgreSQL!** 🚀

---

## Thank You!

**This week:**
1. Complete the authentication assignment
2. Build user preferences with DynamoDB
3. Protect your API routes
4. Think about what data needs SQL vs NoSQL

**Next week:**
We add PostgreSQL for expense data!

**See you next week!**

---
