-- ============================================================================
-- Check RLS policies for buddy_group_members
-- ============================================================================

-- Show all policies on buddy_group_members table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'buddy_group_members'
ORDER BY policyname;

-- Also check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename IN ('buddy_group_members', 'buddy_groups');

