-- Helper SQL Functions for BFF COMPASS

-- Function to get users without groups
CREATE OR REPLACE FUNCTION get_users_without_groups()
RETURNS TABLE (user_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id as user_id
  FROM public.profiles p
  WHERE p.id NOT IN (
    SELECT bgm.user_id
    FROM public.buddy_group_members bgm
    JOIN public.buddy_groups bg ON bgm.group_id = bg.id
    WHERE bg.status = 'active'
  )
  AND p.onboarding_completed = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get groups with capacity (less than 5 members)
CREATE OR REPLACE FUNCTION get_groups_with_capacity(category TEXT)
RETURNS TABLE (
  id UUID,
  group_name TEXT,
  created_by UUID,
  is_ai_matched BOOLEAN,
  matching_criteria JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  status TEXT,
  member_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bg.id,
    bg.group_name,
    bg.created_by,
    bg.is_ai_matched,
    bg.matching_criteria,
    bg.created_at,
    bg.status,
    COUNT(bgm.id) as member_count
  FROM public.buddy_groups bg
  LEFT JOIN public.buddy_group_members bgm ON bg.id = bgm.group_id
  WHERE bg.status = 'active'
    AND (bg.matching_criteria->>'loneliness_category')::TEXT = category
  GROUP BY bg.id, bg.group_name, bg.created_by, bg.is_ai_matched, bg.matching_criteria, bg.created_at, bg.status
  HAVING COUNT(bgm.id) < 5
  ORDER BY COUNT(bgm.id) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and award badges
CREATE OR REPLACE FUNCTION check_and_award_badges(user_uuid UUID)
RETURNS TABLE (badge_id UUID, badge_name TEXT) AS $$
DECLARE
  badge_record RECORD;
  user_count INTEGER;
  already_has BOOLEAN;
BEGIN
  -- Loop through all badges
  FOR badge_record IN SELECT * FROM public.badges WHERE criteria_type IS NOT NULL
  LOOP
    -- Check if user already has this badge
    SELECT EXISTS (
      SELECT 1 FROM public.user_badges 
      WHERE user_id = user_uuid AND public.user_badges.badge_id = badge_record.id
    ) INTO already_has;
    
    IF already_has THEN
      CONTINUE;
    END IF;
    
    -- Check criteria and award if met
    user_count := 0;
    
    CASE badge_record.criteria_type
      WHEN 'events_attended' THEN
        SELECT COUNT(*) INTO user_count
        FROM public.event_attendance
        WHERE public.event_attendance.user_id = user_uuid;
        
      WHEN 'messages_sent' THEN
        SELECT COUNT(*) INTO user_count
        FROM public.messages
        WHERE sender_id = user_uuid;
        
      WHEN 'mood_checkins' THEN
        SELECT COUNT(*) INTO user_count
        FROM public.mood_entries
        WHERE public.mood_entries.user_id = user_uuid;
        
      WHEN 'connections_made' THEN
        SELECT COUNT(*) INTO user_count
        FROM public.buddy_group_members
        WHERE public.buddy_group_members.user_id = user_uuid;
        
      WHEN 'surveys_completed' THEN
        SELECT COUNT(*) INTO user_count
        FROM (
          SELECT 1 FROM public.loneliness_assessments WHERE public.loneliness_assessments.user_id = user_uuid
          UNION ALL
          SELECT 1 FROM public.leisure_assessments WHERE public.leisure_assessments.user_id = user_uuid
        ) as surveys;
        
      WHEN 'weekly_streaks' THEN
        -- Check for 7 consecutive days of mood entries
        WITH mood_dates AS (
          SELECT DISTINCT DATE(created_at) as entry_date
          FROM public.mood_entries
          WHERE public.mood_entries.user_id = user_uuid
          ORDER BY entry_date DESC
          LIMIT 7
        ),
        date_diffs AS (
          SELECT 
            entry_date,
            LAG(entry_date) OVER (ORDER BY entry_date) as prev_date,
            entry_date - LAG(entry_date) OVER (ORDER BY entry_date) as diff
          FROM mood_dates
        )
        SELECT COUNT(*) INTO user_count
        FROM date_diffs
        WHERE diff = 1 OR diff IS NULL;
        
        -- If we have 7 consecutive days, user_count will be 7
        IF user_count < 7 THEN
          user_count := 0;
        END IF;
    END CASE;
    
    -- Award badge if criteria met
    IF user_count >= badge_record.criteria_threshold THEN
      INSERT INTO public.user_badges (user_id, badge_id)
      VALUES (user_uuid, badge_record.id)
      ON CONFLICT DO NOTHING;
      
      RETURN QUERY SELECT badge_record.id, badge_record.name;
    END IF;
  END LOOP;
  
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's buddy group with members
CREATE OR REPLACE FUNCTION get_user_buddy_group(user_uuid UUID)
RETURNS TABLE (
  group_id UUID,
  group_name TEXT,
  is_ai_matched BOOLEAN,
  matching_criteria JSONB,
  group_status TEXT,
  member_id UUID,
  member_name TEXT,
  member_role TEXT,
  joined_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bg.id as group_id,
    bg.group_name,
    bg.is_ai_matched,
    bg.matching_criteria,
    bg.status as group_status,
    bgm.user_id as member_id,
    p.display_name as member_name,
    bgm.role as member_role,
    bgm.joined_at
  FROM public.buddy_groups bg
  JOIN public.buddy_group_members bgm ON bg.id = bgm.group_id
  JOIN public.profiles p ON bgm.user_id = p.id
  WHERE bg.id IN (
    SELECT group_id 
    FROM public.buddy_group_members 
    WHERE public.buddy_group_members.user_id = user_uuid
  )
  AND bg.status = 'active'
  ORDER BY bgm.role DESC, bgm.joined_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to check badges after certain actions
CREATE OR REPLACE FUNCTION trigger_check_badges()
RETURNS TRIGGER AS $$
BEGIN
  -- Award badges asynchronously (doesn't block the insert)
  PERFORM check_and_award_badges(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for badge awarding
DROP TRIGGER IF EXISTS check_badges_after_event_attendance ON public.event_attendance;
CREATE TRIGGER check_badges_after_event_attendance
AFTER INSERT ON public.event_attendance
FOR EACH ROW
EXECUTE FUNCTION trigger_check_badges();

DROP TRIGGER IF EXISTS check_badges_after_message ON public.messages;
CREATE TRIGGER check_badges_after_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION trigger_check_badges();

DROP TRIGGER IF EXISTS check_badges_after_mood ON public.mood_entries;
CREATE TRIGGER check_badges_after_mood
AFTER INSERT ON public.mood_entries
FOR EACH ROW
EXECUTE FUNCTION trigger_check_badges();

DROP TRIGGER IF EXISTS check_badges_after_group_join ON public.buddy_group_members;
CREATE TRIGGER check_badges_after_group_join
AFTER INSERT ON public.buddy_group_members
FOR EACH ROW
EXECUTE FUNCTION trigger_check_badges();

-- Function to get user stats for dashboard
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'events_attended', (SELECT COUNT(*) FROM public.event_attendance WHERE user_id = user_uuid),
    'messages_sent', (SELECT COUNT(*) FROM public.messages WHERE sender_id = user_uuid),
    'mood_entries', (SELECT COUNT(*) FROM public.mood_entries WHERE public.mood_entries.user_id = user_uuid),
    'badges_earned', (SELECT COUNT(*) FROM public.user_badges WHERE public.user_badges.user_id = user_uuid),
    'group_members', (
      SELECT COUNT(*) 
      FROM public.buddy_group_members bgm
      WHERE bgm.group_id IN (
        SELECT group_id FROM public.buddy_group_members WHERE public.buddy_group_members.user_id = user_uuid
      )
    ),
    'latest_loneliness_category', (
      SELECT loneliness_category 
      FROM public.loneliness_assessments 
      WHERE public.loneliness_assessments.user_id = user_uuid 
      ORDER BY created_at DESC 
      LIMIT 1
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_users_without_groups IS 'Returns users who have completed onboarding but are not in any active group';
COMMENT ON FUNCTION get_groups_with_capacity IS 'Returns active groups with less than 5 members that match the loneliness category';
COMMENT ON FUNCTION check_and_award_badges IS 'Checks user progress and awards any badges they have earned';
COMMENT ON FUNCTION get_user_buddy_group IS 'Returns user''s current buddy group with all members';
COMMENT ON FUNCTION get_user_stats IS 'Returns comprehensive stats for a user''s dashboard';

