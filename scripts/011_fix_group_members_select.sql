-- ============================================================================
-- Fix buddy_group_members SELECT RLS to show all members in your group
-- ============================================================================

-- The current SELECT policy only shows members of groups you're in
-- But it might be too restrictive - let's make it simpler

DROP POLICY IF EXISTS "group_members_select_authenticated" ON public.buddy_group_members;
DROP POLICY IF EXISTS "group_members_select_own_groups" ON public.buddy_group_members;

-- Allow users to see members of ANY group they belong to
CREATE POLICY "group_members_select_in_my_groups" ON public.buddy_group_members FOR SELECT
  USING (
    group_id IN (
      SELECT group_id 
      FROM public.buddy_group_members 
      WHERE user_id = auth.uid()
    )
  );

COMMENT ON POLICY "group_members_select_in_my_groups" ON public.buddy_group_members 
IS 'Users can see all members of groups they belong to';

-- Verify the fix by checking what the current user can see
SELECT 
  bgm.id,
  bgm.group_id,
  bgm.user_id,
  bgm.role,
  p.display_name,
  p.username
FROM public.buddy_group_members bgm
JOIN public.profiles p ON bgm.user_id = p.id
WHERE bgm.group_id IN (
  SELECT group_id 
  FROM public.buddy_group_members 
  WHERE user_id = auth.uid()
);

