-- ============================================================================
-- Fix infinite recursion in buddy_group_members SELECT policy
-- ============================================================================

-- The previous fix caused infinite recursion because the policy
-- was querying the same table it was protecting!

-- Drop the broken recursive policy
DROP POLICY IF EXISTS "group_members_select_in_my_groups" ON public.buddy_group_members;
DROP POLICY IF EXISTS "group_members_select_authenticated" ON public.buddy_group_members;
DROP POLICY IF EXISTS "group_members_select_own_groups" ON public.buddy_group_members;

-- SOLUTION: Just allow all authenticated users to see all group members
-- Group membership isn't sensitive info - users need to see who's in groups
-- to decide if they want to join or to chat with members
CREATE POLICY "group_members_select_all_authenticated" ON public.buddy_group_members FOR SELECT
  TO authenticated
  USING (true);

COMMENT ON POLICY "group_members_select_all_authenticated" ON public.buddy_group_members 
IS 'All authenticated users can see group members (needed for matching and group display)';

-- Verify: This should now work without recursion
SELECT 
  bgm.id,
  bgm.group_id,
  bgm.user_id,
  bgm.role,
  p.display_name,
  p.username
FROM public.buddy_group_members bgm
JOIN public.profiles p ON bgm.user_id = p.id
LIMIT 10;

