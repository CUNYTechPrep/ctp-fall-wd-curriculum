# I DO Block 1: Cognito Authentication Setup - Detailed Guide

## Overview
Duration: 25 minutes  
Learning Target: Set up AWS Cognito User Pool in LocalStack and implement sign up/sign in functionality

## Pre-Demo Setup
- LocalStack running from Week 7 (with S3)
- Next.js project ready
- Terminal with AWS CLI configured
- VS Code open

## Demo Flow

### Part 1: Why Cognito? (3 minutes)

**Discussion starter:**
"We have a Next.js app. Users can upload files to S3. But how do we know WHO is uploading? We need authentication!"

**Show the problem:**
```typescript
// Current state: No auth
export async function POST(request: Request) {
  const file = await request.formData()
  // Anyone can upload! Security risk!
  await uploadToS3(file)
}
```

**The solution:**
```typescript
// With Cognito: Authenticated users only
export async function POST(request: Request) {
  const userId = await validateToken(request) // ← Cognito validates this
  if (!userId) return new Response('Unauthorized', { status: 401 })
  
  const file = await request.formData()
  await uploadToS3(file, userId) // Now we know who uploaded
}
```

**Key Point:** "Cognito handles all the hard stuff: password hashing, token generation, email verification, password resets. We just use it!"

### Part 2: Create Cognito User Pool (7 minutes)

#### 1. Explain User Pool Concept

**Show on whiteboard/screen:**
```
User Pool = Directory of Users

┌─────────────────────────┐
│      User Pool          │
│                         │
│  user1@email.com        │
│  user2@email.com        │
│  user3@email.com        │
│                         │
│  + Password policies    │
│  + MFA settings         │
│  + Custom attributes    │
└─────────────────────────┘
```

#### 2. Create User Pool in LocalStack

```bash
# Create the user pool
aws --endpoint-url=http://localhost:4566 \
  cognito-idp create-user-pool \
  --pool-name ExpenseTrackerUserPool \
  --policies "PasswordPolicy={MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=false}" \
  --auto-verified-attributes email \
  --username-attributes email \
  --query 'UserPool.Id' \
  --output text

# Save the output (User Pool ID)
# Example: us-east-1_abc123xyz
```

**Explain each part:**
- `MinimumLength=8` → Passwords must be 8+ characters
- `RequireUppercase=true` → Must have A-Z
- `RequireLowercase=true` → Must have a-z
- `RequireNumbers=true` → Must have 0-9
- `auto-verified-attributes email` → Users verify via email
- `username-attributes email` → Users sign in with email

**Think-aloud:**
"These settings ensure strong passwords. In LocalStack, email verification is simulated, but in production AWS it would send real emails."

#### 3. Create App Client

```bash
# Create app client (your Next.js app's credentials)
aws --endpoint-url=http://localhost:4566 \
  cognito-idp create-user-pool-client \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --client-name ExpenseTrackerWebApp \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH \
  --query 'UserPoolClient.ClientId' \
  --output text

# Save the output (Client ID)
# Example: 7abcdef1234567890
```

**Explain:**
- "App Client = Your app's credentials to access the User Pool"
- "ALLOW_USER_PASSWORD_AUTH = Users can sign in with email/password"
- "ALLOW_REFRESH_TOKEN_AUTH = Users can get new tokens without re-signing in"

#### 4. Save to Environment Variables

```bash
# Add to .env.local
cat >> .env.local << EOF

# Cognito Configuration
NEXT_PUBLIC_COGNITO_USER_POOL_ID=<YOUR_USER_POOL_ID>
NEXT_PUBLIC_COGNITO_CLIENT_ID=<YOUR_CLIENT_ID>
COGNITO_ENDPOINT=http://localhost:4566
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
EOF
```

**Show file:**
```bash
cat .env.local
```

### Part 3: Install Cognito SDK (3 minutes)

```bash
# Install AWS SDK for Cognito
npm install @aws-sdk/client-cognito-identity-provider

# Show in package.json
cat package.json | grep cognito
```

**Explain:**
"This is the official AWS SDK. Same code works for LocalStack and production AWS - just change the endpoint!"

### Part 4: Create Cognito Auth Functions (8 minutes)

#### 1. Create Cognito Client

```bash
mkdir -p lib/cognito
code lib/cognito/client.ts
```

**Type this live:**
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

**Explain:**
- "We configure the endpoint for LocalStack"
- "In production, we'd remove the endpoint line"
- "Credentials are 'test' for LocalStack - in production, use IAM roles"

