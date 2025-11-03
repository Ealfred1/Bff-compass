-- ============================================================================
-- Match new user (alfrederic371+2@gmail.com) with existing users
-- ============================================================================

-- This script will:
-- 1. Find the new user by email
-- 2. Copy leisure assessment from an existing user
-- 3. Copy loneliness assessment from the same user (with similar score)

-- First, let's get the user ID for the new user
DO $$
DECLARE
  new_user_id UUID;
  target_user_id UUID := '4cf7460f-5527-49f7-b5ec-8b2924fc3e2b'; -- Existing user to match with
BEGIN
  -- Get the new user's ID
  SELECT id INTO new_user_id
  FROM auth.users
  WHERE email = 'alfrederic371+2@gmail.com';

  IF new_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email alfrederic371+2@gmail.com not found';
  END IF;

  RAISE NOTICE 'Found new user ID: %', new_user_id;

  -- Delete any existing assessments for this user (in case they already started)
  DELETE FROM public.loneliness_assessments WHERE user_id = new_user_id;
  DELETE FROM public.leisure_assessments WHERE user_id = new_user_id;

  -- Insert loneliness assessment matching the target user's category
  -- Using a similar score in the "Moderate" range (15-17)
  INSERT INTO public.loneliness_assessments (
    user_id,
    scores,
    total_score,
    loneliness_category,
    survey_trigger,
    created_at
  ) VALUES (
    new_user_id,
    '{"0": 3, "1": 3, "2": 2, "3": 3, "4": 3, "5": 2}'::jsonb, -- Total = 16 (Moderate)
    16,
    'Moderate',
    'onboarding',
    NOW()
  );

  RAISE NOTICE 'Created loneliness assessment with score 16 (Moderate category)';

  -- Insert leisure assessment EXACTLY matching the target user
  INSERT INTO public.leisure_assessments (
    user_id,
    section1_scores,
    section2_scores,
    combined_scores,
    top_categories,
    other_interests,
    survey_trigger,
    created_at
  ) VALUES (
    new_user_id,
    '{"1": "A", "2": "D", "3": "F", "4": "D", "5": "B"}'::jsonb,
    '{}'::jsonb,
    '{"A": 1, "B": 1, "C": 0, "D": 2, "E": 0, "F": 1, "G": 0}'::jsonb,
    ARRAY['Creative Expression', 'Physical Activities', 'Mind-Body'],
    NULL,
    'onboarding',
    NOW()
  );

  RAISE NOTICE 'Created leisure assessment matching target user';

  -- Update the profile to mark onboarding as completed
  UPDATE public.profiles
  SET onboarding_completed = true
  WHERE id = new_user_id;

  RAISE NOTICE 'Marked onboarding as completed';

  -- Show the results
  RAISE NOTICE '✅ SUCCESS! User % is now ready to match with user %', new_user_id, target_user_id;
  RAISE NOTICE 'Loneliness Category: Moderate (score 16)';
  RAISE NOTICE 'Top Categories: Creative Expression, Physical Activities, Mind-Body';
  
END $$;

-- Verify the data was inserted correctly
SELECT 
  u.email,
  la.loneliness_category,
  la.total_score,
  lea.top_categories
FROM auth.users u
LEFT JOIN public.loneliness_assessments la ON u.id = la.user_id
LEFT JOIN public.leisure_assessments lea ON u.id = lea.user_id
WHERE u.email = 'alfrederic371+2@gmail.com';

