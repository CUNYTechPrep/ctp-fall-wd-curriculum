# Week 8 Demo: Authentication & User Settings with Cognito + DynamoDB

## Overview

A complete Next.js application demonstrating:
- **Authentication** with AWS Cognito
- **User preferences** stored in DynamoDB
- **Accessibility settings** (dark mode, font size, high contrast, reduced motion)
- **Profile photo** uploads to S3
- **Protected routes** with JWT validation

## Features

### Authentication
- Sign up with email/password
- Sign in with session management
- JWT token validation
- Protected API routes
- Sign out functionality

### User Settings (Accessibility)
- 🌓 **Dark/Light Mode** - Toggle theme preference
- 🔤 **Font Size** - Adjust text size (small, medium, large, x-large)
- 🎨 **High Contrast** - Increase contrast for better readability
- 🎞️ **Reduced Motion** - Disable animations
- 🖼️ **Profile Photo** - Upload and display user avatar

### Data Storage
- **DynamoDB**: User preferences (theme, font size, etc.)
- **S3**: Profile photos
- **Cognito**: User authentication and management

## Architecture

```
┌─────────────────────────────────────┐
│      Next.js Application            │
│  ┌──────────────────────────────┐  │
│  │  Pages                       │  │
│  │  - /login                    │  │
│  │  - /signup                   │  │
│  │  - /settings (protected)     │  │
│  │  - /profile (protected)      │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  API Routes                  │  │
│  │  - /api/auth/signup          │  │
│  │  - /api/auth/signin          │  │
│  │  - /api/auth/user            │  │
│  │  - /api/settings             │  │
│  │  - /api/upload               │  │
│  └──────────────────────────────┘  │
└────────┬────────────┬──────────┬───┘
         │            │          │
    ┌────▼───┐   ┌───▼─────┐  ┌─▼──┐
    │Cognito │   │DynamoDB │  │ S3 │
    │Users   │   │Settings │  │Pics│
    └────────┘   └─────────┘  └────┘
         LocalStack Environment
```

## Setup Instructions

### 1. Prerequisites
```bash
# Docker installed and running
docker --version

# Node.js 18+ installed
node --version

# AWS CLI installed
aws --version
```

### 2. Start LocalStack
```bash
# Start LocalStack with Cognito, DynamoDB, and S3
docker run -d \
  --name localstack \
  -p 4566:4566 \
  -e SERVICES=cognito-idp,dynamodb,s3 \
  -e DEBUG=1 \
  localstack/localstack

# Verify it's running
docker ps | grep localstack
```

### 3. Configure AWS CLI
```bash
aws configure set aws_access_key_id test
aws configure set aws_secret_access_key test
aws configure set region us-east-1
```

### 4. Set Up AWS Resources
```bash
# Run the setup script
chmod +x scripts/setup-localstack.sh
./scripts/setup-localstack.sh

# This creates:
# - Cognito User Pool
# - DynamoDB UserSettings table
# - S3 bucket for profile photos
```

### 5. Install Dependencies
```bash
npm install
```

### 6. Configure Environment Variables
```bash
# Copy example env file
cp .env.example .env.local

# Update with your User Pool ID and Client ID from setup script
# The setup script will output these values
```

