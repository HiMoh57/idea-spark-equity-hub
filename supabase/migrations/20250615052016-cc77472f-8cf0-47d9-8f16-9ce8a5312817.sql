
-- Create table for tracking incomplete idea submissions
CREATE TABLE public.incomplete_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  email TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Add Row Level Security
ALTER TABLE public.incomplete_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own incomplete submissions
CREATE POLICY "Users can manage their own incomplete submissions" 
  ON public.incomplete_submissions 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create index for efficient queries
CREATE INDEX idx_incomplete_submissions_reminder ON public.incomplete_submissions(created_at, reminder_sent);
