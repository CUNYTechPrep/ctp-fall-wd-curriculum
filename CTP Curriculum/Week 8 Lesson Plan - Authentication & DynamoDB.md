### Block 4: Protected Routes & Authorization (30 minutes)

**Lecture (10 min):**
- Authentication vs Authorization
- Protecting API routes
- User-owned resources
- Common authorization patterns

**I DO - Create Auth Middleware (15 min):**

```typescript
// lib/auth/middleware.ts
import { getUser } from '@/lib/cognito/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function requireAuth(request: NextRequest): Promise<string | NextResponse> {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const token = authHeader.substring(7)
    const user = await getUser(token)
    return user.Username! // Return username/userId
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}

// Usage in API routes
// app/api/profile/route.ts
import { requireAuth } from '@/lib/auth/middleware'

export async function GET(request: Request) {
  const userIdOrError = await requireAuth(request as any)
  
  if (userIdOrError instanceof NextResponse) {
    return userIdOrError // Return error response
  }
  
  const userId = userIdOrError // It's the userId
  
  // Now fetch user-specific data
  return NextResponse.json({ userId, message: 'Protected data' })
}
```

**WE DO - Protect an API Route (5 min):**
Students add authentication to an existing API route

**Key Points:**
- "Always validate tokens on the server"
- "Never trust client-sent userId - extract from token"
- "Authorization checks user owns the resource"

### Block 5: Introduction to DynamoDB & NoSQL (25 minutes)

**Lecture (15 min):**

**What is DynamoDB?**
- NoSQL key-value and document database
- Managed by AWS (serverless)
- Extremely fast (single-digit millisecond latency)
- Automatically scales
- Pay per request

**SQL vs NoSQL: A Preview**

This week we're using NoSQL (DynamoDB). Next week we'll add SQL (PostgreSQL). Here's why we need both:

| Feature | NoSQL (DynamoDB) | SQL (PostgreSQL - Week 9) |
|---------|------------------|---------------------------|
| **Data Model** | Key-value, flexible schema | Tables with fixed schema |
| **Queries** | Simple lookups by key | Complex queries with JOINs |
| **Speed** | Extremely fast | Fast, but more overhead |
| **Relationships** | Denormalized (duplicate data) | Normalized (linked tables) |
| **Scaling** | Horizontal (automatic) | Vertical (bigger server) |
| **Best For** | User preferences, settings | Transactions, complex data |
| **Learning Curve** | Medium (think in keys) | Easier (familiar SQL) |

**When to Use DynamoDB (This Week):**
✅ User preferences and settings  
✅ Session data  
✅ Simple key-value lookups  
✅ Data that belongs to one user  
✅ Need extremely fast reads  
✅ Flexible data structure  

**When to Use PostgreSQL (Next Week):**
✅ Expenses with categories (relationships)  
✅ Transactions that span multiple records  
✅ Complex queries (filters, aggregations, sorting)  
✅ Reporting and analytics  
✅ Data that needs referential integrity  
✅ You already know SQL  

**Our Architecture (Week 8 + 9):**
```
┌─────────────────────────────────┐
│      Next.js Application        │
└────┬──────────────┬─────────────┘
     │              │
  ┌──▼────┐    ┌───▼──────┐
  │Cognito│    │DynamoDB  │ ← Week 8
  │Auth   │    │Prefs     │
  └───────┘    └──────────┘
                    │
               ┌────▼─────┐
               │PostgreSQL│ ← Week 9
               │Expenses  │
               └──────────┘
```

**Real-World Example:**
```
E-commerce Application:

DynamoDB stores:
- Shopping cart (fast access, temporary)
- User preferences (theme, language)
- Recently viewed items
- Session data

PostgreSQL stores:
- Products catalog (with categories)
- Orders (with line items)
- Inventory (with stock levels)
- Customer addresses (multiple per user)

Why both? Different access patterns, different needs!
```

**Demo Comparison (5 min):**

Show side-by-side examples:

```typescript
// DynamoDB: Get user theme preference
const { Item } = await Preference.get({
  userId: 'user123',
  preferenceKey: 'theme'
})
// Result: { userId: 'user123', preferenceKey: 'theme', value: 'dark' }
// Time: ~1-5ms

// PostgreSQL (Week 9): Get user's expenses from last month
const expenses = await db
  .select()
  .from(expenses)
  .where(
    and(
      eq(expenses.userId, 'user123'),
      gte(expenses.date, lastMonth),
      inArray(expenses.category, ['Food', 'Transport'])
    )
  )
  .orderBy(desc(expenses.date))
  .limit(50)
// Result: Array of expenses with complex filtering
// Time: ~10-50ms (still fast, but more complex query)
```

