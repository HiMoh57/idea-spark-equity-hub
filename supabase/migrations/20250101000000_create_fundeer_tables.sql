-- Create pitch_decks table for Fundeer
CREATE TABLE public.pitch_decks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_id UUID REFERENCES public.ideas(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  solution TEXT NOT NULL,
  business_model TEXT NOT NULL,
  target_market TEXT NOT NULL,
  competitor_summary TEXT NOT NULL,
  traction TEXT NOT NULL,
  team TEXT NOT NULL,
  ask_and_use_of_funds TEXT NOT NULL,
  deck_content JSONB NOT NULL DEFAULT '[]',
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pitch_deck_usage table to track monthly usage
CREATE TABLE public.pitch_deck_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, month_year)
);

-- Enable RLS on pitch_decks
ALTER TABLE public.pitch_decks ENABLE ROW LEVEL SECURITY;

-- Policy: users can view their own pitch decks
CREATE POLICY "Users can view their own pitch decks"
  ON public.pitch_decks
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: users can create their own pitch decks
CREATE POLICY "Users can create their own pitch decks"
  ON public.pitch_decks
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy: users can update their own pitch decks
CREATE POLICY "Users can update their own pitch decks"
  ON public.pitch_decks
  FOR UPDATE
  USING (user_id = auth.uid());

-- Policy: users can delete their own pitch decks
CREATE POLICY "Users can delete their own pitch decks"
  ON public.pitch_decks
  FOR DELETE
  USING (user_id = auth.uid());

-- Enable RLS on pitch_deck_usage
ALTER TABLE public.pitch_deck_usage ENABLE ROW LEVEL SECURITY;

-- Policy: users can view their own usage
CREATE POLICY "Users can view their own usage"
  ON public.pitch_deck_usage
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: users can update their own usage
CREATE POLICY "Users can update their own usage"
  ON public.pitch_deck_usage
  FOR UPDATE
  USING (user_id = auth.uid());

-- Policy: users can insert their own usage
CREATE POLICY "Users can insert their own usage"
  ON public.pitch_deck_usage
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Function to get or create monthly usage record
CREATE OR REPLACE FUNCTION public.get_or_create_monthly_usage(user_uuid UUID)
RETURNS public.pitch_deck_usage
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_month TEXT;
  usage_record public.pitch_deck_usage;
BEGIN
  current_month := TO_CHAR(CURRENT_DATE, 'YYYY-MM');
  
  -- Try to get existing record
  SELECT * INTO usage_record
  FROM public.pitch_deck_usage
  WHERE user_id = user_uuid AND month_year = current_month;
  
  -- If no record exists, create one
  IF usage_record IS NULL THEN
    INSERT INTO public.pitch_deck_usage (user_id, month_year, usage_count)
    VALUES (user_uuid, current_month, 0)
    RETURNING * INTO usage_record;
  END IF;
  
  RETURN usage_record;
END;
$$;

-- Function to increment usage count
CREATE OR REPLACE FUNCTION public.increment_pitch_deck_usage(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_usage public.pitch_deck_usage;
  user_profile public.profiles;
BEGIN
  -- Get user profile to check if they're premium
  SELECT * INTO user_profile
  FROM public.profiles
  WHERE id = user_uuid;
  
  -- If user is premium, allow unlimited usage
  IF user_profile.user_type = 'premium' THEN
    RETURN TRUE;
  END IF;
  
  -- Get current usage
  SELECT * INTO current_usage
  FROM public.get_or_create_monthly_usage(user_uuid);
  
  -- Check if user has exceeded free limit (1 per month)
  IF current_usage.usage_count >= 1 THEN
    RETURN FALSE;
  END IF;
  
  -- Increment usage count
  UPDATE public.pitch_deck_usage
  SET usage_count = usage_count + 1, updated_at = now()
  WHERE id = current_usage.id;
  
  RETURN TRUE;
END;
$$;

-- Add real-time support for pitch_decks
ALTER TABLE public.pitch_decks REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pitch_decks; 