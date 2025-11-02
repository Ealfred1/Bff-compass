-- Seed Guidance Content (Daily Messages & Weekly Videos)
-- Run this after creating the tables

-- Daily Messages for each loneliness category
INSERT INTO public.guidance_content (content_type, loneliness_category, title, content, is_active, display_order) VALUES

-- Low Loneliness Category
('daily_message', 'Low', 'Celebrate Your Connections', 
'You''re doing great at maintaining your social connections! Today, take a moment to appreciate the friendships you''ve built. Consider reaching out to someone you haven''t talked to in a while - a simple "thinking of you" message can brighten both your days. Remember, maintaining connections is just as important as making new ones.', 
true, 1),

-- Moderate Loneliness Category  
('daily_message', 'Moderate', 'Small Steps to Connection',
'Feeling a bit disconnected is normal, and you''re taking the right steps by being here. Today, try initiating a conversation with someone in your buddy group. Share something you''re interested in or ask about their day. Remember, meaningful connections often start with simple, genuine interactions. You''re not alone in this journey.',
true, 2),

-- Moderately High Loneliness Category
('daily_message', 'Moderately High', 'You Are Worthy of Connection',
'Loneliness can feel overwhelming, but remember: you are worthy of meaningful friendships. Today''s focus is on self-compassion. It''s okay to feel lonely - it doesn''t define you. Take one small action today: send a message to your buddy group, attend a virtual event, or share how you''re feeling. Your presence matters, and there are people who want to connect with you.',
true, 3),

-- High Loneliness Category
('daily_message', 'High', 'Reaching Out is Strength',
'First, know that what you''re feeling is valid, and reaching out for connection takes courage. You''ve already shown that strength by being here. Today, be gentle with yourself. If you''re struggling, please use the "You Good? Line" button to access immediate support. Remember: loneliness is temporary, and with support, things can and do get better. You don''t have to face this alone.',
true, 4);

-- Weekly Videos for each category (one per day of week)

-- Sunday Videos (day_of_week = 0)
INSERT INTO public.guidance_content (content_type, loneliness_category, title, content, video_url, day_of_week, is_active) VALUES
('weekly_video', 'Low', 'Building Lasting Friendships', 
'Learn strategies to deepen your existing connections and maintain healthy friendships.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 0, true),

('weekly_video', 'Moderate', 'Overcoming Social Anxiety', 
'Practical tips for managing anxiety in social situations and building confidence.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 0, true),

('weekly_video', 'Moderately High', 'Understanding Loneliness', 
'Exploring the psychology of loneliness and how to break the cycle.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 0, true),

('weekly_video', 'High', 'Finding Hope in Connection', 
'Stories of resilience and practical steps for moving forward when loneliness feels overwhelming.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 0, true);

-- Monday Videos (day_of_week = 1)
INSERT INTO public.guidance_content (content_type, loneliness_category, title, content, video_url, day_of_week, is_active) VALUES
('weekly_video', 'Low', 'The Power of Active Listening', 
'Enhance your relationships by mastering the art of truly listening to others.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, true),

('weekly_video', 'Moderate', 'Starting Conversations', 
'Practical techniques for initiating and maintaining engaging conversations.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, true),

('weekly_video', 'Moderately High', 'Self-Compassion in Isolation', 
'Learning to be kind to yourself while working through feelings of loneliness.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, true),

('weekly_video', 'High', 'When to Seek Professional Help', 
'Understanding when loneliness requires professional support and where to find it.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 1, true);

-- Tuesday Videos (day_of_week = 2)
INSERT INTO public.guidance_content (content_type, loneliness_category, title, content, video_url, day_of_week, is_active) VALUES
('weekly_video', 'Low', 'Expanding Your Social Circle', 
'Tips for meeting new people while maintaining your existing friendships.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, true),

('weekly_video', 'Moderate', 'Finding Your Community', 
'Discovering groups and activities aligned with your interests and values.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, true),

('weekly_video', 'Moderately High', 'Breaking Negative Thought Patterns', 
'Cognitive techniques to challenge thoughts that maintain loneliness.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, true),

('weekly_video', 'High', 'Crisis Coping Strategies', 
'Immediate techniques to manage acute feelings of loneliness and isolation.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, true);

-- Wednesday Videos (day_of_week = 3)
INSERT INTO public.guidance_content (content_type, loneliness_category, title, content, video_url, day_of_week, is_active) VALUES
('weekly_video', 'Low', 'Quality Over Quantity', 
'Why deep connections matter more than having lots of acquaintances.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 3, true),

('weekly_video', 'Moderate', 'Digital vs In-Person Connection', 
'Balancing online friendships with face-to-face interactions.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 3, true),

('weekly_video', 'Moderately High', 'Mindfulness for Loneliness', 
'Using mindfulness practices to cope with difficult emotions.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 3, true),

('weekly_video', 'High', 'You Are Not Alone', 
'Hearing from others who have overcome severe loneliness and found connection.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 3, true);

-- Thursday through Saturday (days 4-6) - Add more content as needed
INSERT INTO public.guidance_content (content_type, loneliness_category, title, content, video_url, day_of_week, is_active) VALUES
('weekly_video', 'Moderate', 'Building Social Confidence', 
'Step-by-step approach to feeling more comfortable in social situations.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 4, true),

('weekly_video', 'Moderate', 'The Science of Friendship', 
'Understanding what makes friendships work and how to nurture them.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 5, true),

('weekly_video', 'Moderate', 'Weekend Connection Challenge', 
'Activities and ideas for meaningful social interaction this weekend.', 
'https://www.youtube.com/embed/dQw4w9WgXcQ', 6, true);

-- Sample Events
INSERT INTO public.events (title, description, event_url, event_date, location, is_active) VALUES
('Virtual Coffee Chat', 'Join us for a casual virtual meetup to connect with other members. Bring your favorite beverage and let''s chat!', 'https://meet.example.com/coffee-chat', NOW() + INTERVAL '3 days', 'Online - Zoom', true),
('Weekend Hiking Group', 'Get outside and connect with nature and fellow hikers. All skill levels welcome!', 'https://example.com/hiking', NOW() + INTERVAL '5 days', 'Local Trail - Check event link', true),
('Board Game Night', 'In-person board game night at the community center. Bring a game or just bring yourself!', 'https://example.com/board-games', NOW() + INTERVAL '7 days', 'Community Center - Room 101', true),
('Wellness Workshop', 'Interactive workshop on mindfulness and stress reduction techniques.', 'https://example.com/wellness', NOW() + INTERVAL '10 days', 'Online - Google Meet', true),
('Book Club Meeting', 'Monthly book club discussion. This month: The Midnight Library by Matt Haig', 'https://example.com/bookclub', NOW() + INTERVAL '14 days', 'Local Library - Meeting Room A', true);

COMMENT ON TABLE public.guidance_content IS 'Daily messages and weekly videos personalized by loneliness category';
COMMENT ON TABLE public.events IS 'Campus and wellness events for in-person connection';

