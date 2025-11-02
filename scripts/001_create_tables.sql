-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create UCLA Loneliness Scale results
CREATE TABLE IF NOT EXISTS public.loneliness_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scores JSONB NOT NULL,
  total_score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create Leisure Interest Assessment results
CREATE TABLE IF NOT EXISTS public.leisure_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  section1_scores JSONB NOT NULL,
  section2_scores JSONB NOT NULL,
  combined_scores JSONB NOT NULL,
  top_categories TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create connections/matches between buddies
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  compatibility_score INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id < user2_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES public.connections(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create mood tracking table
CREATE TABLE IF NOT EXISTS public.mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mood INTEGER CHECK (mood BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create badges/achievements
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, badge_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loneliness_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leisure_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for assessments
CREATE POLICY "loneliness_select_own" ON public.loneliness_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "loneliness_insert_own" ON public.loneliness_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "leisure_select_own" ON public.leisure_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "leisure_insert_own" ON public.leisure_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for connections
CREATE POLICY "connections_select_own" ON public.connections FOR SELECT 
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "connections_insert_own" ON public.connections FOR INSERT 
  WITH CHECK (auth.uid() = user1_id);

-- RLS Policies for messages
CREATE POLICY "messages_select_own" ON public.messages FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.connections 
    WHERE id = messages.connection_id 
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  ));
CREATE POLICY "messages_insert_own" ON public.messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for mood
CREATE POLICY "mood_select_own" ON public.mood_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "mood_insert_own" ON public.mood_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for badges
CREATE POLICY "user_badges_select_own" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
