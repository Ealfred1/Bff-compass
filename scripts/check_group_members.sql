-- ============================================================================
-- Diagnostic: Check all buddy groups and their members
-- ============================================================================

-- Show all buddy groups with member details
SELECT 
  bg.id as group_id,
  bg.group_name,
  bg.status,
  bg.created_at,
  bg.matching_criteria->>'loneliness_category' as loneliness_category,
  COUNT(bgm.id) as member_count,
  STRING_AGG(p.display_name || ' (' || p.username || ')', ', ' ORDER BY bgm.joined_at) as members
FROM public.buddy_groups bg
LEFT JOIN public.buddy_group_members bgm ON bg.id = bgm.group_id
LEFT JOIN public.profiles p ON bgm.user_id = p.id
WHERE bg.status = 'active'
GROUP BY bg.id, bg.group_name, bg.status, bg.created_at, bg.matching_criteria
ORDER BY bg.created_at DESC;

-- Show detailed member list with roles
SELECT 
  bg.id as group_id,
  bg.matching_criteria->>'loneliness_category' as category,
  p.username,
  p.display_name,
  bgm.role,
  bgm.joined_at,
  u.email
FROM public.buddy_groups bg
JOIN public.buddy_group_members bgm ON bg.id = bgm.group_id
JOIN public.profiles p ON bgm.user_id = p.id
LEFT JOIN auth.users u ON p.id = u.id
WHERE bg.status = 'active'
ORDER BY bg.created_at DESC, bgm.joined_at ASC;