### 7. Run the Application
```bash
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
week08-auth-demo/
├── app/
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Home/landing page
│   ├── login/
│   │   └── page.tsx            # Sign in page
│   ├── signup/
│   │   └── page.tsx            # Sign up page
│   ├── settings/
│   │   └── page.tsx            # User settings page (protected)
│   ├── profile/
│   │   └── page.tsx            # User profile page (protected)
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/
│   │   │   │   └── route.ts    # POST: Create user
│   │   │   ├── signin/
│   │   │   │   └── route.ts    # POST: Sign in user
│   │   │   └── user/
│   │   │       └── route.ts    # GET: Get user info
│   │   ├── settings/
│   │   │   └── route.ts        # GET/POST: User settings
│   │   └── upload/
│   │       └── route.ts        # POST: Upload profile photo
│   └── globals.css             # Global styles with theme variables
├── lib/
│   ├── cognito/
│   │   ├── client.ts           # Cognito client config
│   │   └── auth.ts             # Auth functions (signUp, signIn, getUser)
│   ├── dynamodb/
│   │   ├── client.ts           # DynamoDB client config
│   │   └── entities.ts         # DynamoDB Toolbox entities
│   ├── s3/
│   │   └── client.ts           # S3 client for uploads
│   └── auth/
│       └── middleware.ts       # Auth middleware for protected routes
├── contexts/
│   ├── AuthContext.tsx         # Authentication context
│   └── SettingsContext.tsx     # User settings context
├── components/
│   ├── SettingsForm.tsx        # Accessibility settings form
│   ├── ProfilePhotoUpload.tsx  # Profile photo upload component
│   ├── ProtectedRoute.tsx      # Route protection wrapper
│   └── ThemeProvider.tsx       # Theme provider component
├── scripts/
│   └── setup-localstack.sh     # LocalStack setup script
├── .env.example                # Example environment variables
└── README.md                   # This file
```

## User Flow

### 1. Sign Up
```
User visits /signup
  → Enters email and password
  → Clicks "Sign Up"
  → API calls Cognito.signUp()
  → Cognito creates user
  → User redirected to /login
```

### 2. Sign In
```
User visits /login
  → Enters email and password
  → Clicks "Sign In"
  → API calls Cognito.signIn()
  → Cognito returns JWT tokens
  → Tokens stored in localStorage
  → User redirected to /settings
```

### 3. Update Settings
```
User visits /settings (protected)
  → Frontend validates token
  → Loads current settings from DynamoDB
  → User changes theme to dark mode
  → Clicks "Save Settings"
  → API validates token
  → API updates DynamoDB
  → Settings applied immediately
```

### 4. Upload Profile Photo
```
User visits /profile (protected)
  → Clicks "Upload Photo"
  → Selects image file
  → Frontend uploads to API
  → API validates token
  → API uploads to S3
  → Photo URL saved in DynamoDB
  → New photo displayed
```

## API Endpoints

### Authentication

#### POST /api/auth/signup
```typescript
// Request
{
  "email": "user@example.com",
  "password": "Password123"
}

// Response
{
  "success": true,
  "userSub": "abc-123-def-456"
}
```

#### POST /api/auth/signin
```typescript
// Request
{
  "email": "user@example.com",
  "password": "Password123"
}

// Response
{
  "success": true,
  "accessToken": "eyJhbGc...",
  "idToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### GET /api/auth/user
```typescript
// Headers
Authorization: Bearer <accessToken>

// Response
{
  "success": true,
  "username": "user@example.com",
  "attributes": {
    "email": "user@example.com",
    "sub": "abc-123-def-456"
  }
}
```

### Settings

#### GET /api/settings
```typescript
// Headers
Authorization: Bearer <accessToken>

// Response
{
  "userId": "user@example.com",
  "settings": {
    "theme": "dark",
    "fontSize": "medium",
    "highContrast": false,
    "reducedMotion": false,
    "profilePhoto": "https://..."
  }
}
```

#### POST /api/settings
```typescript
// Headers
Authorization: Bearer <accessToken>

// Request
{
  "theme": "dark",
  "fontSize": "large",
  "highContrast": true
}

// Response
{
  "success": true
}
```

### Upload

#### POST /api/upload
```typescript
// Headers
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

// Request (FormData)
file: <File>

// Response
{
  "success": true,
  "url": "http://localhost:4566/profile-photos/user123/photo.jpg"
}
```

## Theme System

The application uses CSS custom properties for theming:

```css
/* Light theme (default) */
:root {
  --background: #ffffff;
  --foreground: #000000;
  --primary: #0070f3;
}

/* Dark theme */
[data-theme="dark"] {
  --background: #000000;
  --foreground: #ffffff;
  --primary: #3291ff;
}

/* High contrast */
[data-high-contrast="true"] {
  --background: #000000;
  --foreground: #ffffff;
  --primary: #ffff00;
}

