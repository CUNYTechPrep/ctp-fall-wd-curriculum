import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, userProfiles } from '@/db/schema';
import { eq, desc, isNotNull } from 'drizzle-orm';
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().min(1),
  slug: z.string().min(1).max(500),
});

// GET /api/posts - List all published posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const allPosts = await db.query.posts.findMany({
      where: isNotNull(posts.published),
      limit,
      offset,
      orderBy: [desc(posts.published)],
      with: {
        author: {
          columns: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json({
      posts: allPosts,
      pagination: {
        limit,
        offset,
        hasMore: allPosts.length === limit,
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create new post (authenticated)
export async function POST(request: NextRequest) {
  try {
    // TODO: Get user from Cognito session
    // const user = await getCurrentUser(request);
    // For now, use first user
    const [firstUser] = await db.select().from(userProfiles).limit(1);
    
    if (!firstUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, content, slug } = createPostSchema.parse(body);

    const [post] = await db.insert(posts)
      .values({
        userId: firstUser.id,
        title,
        content,
        slug,
        published: new Date(),
      })
      .returning();

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
