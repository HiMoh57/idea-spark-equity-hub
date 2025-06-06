
-- Create idea_comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.idea_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on idea_comments
ALTER TABLE public.idea_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for idea_comments
CREATE POLICY "Anyone can view comments" ON public.idea_comments 
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.idea_comments 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.idea_comments 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.idea_comments 
FOR DELETE USING (auth.uid() = user_id);

-- Enable real-time for all tables
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.user_idea_interests REPLICA IDENTITY FULL;
ALTER TABLE public.access_requests REPLICA IDENTITY FULL;
ALTER TABLE public.payment_verifications REPLICA IDENTITY FULL;
ALTER TABLE public.proposals REPLICA IDENTITY FULL;
ALTER TABLE public.idea_comments REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_idea_interests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.access_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_verifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.proposals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.idea_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create function to automatically create notifications for comments
CREATE OR REPLACE FUNCTION public.handle_new_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  idea_creator UUID;
  idea_title TEXT;
  commenter_name TEXT;
BEGIN
  -- Get idea creator and title
  SELECT creator_id, title INTO idea_creator, idea_title
  FROM public.ideas WHERE id = NEW.idea_id;
  
  -- Get commenter name
  SELECT full_name INTO commenter_name
  FROM public.profiles WHERE id = NEW.user_id;
  
  -- Create notification for idea creator (if not commenting on their own idea)
  IF idea_creator != NEW.user_id THEN
    PERFORM public.create_notification(
      idea_creator,
      'comment',
      'New Comment on Your Idea',
      COALESCE(commenter_name, 'Someone') || ' commented on your idea: ' || idea_title,
      NEW.idea_id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new comments
DROP TRIGGER IF EXISTS on_comment_created ON public.idea_comments;
CREATE TRIGGER on_comment_created
  AFTER INSERT ON public.idea_comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_comment();

-- Update the payment verification notification function
CREATE OR REPLACE FUNCTION public.handle_payment_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  access_request_data RECORD;
  idea_data RECORD;
BEGIN
  -- Only proceed if verification status changed to 'verified'
  IF NEW.verification_status = 'verified' AND (OLD.verification_status IS NULL OR OLD.verification_status != 'verified') THEN
    -- Get access request details
    SELECT ar.requester_id, ar.idea_id INTO access_request_data
    FROM public.access_requests ar
    WHERE ar.id = NEW.access_request_id;
    
    -- Get idea details
    SELECT title INTO idea_data
    FROM public.ideas
    WHERE id = access_request_data.idea_id;
    
    -- Update access request status
    UPDATE public.access_requests 
    SET status = 'approved'
    WHERE id = NEW.access_request_id;
    
    -- Create notification for the requester
    PERFORM public.create_notification(
      access_request_data.requester_id,
      'payment_verified',
      'Payment Verified - Access Granted',
      'Your payment has been verified and access granted to: ' || idea_data.title,
      access_request_data.idea_id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for payment verification
DROP TRIGGER IF EXISTS on_payment_verification_updated ON public.payment_verifications;
CREATE TRIGGER on_payment_verification_updated
  AFTER UPDATE ON public.payment_verifications
  FOR EACH ROW EXECUTE FUNCTION public.handle_payment_verification();
