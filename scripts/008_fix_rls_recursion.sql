-- ============================================================================
-- Fix RLS infinite recursion in buddy_group_members
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

