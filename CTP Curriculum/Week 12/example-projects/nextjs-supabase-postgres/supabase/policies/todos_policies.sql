/**
 * Row Level Security Policies for Todos Table
 *
 * These policies control access to the todos table at the database level.
 *
 * KEY CONCEPTS:
 * - Row Level Security (RLS): PostgreSQL feature for row-level access control
 * - Policies: Rules that filter what rows users can see/modify
 * - auth.uid(): Current authenticated user's ID from Supabase
 *
 * RLS vs APPLICATION LOGIC:
 * - RLS: Database enforces (can't be bypassed)
 * - App logic: Can be bypassed if client is compromised
 * - RLS is your last line of defense!
 *
 * WHY RLS IS POWERFUL:
 * - Works for ALL queries (SELECT, UPDATE, DELETE)
 * - Automatic (don't forget to check in code)
 * - Can't be disabled by client
 * - Applies to API routes, server components, client queries
 *
 * APPLY THESE POLICIES:
 * Copy and paste into Supabase Dashboard → SQL Editor → Run
 *
 * VIDEO GUIDE: supabase-rls-policies.mp4
 */

/**
 * ENABLE ROW LEVEL SECURITY
 *
 * CRITICAL: Must enable RLS on table first!
 * Without this, table is inaccessible (good default)
 */
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

/**
 * SELECT POLICY - Reading Todos
 *
 * Users can read:
 * - Their own todos (private or public)
 * - Other users' public todos
 *
 * POLICY NAME: Clear, descriptive names
 * OPERATION: FOR SELECT (also: INSERT, UPDATE, DELETE, ALL)
 * USING: Condition that must be true to see row
 *
 * auth.uid() = user_id:
 * - auth.uid(): Current user's ID from JWT token
 * - user_id: Column in todos table
 * - Returns true if they match
 *
 * OR is_public = true:
 * - Allow seeing public todos from anyone
 * - Powers the public feed feature
 */
CREATE POLICY "Users can see own and public todos"
ON todos
FOR SELECT
USING (
  auth.uid() = user_id OR is_public = true
);

/**
 * INSERT POLICY - Creating Todos
 *
 * Users can create todos, but:
 * - user_id must match their auth.uid()
 * - Prevents creating todos as other users
 * - Enforced at database level
 *
 * WITH CHECK:
 * - Validates data being inserted
 * - Runs before INSERT
 * - Row only inserted if check passes
 */
CREATE POLICY "Users can create own todos"
ON todos
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
);

/**
 * UPDATE POLICY - Modifying Todos
 *
 * Users can only update their own todos
 *
 * USING:
 * - Checks EXISTING row
 * - Must own row to update it
 * - Can't update others' todos
 *
 * WITH CHECK (optional):
 * - Could add to validate new data
 * - Ensures user_id doesn't change
 */
CREATE POLICY "Users can update own todos"
ON todos
FOR UPDATE
USING (
  auth.uid() = user_id
);

/**
 * DELETE POLICY - Removing Todos
 *
 * Users can only delete their own todos
 */
CREATE POLICY "Users can delete own todos"
ON todos
FOR DELETE
USING (
  auth.uid() = user_id
);

/**
 * ALTERNATIVE: Single Policy for All Operations
 *
 * Can combine operations:
 * ```sql
 * CREATE POLICY "Users manage own todos"
 * ON todos
 * FOR ALL
 * USING (auth.uid() = user_id)
 * WITH CHECK (auth.uid() = user_id);
 * ```
 *
 * Pros: Less code
 * Cons: Less granular control, harder to debug
 */

/**
 * ADVANCED RLS PATTERNS
 *
 * Role-based access:
 * ```sql
 * CREATE POLICY "Admins can see all todos"
 * ON todos
 * FOR SELECT
 * USING (
 *   auth.jwt() ->> 'role' = 'admin'
 * );
 * ```
 *
 * Time-based access:
 * ```sql
 * CREATE POLICY "Todos visible after publish date"
 * ON todos
 * FOR SELECT
 * USING (
 *   publish_date <= NOW()
 * );
 * ```
 *
 * Conditional updates:
 * ```sql
 * CREATE POLICY "Can't complete others' todos"
 * ON todos
 * FOR UPDATE
 * USING (auth.uid() = user_id)
 * WITH CHECK (
 *   -- Allow changing completion only on own todos
 *   auth.uid() = user_id
 * );
 * ```
 *
 * Join with other tables:
 * ```sql
 * CREATE POLICY "Team members can see team todos"
 * ON todos
 * FOR SELECT
 * USING (
 *   EXISTS (
 *     SELECT 1 FROM team_members
 *     WHERE team_members.team_id = todos.team_id
 *     AND team_members.user_id = auth.uid()
 *   )
 * );
 * ```
 */

