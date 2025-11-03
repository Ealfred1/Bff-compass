-- ============================================================================
-- Fix RLS infinite recursion in buddy_group_members and buddy_groups policies
-- ============================================================================

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "group_members_select_own_groups" ON public.buddy_group_members;

-- Create a simpler, non-recursive policy
-- Allow authenticated users to see all group members
-- (Not sensitive data, and needed for group functionality)
CREATE POLICY "group_members_select_authenticated" ON public.buddy_group_members FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Keep the insert policy as is
-- (Already exists: group_members_insert_own)

COMMENT ON POLICY "group_members_select_authenticated" ON public.buddy_group_members 
IS 'Allow authenticated users to view group members (non-recursive)';

-- Fix buddy_groups INSERT policy to work with server-side API
DROP POLICY IF EXISTS "buddy_groups_insert_own" ON public.buddy_groups;

-- Allow any authenticated user to create groups
-- Application ensures created_by is set correctly
CREATE POLICY "buddy_groups_insert_authenticated" ON public.buddy_groups FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Also allow UPDATE for group management
DROP POLICY IF EXISTS "buddy_groups_update_own" ON public.buddy_groups;
CREATE POLICY "buddy_groups_update_own" ON public.buddy_groups FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

COMMENT ON POLICY "buddy_groups_insert_authenticated" ON public.buddy_groups 
IS 'Allow authenticated users to create groups';

