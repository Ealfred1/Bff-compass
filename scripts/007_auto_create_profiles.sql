-- ============================================================================
-- Auto-create profile when user signs up
-- ============================================================================

-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  username_value TEXT;
BEGIN
  -- Generate username from email (before @ symbol)
  username_value := split_part(NEW.email, '@', 1);
  
  -- If username already exists, append user id to make it unique
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = username_value) THEN
    username_value := username_value || '_' || substring(NEW.id::text from 1 for 8);
  END IF;
  
  INSERT INTO public.profiles (id, username, display_name, created_at)
  VALUES (
    NEW.id,
    username_value,
    username_value,
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users who don't have profiles
INSERT INTO public.profiles (id, username, display_name, created_at)
SELECT 
  u.id,
  -- Generate unique username from email
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.username = split_part(u.email, '@', 1)
    )
    THEN split_part(u.email, '@', 1) || '_' || substring(u.id::text from 1 for 8)
    ELSE split_part(u.email, '@', 1)
  END as username,
  split_part(u.email, '@', 1) as display_name,
  u.created_at
FROM auth.users u
WHERE u.id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile entry when a new user signs up';