/**
 * TESTING POLICIES
 *
 * Test in Supabase SQL Editor:
 *
 * ```sql
 * -- Test as specific user
 * SET LOCAL jwt.claims.sub = 'user-id-here';
 *
 * -- Try to read todos
 * SELECT * FROM todos;
 *
 * -- Should only see that user's todos + public todos
 * ```
 *
 * Or use Supabase client:
 * ```typescript
 * const { data, error } = await supabase
 *   .from('todos')
 *   .select('*')
 *
 * // RLS automatically filters results
 * ```
 */

/**
 * DEBUGGING RLS
 *
 * If queries return empty unexpectedly:
 *
 * 1. Check RLS is enabled:
 * ```sql
 * SELECT tablename, rowsecurity
 * FROM pg_tables
 * WHERE schemaname = 'public';
 * ```
 *
 * 2. List policies:
 * ```sql
 * SELECT tablename, policyname, cmd, qual
 * FROM pg_policies
 * WHERE tablename = 'todos';
 * ```
 *
 * 3. Check auth context:
 * ```sql
 * SELECT auth.uid();
 * ```
 * Should return your user ID, not null
 *
 * 4. Temporarily disable RLS to isolate:
 * ```sql
 * ALTER TABLE todos DISABLE ROW LEVEL SECURITY;
 * -- Test query
 * ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
 * ```
 *
 * 5. Check policy conditions:
 * - Field names correct?
 * - auth.uid() not null?
 * - Logic correct (AND vs OR)?
 */

/**
 * PERFORMANCE CONSIDERATIONS
 *
 * RLS policies are applied to EVERY query:
 * - Keep conditions simple
 * - Use indexed columns
 * - Avoid complex subqueries if possible
 *
 * GOOD INDEXES:
 * ```sql
 * CREATE INDEX idx_todos_user_id ON todos(user_id);
 * CREATE INDEX idx_todos_public ON todos(is_public) WHERE is_public = true;
 * ```
 *
 * These make RLS filtering fast!
 */

/**
 * BYPASSING RLS (ADMIN OPERATIONS)
 *
 * Service role key bypasses RLS:
 *
 * ```typescript
 * import { createClient } from '@supabase/supabase-js'
 *
 * const supabaseAdmin = createClient(
 *   process.env.SUPABASE_URL,
 *   process.env.SUPABASE_SERVICE_ROLE_KEY // Server-side only!
 * )
 *
 * // Gets ALL todos, ignoring RLS
 * const { data } = await supabaseAdmin
 *   .from('todos')
 *   .select('*')
 * ```
 *
 * USE WITH CAUTION:
 * - Only in server-side code
 * - Never expose service role key
 * - Add your own authorization checks
 * - Use for admin panels, cleanup jobs, etc.
 */

/**
 * POLICY NAMING CONVENTIONS
 *
 * Good names describe what they allow:
 * - "Users can see own todos" ✅
 * - "Select policy" ❌
 *
 * Include operation:
 * - "Admins can delete any todo" ✅
 * - "Admin policy" ❌
 *
 * Be specific:
 * - "Team members can update shared todos" ✅
 * - "Update todos" ❌
 */

/**
 * MULTIPLE POLICIES
 *
 * Can have multiple policies for same operation:
 *
 * ```sql
 * -- Policy 1: See own todos
 * CREATE POLICY "Users see own todos"
 * ON todos FOR SELECT
 * USING (auth.uid() = user_id);
 *
 * -- Policy 2: See public todos
 * CREATE POLICY "Anyone sees public todos"
 * ON todos FOR SELECT
 * USING (is_public = true);
 * ```
 *
 * Policies are OR'd together:
 * Row visible if ANY policy allows it
 */

/**
 * DROPPING POLICIES
 *
 * To remove a policy:
 * ```sql
 * DROP POLICY "Users can see own and public todos" ON todos;
 * ```
 *
 * To replace:
 * ```sql
 * DROP POLICY IF EXISTS "old_policy" ON todos;
 * CREATE POLICY "new_policy" ON todos FOR SELECT USING (...);
 * ```
 */

/**
 * VIEWING POLICY QUERIES
 *
 * See what SQL PostgreSQL generates:
 *
 * ```sql
 * EXPLAIN SELECT * FROM todos;
 * ```
 *
 * Shows how RLS filters are applied
 * Useful for performance tuning
 */
