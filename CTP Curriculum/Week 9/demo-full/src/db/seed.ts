import { db } from '@/lib/db';
import { userProfiles, posts, comments } from './schema';

async function seed() {
  console.log('⏳ Seeding database...');

  try {
    // Create sample user profiles
    const [alice, bob, charlie] = await db.insert(userProfiles).values([
      {
        cognitoUserId: 'sample-cognito-user-1',
        email: 'alice@example.com',
        displayName: 'Alice Developer',
        bio: 'Full-stack developer passionate about React and TypeScript',
      },
      {
        cognitoUserId: 'sample-cognito-user-2',
        email: 'bob@example.com',
        displayName: 'Bob Engineer',
        bio: 'Backend enthusiast, loves PostgreSQL and AWS',
      },
      {
        cognitoUserId: 'sample-cognito-user-3',
        email: 'charlie@example.com',
        displayName: 'Charlie Designer',
        bio: 'UI/UX designer who codes',
      },
    ]).returning();

    console.log('✅ Created user profiles');

    // Create sample posts
    const [post1, post2, post3] = await db.insert(posts).values([
      {
        userId: alice.id,
        title: 'Getting Started with Drizzle ORM',
        slug: 'getting-started-drizzle-orm',
        content: 'Drizzle ORM is a fantastic TypeScript-first ORM for PostgreSQL. In this post, we\'ll explore why it\'s becoming the go-to choice for modern web applications...',
        published: new Date(),
      },
      {
        userId: bob.id,
        title: 'Why I Love PostgreSQL',
        slug: 'why-i-love-postgresql',
        content: 'PostgreSQL offers powerful features like JSONB support, full-text search, and amazing performance. Here\'s why it\'s my database of choice...',
        published: new Date(),
      },
      {
        userId: charlie.id,
        title: 'Building Beautiful UIs with Tailwind',
        slug: 'building-beautiful-uis-tailwind',
        content: 'Tailwind CSS has revolutionized how I approach styling. Let me show you some of my favorite patterns...',
        published: new Date(),
      },
    ]).returning();

    console.log('✅ Created blog posts');

    // Create sample comments
    await db.insert(comments).values([
      {
        postId: post1.id,
        userId: bob.id,
        content: 'Great introduction! I just started using Drizzle too and I\'m loving the type safety.',
      },
      {
        postId: post1.id,
        userId: charlie.id,
        content: 'This is exactly what I needed to get started. Thanks Alice!',
      },
      {
        postId: post2.id,
        userId: alice.id,
        content: 'Totally agree! The JSONB support is game-changing for flexible schemas.',
      },
      {
        postId: post3.id,
        userId: bob.id,
        content: 'Love these patterns. Going to try them in my next project!',
      },
    ]);

    console.log('✅ Created comments');
    console.log('\n🎉 Database seeded successfully!');
    console.log('\nSample data:');
    console.log(`- ${3} users`);
    console.log(`- ${3} posts`);
    console.log(`- ${4} comments`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
