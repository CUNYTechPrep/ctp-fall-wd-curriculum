import { pgTable, text, timestamp, uuid, varchar, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// User Profiles - extends Cognito users
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  cognitoUserId: varchar('cognito_user_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  displayName: varchar('display_name', { length: 255 }),
  bio: text('bio'),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  cognitoUserIdIdx: index('cognito_user_id_idx').on(table.cognitoUserId),
  emailIdx: index('email_idx').on(table.email),
}));

// Posts
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 500 }).notNull(),
  content: text('content').notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  published: timestamp('published'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('post_user_id_idx').on(table.userId),
  slugIdx: index('post_slug_idx').on(table.slug),
  publishedIdx: index('post_published_idx').on(table.published),
}));

// Comments
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  postIdIdx: index('comment_post_id_idx').on(table.postId),
  userIdIdx: index('comment_user_id_idx').on(table.userId),
}));

// Relations
export const userProfilesRelations = relations(userProfiles, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(userProfiles, {
    fields: [posts.userId],
    references: [userProfiles.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(userProfiles, {
    fields: [comments.userId],
    references: [userProfiles.id],
  }),
}));

// Types
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
