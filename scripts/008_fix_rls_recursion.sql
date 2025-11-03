-- ============================================================================
-- Fix RLS infinite recursion in buddy_group_members and buddy_groups policies
-- ============================================================================

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "group_members_select_own_groups" ON public.buddy_group_members;

-- Drop if already exists from previous run
DROP POLICY IF EXISTS "group_members_select_authenticated" ON public.buddy_group_members;

-- Create a simpler, non-recursive policy
-- Allow authenticated users to see all group members
-- (Not sensitive data, and needed for group functionality)
CREATE POLICY "group_members_select_authenticated" ON public.buddy_group_members FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Keep the insert policy as is
-- (Already exists: group_members_insert_own)

COMMENT ON POLICY "group_members_select_authenticated" ON public.buddy_group_members 
IS 'Allow authenticated users to view group members (non-recursive)';

-- Fix buddy_groups policies to work with server-side API
DROP POLICY IF EXISTS "buddy_groups_select_member" ON public.buddy_groups;
DROP POLICY IF EXISTS "buddy_groups_insert_own" ON public.buddy_groups;
DROP POLICY IF EXISTS "buddy_groups_insert_authenticated" ON public.buddy_groups;
DROP POLICY IF EXISTS "buddy_groups_update_own" ON public.buddy_groups;

-- Allow authenticated users to see all active groups (needed for matching)
CREATE POLICY "buddy_groups_select_authenticated" ON public.buddy_groups FOR SELECT
  USING (auth.uid() IS NOT NULL AND status = 'active');

-- Allow any authenticated user to create groups
CREATE POLICY "buddy_groups_insert_authenticated" ON public.buddy_groups FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow UPDATE for group management
CREATE POLICY "buddy_groups_update_own" ON public.buddy_groups FOR UPDATE
  USING (auth.uid() IS NOT NULL);

COMMENT ON POLICY "buddy_groups_select_authenticated" ON public.buddy_groups 
IS 'Allow authenticated users to view active groups';
COMMENT ON POLICY "buddy_groups_insert_authenticated" ON public.buddy_groups 
IS 'Allow authenticated users to create groups';
COMMENT ON POLICY "buddy_groups_update_own" ON public.buddy_groups 
IS 'Allow authenticated users to update groups';

