/**
 * Initial Database Schema Migration
 *
 * This SQL file creates all tables and policies for the todo application.
 *
 * HOW TO USE:
 * 1. Copy this entire file
 * 2. Go to Supabase Dashboard → SQL Editor
 * 3. Paste and run
 * 4. Verify tables created in Table Editor
 *
 * WHAT THIS CREATES:
 * - user_profiles table (extends auth.users)
 * - user_settings table (accessibility preferences)
 * - todos table (todo items)
 * - todo_attachments table (file metadata)
 * - messages table (real-time messaging)
 * - Row Level Security policies
 * - Indexes for performance
 * - Database triggers
 *
 * VIDEO GUIDE: supabase-schema-setup.mp4
 */

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/**
 * USER PROFILES TABLE
 *
 * Extends auth.users with application-specific data
 *
 * WHY SEPARATE TABLE?
 * - auth.users managed by Supabase Auth
 * - Keep auth data separate from app data
 * - Easier to query and modify
 * - Can add custom fields without affecting auth
 */
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  profile_picture TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

/**
 * USER SETTINGS TABLE
 *
 * Stores accessibility preferences
 */
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  theme TEXT DEFAULT 'light' NOT NULL CHECK (theme IN ('light', 'dark')),
  font_size TEXT DEFAULT 'medium' NOT NULL CHECK (font_size IN ('small', 'medium', 'large')),
  high_contrast BOOLEAN DEFAULT FALSE NOT NULL,
  reduced_motion BOOLEAN DEFAULT FALSE NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

/**
 * TODOS TABLE
 *
 * Main table for todo items
 *
 * ARRAY COLUMN:
 * - tags TEXT[]: PostgreSQL array for storing multiple tags
 * - Can query with array operators
 * - More efficient than separate tags table for this use case
 */
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (length(title) > 0 AND length(title) <= 500),
  description TEXT CHECK (length(description) <= 2000),
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  is_public BOOLEAN DEFAULT FALSE NOT NULL,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

/**
 * TODO ATTACHMENTS TABLE
 *
 * Stores metadata for uploaded files
 */
CREATE TABLE todo_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  todo_id UUID REFERENCES todos(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL CHECK (file_size > 0 AND file_size <= 5242880), -- 5MB max
  mime_type TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

/**
 * MESSAGES TABLE
 *
 * Real-time messaging between users
 */
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (length(content) > 0 AND length(content) <= 2000),
  read BOOLEAN DEFAULT FALSE NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

/**
 * INDEXES FOR PERFORMANCE
 *
 * Critical for fast queries, especially with many rows
 */

-- User's todos queries
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_user_created ON todos(user_id, created_at DESC);

-- Public feed queries
CREATE INDEX idx_todos_public_created ON todos(is_public, created_at DESC) WHERE is_public = TRUE;
CREATE INDEX idx_todos_public_tags ON todos USING GIN(tags) WHERE is_public = TRUE;

-- Full-text search on public todos
CREATE INDEX idx_todos_search ON todos
USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')))
WHERE is_public = TRUE;

-- Attachment queries
CREATE INDEX idx_attachments_todo ON todo_attachments(todo_id);

-- Message queries
CREATE INDEX idx_messages_recipient_created ON messages(recipient_id, created_at DESC);
CREATE INDEX idx_messages_sender_created ON messages(sender_id, created_at DESC);
CREATE INDEX idx_messages_conversation ON messages(sender_id, recipient_id, created_at DESC);
CREATE INDEX idx_messages_unread ON messages(recipient_id, read, created_at DESC) WHERE read = FALSE;

-- Settings queries
CREATE INDEX idx_settings_user ON user_settings(user_id);

/**
 * ROW LEVEL SECURITY POLICIES
 *
 * Database-level access control
 * This is what makes Supabase secure!
 */

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

/**
 * USER PROFILES POLICIES
 */

-- Users can view any profile (for attribution, messaging, etc.)
CREATE POLICY "Profiles are viewable by everyone"
ON user_profiles FOR SELECT
USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = user_id);

/**
 * USER SETTINGS POLICIES
 */

-- Users can only see their own settings
CREATE POLICY "Users can view own settings"
ON user_settings FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own settings
CREATE POLICY "Users can update own settings"
ON user_settings FOR UPDATE
USING (auth.uid() = user_id);

/**
 * TODOS POLICIES
 *
 * Complex policies for public/private todos
 */

-- Users can see their own todos OR public todos from anyone
CREATE POLICY "Users can see own and public todos"
ON todos FOR SELECT
USING (auth.uid() = user_id OR is_public = TRUE);

-- Users can create their own todos
CREATE POLICY "Users can create own todos"
ON todos FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update only their own todos
CREATE POLICY "Users can update own todos"
ON todos FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete only their own todos
CREATE POLICY "Users can delete own todos"
ON todos FOR DELETE
USING (auth.uid() = user_id);

/**
 * TODO ATTACHMENTS POLICIES
 *
 * Attachments follow todo permissions
 */

-- Users can see attachments for todos they can see
CREATE POLICY "Users can see attachments for visible todos"
ON todo_attachments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM todos
    WHERE todos.id = todo_attachments.todo_id
    AND (todos.user_id = auth.uid() OR todos.is_public = TRUE)
  )
);

-- Users can add attachments to their own todos
CREATE POLICY "Users can add attachments to own todos"
ON todo_attachments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM todos
    WHERE todos.id = todo_id
    AND todos.user_id = auth.uid()
  )
);

-- Users can delete attachments from their own todos
CREATE POLICY "Users can delete attachments from own todos"
ON todo_attachments FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM todos
    WHERE todos.id = todo_id
    AND todos.user_id = auth.uid()
  )
);

/**
 * MESSAGES POLICIES
 *
 * Privacy-first messaging
 */

-- Users can see messages they sent or received
CREATE POLICY "Users can see their own messages"
ON messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Users can send messages (as themselves only)
CREATE POLICY "Users can send messages"
ON messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Recipients can mark messages as read
CREATE POLICY "Recipients can update read status"
ON messages FOR UPDATE
USING (auth.uid() = recipient_id);

/**
 * DATABASE TRIGGERS
 *
 * Automatically create profiles and settings for new users
 */

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile
  INSERT INTO user_profiles (user_id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'displayName', split_part(NEW.email, '@', 1))
  );

  -- Create default user settings
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

/**
 * UPDATED_AT TRIGGER
 *
 * Automatically update updated_at timestamp
 */

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

/**
 * VERIFICATION QUERIES
 *
 * Run these to verify everything worked:
 *
 * -- Check tables created
 * SELECT tablename FROM pg_tables WHERE schemaname = 'public';
 *
 * -- Check RLS enabled
 * SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
 *
 * -- Check policies
 * SELECT tablename, policyname FROM pg_policies;
 *
 * -- Check indexes
 * SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public';
 *
 * -- Check triggers
 * SELECT trigger_name, event_object_table FROM information_schema.triggers;
 */

/**
 * ROLLBACK (if needed)
 *
 * To undo this migration:
 *
 * DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
 * DROP FUNCTION IF EXISTS handle_new_user();
 * DROP TRIGGER IF EXISTS update_todos_updated_at ON todos;
 * DROP FUNCTION IF EXISTS update_updated_at_column();
 * DROP TABLE IF EXISTS messages CASCADE;
 * DROP TABLE IF EXISTS todo_attachments CASCADE;
 * DROP TABLE IF EXISTS todos CASCADE;
 * DROP TABLE IF EXISTS user_settings CASCADE;
 * DROP TABLE IF EXISTS user_profiles CASCADE;
 */
