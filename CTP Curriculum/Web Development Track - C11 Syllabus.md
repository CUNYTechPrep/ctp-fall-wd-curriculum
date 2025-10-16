## Program Overview

This intensive 13-week fellowship prepares computer science students for careers as professional web developers through hands-on experience with modern technologies and industry best practices. Fellows will work in teams to build and deploy a full-stack web application using React, Next.js, TypeScript, and AWS services, while learning agile development methodologies and professional collaboration skills.

## Learning Objectives

By the end of this program, fellows will be able to:

1. **Build Modern Web Applications:** Design and develop full-stack applications using React, Next.js, and TypeScript
2. **Deploy to Cloud Infrastructure:** Deploy and manage applications on AWS using services like S3, Lambda, Aurora DSQL, and DynamoDB
3. **Apply Professional Practices:** Implement agile methodologies, write comprehensive documentation, and conduct effective code reviews
4. **Collaborate Effectively:** Work in teams using Git/GitHub, manage projects, and resolve conflicts professionally
5. **Test and Maintain Code:** Write and execute tests using Vitest, implement CI/CD pipelines, and ensure code quality
6. **Integrate AI Responsibly:** Use GitHub Copilot and AI tools to enhance productivity while maintaining code understanding
7. **Present Technical Work:** Communicate technical decisions through ADRs and present projects professionally

## Program Schedule

### Phase 1: Foundations (Weeks 1-3)
- [[Week 1 Lesson Plan - Professional Development & AI-Assisted Coding]]
- [[Week 2 Lesson Plan - React Fundamentals & Project Kickoff]]
- [[Week 3 Lesson Plan - TypeScript Integration]]

### Phase 2: Core Development (Weeks 4-7)
- **Week 4:** Styling with Tailwind & Career Workshop*
- **Week 5:** Review Week
- [[Week 6 Lesson Plan - Next.js & Migration from Vite]]
- **Week 7:** CI/CD & Static Deployment

### Phase 3: Full-Stack Integration (Weeks 8-10)

- **Week 8:** Authentication & NoSQL with Cognito and DynamoDB  
  **Building on Week 7's LocalStack foundation**
  
  **Learning Objectives:**  
  - Add Cognito and DynamoDB to LocalStack setup  
  - Implement user authentication with Cognito (sign up, sign in, sign out)  
  - Understand JWT tokens and session management  
  - Implement authorization (protected routes and API endpoints)  
  - Model data in DynamoDB with DynamoDB Toolbox  
  - Build user-specific features with NoSQL  
  - Secure Next.js API routes with authentication  
  - Manage user state across the application  

  **Topics Covered:**  
  - Cognito User Pools and App Clients  
  - Sign up/sign in flows with email and password  
  - JWT tokens: access, ID, and refresh tokens  
  - Protecting API routes with authentication middleware  
  - Authorization patterns (user-owned resources)  
  - DynamoDB: partition keys, sort keys, access patterns  
  - DynamoDB Toolbox for TypeScript support  
  - NoSQL data modeling best practices  
  - When to use NoSQL vs SQL (preview of Week 9)  

  **Activities:**  
  - Extend Week 7 LocalStack with Cognito and DynamoDB  
  - Build complete authentication system  
  - Create user preferences in DynamoDB  
  - Implement protected dashboard  
  - Store user-specific data with proper authorization  
  - Build authentication context for React  

  **Deliverables:**  
  - Next.js app with Cognito authentication  
  - Sign up, sign in, sign out flows working  
  - Protected routes and API endpoints  
  - DynamoDB tables for user data (preferences, settings)  
  - User-specific features (dashboard, profile)  
  - Documentation of authentication flow  

- **Week 9:** Database Integration with PostgreSQL  
  **Adding relational database to the stack**
  
  **Topics:**  
  - PostgreSQL/RDS with Drizzle ORM  
  - Schema design and migrations  
  - Complex queries and relationships  
  - SQL vs NoSQL comparison  
  - Integrating with Week 8's authentication  

  **Activities:**  
  - Set up PostgreSQL database in LocalStack  
  - Define schemas and relationships with Drizzle ORM  
  - Implement data seeding and migration scripts  
  - Build API routes for database interactions  
  - Integrate database with authentication system  

  **Deliverables:**  
  - PostgreSQL database setup and migration scripts  
  - API routes for CRUD operations  
  - Integration of database with Next.js app  
  - Documentation of database design and API  

- **Week 10:** Final Integrations and Testing  
  **Polishing the application**
  
  **Topics:**  
  - Integrating frontend and backend components  
  - End-to-end testing strategies  
  - Performance optimization techniques  
  - Security best practices (OWASP Top Ten)  
  - Preparing for production deployment  

  **Activities:**  
  - Conduct end-to-end testing of the application  
  - Optimize performance (database queries, API responses)  
  - Review security settings and implement best practices  
  - Prepare deployment scripts and configurations  

  **Deliverables:**  
  - Fully integrated and tested application  
  - Performance and security audit report  
  - Deployment plan and scripts  

### Phase 4: Production & Deployment (Weeks 11-13)
- **Week 11:** Advanced React & Career Workshop*
- **Week 12:** Production Readiness
- **Week 13:** Production Deployment & Presentations

*Lighter weeks with 1-hour career workshops


### Weekly Deliverables
- **Every Two Weeks from Week 4 through 12:** At least one meaningful PR to team repository
- **Week 2:** Project README for pitch
- **Week 5:** First test suite and testing ADR
- **Week 7:** Deployed static site with CI/CD
- **Week 9:** Database schema and migration scripts
- **Week 13:** Final deployed application and presentation

## Team Project Requirements

### Minimum Technical Requirements
- React/Next.js frontend with TypeScript
- Styled with Tailwind CSS
- Minimum 70% test coverage
- API routes or Lambda functions for backend
- PostgreSQL database with Drizzle ORM and/or DynamoDB
- Deployed to AWS with LocalStack testing
- CI/CD pipeline with GitHub Actions
- Comprehensive documentation with ADR's and README(s)

### Documentation Requirements
- README with setup instructions, architecture overview, and contribution guidelines
- Minimum 3 ADRs documenting major technical decisions
- API documentation
- Inline code comments for complex logic

## Important Dates

| Date    | Event                                  |
| ------- | -------------------------------------- |
| Week 1  | Program Kickoff, AI, and Agile Teams   |
| Week 2  | Project Pitches & Team Formation       |
| Week 4  | Career Workshop: Resume Building       |
| Week 7  | Mid-Program Check-in                   |
| Week 11 | Career Workshop: Job Search Strategies |
| Week 13 | Final Presentations & Deployment       |
