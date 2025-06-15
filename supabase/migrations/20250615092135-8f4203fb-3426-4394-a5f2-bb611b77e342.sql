
-- Enable the required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job to run the email reminder function every hour
SELECT cron.schedule(
  'send-incomplete-reminders',
  '0 * * * *', -- Run every hour at minute 0
  $$
  SELECT
    net.http_post(
        url:='https://liqgacnotmqhokowcdvc.supabase.co/functions/v1/send-incomplete-reminder',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcWdhY25vdG1xaG9rb3djZHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MTkwNDAsImV4cCI6MjA2NDQ5NTA0MH0.iVYUY9MoWL7jLkrw-wU39Xvdpwta-XTZHmZD7kYxVeI"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);