**Key Insight:**
"DynamoDB is like a super-fast filing cabinet - you need to know exactly which drawer to open. PostgreSQL is like a smart librarian - you can ask complex questions and it figures out where to look."

**Discussion (5 min):**
Ask students:
- "What data in your expense tracker needs fast lookups?" (preferences, session)
- "What data needs complex queries?" (expenses with filters, date ranges, categories)
- "Where would you store user's default currency preference?" (DynamoDB)
- "Where would you store expense transactions?" (PostgreSQL - Week 9)

**Preview Week 9:**
"Next week we'll add PostgreSQL for our expense data. You'll see how to:
- Model relationships (expenses belong to categories)
- Write complex queries (filter by date, category, amount)
- Use transactions (all-or-nothing operations)
- Generate reports (sum, group by, aggregations)

But first, let's master DynamoDB for user data!"

### Block 6: DynamoDB Setup & Data Modeling (35 minutes)

**Lecture (10 min):**

**DynamoDB Key Concepts:**

1. **Primary Key:**
   - Every item must have a unique primary key
   - Two types: Simple (partition key) or Composite (partition + sort key)

2. **Partition Key:**
   - Determines which server stores the data
   - Should have many unique values
   - Example: `userId`

3. **Sort Key:**
   - Optional, allows range queries within partition
   - Orders items within a partition
   - Example: `preferenceKey`, `timestamp`

**Our Data Model for User Preferences:**
```
Table: UserPreferences

Primary Key:
  Partition Key: userId (string)
  Sort Key: preferenceKey (string)

Attributes:
  value (map) - flexible JSON object
  updatedAt (string) - ISO timestamp

Access Pattern: "Get all preferences for a user"
Query: userId = "user123" → Returns all preferences
```

**Why this design?**
- All user preferences in one partition (fast)
- Sort key lets us get specific preference or all preferences
- Value is flexible (different preferences have different shapes)

**I DO - Set Up DynamoDB (15 min):**

1. Create DynamoDB table:
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

2. Install DynamoDB Toolbox:
```bash
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb dynamodb-toolbox
```

3. Create DynamoDB client:
```typescript
// lib/dynamodb/client.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' }
})

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true }
})
```

4. Define entity with DynamoDB Toolbox:
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
    updatedAt: { type: 'string', default: () => new Date().toISOString() }
  },
  table: PreferencesTable
})

export interface PreferenceItem {
  userId: string
  preferenceKey: string
  value: Record<string, any>
  updatedAt?: string
}
```

5. Create API routes for preferences:
```typescript
// app/api/preferences/route.ts
import { Preference } from '@/lib/dynamodb/entities'
import { requireAuth } from '@/lib/auth/middleware'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const userIdOrError = await requireAuth(request)
  if (userIdOrError instanceof NextResponse) return userIdOrError
  
  const userId = userIdOrError
  const { preferenceKey, value } = await request.json()

  await Preference.put({ userId, preferenceKey, value })
  return NextResponse.json({ success: true })
}