/* Font size */
[data-font-size="small"] { font-size: 14px; }
[data-font-size="medium"] { font-size: 16px; }
[data-font-size="large"] { font-size: 18px; }
[data-font-size="x-large"] { font-size: 20px; }
```

## Testing

### Manual Testing
1. Sign up a new user
2. Sign in with that user
3. Navigate to settings
4. Change theme, font size, etc.
5. Refresh page - settings should persist
6. Upload profile photo
7. Sign out
8. Sign in again - settings and photo should still be there

### Testing with curl
```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'

# Sign in
TOKEN=$(curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}' \
  | jq -r '.accessToken')

# Get user
curl http://localhost:3000/api/auth/user \
  -H "Authorization: Bearer $TOKEN"

# Get settings
curl http://localhost:3000/api/settings \
  -H "Authorization: Bearer $TOKEN"

# Update settings
curl -X POST http://localhost:3000/api/settings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"theme":"dark","fontSize":"large"}'
```

## Accessibility Features

### 1. Dark Mode
- Reduces eye strain in low light
- User preference saved in DynamoDB
- Applied immediately via CSS custom properties

### 2. Font Size
- Options: small (14px), medium (16px), large (18px), x-large (20px)
- Affects all text in the application
- Helps users with visual impairments

### 3. High Contrast
- Increases contrast between foreground and background
- Yellow on black for maximum contrast
- Helps users with low vision

### 4. Reduced Motion
- Disables animations and transitions
- Helps users with vestibular disorders
- Applied via `prefers-reduced-motion` CSS

### 5. Keyboard Navigation
- All interactive elements accessible via keyboard
- Focus indicators visible
- Tab order logical

## Common Issues

### LocalStack not responding
```bash
# Check if running
docker ps | grep localstack

# Restart if needed
docker restart localstack

# Check logs
docker logs localstack
```

### Cognito token expired
```
Error: Token has expired
```
**Solution:** Sign in again to get new token

### DynamoDB table not found
```
Error: ResourceNotFoundException
```
**Solution:** Run setup script again
```bash
./scripts/setup-localstack.sh
```

### S3 upload fails
```
Error: Access Denied
```
**Solution:** Verify S3 bucket exists
```bash
aws --endpoint-url=http://localhost:4566 s3 ls
```

## Production Deployment

To deploy to production AWS:

1. **Remove LocalStack endpoint:**
```typescript
// Change from:
endpoint: 'http://localhost:4566'

// To: (remove endpoint line entirely)
// SDK will use default AWS endpoints
```

2. **Use real AWS credentials:**
```bash
# Set up AWS credentials
aws configure

# Use IAM roles in production
```

3. **Update environment variables:**
```bash
# Use production Cognito User Pool
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXX
NEXT_PUBLIC_COGNITO_CLIENT_ID=XXXXXXXXX

# Remove LocalStack-specific vars
# AWS_ACCESS_KEY_ID=test  ← Remove
# AWS_SECRET_ACCESS_KEY=test  ← Remove
```

4. **Deploy Next.js app:**
```bash
# Build
npm run build

# Deploy to Vercel, AWS Amplify, or your platform
vercel deploy
```

## Learning Objectives

By exploring this demo, students will learn:

✅ How to set up AWS Cognito for authentication  
✅ How to create and configure a User Pool  
✅ How to implement sign up and sign in flows  
✅ How to validate JWT tokens  
✅ How to protect API routes with middleware  
✅ How to store user preferences in DynamoDB  
✅ How to use DynamoDB Toolbox for TypeScript safety  
✅ How to upload files to S3  
✅ How to implement accessibility features  
✅ How to use React Context for state management  
✅ How to apply themes with CSS custom properties  

## Next Steps

After understanding this demo:

1. **Customize it:** Change the settings options, add new features
2. **Add features:** Password reset, email verification, MFA
3. **Improve UI:** Add animations, better styling, loading states
4. **Add tests:** Unit tests, integration tests, e2e tests
5. **Deploy it:** Deploy to production AWS

## Resources

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [DynamoDB Toolbox](https://dynamodb-toolbox.com/)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [LocalStack Documentation](https://docs.localstack.cloud/)
- [Web Accessibility](https://www.w3.org/WAI/fundamentals/accessibility-intro/)

---

**Questions?** Check the inline code comments or review the I DO blocks in the curriculum!
