# Next.js + Firebase Todo Application

A full-stack todo application built with Next.js 15 and Firebase.

## Features

- User authentication (sign up, sign in, sign out)
- Todo CRUD operations with real-time updates
- User accessibility settings (theme, font size, contrast, motion)
- Profile picture uploads
- Todo file attachments
- Public feed of todos (searchable, filterable, paginated)
- Real-time messaging between users
- Tags for categorization
- Responsive design
- Real-time updates across all features

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Authentication
- **Database:** Cloud Firestore
- **Storage:** Firebase Storage
- **Real-time:** Firestore real-time listeners

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project created

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and fill in your Firebase credentials:
   ```bash
   cp .env.example .env.local
   ```

4. Set up Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Create a Storage bucket
   - Copy your Firebase config to `.env.local`

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
nextjs-firebase/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── todos/            # Todo components
│   ├── feed/             # Public feed components
│   ├── messages/         # Messaging components
│   └── ui/               # Shared UI components
├── lib/                  # Utility functions
│   ├── firebase/         # Firebase configuration
│   └── hooks/            # Custom React hooks
└── types/                # TypeScript type definitions
```

## Firebase Security Rules

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // User settings
    match /userSettings/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Todos
    match /todos/{todoId} {
      allow read: if resource.data.isPublic == true ||
                     request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }

    // Todo attachments
    match /todoAttachments/{attachmentId} {
      allow read, write: if request.auth.uid == get(/databases/$(database)/documents/todos/$(resource.data.todoId)).data.userId;
    }

    // Messages
    match /messages/{messageId} {
      allow read: if request.auth.uid == resource.data.senderId ||
                     request.auth.uid == resource.data.recipientId;
      allow create: if request.auth.uid == request.resource.data.senderId;
      allow update: if request.auth.uid == resource.data.recipientId;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile pictures
    match /profile-pictures/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId &&
                      request.resource.size < 5 * 1024 * 1024 &&
                      request.resource.contentType.matches('image/.*');
    }

    // Todo attachments
    match /todo-attachments/{userId}/{todoId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId &&
                      request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

This app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Self-hosted

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