export async function GET(request: NextRequest) {
  const userIdOrError = await requireAuth(request)
  if (userIdOrError instanceof NextResponse) return userIdOrError
  
  const userId = userIdOrError
  const { searchParams } = new URL(request.url)
  const preferenceKey = searchParams.get('preferenceKey')

  if (preferenceKey) {
    // Get single preference
    const { Item } = await Preference.get({ userId, preferenceKey })
    return NextResponse.json(Item || null)
  } else {
    // Get all preferences for user
    const { Items } = await Preference.query(userId)
    return NextResponse.json(Items || [])
  }
}
```

**WE DO - Test Preferences API (10 min):**
- Students save a theme preference
- Retrieve all preferences
- Update a preference
- See data persists across sessions

**Key Teaching Moments:**
- "DynamoDB Toolbox gives us TypeScript safety for NoSQL"
- "Notice how fast the queries are - usually under 5ms"
- "Partition key (userId) keeps all user data together"
- "This pattern works great for user settings, but wouldn't work well for complex queries"

### Block 7: Building User Features with DynamoDB (30 minutes)

**Lecture (10 min):**

**Our User Features:**
1. **Save Preferences:**
   - Theme, language, etc.
   - Fast key-value pairs

2. **Load Preferences:**
   - On app start, load user preferences
   - Apply theme, settings

3. **Update Preferences:**
   - Change theme, update language
   - Save back to DynamoDB

4. **Delete Preferences:**
   - Reset to defaults
   - Remove from DynamoDB

**I DO - Implement Save & Load Preferences (15 min):**

1. **Save Preferences API Route:**
```typescript
// app/api/preferences/route.ts
export async function POST(request: NextRequest) {
  // ...existing code...

  await Preference.put({ userId, preferenceKey, value })
  return NextResponse.json({ success: true })
}
```

2. **Load Preferences API Route:**
```typescript
// app/api/preferences/route.ts
export async function GET(request: NextRequest) {
  // ...existing code...

  if (preferenceKey) {
    // Get single preference
    const { Item } = await Preference.get({ userId, preferenceKey })
    return NextResponse.json(Item || null)
  } else {
    // Get all preferences for user
    const { Items } = await Preference.query(userId)
    return NextResponse.json(Items || [])
  }
}
```

3. **Client-Side Code:**
```typescript
// app/preferences/page.tsx
import { useEffect } from 'react'

export default function PreferencesPage() {
  useEffect(() => {
    async function loadPreferences() {
      const response = await fetch('/api/preferences')
      const data = await response.json()
      console.log('User preferences:', data)
      
      // Apply preferences (theme, language, etc.)
    }

    loadPreferences()
  }, [])

  return <div>Preferences Page</div>
}
```

**WE DO - Implement Update & Delete Preferences (10 min):**
- Students add update and delete functions
- Test resetting preferences to defaults

**Key Teaching Moments:**
- "Notice how we never expose userId to the client - security!"
- "All user-specific data is fetched with a single query"
- "Updating preferences is just as fast - single item upsert"
- "This pattern is great for user settings, but what if we had complex data?"

### Block 8: Advanced DynamoDB: Queries & Transactions (30 minutes)

**Lecture (10 min):**

**Advanced DynamoDB Concepts:**

1. **Queries:**
   - Find items by primary key
   - Filter results with sort key or attributes
   - Example: Get all preferences for a user, filter by type

2. **Transactions:**
   - All-or-nothing operations
   - Execute multiple puts/deletes in one request
   - Example: Update user profile and preferences together

**When to Use Advanced Features:**
- Queries: When you need more than just key-value access
- Transactions: When updating related data in multiple tables

**I DO - Querying Data (10 min):**

1. **Update Data Model:**
```typescript
// lib/dynamodb/entities.ts
export const Preference = new Entity({
  name: 'Preference',
  attributes: {
    userId: { partitionKey: true, type: 'string' },
    preferenceKey: { sortKey: true, type: 'string' },
    value: { type: 'map' },
    updatedAt: { type: 'string', default: () => new Date().toISOString() },
    type: { type: 'string' } // New attribute for preference type
  },
  table: PreferencesTable
})
```

2. **Query API Route:**
```typescript
// app/api/preferences/route.ts
export async function GET(request: NextRequest) {
  // ...existing code...

  // Example: Get all theme preferences for a user
  const { Items } = await Preference.query(userId, {
    beginsWith: 'theme_' // Filter by sort key prefix
  })
  return NextResponse.json(Items || [])
}
```

3. **Client-Side Code:**
```typescript
// app/preferences/page.tsx
import { useEffect } from 'react'

