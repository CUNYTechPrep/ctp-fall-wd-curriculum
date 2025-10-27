import { db } from '@/lib/db';
import { userProfiles, posts, comments } from './schema';

async function seed() {
  console.log('⏳ Seeding database...');

  // Create sample user profiles
  const [user1, user2] = await db.insert(userProfiles).values([
    {
      cognitoUserId: 'sample-user-1',
      displayName: 'Alice Developer',
      bio: 'Full-stack developer passionate about React and TypeScript',
    },
    {
      cognitoUserId: 'sample-user-2',
      displayName: 'Bob Engineer',
      bio: 'Backend enthusiast, loves PostgreSQL and AWS',
    },
  ]).returning();

  // Create sample posts
  const [post1, post2] = await db.insert(posts).values([
    {
      userId: user1.id,
      title: 'Getting Started with Drizzle ORM',
      content: 'Drizzle ORM is a fantastic TypeScript-first ORM for PostgreSQL...',
    },
    {
      userId: user2.id,
      title: 'Why I Love PostgreSQL',
      content: 'PostgreSQL offers powerful features like JSONB, full-text search...',
    },
  ]).returning();

  // Create sample comments
  await db.insert(comments).values([
    {
      postId: post1.id,
      userId: user2.id,
      content: 'Great introduction! I just started using Drizzle too.',
    },
    {
      postId: post2.id,
      userId: user1.id,
      content: 'Totally agree! The JSONB support is game-changing.',
    },
  ]);

  console.log('✅ Database seeded successfully!');
}

seed()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
