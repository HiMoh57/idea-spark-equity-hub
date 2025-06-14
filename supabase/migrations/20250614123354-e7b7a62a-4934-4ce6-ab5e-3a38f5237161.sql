
-- Enable RLS on access_requests
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Policy: allow users to view their own access requests (as requester)
CREATE POLICY "Users can view their access requests"
  ON public.access_requests
  FOR SELECT
  USING (requester_id = auth.uid());

-- Enable RLS on payment_verifications
ALTER TABLE public.payment_verifications ENABLE ROW LEVEL SECURITY;

-- Policy: allow users to view verifications for access requests they own
CREATE POLICY "Users can view their payment verifications"
  ON public.payment_verifications
  FOR SELECT
  USING (
    access_request_id IN (
      SELECT id FROM public.access_requests WHERE requester_id = auth.uid()
    )
  );

-- Enable RLS on ideas
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

-- Policy: allow all users to SELECT ideas (since this is public info)
CREATE POLICY "Anyone can select ideas"
  ON public.ideas
  FOR SELECT
  USING (true);