export default function PreferencesPage() {
  useEffect(() => {
    async function loadPreferences() {
      const response = await fetch('/api/preferences?preferenceKey=theme_')
      const data = await response.json()
      console.log('User theme preferences:', data)
      
      // Apply theme preferences
    }

    loadPreferences()
  }, [])

  return <div>Preferences Page</div>
}
```

**WE DO - Implement Transactions (10 min):**
- Students update profile and preferences in one transaction
- Ensure data consistency across operations

**Key Teaching Moments:**
- "Queries let us find data based on attributes, not just keys"
- "Transactions are powerful for maintaining data integrity"
- "DynamoDB is flexible - use it as a document store or key-value store"
- "But remember, with great power comes great responsibility - design your data model wisely"

### Block 9: Introduction to PostgreSQL (25 minutes)

**Lecture (15 min):**

**What is PostgreSQL?**
- Relational database management system (RDBMS)
- Uses SQL (Structured Query Language)
- ACID compliant (Atomicity, Consistency, Isolation, Durability)
- Strong support for complex queries and transactions
- Extensible with custom functions and data types

**SQL vs NoSQL: The Sequel**

Last week we explored NoSQL with DynamoDB. This week, we're diving into SQL with PostgreSQL. Here's a quick comparison:

| Feature | NoSQL (DynamoDB) | SQL (PostgreSQL) |
|---------|------------------|------------------|
| **Data Model** | Key-value, document | Tables, rows, columns |
| **Schema** | Flexible, dynamic | Fixed, predefined |
| **Queries** | Simple, by key | Complex, SQL syntax |
| **Transactions** | Limited, single-table | Full support, multi-table |
| **Joins** | Not supported | Supported, powerful |
| **Best For** | Fast, simple lookups | Complex queries, reporting |
| **Scaling** | Horizontal, automatic | Vertical, manual |

**When to Use PostgreSQL:**
✅ Complex queries with multiple conditions  
✅ Joins between related data (e.g., users and orders)  
✅ Transactions that require atomicity across tables  
✅ Reporting and analytics with aggregations  
✅ Data integrity and constraints (e.g., foreign keys)  
✅ You need advanced SQL features (e.g., window functions)  

**Our Architecture (Week 9):**
```
┌─────────────────────────────────┐
│      Next.js Application        │
└────┬──────────────┬─────────────┘
     │              │
  ┌──▼────┐    ┌───▼──────┐
  │Cognito│    │PostgreSQL│
  │Auth   │    │Expenses  │
  └───────┘    └──────────┘
```

**Real-World Example:**
```
E-commerce Application:

PostgreSQL stores:
- Users (with authentication details)
- Products (with categories and prices)
- Orders (with line items and totals)
- Inventory (with stock levels)
- Shipping addresses (multiple per user)

Why PostgreSQL? Complex relationships, need for transactions, and powerful queries.
```

**Demo: Exploring PostgreSQL (5 min):**

Show basic SQL commands:

```sql
-- Create table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data
INSERT INTO users (username, password) VALUES ('john_doe', 'securepassword');

-- Query data
SELECT * FROM users WHERE username = 'john_doe';

-- Update data
UPDATE users SET password = 'newpassword' WHERE username = 'john_doe';

-- Delete data
DELETE FROM users WHERE username = 'john_doe';
```

**Key Insight:**
"PostgreSQL is like a powerful spreadsheet - you can do complex calculations, but you need to know how to write the formulas (SQL queries). DynamoDB is like a super-fast filing cabinet - you just need to know which drawer to open."

**Discussion (5 min):**
Ask students:
- "What data in our expense tracker needs complex relationships?" (users, expenses, categories)
- "Where would you store a user's authentication details?" (PostgreSQL)
- "Where would you store expense transactions?" (PostgreSQL)
- "What about user preferences?" (DynamoDB)

**Preview Week 10:**
"Next week we'll dive deeper into PostgreSQL. You'll learn how to:
- Model complex relationships (users, expenses, categories)
- Write advanced SQL queries (joins, subqueries, aggregations)
- Use transactions for data integrity
- Optimize queries for performance

But first, let's recap and solidify our understanding of DynamoDB!"

### Block 10: PostgreSQL Setup & Data Modeling (35 minutes)

**Lecture (10 min):**

**PostgreSQL Key Concepts:**

1. **Tables:**
   - Store data in rows and columns
   - Each table has a unique name within the database

2. **Schema:**
   - Defines the structure of a table (columns, types, constraints)
   - Can be modified with ALTER TABLE

3. **Primary Key:**
   - Uniquely identifies each row in a table
   - Can be a single column or a combination of columns

4. **Foreign Key:**
   - Establishes a relationship between two tables
   - References the primary key of another table

5. **Indexes:**
   - Improve the speed of data retrieval
   - Can be created on one or more columns

6. **Views:**
   - Virtual tables based on the result of a query
   - Simplify complex queries, provide security

**Our Data Model for Expenses:**
```
Table: Expenses

Primary Key:
  Partition Key: userId (string)
  Sort Key: expenseId (string)

Attributes:
  amount (number) - expense amount
  description (string) - expense description
  date (string) - ISO date string
  category (string) - expense category
  createdAt (string) - ISO timestamp

