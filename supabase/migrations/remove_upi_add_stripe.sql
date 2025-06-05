
-- Remove UPI payment verification table
DROP TABLE IF EXISTS public.payment_verifications CASCADE;

-- Update access_requests table for Stripe integration
ALTER TABLE public.access_requests 
DROP COLUMN IF EXISTS payment_amount,
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS amount_paid INTEGER;

-- Create Stripe payments table
CREATE TABLE IF NOT EXISTS public.stripe_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  access_request_id UUID NOT NULL REFERENCES public.access_requests(id) ON DELETE CASCADE,
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on stripe_payments
ALTER TABLE public.stripe_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for stripe_payments
CREATE POLICY "Users can view their stripe payments" ON public.stripe_payments FOR SELECT USING (
  auth.uid() IN (
    SELECT requester_id FROM public.access_requests WHERE id = access_request_id
  )
);

CREATE POLICY "System can manage stripe payments" ON public.stripe_payments FOR ALL USING (true);

-- Update access_requests policies for Stripe integration
DROP POLICY IF EXISTS "Users can view their access requests" ON public.access_requests;
DROP POLICY IF EXISTS "Users can create access requests" ON public.access_requests;
DROP POLICY IF EXISTS "Idea creators can view requests for their ideas" ON public.access_requests;

CREATE POLICY "Users can view their access requests" ON public.access_requests FOR SELECT USING (
  auth.uid() = requester_id OR 
  auth.uid() IN (SELECT creator_id FROM public.ideas WHERE id = idea_id)
);

CREATE POLICY "Users can create access requests" ON public.access_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "System can update access requests" ON public.access_requests FOR UPDATE USING (true);
