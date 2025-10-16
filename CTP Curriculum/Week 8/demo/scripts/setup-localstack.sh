#!/bin/bash

echo "🚀 Setting up LocalStack for Week 8 Demo..."
echo ""

ENDPOINT="http://localhost:4566"

# Check if LocalStack is running
if ! curl -s $ENDPOINT > /dev/null 2>&1; then
    echo "❌ LocalStack is not running!"
    echo "Start it with: docker run -d --name localstack -p 4566:4566 -e SERVICES=cognito-idp,dynamodb,s3 localstack/localstack"
    exit 1
fi

echo "✅ LocalStack is running"
echo ""

# Create Cognito User Pool
echo "📝 Creating Cognito User Pool..."
USER_POOL_ID=$(aws --endpoint-url=$ENDPOINT \
  cognito-idp create-user-pool \
  --pool-name Week8DemoUserPool \
  --policies "PasswordPolicy={MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=false}" \
  --auto-verified-attributes email \
  --username-attributes email \
  --query 'UserPool.Id' \
  --output text 2>/dev/null)

if [ -z "$USER_POOL_ID" ]; then
    echo "❌ Failed to create User Pool"
    exit 1
fi

echo "✅ User Pool created: $USER_POOL_ID"

# Create App Client
echo "📝 Creating App Client..."
CLIENT_ID=$(aws --endpoint-url=$ENDPOINT \
  cognito-idp create-user-pool-client \
  --user-pool-id $USER_POOL_ID \
  --client-name Week8DemoWebApp \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH \
  --query 'UserPoolClient.ClientId' \
  --output text 2>/dev/null)

if [ -z "$CLIENT_ID" ]; then
    echo "❌ Failed to create App Client"
    exit 1
fi

echo "✅ App Client created: $CLIENT_ID"
echo ""

# Create DynamoDB Table
echo "📝 Creating DynamoDB Table..."
aws --endpoint-url=$ENDPOINT \
  dynamodb create-table \
  --table-name UserSettings \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=settingKey,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=settingKey,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --no-cli-pager > /dev/null 2>&1

echo "✅ DynamoDB table 'UserSettings' created"
echo ""

# Create S3 Bucket
echo "📝 Creating S3 Bucket..."
aws --endpoint-url=$ENDPOINT \
  s3 mb s3://profile-photos > /dev/null 2>&1

# Make bucket public (for demo purposes)
aws --endpoint-url=$ENDPOINT \
  s3api put-bucket-acl \
  --bucket profile-photos \
  --acl public-read > /dev/null 2>&1

echo "✅ S3 bucket 'profile-photos' created"
echo ""

# Create .env.local file
echo "📝 Creating .env.local file..."
cat > .env.local << EOF
# AWS Configuration (LocalStack)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test

# Cognito Configuration
NEXT_PUBLIC_COGNITO_USER_POOL_ID=$USER_POOL_ID
NEXT_PUBLIC_COGNITO_CLIENT_ID=$CLIENT_ID
COGNITO_ENDPOINT=http://localhost:4566

# DynamoDB Configuration
DYNAMODB_ENDPOINT=http://localhost:4566
DYNAMODB_TABLE_NAME=UserSettings

# S3 Configuration
S3_ENDPOINT=http://localhost:4566
S3_BUCKET_NAME=profile-photos
NEXT_PUBLIC_S3_URL=http://localhost:4566
EOF

echo "✅ .env.local file created"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "📋 Configuration Summary:"
echo "  User Pool ID: $USER_POOL_ID"
echo "  Client ID: $CLIENT_ID"
echo "  DynamoDB Table: UserSettings"
echo "  S3 Bucket: profile-photos"
echo ""
echo "Next steps:"
echo "  1. Run 'npm install'"
echo "  2. Run 'npm run dev'"
echo "  3. Open http://localhost:3000"
echo ""
