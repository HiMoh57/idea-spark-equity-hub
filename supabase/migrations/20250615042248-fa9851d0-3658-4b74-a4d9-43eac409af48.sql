
-- Add verification fields to profiles table for verified badges
ALTER TABLE public.profiles 
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN profile_picture_url TEXT,
ADD COLUMN is_verified_poster BOOLEAN GENERATED ALWAYS AS (email_verified AND profile_picture_url IS NOT NULL) STORED;

-- Create featured_ideas table for showcasing premium ideas
CREATE TABLE public.featured_ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE,
  featured_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on featured_ideas
ALTER TABLE public.featured_ideas ENABLE ROW LEVEL SECURITY;

-- Policy to allow everyone to view featured ideas
CREATE POLICY "Everyone can view featured ideas" 
  ON public.featured_ideas 
  FOR SELECT 
  TO public 
  USING (is_active = true);

-- Create app_stats table for live statistics
CREATE TABLE public.app_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_users INTEGER DEFAULT 0,
  ideas_submitted_today INTEGER DEFAULT 0,
  active_countries INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on app_stats
ALTER TABLE public.app_stats ENABLE ROW LEVEL SECURITY;

-- Policy to allow everyone to view app stats
CREATE POLICY "Everyone can view app stats" 
  ON public.app_stats 
  FOR SELECT 
  TO public 
  USING (true);

-- Insert initial stats row
INSERT INTO public.app_stats (total_users, ideas_submitted_today, active_countries) 
VALUES (165, 5, 3);

-- Create function to update stats automatically
CREATE OR REPLACE FUNCTION public.update_app_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update total users count
  UPDATE public.app_stats 
  SET total_users = (
    SELECT COUNT(*) FROM auth.users
  ),
  ideas_submitted_today = (
    SELECT COUNT(*) FROM public.ideas 
    WHERE DATE(created_at) = CURRENT_DATE
  ),
  last_updated = now()
  WHERE id = (SELECT id FROM public.app_stats LIMIT 1);
  
  -- If no row exists, insert one
  IF NOT FOUND THEN
    INSERT INTO public.app_stats (total_users, ideas_submitted_today, active_countries)
    VALUES (
      (SELECT COUNT(*) FROM auth.users),
      (SELECT COUNT(*) FROM public.ideas WHERE DATE(created_at) = CURRENT_DATE),
      3
    );
  END IF;
END;
$$;

-- Add some sample featured ideas (replace with actual idea IDs from your database)
INSERT INTO public.featured_ideas (idea_id, featured_order, is_active)
SELECT id, ROW_NUMBER() OVER (ORDER BY views DESC), true
FROM public.ideas 
WHERE status = 'approved'
LIMIT 3;
