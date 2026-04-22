-- Create Database Webhook for Email Notifications
-- Run this in Supabase SQL Editor after setting up Resend

-- Step 1: Enable pg_net extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Step 2: Create function to call Edge Function
CREATE OR REPLACE FUNCTION trigger_email_notification()
RETURNS TRIGGER AS $$
DECLARE
  response RECORD;
BEGIN
  -- Call the Edge Function via HTTP
  SELECT * FROM net.http_post(
    url := 'https://yaumblbimxrunltqadsq.supabase.co/functions/v1/send-email-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer sb_publishable_bz-UdtzBNgA_ckTh--Hrig_bbSh8prW'
    ),
    body := jsonb_build_object(
      'record', row_to_json(NEW)
    )
  ) INTO response;
  
  -- Log the response (optional)
  RAISE NOTICE 'Email notification triggered: %', response.status;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create trigger on quote_requests table
DROP TRIGGER IF EXISTS trigger_quote_email_notification ON quote_requests;
CREATE TRIGGER trigger_quote_email_notification
  AFTER INSERT ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION trigger_email_notification();

-- Step 4: Verify trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'trigger_quote_email_notification';

COMMENT ON FUNCTION trigger_email_notification() IS 'Triggers email notification when a new quote request is submitted';

https://vercel.com/new?email=aardenx%40outlook.com&teamSlug=zhouhuis-projects-154b1ae1    aardenx
