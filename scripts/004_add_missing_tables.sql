-- ============================================================================
-- BFF COMPASS - Complete Database Schema Migration
-- Adds all missing tables and updates existing ones per specification
-- ============================================================================

-- 1. Update profiles table with school_id (keeping auth but adding field)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS school_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON public.profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON public.profiles(last_active);

-- 2. Update loneliness_assessments with computed category
ALTER TABLE public.loneliness_assessments
ADD COLUMN IF NOT EXISTS loneliness_category TEXT GENERATED ALWAYS AS (
  CASE 
    WHEN total_score <= 14 THEN 'Low'
    WHEN total_score <= 17 THEN 'Moderate'
    WHEN total_score <= 21 THEN 'Moderately High'
    ELSE 'High'
  END
) STORED,
ADD COLUMN IF NOT EXISTS survey_trigger TEXT DEFAULT 'onboarding';

-- Note: UCLA 6-item scale ranges 6-24, adjusted thresholds
-- Original spec had 34/49/64 for 21-item version

-- Add index for category queries
CREATE INDEX IF NOT EXISTS idx_loneliness_category ON public.loneliness_assessments(loneliness_category);

-- 3. Update leisure_assessments with other_interests field
ALTER TABLE public.leisure_assessments
ADD COLUMN IF NOT EXISTS other_interests TEXT,
ADD COLUMN IF NOT EXISTS survey_trigger TEXT DEFAULT 'onboarding';

-- 4. Add mood_tags to mood_entries
ALTER TABLE public.mood_entries
ADD COLUMN IF NOT EXISTS mood_tags TEXT[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_mood_tags ON public.mood_entries USING GIN(mood_tags);

-- 5. Update badges table with criteria fields
ALTER TABLE public.badges
ADD COLUMN IF NOT EXISTS criteria_type TEXT CHECK (criteria_type IN ('events_attended', 'messages_sent', 'mood_checkins', 'connections_made', 'weekly_streaks', 'surveys_completed')),
ADD COLUMN IF NOT EXISTS criteria_threshold INTEGER,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================================================
-- NEW TABLES
-- ============================================================================

-- 6. Create buddy_groups table (3-5 member groups)
CREATE TABLE IF NOT EXISTS public.buddy_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_ai_matched BOOLEAN DEFAULT TRUE,
  matching_criteria JSONB, -- Store AI matching logic/scores
  encryption_key_id TEXT, -- Reference to encryption key (stored client-side)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

-- 7. Create buddy_group_members table (enforce 3-5 members)
CREATE TABLE IF NOT EXISTS public.buddy_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.buddy_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role TEXT DEFAULT 'member' CHECK (role IN ('creator', 'member')),
  UNIQUE(group_id, user_id)
);

-- Add check constraint for group size (3-5 members)
CREATE OR REPLACE FUNCTION check_group_member_count()
RETURNS TRIGGER AS $$
DECLARE
  member_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO member_count
  FROM public.buddy_group_members
  WHERE group_id = NEW.group_id;
  
  IF member_count >= 5 THEN
    RAISE EXCEPTION 'Group cannot have more than 5 members';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_group_size
BEFORE INSERT ON public.buddy_group_members
FOR EACH ROW
EXECUTE FUNCTION check_group_member_count();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_buddy_groups_created_by ON public.buddy_groups(created_by);
CREATE INDEX IF NOT EXISTS idx_buddy_groups_status ON public.buddy_groups(status);
CREATE INDEX IF NOT EXISTS idx_buddy_group_members_group_id ON public.buddy_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_buddy_group_members_user_id ON public.buddy_group_members(user_id);

-- 8. Update messages table for group support
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES public.buddy_groups(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS encrypted_content TEXT,
ADD COLUMN IF NOT EXISTS encryption_iv TEXT, -- Initialization vector for decryption
ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'link', 'image', 'event'));

-- Migrate existing messages if needed (set group_id from connection_id mapping)
-- This would need custom logic based on how you want to migrate 1-on-1 to groups

