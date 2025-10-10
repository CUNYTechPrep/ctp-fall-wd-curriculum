# I DO Block 1: LocalStack Setup Demo Details

## Demo Overview
Instructor demonstrates setting up LocalStack with Docker and configuring basic S3 service for local development.

## Duration: 15 minutes

## Materials Needed
- Docker Desktop running
- Terminal/Command line
- Web browser
- Code editor

## Demo Steps

### Step 1: Start LocalStack (5 minutes)

1. **Create docker-compose.yml**
```yaml
version: '3.8'
services:
  localstack:
    image: localstack/localstack
    ports:
      - "4566:4566"
    environment:
      - SERVICES=s3
      - DEBUG=1
    volumes:
      - "./localstack:/tmp/localstack"
```

2. **Start LocalStack**
```bash
docker-compose up -d
```

3. **Verify Services**
```bash
curl http://localhost:4566/health
```

### Step 2: LocalStack Dashboard (5 minutes)

1. **Open Web UI**
   - Navigate to `http://localhost:4566/_localstack/health`
   - Show service status
   - Explain available services

2. **AWS CLI Configuration**
```bash
aws configure set aws_access_key_id test
aws configure set aws_secret_access_key test
aws configure set default.region us-east-1
```

### Step 3: Create S3 Bucket (5 minutes)

1. **Create Bucket via CLI**
```bash
aws --endpoint-url=http://localhost:4566 s3 mb s3://demo-uploads
```

2. **List Buckets**
```bash
aws --endpoint-url=http://localhost:4566 s3 ls
```

3. **Upload Test File**
```bash
echo "Hello LocalStack" > test.txt
aws --endpoint-url=http://localhost:4566 s3 cp test.txt s3://demo-uploads/
```

4. **Verify in Dashboard**
   - Show bucket in LocalStack UI
   - Show uploaded file

## Key Teaching Points

- **LocalStack Benefits**
  - No AWS charges during development
  - Offline development capability
  - Consistent environment across team

- **Docker Advantages**
  - Easy setup and teardown
  - Isolated environment
  - Reproducible configuration

- **Development Workflow**
  - Develop locally with LocalStack
  - Test with real AWS for production
  - Switch endpoints via environment variables

## Common Issues & Solutions

- **Port 4566 already in use**
  - Kill existing LocalStack: `docker-compose down`
  - Check for other services on port 4566

- **Docker not running**
  - Start Docker Desktop
  - Verify with `docker ps`

- **AWS CLI not found**
  - Install AWS CLI
  - Use npx aws-cli instead

## Student Questions to Anticipate

**Q: "Do we need an AWS account?"**
A: No, LocalStack emulates AWS services locally without requiring an account.

**Q: "Will this work the same as real AWS?"**
A: LocalStack aims for API compatibility, but some advanced features may differ. Always test with real AWS before production.

**Q: "Can we use this in production?"**
A: LocalStack is for development only. Use real AWS services for production.

## Next Steps
- Show students how this connects to Next.js
- Demonstrate SDK configuration
- Preview file upload implementation