-- ============================================================================
-- Fix badge trigger to handle different column names across tables
-- ============================================================================

-- Update trigger function to handle different user_id column names
CREATE OR REPLACE FUNCTION trigger_check_badges()
RETURNS TRIGGER AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Determine which column to use based on the table
  IF TG_TABLE_NAME = 'messages' THEN
    target_user_id := NEW.sender_id;
  ELSE
    -- For event_attendance, mood_entries, buddy_group_members
    target_user_id := NEW.user_id;
  END IF;
  
  -- Award badges asynchronously (doesn't block the insert)
  PERFORM check_and_award_badges(target_user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION trigger_check_badges() 
IS 'Trigger function that checks and awards badges after user actions. Handles different user_id column names across tables.';