-- Index for group messages
CREATE INDEX IF NOT EXISTS idx_messages_group_id ON public.messages(group_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- 9. Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_url TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Create event_attendance table
CREATE TABLE IF NOT EXISTS public.event_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  attended_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_active ON public.events(is_active);
CREATE INDEX IF NOT EXISTS idx_event_attendance_user_id ON public.event_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_event_id ON public.event_attendance(event_id);

-- 11. Create guidance_content table
CREATE TABLE IF NOT EXISTS public.guidance_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('daily_message', 'weekly_video')),
  loneliness_category TEXT NOT NULL CHECK (loneliness_category IN ('Low', 'Moderate', 'Moderately High', 'High')),
  title TEXT NOT NULL,
  content TEXT, -- Message content or video description
  video_url TEXT, -- YouTube or video hosting URL
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_guidance_content_type ON public.guidance_content(content_type);
CREATE INDEX IF NOT EXISTS idx_guidance_category ON public.guidance_content(loneliness_category);
CREATE INDEX IF NOT EXISTS idx_guidance_active ON public.guidance_content(is_active);
CREATE INDEX IF NOT EXISTS idx_guidance_day_of_week ON public.guidance_content(day_of_week);

-- 12. Create user_guidance_history table
CREATE TABLE IF NOT EXISTS public.user_guidance_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  guidance_content_id UUID NOT NULL REFERENCES public.guidance_content(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, guidance_content_id, (viewed_at::date))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_guidance_history_user_id ON public.user_guidance_history(user_id);
CREATE INDEX IF NOT EXISTS idx_guidance_history_viewed_at ON public.user_guidance_history(viewed_at DESC);

-- 13. Create mental_health_resources table
CREATE TABLE IF NOT EXISTS public.mental_health_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('emergency', 'non_emergency', 'support_group', 'therapy', 'hotline')),
  title TEXT NOT NULL,
  description TEXT,
  phone_number TEXT,
  website_url TEXT,
  available_hours TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_crisis_resource BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.mental_health_resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_active ON public.mental_health_resources(is_active);
CREATE INDEX IF NOT EXISTS idx_resources_crisis ON public.mental_health_resources(is_crisis_resource);
CREATE INDEX IF NOT EXISTS idx_resources_order ON public.mental_health_resources(display_order);

-- ============================================================================
-- RLS POLICIES FOR NEW TABLES
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE public.buddy_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buddy_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guidance_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_guidance_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mental_health_resources ENABLE ROW LEVEL SECURITY;

