-- Supabase Edge Function: Send Email Notification on New Quote Request
-- This function triggers when a new quote request is inserted

-- Enable pg_net extension for HTTP requests (for sending emails via external service)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a function to send email notification
CREATE OR REPLACE FUNCTION notify_new_quote_request()
RETURNS TRIGGER AS $$
DECLARE
  response RECORD;
BEGIN
  -- Send HTTP request to email service (e.g., Resend, SendGrid, or your own endpoint)
  -- This is a placeholder - you'll need to configure your email service
  
  -- Example using Resend API:
  -- SELECT * FROM net.http_post(
  --   url := 'https://api.resend.com/emails',
  --   headers := jsonb_build_object(
  --     'Content-Type', 'application/json',
  --     'Authorization', 'Bearer YOUR_RESEND_API_KEY'
  --   ),
  --   body := jsonb_build_object(
  --     'from', 'noreply@fixturerb2b.top',
  --     'to', ARRAY['your-email@example.com'],
  --     'subject', 'New Quote Request from ' || NEW.customer_name,
  --     'html', '<h1>New Quote Request</h1>' ||
  --            '<p><strong>Name:</strong> ' || NEW.customer_name || '</p>' ||
  --            '<p><strong>Email:</strong> ' || NEW.customer_email || '</p>' ||
  --            '<p><strong>Company:</strong> ' || NEW.company_name || '</p>' ||
  --            '<p><strong>Product:</strong> ' || NEW.product_name || '</p>' ||
  --            '<p><strong>Quantity:</strong> ' || NEW.quantity || '</p>' ||
  --            '<p><a href="https://app.supabase.com/project/YOUR_PROJECT/editor?table=quote_requests">View in Dashboard</a></p>'
  --   )
  -- ) INTO response;
  
  -- For now, we'll just log the event
  RAISE NOTICE 'New quote request from % (%)', NEW.customer_name, NEW.customer_email;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function on insert
DROP TRIGGER IF EXISTS trigger_notify_quote_request ON quote_requests;
CREATE TRIGGER trigger_notify_quote_request
  AFTER INSERT ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_quote_request();

COMMENT ON FUNCTION notify_new_quote_request() IS 'Sends email notification when a new quote request is submitted';
