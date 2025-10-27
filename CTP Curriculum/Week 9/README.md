# Week 9: PostgreSQL with Drizzle ORM & AWS RDS

## Learning Objectives
- Understand relational database concepts and SQL
- Set up and configure PostgreSQL locally
- Use Drizzle ORM for type-safe database operations
- Design database schemas and relationships
- Implement database migrations
- Compare SQL vs NoSQL use cases
- **Understand AWS RDS as managed PostgreSQL**
- **Deploy PostgreSQL to AWS RDS**
- Integrate PostgreSQL with Next.js API routes

## Topics Covered
1. **PostgreSQL Fundamentals**
   - SQL basics (SELECT, INSERT, UPDATE, DELETE)
   - Tables, columns, data types
   - Primary keys and foreign keys
   - Indexes for performance

2. **Drizzle ORM**
   - Type-safe schema definitions
   - Query builder
   - Migrations
   - Relations and joins

3. **AWS RDS (Managed PostgreSQL)**
   - What is RDS? (Managed service for PostgreSQL)
   - RDS vs self-hosted PostgreSQL
   - Benefits: backups, patching, scaling, monitoring
   - Security: VPC, security groups, IAM auth
   - Cost considerations

4. **Database Design**
   - Normalization
   - Relationships (one-to-many, many-to-many)
   - Indexing strategies

5. **SQL vs NoSQL**
   - When to use PostgreSQL (structured data, relationships, ACID)
   - When to use DynamoDB (key-value, high throughput, flexible schema)
   - Using both together (hybrid approach)

## Key Concept: RDS is PostgreSQL

**Important:** RDS doesn't change how you use PostgreSQL. The SQL, queries, and ORM code are identical. RDS just means:
- ✅ AWS manages the server for you
- ✅ Automatic backups and updates
- ✅ Easy scaling and monitoring
- ✅ High availability options
- ❌ You don't SSH into the server
- ❌ Costs more than self-hosted

**Your app doesn't know the difference** - it just connects to a different hostname:
```typescript
// Local development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ctpdb

// Production with RDS
DATABASE_URL=postgresql://user:pass@mydb.abc123.us-east-1.rds.amazonaws.com:5432/ctpdb
```

## Demo Project
Extending Week 8's authenticated app with PostgreSQL for structured data (posts, comments, user profiles with relationships).

**Local Development:** PostgreSQL in Docker
**Production Deployment:** AWS RDS PostgreSQL (managed service)

## Prerequisites
- Completion of Week 8 (Cognito authentication & DynamoDB)
- Understanding of TypeScript
- Docker Desktop running
- Node.js 18+

## Getting Started
See `demo/README.md` for setup instructions.

## Key Concepts

### Why PostgreSQL?
- ACID compliance for data integrity
- Complex relationships between entities
- Powerful query capabilities with SQL
- Strong consistency guarantees
- Good for structured data with clear relationships

### Why Drizzle ORM?
- Type-safe queries with TypeScript
- Lightweight and performant
- SQL-like syntax
- Excellent migration system
- Great developer experience

### What RDS Adds (vs self-managed PostgreSQL)

1. **Automated Backups** - Point-in-time recovery
2. **Automatic OS/Database Patching** - Security updates handled
3. **High Availability** - Multi-AZ deployments with automatic failover
4. **Monitoring** - CloudWatch integration
5. **Scaling** - Easy vertical/horizontal scaling
6. **Security** - VPC isolation, encryption at rest, IAM authentication
7. **Read Replicas** - For scaling reads

### Week 9 Focus

Let me update the materials to clarify what we're actually teaching:

### [README.md](vscode-remote://codespaces/workspaces/ctp-fall-wd-curriculum/CTP%20Curriculum/Week%209/README.md)

Clarify RDS vs PostgreSQL distinction.