Access Pattern: "Get all expenses for a user, filter by date and category"
Query: userId = "user123" AND category = "Food" AND date >= "2023-01-01"
```

**Why this design?**
- Partition key (userId) groups all expenses for a user
- Sort key (expenseId) ensures uniqueness and allows range queries
- Attributes support filtering and reporting (date, category)

**I DO - Set Up PostgreSQL (15 min):**

1. Install PostgreSQL:
```bash
# On macOS with Homebrew
brew install postgresql

# On Ubuntu
sudo apt update
sudo apt install postgresql postgresql-contrib

# On Windows, download installer from https://www.postgresql.org/download/windows/
```

2. Start PostgreSQL service:
```bash
# macOS
brew services start postgresql

# Ubuntu
sudo service postgresql start

# Windows, use pgAdmin or start from Services management console
```

3. Create database and user:
```bash
# Switch to postgres user
sudo -i -u postgres

# Access PostgreSQL prompt
psql

# Create database
CREATE DATABASE expense_tracker;

# Create user with password
CREATE USER tracker_user WITH PASSWORD 'password';

# Grant all privileges on database to user
GRANT ALL PRIVILEGES ON DATABASE expense_tracker TO tracker_user;

# Exit PostgreSQL prompt
\q

# Switch back to regular user
exit
```

4. Connect to database:
```bash
# Connect as tracker_user
psql -U tracker_user -d expense_tracker -h localhost -W
```

5. Create expenses table:
```sql
CREATE TABLE expenses (
  userId VARCHAR(50) NOT NULL,
  expenseId SERIAL PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  category VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
);
```

6. Install PostgreSQL client for Node.js:
```bash
npm install pg
```

7. Create PostgreSQL client:
```typescript
// lib/postgres/client.ts
import { Client } from 'pg'

const client = new Client({
  user: 'tracker_user',
  host: 'localhost',
  database: 'expense_tracker',
  password: 'password',
  port: 5432,
})

client.connect()

export default client
```

8. Define Expense model:
```typescript
// lib/postgres/models/expense.ts
import client from '../client'

