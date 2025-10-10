# Week 7 Lesson Plan: AWS LocalStack with Next.js

## Overview

This week introduces students to LocalStack, a tool for emulating AWS services locally. Students will learn to integrate AWS S3 with Next.js for file storage and management, developing locally without cloud costs.

## Learning Objectives

By the end of this week, students will be able to:

1. Understand what LocalStack is and its benefits for development
2. Set up LocalStack with Docker for local AWS services
3. Configure Next.js applications to work with LocalStack S3
4. Implement file upload functionality using AWS SDK
5. Create API routes for S3 operations
6. List and manage files in S3 buckets
7. Understand the difference between local and production AWS configurations

## Prerequisites

- Completion of Week 6 (Next.js fundamentals)
- Docker Desktop installed
- Basic understanding of cloud storage concepts
- Familiarity with Next.js API routes

## Session Structure (60 minutes)

### Part 1: Introduction to LocalStack (10 minutes)

**Topics:**
- What is LocalStack?
- Benefits of local cloud development
- LocalStack vs real AWS
- Use cases and when to use LocalStack

**Activities:**
- Show LocalStack architecture diagram
- Demonstrate cost comparison
- Show LocalStack dashboard

**Key Points:**
- LocalStack emulates AWS services locally
- Free, offline development
- Same code works with LocalStack and real AWS
- Faster iteration and testing

### Part 2: LocalStack Setup (10 minutes)

**Topics:**
- Docker Compose configuration
- Starting LocalStack services
- Verifying service health
- Creating S3 buckets with AWS CLI

**Activities:**
- Live demo: docker-compose up
- Show health check endpoint
- Create bucket with AWS CLI
- View bucket in LocalStack dashboard

**Key Points:**
- Single port (4566) for all services
- Docker volumes for data persistence
- AWS CLI works with `--endpoint-url` flag
- LocalStack requires forcePathStyle for S3

### Part 3: Next.js AWS SDK Integration (15 minutes)

**Topics:**
- Installing AWS SDK v3
- Configuring S3 client for LocalStack
- Environment variables setup
- forcePathStyle explanation

**Activities:**
- Install @aws-sdk/client-s3
- Create lib/s3.ts configuration
- Set up .env.local
- Explain each configuration option

**Key Points:**
- AWS SDK v3 is modular and tree-shakeable
- endpoint config points to LocalStack
- forcePathStyle required for LocalStack
- Test credentials safe for local dev

### Part 4: File Upload Implementation (20 minutes)

**Topics:**
- Creating upload API route
- FormData handling in Next.js
- File to Buffer conversion
- PutObjectCommand usage
- Building upload form component
- Error handling and user feedback

**Activities:**
- Create /api/upload route
- Implement PutObjectCommand
- Build upload page with form
- Test complete upload flow
- Verify in LocalStack dashboard

**Key Points:**
- API routes handle S3 operations server-side
- FormData for file uploads
- Client components for forms
- Always provide user feedback

### Part 5: File Listing and Management (5 minutes)

**Topics:**
- ListObjectsV2Command
- Displaying file metadata
- Formatting file sizes and dates

**Activities:**
- Create /api/files route
- Build file list component
- Show complete CRUD flow

**Key Points:**
- S3 returns file metadata
- Format data for user display
- Client-side fetching with useEffect

## Demos and Code-Along

### Demo 1: LocalStack Setup (I DO - 5 minutes)

**File:** `I DO Block 1 - LocalStack Setup Demo Details.md`

1. Create docker-compose.yml
2. Start LocalStack
3. Verify health
4. Create S3 bucket
5. Show dashboard

### Demo 2: AWS SDK Integration (I DO - 10 minutes)

**File:** `I DO Block 2 - Next.js AWS SDK Integration Demo Details.md`

1. Install AWS SDK
2. Configure S3 client
3. Set environment variables
4. Create upload API route
5. Explain configuration options

### Demo 3: Complete Upload App (I DO - 15 minutes)

**File:** `I DO Block 3 - Complete File Upload Demo Details.md`

1. Build upload page
2. Test file upload
3. Create file listing API
4. Display files on home page
5. Demo complete workflow

### Practice Activity (YOU DO - Remainder of week)

**File:** `you-do/README.md`

Students build a complete file manager application with:
- File upload
- File listing
- File deletion
- Clean UI
- Error handling

## Materials Needed

### Software
- Docker Desktop
- Node.js 18+
- VS Code or preferred editor
- AWS CLI (optional but helpful)

