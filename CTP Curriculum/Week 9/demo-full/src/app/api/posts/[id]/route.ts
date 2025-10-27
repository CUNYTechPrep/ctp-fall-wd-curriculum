import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/posts/[id] - Get single post with comments
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, params.id),
      with: {
        author: {
          columns: {
            id: true,
            displayName: true,
            bio: true,
            avatarUrl: true,
          },
        },
        comments: {
          orderBy: (comments, { desc }) => [desc(comments.createdAt)],
          with: {
            author: {
              columns: {
                id: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Update post (owner only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, content } = body;

    const [updated] = await db.update(posts)
      .set({
        title,
        content,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, params.id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Delete post (owner only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [deleted] = await db.delete(posts)
      .where(eq(posts.id, params.id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