export async function createExpense(expense) {
  const { userId, amount, description, date, category } = expense
  const result = await client.query(
    `INSERT INTO expenses (userId, amount, description, date, category)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, amount, description, date, category]
  )
  return result.rows[0]
}

export async function getExpensesByUserId(userId) {
  const result = await client.query(
    `SELECT * FROM expenses WHERE userId = $1 ORDER BY date DESC`,
    [userId]
  )
  return result.rows
}
```

9. Create API routes for expenses:
```typescript
// app/api/expenses/route.ts
import { createExpense, getExpensesByUserId } from '@/lib/postgres/models/expense'
import { requireAuth } from '@/lib/auth/middleware'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const userIdOrError = await requireAuth(request)
  if (userIdOrError instanceof NextResponse) return userIdOrError
  
  const userId = userIdOrError
  const { amount, description, date, category } = await request.json()

  const expense = await createExpense({ userId, amount, description, date, category })
  return NextResponse.json(expense)
}

export async function GET(request: NextRequest) {
  const userIdOrError = await requireAuth(request)
  if (userIdOrError instanceof NextResponse) return userIdOrError
  
  const userId = userIdOrError
  const expenses = await getExpensesByUserId(userId)
  return NextResponse.json(expenses)
}
```

**WE DO - Test Expenses API (10 min):**
- Students create a new expense
- Retrieve all expenses
- See data persists across sessions

**Key Teaching Moments:**
- "PostgreSQL setup is more involved, but gives us powerful features"
- "SQL queries can be complex, but they're very flexible"
- "Transactions ensure data integrity, especially with related data"
- "Indexes can greatly improve query performance - but use them wisely"

### Block 11: Advanced PostgreSQL: Joins, Aggregations, & Transactions (30 minutes)

**Lecture (10 min):**

**Advanced PostgreSQL Concepts:**

1. **Joins:**
   - Combine rows from two or more tables based on a related column
   - Types: INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN

2. **Aggregations:**
   - Perform calculations on multiple rows
   - Functions: COUNT, SUM, AVG, MIN, MAX
   - GROUP BY clause to group rows

3. **Transactions:**
   - Group multiple SQL statements into a single unit
   - BEGIN, COMMIT, ROLLBACK statements
   - Ensure data integrity

**When to Use Advanced Features:**
- Joins: When you need data from multiple tables
- Aggregations: When you need summary data (e.g., totals, averages)
- Transactions: When you need atomicity across multiple operations

**I DO - Joins & Aggregations (10 min):**

1. **Update Data Model:**
```typescript
// lib/postgres/models/expense.ts
export async function getExpenseSummaryByUserId(userId) {
  const result = await client.query(
    `SELECT category, SUM(amount) as totalAmount, COUNT(*) as count
     FROM expenses WHERE userId = $1
     GROUP BY category ORDER BY totalAmount DESC`,
    [userId]
  )
  return result.rows
}
```

2. **Query API Route:**
```typescript
// app/api/expenses/route.ts
export async function GET(request: NextRequest) {
  // ...existing code...

  // Example: Get expense summary by category
  const summary = await getExpenseSummaryByUserId(userId)
  return NextResponse.json(summary)
}
```

3. **Client-Side Code:**
```typescript
// app/summary/page.tsx
import { useEffect } from 'react'

export default function SummaryPage() {
  useEffect(() => {
    async function loadSummary() {
      const response = await fetch('/api/expenses?summary=true')
      const data = await response.json()
      console.log('Expense summary:', data)
      
      // Display summary data in a chart or table
    }

    loadSummary()
  }, [])

  return <div>Summary Page</div>
}
```

**WE DO - Implement Transactions (10 min):**
- Students create a transaction that inserts an expense and updates the user's balance
- Ensure atomicity and data integrity

**Key Teaching Moments:**
- "Joins let us combine related data from multiple tables"
- "Aggregations provide powerful summary statistics with minimal effort"
- "Transactions are crucial for maintaining data integrity in complex operations"
- "PostgreSQL is a powerful tool - use it wisely and it will serve you well"

### Block 12: Course Wrap-Up & Final Project Introduction (30 minutes)

**Lecture (10 min):**

**Course Recap:**
- Week 1-2: Introduction to web development, Next.js basics
- Week 3-4: Authentication with Cognito, protecting routes
- Week 5-6: Introduction to databases, DynamoDB basics
- Week 7-8: Advanced DynamoDB: queries, transactions, data modeling
- Week 9-10: Introduction to PostgreSQL, data modeling, SQL basics
- Week 11-12: Advanced PostgreSQL: joins, aggregations, transactions

**Final Project: Expense Tracker App**

Build a full-stack expense tracker app with the following features:
- User authentication (sign up, sign in, sign out)
- User profile with settings
- Expense tracking (add, edit, delete expenses)
- Expense categorization and reporting
- Responsive design for mobile and desktop

**Project Requirements:**
- Use Next.js for the frontend
- Use DynamoDB for user preferences and settings
- Use PostgreSQL for expense data
- Implement authentication with Cognito
- Deploy the app to AWS (Amplify, Lambda, API Gateway, RDS)

**Project Timeline:**
- Week 13: Project setup, authentication, and user management
- Week 14: Expense tracking features (CRUD operations)
- Week 15: Reporting and analytics, final touches
- Week 16: Deployment and presentation

**I DO - Project Setup (15 min):**

1. **Create Next.js app:**
```bash
npx create-next-app@latest expense-tracker
cd expense-tracker
```

2. **Install dependencies:**
```bash
npm install aws-amplify @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb pg
```

3. **Set up AWS Amplify:**
```bash
amplify init
amplify add auth
amplify add api
amplify push
```

4. **Set up DynamoDB and PostgreSQL:**
- Follow previous setup instructions for DynamoDB and PostgreSQL
- Create tables and seed initial data

5. **Configure environment variables:**
```bash
# .env.local
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_DYNAMODB_TABLE=UserPreferences
NEXT_PUBLIC_POSTGRESQL_URL=postgresql://tracker_user:password@localhost:5432/expense_tracker
```

6. **Create API routes for expenses and preferences:**
- Reuse code from previous blocks
- Ensure correct integration with PostgreSQL and DynamoDB

7. **Build frontend components:**
```tsx
// app/components/ExpenseForm.tsx
import { useState } from 'react'

export default function ExpenseForm() {
  const [amount, setAmount] = useState(0)
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    // Call API to create expense
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
      </select>
      <button type="submit">Add Expense</button>
    </form>
  )
}
```

8. **Build pages:**
```tsx
// app/page.tsx
import ExpenseForm from '@/components/ExpenseForm'

export default function HomePage() {
  return (
    <div>
      <h1>Expense Tracker</h1>
      <ExpenseForm />
      {/* Display expense list and summary */}
    </div>
  )
}
```

**WE DO - Project Planning (5 min):**
- Students outline their project structure and features
- Discuss in groups and share ideas

**Key Teaching Moments:**
- "For the final project, you will apply everything you've learned"
- "Focus on building a solid foundation: authentication, data modeling, API routes"
- "Iterate on your project: build, test, refine, repeat"
- "Don't aim for perfection - aim for progress and learning"

### Block 13-16: Final Project Development & Presentations

**Lecture (5 min each block):**

**Project Development Tips:**
- Break down features into small, manageable tasks
- Prioritize core functionality first
- Use version control (Git) to track changes
- Write clean, modular, and reusable code
- Test your code thoroughly (unit tests, integration tests)
- Optimize for performance and security
- Document your code and architecture

**Project Presentation Tips:**
- Prepare a clear and concise presentation
- Explain your project goals, features, and architecture
- Demo the key functionality of your app
- Highlight the challenges you faced and how you overcame them
- Share your learning experience and future improvements

**I DO - Code Review & Feedback (10 min each block):**
- Instructors review student code and provide feedback
- Focus on code quality, best practices, and project structure

**WE DO - Project Refinement (10 min each block):**
- Students refine their projects based on feedback
- Focus on improving code quality, performance, and security

**Key Teaching Moments:**
- "The final project is your opportunity to showcase your skills and creativity"
- "Don't be afraid to experiment and try new things"
- "Seek feedback early and often - it's crucial for improvement"
- "Be proud of what you've accomplished - you've come a long way!"

### Block 17: Course Reflection & Next Steps (30 minutes)

**Lecture (10 min):**

**Course Reflection:**
- What did you enjoy most about the course?
- What was the most challenging part?
- How have your skills and knowledge improved?
- What are you most proud of accomplishing?

**Next Steps:**
- Continue building and refining your expense tracker app
- Explore advanced topics and technologies (e.g., serverless, GraphQL, TypeScript)
- Contribute to open source projects and build your portfolio
- Prepare for job interviews and technical assessments
- Never stop learning and growing as a developer

**I DO - Personal Action Plan (15 min):**
1. Reflect on your goals, strengths, and areas for improvement
2. Identify specific actions and resources to achieve your goals
3. Create a timeline and milestones to track your progress

**WE DO - Share Action Plans (5 min):**
- In pairs or small groups, share your action plans and provide feedback
- Discuss common goals, challenges, and strategies

**Key Teaching Moments:**
- "Reflection is crucial for recognizing your growth and planning your future"
- "Set realistic and achievable goals, but also challenge yourself"
- "Seek out new learning opportunities and experiences"
- "Stay curious, motivated, and passionate about technology and development"

---

# Appendix: Additional Resources

## Learning Resources
- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - JavaScript documentation and tutorials
- [React Documentation](https://reactjs.org/docs/getting-started.html) - React documentation and tutorials
- [Next.js Documentation](https://nextjs.org/docs) - Next.js documentation and tutorials
- [AWS Amplify Documentation](https://docs.amplify.aws/) - AWS Amplify documentation and tutorials
- [DynamoDB Documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html) - Amazon DynamoDB documentation
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) - PostgreSQL documentation

## Tools and Technologies
- [Node.js](https://nodejs.org/) - JavaScript runtime built on Chrome's V8 JavaScript engine
- [npm](https://www.npmjs.com/) - Package manager for JavaScript
- [AWS CLI](https://aws.amazon.com/cli/) - Command line interface for AWS
- [PostgreSQL](https://www.postgresql.org/) - Object-relational database system

## Community and Support
- [Stack Overflow](https://stackoverflow.com/) - Q&A site for programming and development issues
- [GitHub](https://github.com/) - Code hosting platform for version control and collaboration
- [AWS Developer Forums](https://forums.aws.amazon.com/) - AWS discussion forums for developers
- [Reddit - r/webdev](https://www.reddit.com/r/webdev/) - Web development community on Reddit
- [Dev.to](https://dev.to/) - Community of software developers sharing articles and tutorials

## Final Project Inspiration
- [Build a Serverless CRUD App with AWS Amplify, DynamoDB, and React](https://aws.amazon.com/getting-started/hands-on/build-serverless-crud-app-amplify-react/) - AWS tutorial for building a serverless app
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/) - Comprehensive PostgreSQL tutorial
- [DynamoDB Tutorial](https://www.dynamodbguide.com/) - Comprehensive DynamoDB tutorial