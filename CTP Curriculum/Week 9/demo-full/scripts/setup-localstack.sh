#!/bin/bash

set -e

echo "🚀 Setting up LocalStack resources..."

# Wait for LocalStack to be ready
echo "⏳ Waiting for LocalStack to be ready..."
until curl -s http://localhost:4566/_localstack/health | grep -q '"dynamodb": "available"'; do
  echo "   Still waiting..."
  sleep 2
done
echo "✅ LocalStack is ready!"

# Create Cognito User Pool
echo "📝 Creating Cognito User Pool..."
USER_POOL_ID=$(aws cognito-idp create-user-pool \
  --pool-name BlogUserPool \
  --endpoint-url http://localhost:4566 \
  --region us-east-1 \
  --query 'UserPool.Id' \
  --output text)

echo "   User Pool ID: $USER_POOL_ID"

# Create Cognito User Pool Client
echo "📝 Creating Cognito User Pool Client..."
CLIENT_ID=$(aws cognito-idp create-user-pool-client \
  --user-pool-id "$USER_POOL_ID" \
  --client-name BlogClient \
  --endpoint-url http://localhost:4566 \
  --region us-east-1 \
  --query 'UserPoolClient.ClientId' \
  --output text)

echo "   Client ID: $CLIENT_ID"

# Create DynamoDB Table for user settings
echo "📝 Creating DynamoDB Table (UserSettings)..."
aws dynamodb create-table \
  --table-name UserSettings \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:4566 \
  --region us-east-1 > /dev/null

echo "   UserSettings table created"

# Create S3 Bucket for profile photos
echo "📝 Creating S3 Bucket (profile-photos)..."
aws s3 mb s3://profile-photos \
  --endpoint-url http://localhost:4566 \
  --region us-east-1

# Set CORS for S3 bucket
cat > /tmp/cors-config.json << EOF
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": []
    }
  ]
}
EOF

aws s3api put-bucket-cors \
  --bucket profile-photos \
  --cors-configuration file:///tmp/cors-config.json \
  --endpoint-url http://localhost:4566 \
  --region us-east-1

echo "   S3 bucket created and configured"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
  echo "📝 Creating .env.local file..."
  cat > .env.local << EOF
NODE_ENV=development
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test

NEXT_PUBLIC_COGNITO_USER_POOL_ID=$USER_POOL_ID
NEXT_PUBLIC_COGNITO_CLIENT_ID=$CLIENT_ID
COGNITO_ENDPOINT=http://localhost:4566

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ctpdb

DYNAMODB_ENDPOINT=http://localhost:4566
DYNAMODB_TABLE_NAME=UserSettings

S3_ENDPOINT=http://localhost:4566
S3_BUCKET_NAME=profile-photos
NEXT_PUBLIC_S3_URL=http://localhost:4566

NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
  echo "   .env.local created"
else
  echo "⚠️  .env.local already exists, skipping creation"
fi

echo ""
echo "✨ LocalStack setup complete!"
echo ""
echo "📋 Summary:"
echo "   User Pool ID: $USER_POOL_ID"
echo "   Client ID: $CLIENT_ID"
echo "   DynamoDB Table: UserSettings"
echo "   S3 Bucket: profile-photos"
echo ""
echo "🎯 Next steps:"
echo "   1. Run: npm run db:migrate"
echo "   2. Run: npm run db:seed"
echo "   3. Run: npm run dev"