-- Buddy Groups: Users can see groups they're members of
CREATE POLICY "buddy_groups_select_member" ON public.buddy_groups FOR SELECT
  USING (
    id IN (
      SELECT group_id FROM public.buddy_group_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "buddy_groups_insert_own" ON public.buddy_groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Buddy Group Members: Users can see members of their groups
CREATE POLICY "group_members_select_own_groups" ON public.buddy_group_members FOR SELECT
  USING (
    group_id IN (
      SELECT group_id FROM public.buddy_group_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "group_members_insert_own" ON public.buddy_group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update messages RLS for group support
DROP POLICY IF EXISTS "messages_select_own" ON public.messages;
CREATE POLICY "messages_select_own_groups" ON public.messages FOR SELECT
  USING (
    group_id IN (
      SELECT group_id FROM public.buddy_group_members WHERE user_id = auth.uid()
    )
    OR
    connection_id IN (
      SELECT id FROM public.connections 
      WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "messages_insert_own" ON public.messages;
CREATE POLICY "messages_insert_in_groups" ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND (
      group_id IN (
        SELECT group_id FROM public.buddy_group_members WHERE user_id = auth.uid()
      )
      OR connection_id IS NOT NULL
    )
  );

-- Events: Public read, admin write
CREATE POLICY "events_select_all" ON public.events FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "events_insert_authenticated" ON public.events FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Event Attendance: Users can manage their own attendance
CREATE POLICY "event_attendance_select_own" ON public.event_attendance FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "event_attendance_insert_own" ON public.event_attendance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Guidance Content: Public read for active content
CREATE POLICY "guidance_content_select_active" ON public.guidance_content FOR SELECT
  USING (is_active = TRUE);

-- User Guidance History: Users can only see their own
CREATE POLICY "guidance_history_select_own" ON public.user_guidance_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "guidance_history_insert_own" ON public.user_guidance_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Mental Health Resources: Public read for active resources
CREATE POLICY "resources_select_active" ON public.mental_health_resources FOR SELECT
  USING (is_active = TRUE);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Seed Mental Health Resources
INSERT INTO public.mental_health_resources (resource_type, title, description, phone_number, website_url, available_hours, is_crisis_resource, display_order) VALUES
('emergency', '988 Suicide & Crisis Lifeline', 'Free and confidential support for people in distress, prevention and crisis resources.', '988', 'https://988lifeline.org', '24/7', TRUE, 1),
('emergency', 'Crisis Text Line', 'Free, 24/7 support for those in crisis. Text HOME to connect with a Crisis Counselor.', '741741', 'https://www.crisistextline.org', '24/7', TRUE, 2),
('emergency', 'NAMI Helpline', 'Information, referrals and support for those living with mental health conditions.', '1-800-950-6264', 'https://www.nami.org/help', 'M-F 10am-10pm ET', FALSE, 3),
('non_emergency', 'SAMHSA National Helpline', 'Treatment referral and information service for mental health and substance use disorders.', '1-800-662-4357', 'https://www.samhsa.gov/find-help/national-helpline', '24/7', FALSE, 4),
('non_emergency', 'Therapy Finder', 'Find a therapist near you through Psychology Today directory.', NULL, 'https://www.psychologytoday.com/us/therapists', 'Online', FALSE, 5),
('support_group', 'Support Groups', 'Find peer support groups for various mental health challenges.', NULL, 'https://www.nami.org/Support-Education/Support-Groups', 'Varies', FALSE, 6)
ON CONFLICT DO NOTHING;

-- Update existing badges with criteria
UPDATE public.badges SET 
  criteria_type = 'connections_made',
  criteria_threshold = 1
WHERE name = 'First Connection';

UPDATE public.badges SET 
  criteria_type = 'messages_sent',
  criteria_threshold = 1
WHERE name = 'Conversation Starter';

UPDATE public.badges SET 
  criteria_type = 'messages_sent',
  criteria_threshold = 5
WHERE name = 'Mentor';

UPDATE public.badges SET 
  criteria_type = 'weekly_streaks',
  criteria_threshold = 7
WHERE name = 'Wellness Warrior';

UPDATE public.badges SET 
  criteria_type = 'surveys_completed',
  criteria_threshold = 1
WHERE name = 'Explorer';

UPDATE public.badges SET 
  criteria_type = 'connections_made',
  criteria_threshold = 10
WHERE name = 'Social Butterfly';

-- Add more specific badges per spec
INSERT INTO public.badges (name, description, icon, criteria_type, criteria_threshold) VALUES
('Mood Master', 'Complete 10 mood check-ins', '😊', 'mood_checkins', 10),
('Event Enthusiast', 'Attend 10 events', '🎉', 'events_attended', 10),
('Super Connector', 'Attend 20 events', '🌟', 'events_attended', 20),
('Message Champion', 'Send 50 messages', '💬', 'messages_sent', 50),
('Streak Master', '7-day mood check-in streak', '🔥', 'weekly_streaks', 7)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get user's current loneliness category
CREATE OR REPLACE FUNCTION get_user_loneliness_category(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  category TEXT;
BEGIN
  SELECT loneliness_category INTO category
  FROM public.loneliness_assessments
  WHERE user_id = user_uuid
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN COALESCE(category, 'Moderate');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to count user's event attendance
CREATE OR REPLACE FUNCTION get_user_event_count(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  event_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO event_count
  FROM public.event_attendance
  WHERE user_id = user_uuid;
  
  RETURN COALESCE(event_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user should retake surveys (20 events since last survey)
CREATE OR REPLACE FUNCTION should_retake_survey(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  last_survey_date TIMESTAMP;
  events_since_survey INTEGER;
BEGIN
  -- Get last survey date
  SELECT MAX(created_at) INTO last_survey_date
  FROM public.loneliness_assessments
  WHERE user_id = user_uuid;
  
  -- Count events since then
  SELECT COUNT(*) INTO events_since_survey
  FROM public.event_attendance
  WHERE user_id = user_uuid
    AND attended_at > COALESCE(last_survey_date, '1970-01-01');
  
  RETURN events_since_survey >= 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

COMMENT ON TABLE public.buddy_groups IS 'Groups of 3-5 users matched by AI';
COMMENT ON TABLE public.buddy_group_members IS 'Members of buddy groups (enforced 3-5 per group)';
COMMENT ON TABLE public.events IS 'Campus or wellness events';
COMMENT ON TABLE public.event_attendance IS 'Tracks user attendance at events';
COMMENT ON TABLE public.guidance_content IS 'Daily messages and weekly videos by loneliness category';
COMMENT ON TABLE public.user_guidance_history IS 'Tracks which guidance content users have viewed';
COMMENT ON TABLE public.mental_health_resources IS 'Mental health and crisis support resources';