### Files and Resources
- Docker Compose configuration
- Demo project code
- Slides presentation
- Assignment README
- Setup instructions

## Teaching Tips

### Before Class
- Test Docker and LocalStack work on teaching machine
- Have demo project ready to run
- Test all commands and scripts
- Prepare backup plan if Docker fails

### During Class
- Emphasize cost savings with LocalStack
- Show both LocalStack dashboard and AWS CLI
- Demonstrate errors and how to debug
- Compare LocalStack and real AWS configs
- Allow time for Docker/LocalStack issues

### Common Student Issues
1. **Docker not installed/running**
   - Solution: Install Docker Desktop, ensure it's running

2. **Port 4566 already in use**
   - Solution: `docker-compose down`, check for other LocalStack instances

3. **Bucket doesn't exist errors**
   - Solution: Run bucket creation command again

4. **Environment variables not loading**
   - Solution: Restart Next.js dev server, check .env.local format

5. **forcePathStyle confusion**
   - Solution: Explain path-style vs virtual-hosted URLs

## Assignment

**File Manager Application**

Students build a complete file management app with upload, list, and delete functionality.

**Due:** Before Week 8

**Submission:**
- GitHub repository
- README with setup instructions
- Screenshots or demo video
- Brief reflection on challenges

## Assessment Criteria

### Technical Implementation (70 points)
- LocalStack setup works correctly (10 points)
- File upload functionality (20 points)
- File listing with metadata (20 points)
- File deletion with confirmation (20 points)

### Code Quality (20 points)
- Clean, organized code structure
- Proper error handling
- TypeScript types used correctly
- Comments where appropriate

### User Experience (10 points)
- Clean, responsive UI
- Loading states
- Error messages
- Success feedback

## Extension Ideas

For students who finish early:
- Add file download functionality
- Implement image preview
- Add search/filter
- Multiple file upload
- Drag and drop upload
- File categories/folders
- Deploy with real AWS S3

## Resources

### Documentation
- [LocalStack Documentation](https://docs.localstack.cloud/)
- [AWS SDK v3 for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [S3 Client Docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

### Course Materials
- Week 7 Slides
- Demo project code
- I DO demo details
- YOU DO assignment

### External Resources
- LocalStack tutorials
- AWS S3 best practices
- Next.js file upload guides
- Docker Compose documentation

## Follow-up for Next Week

**Week 8 Preview:**
- Testing and quality assurance
- Unit tests with Jest
- Integration testing
- E2E testing with Playwright

**Preparation:**
- Complete file manager assignment
- Push code to GitHub
- Review testing concepts
- Install Jest and testing libraries

## Notes for Instructor

### Timing Adjustments
- If running short on time, skip file deletion and assign as homework
- If students struggling with LocalStack, provide pre-configured project
- Allow 5-10 minutes for troubleshooting Docker issues

### Differentiation
- **Advanced students:** Challenge them with bonus features
- **Struggling students:** Provide starter code with scaffolding
- **Visual learners:** Use diagrams for LocalStack architecture
- **Hands-on learners:** More time for YOU DO activities

### Success Indicators
- Students can start LocalStack independently
- Students understand why we use LocalStack
- Students can implement basic S3 operations
- Students can switch between LocalStack and real AWS
- Students grasp environment variable configuration

### Common Misconceptions
1. "LocalStack is only for S3"
   - Clarify: LocalStack supports 80+ AWS services

2. "We need AWS accounts"
   - Clarify: LocalStack works without any AWS account

3. "This only works locally"
   - Clarify: Same code works with real AWS in production

4. "LocalStack is production-ready"
   - Clarify: LocalStack is for development only

## Reflection Questions for Students

1. How does LocalStack help with development?
2. What's the difference between LocalStack and real AWS?
3. When would you use forcePathStyle?
4. How do you switch from LocalStack to real AWS?
5. What challenges did you face with file uploads?

## Additional Activities (If Time Permits)

### Activity 1: Cost Calculation
Calculate savings using LocalStack vs real AWS during development

### Activity 2: Comparison Demo
Show same code working with both LocalStack and real AWS

### Activity 3: Debugging Exercise
Intentionally break something and have students debug

### Activity 4: Performance Testing
Upload many files and observe LocalStack performance

## Success Metrics

By the end of the session, students should:
- [ ] Successfully run LocalStack locally
- [ ] Upload files to LocalStack S3
- [ ] List files from S3
- [ ] Understand S3 client configuration
- [ ] Be able to troubleshoot common issues
- [ ] Have started the file manager assignment

## License

This lesson plan is part of the CTP Web Development Curriculum.