#### 2. Create Sign Up Function

```bash
code lib/cognito/auth.ts
```

**Type this live:**
```typescript
// lib/cognito/auth.ts
import {
  SignUpCommand,
  InitiateAuthCommand,
  GetUserCommand
} from '@aws-sdk/client-cognito-identity-provider'
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
  
  try {
    const response = await cognitoClient.send(command)
    return {
      success: true,
      userSub: response.UserSub,
      message: 'Sign up successful! Please check your email to verify.'
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Sign up failed'
    }
  }
}
```

**Key Teaching Moments:**
- "UserSub is a unique ID for the user - like a primary key"
- "UserAttributes can include custom fields"
- "Cognito validates password strength automatically"

#### 3. Create Sign In Function

```typescript
// Add to lib/cognito/auth.ts
export async function signIn(email: string, password: string) {
  const command = new InitiateAuthCommand({
    ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    }
  })
  
  try {
    const response = await cognitoClient.send(command)
    
    if (!response.AuthenticationResult) {
      throw new Error('Authentication failed')
    }
    
    return {
      success: true,
      accessToken: response.AuthenticationResult.AccessToken,
      idToken: response.AuthenticationResult.IdToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
      expiresIn: response.AuthenticationResult.ExpiresIn
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Sign in failed'
    }
  }
}
```

**Explain the tokens:**
- "AccessToken: Used to access protected API routes"
- "IdToken: Contains user information (email, sub, etc.)"
- "RefreshToken: Used to get new tokens when they expire"
- "ExpiresIn: How long until access token expires (usually 1 hour)"

#### 4. Create Get User Function

```typescript
// Add to lib/cognito/auth.ts
export async function getUser(accessToken: string) {
  const command = new GetUserCommand({
    AccessToken: accessToken
  })
  
  try {
    const response = await cognitoClient.send(command)
    
    const attributes = response.UserAttributes?.reduce((acc, attr) => {
      if (attr.Name && attr.Value) {
        acc[attr.Name] = attr.Value
      }
      return acc
    }, {} as Record<string, string>)
    
    return {
      success: true,
      username: response.Username,
      attributes
    }
  } catch (error: any) {
    return {
      success: false,
      error: 'Invalid or expired token'
    }
  }
}
```

**Explain:**
"This validates the token and returns user info. We'll use this to protect API routes!"

### Part 5: Test with curl (4 minutes)

**Create test script:**
```bash
code scripts/test-cognito.sh
```

```bash
#!/bin/bash

# Test sign up
echo "Testing sign up..."
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'

echo "\n\nTesting sign in..."
# Test sign in
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

```bash
chmod +x scripts/test-cognito.sh
```

**Think-aloud:**
"We'll create the API routes next, but this script will help us test everything quickly."

## Common Issues & Solutions

### Issue: User Pool ID not found
```
Error: ResourceNotFoundException
```
**Solution:**
```bash
# List user pools to verify
aws --endpoint-url=http://localhost:4566 \
  cognito-idp list-user-pools --max-results 10
```

### Issue: Invalid password
```
Error: Password did not conform with policy
```
**Solution:**
"Check password has: 8+ chars, uppercase, lowercase, number"

### Issue: Client ID mismatch
```
Error: Unable to verify secret hash for client
```
**Solution:**
"Double-check NEXT_PUBLIC_COGNITO_CLIENT_ID in .env.local"

## Key Teaching Points

1. **Cognito Simplifies Auth:**
   - No password storage in your database
   - Built-in security best practices
   - Token-based authentication

2. **LocalStack = Practice AWS:**
   - Same code, different endpoint
   - Free to experiment
   - No AWS charges

3. **Tokens Are Powerful:**
   - AccessToken for API access
   - IdToken for user info
   - RefreshToken for renewals

## Think-Aloud Moments
- "Notice we never store passwords - Cognito does that securely"
- "The tokens are JWTs - they contain encrypted user data"
- "Same Cognito commands work in production - just remove endpoint!"
- "In LocalStack, email verification is automatic - in production, users get real emails"

## Wrap-up Questions
- "Why use Cognito instead of building our own auth?" (Security, features, tested)
- "What's the difference between access token and ID token?" (Access = API, ID = user info)
- "Where do we store the user's token?" (Client-side, in localStorage or cookies)

## Transition to Block 2
"Now we have authentication! Users can sign up and sign in. Next, let's create the API routes to handle sign up and sign in requests, and build a UI for users to actually use this!"
