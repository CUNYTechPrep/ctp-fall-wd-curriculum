import { pgTable, text, timestamp, uuid, varchar, index, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// User Profiles - extends Cognito users
export const userSettings = pgTable('user_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id', { length: 255 }).notNull().unique(),
  themeKey: varchar('theme_key', { length: 255 }).notNull().unique(),
  value: jsonb('value').notNull(),
});

// Types
export type UserSettings = typeof userSettings.$inferSelect;
export type NewUserSettings = typeof userSettings.$inferInsert;
